import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useEffect, useState } from 'react';

// Simple Error Boundary to surface runtime errors inside the map component
class MapErrorBoundary extends React.Component<any, { hasError: boolean; error?: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('CorrelationMap caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-sm text-red-600">
          <div className="font-semibold">Map failed to load</div>
          <div>{this.state.error?.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
import { useUserLocation } from '@/hooks/useUserLocation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useVote } from '@/hooks/useVote';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// Fix for default marker icon issue with bundlers like Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter: [number, number] = [20.5937, 78.9629];

interface Correlation {
  region_id: string;
  category_a: string;
  category_b: string;
  correlation_score: number;
  co_occurrence: number;
  center_point_wkt: string;
}

const fetchNearbyCorrelations = async (latitude: number, longitude: number, radius: number) => {
  const { data, error } = await supabase.rpc('get_nearby_correlations', {
    lat: latitude,
    lng: longitude,
    radius: radius,
  });
  if (error) throw new Error(error.message);
  return data as Correlation[] || [];
};

const parseWktPoint = (wkt: string): [number, number] | null => {
    if (!wkt || !wkt.includes('POINT')) return null;
    const coords = wkt.replace(/POINT\(|\)/g, '').trim().split(' ');
    const lat = parseFloat(coords[1]);
    const lng = parseFloat(coords[0]);
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
}

const categoryColors: { [key: string]: string } = {
    roads: '#6b7280', // gray
    water: '#3b82f6', // blue
    electricity: '#f59e0b', // amber
    sanitation: '#10b981', // emerald
    education: '#8b5cf6', // violet
    healthcare: '#ef4444', // red
    pollution: '#d97706', // yellow-orange
    safety: '#ec4899', // pink
    other: '#a1a1aa', // neutral
};

const getBlendedColor = (catA: string, catB: string) => {
    const colorA = categoryColors[catA] || categoryColors['other'];
    const colorB = categoryColors[catB] || categoryColors['other'];
    // This is a simple visual blend, not a true color mix.
    // It creates a gradient from one color to the other.
    return `linear-gradient(45deg, ${colorA}, ${colorB})`;
};

type Focus = { lat?: number | null; lng?: number | null; zoom?: number; id?: string | number; pincode?: string } | null;

const _RecenterMap = ({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (map && lat != null && lng != null) {
      try {
        map.flyTo([lat, lng], zoom || 14, { duration: 0.8 });
      } catch (e) {
        map.setView([lat, lng], zoom || 14);
      }
    }
  }, [map, lat, lng, zoom]);
  return null;
};

const CorrelationMap = ({ focus }: { focus?: Focus }) => {
  const { position: userLocation, error: locationError, loading: locationLoading } = useUserLocation();

  const { data: correlations = [], isLoading: correlationsLoading } = useQuery({
    queryKey: ['nearbyCorrelations', userLocation?.latitude, userLocation?.longitude],
    queryFn: () => fetchNearbyCorrelations(userLocation!.latitude, userLocation!.longitude, 10000), // 10km radius
    enabled: !!userLocation,
  });

  // Fetch nearby problems to show as markers
  const fetchNearbyProblemsForMap = async (latitude: number, longitude: number) => {
    const { data, error } = await supabase.rpc('nearby_problems', {
      lat: latitude,
      lng: longitude,
    });
    if (error) throw new Error(error.message);
    const rows = (data || []) as any[];

    const uniqueRows = [];
    const seenIds = new Set();
    rows.forEach(r => {
        if (!seenIds.has(r.id)) {
            seenIds.add(r.id);
            uniqueRows.push(r);
        }
    });

    // Normalize latitude/longitude from 'location' column if needed.
    return uniqueRows.map((r) => {
        const out: any = { ...r };
        if ((!out.latitude || !out.longitude) && out.location) {
            const loc = out.location;
            if (loc && typeof loc === 'object' && Array.isArray(loc.coordinates)) {
                out.longitude = Number(loc.coordinates[0]);
                out.latitude = Number(loc.coordinates[1]);
            } else if (typeof loc === 'string' && loc.startsWith('POINT')) {
                const inside = loc.replace(/POINT\(|\)/g, '').trim();
                const [lngStr, latStr] = inside.split(' ').filter(Boolean);
                out.longitude = Number(lngStr);
                out.latitude = Number(latStr);
            }
        }
        return out;
    });
  };

  const { data: problemMarkersRaw = [], isLoading: problemsLoading } = useQuery({
    queryKey: ['nearbyProblemsMap', userLocation?.latitude, userLocation?.longitude],
    queryFn: () => fetchNearbyProblemsForMap(userLocation!.latitude, userLocation!.longitude),
    enabled: !!userLocation,
  });

  // Fetch the focused problem explicitly to ensure it's on the map
  const focusProblemId = focus?.id != null ? String(focus.id) : null;

  const { data: focusedProblem } = useQuery({
    queryKey: ['problem', focusProblemId],
    queryFn: async () => {
        if (!focusProblemId) return null;
        const { data, error } = await supabase.from('problems').select('*').eq('id', focusProblemId).single();
        if (error) {
            console.error('Failed to fetch focused problem', error);
            return null;
        }
        // Manually normalize coordinates, similar to fetchNearbyProblemsForMap
        const out: any = { ...data };
        if ((!out.latitude || !out.longitude) && out.location) {
            const loc = out.location;
            if (loc && typeof loc === 'object' && Array.isArray(loc.coordinates)) {
                out.longitude = Number(loc.coordinates[0]);
                out.latitude = Number(loc.coordinates[1]);
            } else if (typeof loc === 'string' && loc.startsWith('POINT')) {
                const inside = loc.replace(/POINT\(|\)/g, '').trim();
                const [lngStr, latStr] = inside.split(' ').filter(Boolean);
                out.longitude = Number(lngStr);
                out.latitude = Number(latStr);
            }
        }
        return out;
    },
    enabled: !!focusProblemId,
  });

  const problemMarkers = React.useMemo(() => {
    const combined = [...problemMarkersRaw];
    if (focusedProblem) {
        if (!combined.some(p => p.id === focusedProblem.id)) {
            combined.push(focusedProblem);
        }
    }
    // The de-duplication logic is now inside fetchNearbyProblemsForMap, but this extra check is fine.
    return combined;
  }, [problemMarkersRaw, focusedProblem]);

  const voteMutation = useVote();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: userVotes = {} } = useQuery({
    queryKey: ['userVotes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('votable_id, vote_type')
        .eq('user_id', user!.id)
        .eq('votable_type', 'problem');
      if (error) throw new Error(error.message);
      return (data || []).reduce((acc, row) => {
        acc[row.votable_id as string] = row.vote_type as 'upvote' | 'downvote';
        return acc;
      }, {} as Record<string, 'upvote' | 'downvote'>);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 30,
  });

  // Fetch votes for the problems rendered on the map
  const problemIds = (problemMarkers || []).map((p) => p.id).filter(Boolean);
  const { data: votesForMap = [] } = useQuery({
    queryKey: ['votesForMap', ...problemIds],
    queryFn: async () => {
      if (!problemIds.length) return [];
      const { data, error } = await (supabase as any).rpc('get_votes_for_problems', {
        p_problem_ids: problemIds,
      });
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: problemIds.length > 0,
  });

  // build a map of counts by problem id
  const voteCountsByProblem: Record<string, { up: number; down: number }> = {};
  (votesForMap || []).forEach((v: any) => {
    const problemId = v.problem_id || v.id;
    voteCountsByProblem[problemId] = { up: v.upvotes || v.up || 0, down: v.downvotes || v.down || 0 };
  });

  const mapCenter: [number, number] = userLocation ? [userLocation.latitude, userLocation.longitude] : defaultCenter;

  // marker refs map (must be a hook and called unconditionally to keep hook order stable)
  const markerRefs = React.useRef<Record<string, any> | null>({});

  // Utility: validate and normalize lat/lng. Some DB rows may have swapped values or strings.
  const normalizeCoords = (rawLat: any, rawLng: any) => {
    const latNum = rawLat == null ? null : Number(rawLat);
    const lngNum = rawLng == null ? null : Number(rawLng);

    const isValid = (lat: number | null, lng: number | null) => {
      if (lat == null || lng == null) return false;
      if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
      if (lat < -90 || lat > 90) return false;
      if (lng < -180 || lng > 180) return false;
      return true;
    };

    if (isValid(latNum, lngNum)) {
      return { lat: latNum, lng: lngNum, swapped: false, valid: true };
    }

    // Try swapping
    if (isValid(lngNum, latNum)) {
      return { lat: lngNum, lng: latNum, swapped: true, valid: true };
    }

    return { lat: null, lng: null, swapped: false, valid: false };
  };

  

  if (locationLoading) {
    return <div className="flex items-center justify-center h-full"><p>Loading map...</p></div>;
  }

  if (locationError) {
    return <div className="flex items-center justify-center h-full"><p className="text-red-500">Error: {locationError}</p></div>;
  }

  // handle focus: recenter and open popup when focus prop changes
  const map = (null as any);
  // We'll use a useEffect below with useMap inside a small component if needed. Simpler: use a ref to capture the map via react-leaflet's context by rendering a helper component.

  const FocusHandler = ({ focus }: { focus?: Focus }) => {
    const mapInstance = (useMap as any)();
    React.useEffect(() => {
    if (!focus || !mapInstance) return;
    const { lat, lng, zoom, id, pincode } = focus;
    console.debug('[CorrelationMap] Focus changed:', { lat, lng, id, pincode });

      const openPopupForId = (problemId?: string | number) => {
        if (!problemId) return false;
        const key = String(problemId);
        const ref = markerRefs.current && markerRefs.current[key];
        if (ref) {
          try {
            if (typeof ref.openPopup === 'function') ref.openPopup();
          } catch (err) {
            // ignore
          }
          return true;
        }
        return false;
      };

      const tryFly = (targetLat?: number | null, targetLng?: number | null) => {
        if (targetLat == null || targetLng == null) return;
        try {
          mapInstance.flyTo([targetLat, targetLng], zoom || 16, { duration: 0.6 });
        } catch (e) {
          mapInstance.setView([targetLat, targetLng], zoom || 16);
        }
      };

      // If coordinates available, fly and open popup
      if (lat != null && lng != null) {
        const normalized = normalizeCoords(lat, lng);
        console.debug('[CorrelationMap] Normalized focus coords:', normalized);
        if (normalized.valid) {
          tryFly(normalized.lat, normalized.lng);
          // Try to open the popup immediately, otherwise retry a few times in case markers are still rendering
          if (!openPopupForId(id)) {
            let attempts = 0;
            const iv = setInterval(() => {
              attempts += 1;
              if (openPopupForId(id) || attempts >= 6) clearInterval(iv);
            }, 500);
          }
          return;
        }
      }

      // If no coords but pincode provided, try to geocode via Nominatim
      if (pincode) {
        (async () => {
          try {
            const query = encodeURIComponent(`${pincode}, India`);
            const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&postalcode=${encodeURIComponent(pincode)}&limit=1`;
            const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
            const json = await res.json();
              if (Array.isArray(json) && json.length > 0) {
                const entry = json[0];
                const gLat = Number(entry.lat);
                const gLng = Number(entry.lon);
                const normalized = normalizeCoords(gLat, gLng);
                if (normalized.valid) {
                  tryFly(normalized.lat, normalized.lng);
                  // try open popup (marker might be present if problems were loaded)
                  if (!openPopupForId(id)) {
                    let attempts = 0;
                    const iv = setInterval(() => {
                      attempts += 1;
                      if (openPopupForId(id) || attempts >= 6) clearInterval(iv);
                    }, 500);
                  }
                  return;
                }
              }
          } catch (err) {
            // ignore geocode errors
            console.error('Pincode geocode failed', err);
          }
        })();
      }

      // Fallback: try opening popup if already available
      openPopupForId(id);
      // record debug info into outer component via custom event on window (fallback if setDebugFocus isn't available)
      try {
        (window as any).__correlationMapLastFocus = { raw: { lat, lng, pincode, id }, timestamp: Date.now() };
      } catch (e) {}
    }, [focus, mapInstance]);
    return null;
  };


  return (
    <MapErrorBoundary>
      <div className="relative h-full w-full rounded-2xl border border-border bg-card shadow-sm">
        <MapContainer center={mapCenter} zoom={12} style={containerStyle} className="h-full w-full rounded-2xl">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Recenter component to change view when focus prop provided */}
          {focus && <FocusHandler focus={focus} />}

          {correlationsLoading ? (
            <div className="flex h-full items-center justify-center"><p>Loading correlation data...</p></div>
          ) : (
            correlations.map((c) => {
          const position = parseWktPoint(c.center_point_wkt);
          if (!position) return null;

          const iconSize = 20 + (c.correlation_score * 30); // Size based on score
          const iconColor = getBlendedColor(c.category_a, c.category_b);

          const customIcon = new L.DivIcon({
            className: 'custom-div-icon',
            html: `<div style="width:${iconSize}px;height:${iconSize}px;border-radius:999px;background:${iconColor};opacity:0.75;border:2px solid rgba(255,255,255,0.9);"></div>`,
            iconSize: [iconSize, iconSize],
            iconAnchor: [iconSize / 2, iconSize / 2]
          });

              return (
                <Marker key={c.region_id + c.category_a + c.category_b} position={position} icon={customIcon}>
                  <Popup>
                    <div className="w-72 rounded-xl border border-border bg-white p-4 text-foreground shadow-lg">
                      <div className="mb-3">
                        <h3 className="text-base font-semibold text-primary">Correlation Alert</h3>
                        <p className="text-xs text-muted-foreground">Overlap between categories in this grid cell</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-foreground">
                          <Badge variant="secondary">{c.category_a}</Badge>
                          <span className="text-muted-foreground">↔</span>
                          <Badge variant="secondary">{c.category_b}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                          <TrendingUp className="h-3.5 w-3.5" /> Score
                          <span className="font-mono text-base text-foreground">{c.correlation_score.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                          <Users className="h-3.5 w-3.5" /> Co-occurrences
                          <span className="font-mono text-base text-foreground">{c.co_occurrence}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          )}

      {/* Problem markers */}
      {(() => {
        if (problemsLoading) return null;

        const markersByLocation: Record<string, any[]> = {};
        (problemMarkers || []).forEach((p) => {
          const normalized = normalizeCoords(p.latitude, p.longitude);
          if (!normalized.valid || !normalized.lat || !normalized.lng) return;
          const key = `${normalized.lat.toFixed(6)},${normalized.lng.toFixed(6)}`;
          if (!markersByLocation[key]) {
            markersByLocation[key] = [];
          }
          markersByLocation[key].push(p);
        });

        return Object.values(markersByLocation).flatMap(overlapping => {
          const isCluster = overlapping.length > 1;
          return overlapping.map((p, index) => {
            const normalized = normalizeCoords(p.latitude, p.longitude);
            if (!normalized.valid || !normalized.lat || !normalized.lng) return null;

            let position: [number, number] = [normalized.lat, normalized.lng];

            if (isCluster) {
              const offset = 0.001; // Drastically increased offset
              const angle = (index / overlapping.length) * 2 * Math.PI;
              position = [
                  position[0] + offset * Math.cos(angle),
                  position[1] + offset * Math.sin(angle),
              ];
            }

            const counts = voteCountsByProblem[p.id] || { up: 0, down: 0 };
            const currentVote = userVotes?.[p.id] ?? null;
            const isUpvoted = currentVote === 'upvote';
            const isDownvoted = currentVote === 'downvote';
            const titleRaw = `(#${index}) ${p.title || ''}`;
            const titleTrunc = titleRaw.length > 30 ? titleRaw.slice(0, 27) + '...' : titleRaw;
            const net = (counts.up || 0) - (counts.down || 0);
            const netLabel = net >= 0 ? `+${net}` : `${net}`;

            const problemIcon = new L.DivIcon({
              className: 'problem-label-icon',
              html: `<div style="background:rgba(255,255,255,0.92);padding:6px 10px;border-radius:16px;border:1px solid rgba(15,23,42,0.1);font-size:12px;box-shadow:0 6px 18px rgba(15,23,42,0.15);display:flex;gap:8px;align-items:center;color:#0f172a;">
                        <span style="font-weight:600;max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${titleTrunc}</span>
                        <span style="background:${net>=0? 'rgba(16,185,129,0.15)' : 'rgba(248,113,113,0.15)'};color:${net>=0? '#047857' : '#b91c1c'};padding:2px 8px;border-radius:999px;font-weight:700;font-size:11px;">${netLabel}</span>
                      </div>`,
              iconSize: [Math.min(220, 12 * titleTrunc.length + 60), 36],
              iconAnchor: [10, 36],
            });

            return (
              <Marker
                key={`problem-${p.id}`}
                position={position}
                icon={problemIcon}
                zIndexOffset={1000}
                ref={(m) => {
                      try {
                        if (m) {
                          markerRefs.current = markerRefs.current || {};
                          markerRefs.current[String(p.id)] = (m as any)?.leafletElement ?? (m as any);
                        } else if (markerRefs.current) {
                          delete markerRefs.current[String(p.id)];
                        }
                      } catch (e) {
                        // ignore
                      }
                    }}
              >
                <Popup>
                  <Card className="max-w-xs border border-border bg-white p-3 text-sm text-foreground shadow-lg">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-base font-semibold">
                        <button
                          className="text-left text-primary hover:underline"
                          onClick={() => navigate(`/problems/${p.id}`)}
                        >
                          {p.title}
                        </button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-0">
                      <p className="text-muted-foreground">{p.description?.slice(0, 160) ?? 'No description provided.'}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border px-2 py-1 uppercase tracking-widest">Net: {p.votes_count ?? 0}</span>
                        <span className="rounded-full border border-emerald-200 px-2 py-1 text-emerald-700">↑ {counts.up}</span>
                        <span className="rounded-full border border-rose-200 px-2 py-1 text-rose-700">↓ {counts.down}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant={isUpvoted ? 'default' : 'secondary'}
                          className="w-full"
                          onClick={() =>
                            voteMutation.mutate({
                              problemId: p.id,
                              voteType: 'upvote',
                              currentUserId: user?.id,
                              currentVote,
                            })
                          }
                        >
                          👍 {isUpvoted ? 'Upvoted' : 'Upvote'}
                        </Button>
                        <Button
                          size="sm"
                          variant={isDownvoted ? 'default' : 'outline'}
                          className="w-full"
                          onClick={() =>
                            voteMutation.mutate({
                              problemId: p.id,
                              voteType: 'downvote',
                              currentUserId: user?.id,
                              currentVote,
                            })
                          }
                        >
                          👎 {isDownvoted ? 'Downvoted' : 'Downvote'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            );
          });
        });
      })()}
        </MapContainer>

        <div className="absolute left-4 top-4 rounded-xl border border-border bg-white/95 p-3 text-xs text-muted-foreground shadow-sm">
          <div className="text-sm font-semibold text-foreground">Correlation legend</div>
          <p className="mt-1 leading-relaxed">Bubble size follows correlation strength. Select a row in the dashboard to pan here automatically.</p>
        </div>

        <div className="absolute right-4 bottom-4 rounded-xl border border-border bg-white/95 p-3 text-sm text-foreground shadow-sm">
          {userLocation ? (
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your location</div>
              <div className="font-mono text-lg">{userLocation.latitude.toFixed(3)}, {userLocation.longitude.toFixed(3)}</div>
            </div>
          ) : (
            <p className="text-muted-foreground">Share location to unlock nearby correlation intelligence.</p>
          )}
        </div>
      </div>
    </MapErrorBoundary>
  );
};

export default CorrelationMap;
