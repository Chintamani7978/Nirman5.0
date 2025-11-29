import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { useReverseGeocode } from '@/hooks/useReverseGeocode';
import stateDistrictsData from '@/data/state_districts.json';

// Use CDN marker assets so react-leaflet works in Vite without asset copying
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Convert state_districts.json to the expected format
export const STATE_DISTRICTS: Record<string, { districts: string[] }> = Object.fromEntries(
  Object.entries(stateDistrictsData).map(([state, districts]) => [
    state,
    { districts: districts as string[] },
  ])
);

const LOCAL_AREA_GLOSSARY: Record<string, Record<string, string[]>> = {
  Maharashtra: {
    Mumbai: ['Andheri West', 'Bandra East', 'Dadar TT'],
    Pune: ['Kothrud', 'Magarpatta', 'Baner'],
    Nagpur: ['Dhantoli', 'Sitabardi', 'Mankapur'],
  },
  Odisha: {
    Khordha: ['Saheed Nagar', 'Patia', 'Jaydev Vihar'],
    Cuttack: ['Bidanasi', 'Tulsipur', 'Jagatpur'],
    Ganjam: ['Brahmapur', 'Chhatrapur', 'Chatrapur Industrial'],
  },
  'Uttar Pradesh': {
    Lucknow: ['Gomti Nagar', 'Aliganj', 'Hazratganj'],
    'Kanpur Nagar': ['Swaroop Nagar', 'Kakadeo', 'Civil Lines'],
    Varanasi: ['Godowlia', 'Lahurabir', 'Bhelupur'],
  },
  Karnataka: {
    'Bengaluru Urban': ['Koramangala', 'Whitefield', 'Hebbal'],
    Mysuru: ['Vijayanagar', 'Lakshmipuram', 'Jayalakshmipuram'],
    'Dakshina Kannada': ['Hampankatta', 'Surathkal', 'Kadri'],
  },
  Delhi: {
    'New Delhi': ['Connaught Place', 'Chanakyapuri', 'Sarojini Nagar'],
    'Central Delhi': ['Paharganj', 'Kashmere Gate', 'Daryaganj'],
    'South Delhi': ['Saket', 'Hauz Khas', 'Vasant Kunj'],
  },
};

const NORMALIZED_NAME_MAP: Record<string, string> = {
  Pondicherry: 'Puducherry',
  Khurda: 'Khordha',
  'Bangalore Urban': 'Bengaluru Urban',
  Bangalore: 'Bengaluru Urban',
  'Bangalore City': 'Bengaluru Urban',
  'Kanpur Dehat': 'Kanpur Nagar',
};

type Confidence = 'high' | 'medium' | 'low';

type AreaSuggestion = {
  id: string;
  label: string;
  lat?: number;
  lng?: number;
  boundingbox?: [number, number, number, number];
  source: 'google' | 'nominatim' | 'local';
  placeId?: string;
  osmId?: string | number;
  state?: string;
  district?: string;
};

export type LocationConfirmPayload = {
  lat: number;
  lng: number;
  source: 'auto' | 'manual-pin' | 'manual-suggestion';
  state?: string;
  district?: string;
  areaLabel?: string;
  confidence: Confidence;
};

const normalizeName = (value?: string | null) => {
  if (!value) return '';
  const trimmed = value.trim();
  const mapped = NORMALIZED_NAME_MAP[trimmed] ?? trimmed;
  return mapped.toLowerCase();
};

const getDistrictsForState = (state?: string) => {
  if (!state) return [] as string[];
  return STATE_DISTRICTS[state]?.districts ?? [];
};

const levenshteinDistance = (a: string, b: string) => {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const len1 = s1.length;
  const len2 = s2.length;
  const dp = Array.from({ length: len1 + 1 }, () => new Array(len2 + 1).fill(0));
  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
    }
  }
  return dp[len1][len2];
};

const getLocalFuzzySuggestions = (query: string, state?: string, district?: string): AreaSuggestion[] => {
  if (!state) return [];
  const queryLower = query.toLowerCase();
  const districtPool = district ? [district] : getDistrictsForState(state);
  const candidates: AreaSuggestion[] = [];
  districtPool.forEach((districtName) => {
    const glossary = LOCAL_AREA_GLOSSARY[state]?.[districtName];
    if (!glossary) return;
    glossary.forEach((area) => {
      const areaLower = area.toLowerCase();
      // Check exact substring match first (highest priority)
      if (areaLower.includes(queryLower)) {
        candidates.push({
          id: `${districtName}-${area}`,
          label: `${area}, ${districtName}`,
          source: 'local',
          state,
          district: districtName,
        });
        return;
      }
      // Check prefix match (starts with query)
      if (areaLower.startsWith(queryLower)) {
        candidates.push({
          id: `${districtName}-${area}`,
          label: `${area}, ${districtName}`,
          source: 'local',
          state,
          district: districtName,
        });
        return;
      }
      // Fallback to fuzzy Levenshtein matching with lower threshold for short queries
      const distance = levenshteinDistance(area, query);
      const relevance = 1 - Math.min(distance / Math.max(area.length, query.length), 1);
      const threshold = query.length <= 3 ? 0.3 : 0.4;
      if (relevance >= threshold) {
        candidates.push({
          id: `${districtName}-${area}`,
          label: `${area}, ${districtName}`,
          source: 'local',
          state,
          district: districtName,
        });
      }
    });
  });
  return candidates.slice(0, 5);
};

type Props = {
  initial?: { lat: number; lng: number } | null;
  onConfirm: (payload: LocationConfirmPayload) => void;
  compact?: boolean;
  onLocationChange?: (coords: { lat: number; lng: number } | null) => void;
  onAdministrativeChange?: (selection: { state?: string; district?: string }) => void;
  onPlaceSelected?: (info: { label: string; lat: number; lng: number; pincode?: string | null; state?: string; district?: string }) => void;
  confidenceHint?: Confidence;
  initialAdministrative?: { state?: string; district?: string };
  googlePlacesApiKey?: string | null;
  enableManualPinToggle?: boolean;
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };
const containerStyle = { width: '100%', height: '320px' } as const;

const ClickHandler: React.FC<{ onClick: (lat: number, lng: number) => void; allowClicks: boolean }> = ({ onClick, allowClicks }) => {
  useMapEvents({
    click(e) {
      if (!allowClicks) return;
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapController: React.FC<{ setMap: (m: L.Map) => void }> = ({ setMap }) => {
  const map = useMapEvents({});
  useEffect(() => { setMap(map); }, [map, setMap]);
  return null;
};

const districtStyle = {
  weight: 2,
  color: '#38bdf8',
  fillColor: '#38bdf8',
  fillOpacity: 0.15,
};

export default function LocationPicker({
  initial = null,
  onConfirm,
  compact = false,
  onLocationChange,
  onAdministrativeChange,
  onPlaceSelected,
  confidenceHint = 'medium',
  initialAdministrative,
  googlePlacesApiKey,
  enableManualPinToggle = true,
}: Props) {
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(initial);
  const [map, setMap] = useState<L.Map | null>(null);
  const [stateName, setStateName] = useState(initialAdministrative?.state ?? '');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(initialAdministrative?.district ?? null);
  const [areaInput, setAreaInput] = useState('');
  const [areaSuggestions, setAreaSuggestions] = useState<AreaSuggestion[]>([]);
  const [areaLoading, setAreaLoading] = useState(false);
  const [areaError, setAreaError] = useState<string | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [manualPinMode, setManualPinMode] = useState(false);
  const [confidence, setConfidence] = useState<Confidence>(confidenceHint);
  const suggestionAbortRef = useRef<AbortController | null>(null);
  const geoJsonCache = useRef<any | null>(null);
  const [highlightFeature, setHighlightFeature] = useState<any | null>(null);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [geoJsonLoading, setGeoJsonLoading] = useState(false);
  const districtLookupAbortRef = useRef<AbortController | null>(null);
  const areaInputRef = useRef<HTMLInputElement>(null);

  const resolvedPlacesApiKey = useMemo(() => {
    if (googlePlacesApiKey) return googlePlacesApiKey;
    return import.meta.env.VITE_GOOGLE_PLACES_API_KEY ?? import.meta.env.VITE_GOOGLE_API_KEY ?? null;
  }, [googlePlacesApiKey]);

  // Google Places Autocomplete hook - Now uses REST API only (no widget)
  const { isReady: isGooglePlacesReady, isLoading: isGooglePlacesLoading, error: googlePlacesError } = usePlacesAutocomplete({
    apiKey: resolvedPlacesApiKey,
    inputRef: areaInputRef,
    enabled: !compact && !!stateName && !!selectedDistrictName,
    componentRestrictions: { country: 'in' },
    types: ['geocode'],
    // Note: onPlaceSelect is handled in handleSuggestionSelect when user selects from dropdown
  });

  // Reverse geocoding hook
  const { reverseGeocode, isLoading: isReverseGeocoding } = useReverseGeocode({
    googleApiKey: resolvedPlacesApiKey,
  });

  const districtOptions = useMemo(() => getDistrictsForState(stateName), [stateName]);

  useEffect(() => { if (initial) setSelected(initial); }, [initial]);

  useEffect(() => {
    if (!onLocationChange) return;
    onLocationChange(selected);
  }, [selected, onLocationChange]);

  useEffect(() => {
    if (!onAdministrativeChange) return;
    onAdministrativeChange({ state: stateName || undefined, district: selectedDistrictName || undefined });
  }, [stateName, selectedDistrictName, onAdministrativeChange]);

  useEffect(() => {
    const districts = getDistrictsForState(stateName);
    if (!stateName) {
      setSelectedDistrictName(null);
      return;
    }
    if (selectedDistrictName && !districts.includes(selectedDistrictName)) {
      setSelectedDistrictName(null);
    }
  }, [stateName, selectedDistrictName]);

  // Fallback Nominatim search - Always available when Google Places widget is not ready or fails
  useEffect(() => {
    if (compact) return;
    
    const query = areaInput.trim();
    if (!query || query.length < 3 || !stateName || !selectedDistrictName) {
      setAreaSuggestions([]);
      setAreaError(null);
      return;
    }

    // If Google Places is ready and working, we still want to show fallback suggestions
    // as a backup in case the widget doesn't show results
    // Only skip if user hasn't typed anything or query is too short
    
    setAreaLoading(true);
    setAreaError(null);
    suggestionAbortRef.current?.abort();
    const ac = new AbortController();
    suggestionAbortRef.current = ac;
    const timeout = setTimeout(async () => {
      try {
        // Fetch from all sources in parallel and combine results
        let suggestions: AreaSuggestion[] = [];
        
        // Always fetch local suggestions (fast, offline)
        const localSuggestions = getLocalFuzzySuggestions(query, stateName, selectedDistrictName ?? undefined);
        
        // Fetch from APIs in parallel
        const [googleSuggestions, nominatimSuggestions] = await Promise.allSettled([
          resolvedPlacesApiKey ? fetchAreaSuggestions(
            query,
            stateName,
            selectedDistrictName ?? undefined,
            resolvedPlacesApiKey,
            ac.signal
          ) : Promise.resolve([]),
          fetchAreaSuggestions(
            query,
            stateName,
            selectedDistrictName ?? undefined,
            null,
            ac.signal
          ),
        ]).then((results) => [
          results[0].status === 'fulfilled' ? results[0].value : [],
          results[1].status === 'fulfilled' ? results[1].value : [],
        ]);

        // Combine all suggestions, prioritizing Google > Nominatim > Local
        const seen = new Set<string>();
        const addUnique = (arr: AreaSuggestion[]) => {
          arr.forEach((s) => {
            if (!seen.has(s.label.toLowerCase())) {
              suggestions.push(s);
              seen.add(s.label.toLowerCase());
            }
          });
        };
        
        addUnique(googleSuggestions);
        addUnique(nominatimSuggestions);
        addUnique(localSuggestions);

        setAreaSuggestions(suggestions.slice(0, 8));
        setActiveSuggestionIndex(-1);
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          console.error('Autocomplete error', error);
          setAreaError('Unable to fetch suggestions. Showing offline matches.');
          setAreaSuggestions(getLocalFuzzySuggestions(query, stateName, selectedDistrictName ?? undefined));
        }
      } finally {
        setAreaLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
      ac.abort();
    };
  }, [areaInput, stateName, selectedDistrictName, compact, isGooglePlacesReady, resolvedPlacesApiKey]);

  useEffect(() => {
    if (!selectedDistrictName) {
      setHighlightFeature(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        if (!geoJsonCache.current) {
          setGeoJsonLoading(true);
          const res = await fetch('/india_district.geojson');
          if (!res.ok) throw new Error('GeoJSON missing');
          geoJsonCache.current = await res.json();
        }
        const features = geoJsonCache.current?.features ?? [];
        const normalizedTarget = normalizeName(selectedDistrictName);
        const match = features.find((feature: any) => {
          const props = feature.properties ?? {};
          const candidates = [props.NAME_2, props.NAME_1, props.DISTRICT, props.district, props.name].filter(Boolean);
          return candidates.some((candidate: string) => normalizeName(candidate) === normalizedTarget);
        });
        if (!cancelled) setHighlightFeature(match ?? null);
      } catch (error) {
        if (!cancelled) setGeoJsonError('District boundary layer unavailable');
      } finally {
        if (!cancelled) setGeoJsonLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedDistrictName]);

  useEffect(() => {
    if (compact || !stateName || !selectedDistrictName) return;
    districtLookupAbortRef.current?.abort();
    const ac = new AbortController();
    districtLookupAbortRef.current = ac;
    (async () => {
      try {
        const query = `${selectedDistrictName}, ${stateName}, India`;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=in&limit=1&q=${encodeURIComponent(query)}`, {
          signal: ac.signal,
          headers: { 'Accept-Language': 'en' },
        });
        if (!res.ok) return;
        const data = await res.json();
        const hit = data?.[0];
        if (!hit) return;
        const lat = Number(hit.lat);
        const lng = Number(hit.lon);
        setSelected({ lat, lng });
        if (map) map.flyTo([lat, lng], 10, { duration: 0.65 });
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          console.error('District lookup failed', error);
        }
      }
    })();
    return () => ac.abort();
  }, [stateName, selectedDistrictName, compact, map]);

  const handleSuggestionSelect = async (suggestion: AreaSuggestion) => {
    setManualPinMode(false);
    setAreaInput(suggestion.label);
    setAreaSuggestions([]);
    setAreaError(null);
    let lat = suggestion.lat;
    let lng = suggestion.lng;
    try {
      if ((!lat || !lng) && suggestion.source === 'google' && suggestion.placeId && resolvedPlacesApiKey) {
        const detailRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.placeId}&fields=geometry,address_component&key=${resolvedPlacesApiKey}`);
        const detail = await detailRes.json();
        const location = detail.result?.geometry?.location;
        if (location) {
          lat = location.lat;
          lng = location.lng;
        }
        const components: any[] = detail.result?.address_components ?? [];
        const stateComponent = components.find((component) => component.types.includes('administrative_area_level_1'));
        const districtComponent = components.find((component) => component.types.includes('administrative_area_level_2'));
        if (stateComponent) setStateName(stateComponent.long_name);
        if (districtComponent) setSelectedDistrictName(districtComponent.long_name);
      }
      if ((!lat || !lng) && suggestion.source === 'nominatim' && suggestion.osmId) {
        const lookupRes = await fetch(`https://nominatim.openstreetmap.org/lookup?format=jsonv2&osm_ids=${suggestion.osmId}`, {
          headers: { 'Accept-Language': 'en' },
        });
        const lookup = await lookupRes.json();
        const hit = lookup?.[0];
        if (hit) {
          lat = Number(hit.lat);
          lng = Number(hit.lon);
        }
      }
    } catch (error) {
      console.error('Suggestion resolution failed', error);
      setAreaError('Unable to resolve suggestion, please try pinning manually.');
    }
    if (lat && lng) {
      setSelected({ lat, lng });
      if (map) map.flyTo([lat, lng], 15, { duration: 0.65 });
      const derivedConfidence: Confidence = suggestion.source === 'google' ? 'high' : suggestion.source === 'nominatim' ? 'medium' : 'low';
      setConfidence(derivedConfidence);
      if (onPlaceSelected) {
        onPlaceSelected({
          label: suggestion.label,
          lat,
          lng,
          state: suggestion.state ?? stateName ?? undefined,
          district: suggestion.district ?? selectedDistrictName ?? undefined,
          pincode: undefined,
        });
      }
    }
  };

  const handleManualPin = (lat: number, lng: number) => {
    setSelected({ lat, lng });
    setConfidence('low');
  };

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm({
      lat: selected.lat,
      lng: selected.lng,
      source: compact ? 'auto' : manualPinMode ? 'manual-pin' : 'manual-suggestion',
      state: stateName || undefined,
      district: selectedDistrictName || undefined,
      areaLabel: !compact ? areaInput || undefined : undefined,
      confidence,
    });
  };

  const allowMapClicks = compact || (enableManualPinToggle && manualPinMode);

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">State / UT</label>
              <Select
                value={stateName}
                onValueChange={(value) => {
                  setStateName(value);
                  setSelectedDistrictName(null);
                  setAreaInput('');
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm text-foreground transition hover:border-primary/30 hover:bg-white/[0.04] focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl">
                  {Object.keys(STATE_DISTRICTS)
                    .sort()
                    .map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="cursor-pointer rounded-lg px-3 py-2 text-sm transition hover:bg-primary/10 focus:bg-primary/10"
                      >
                        {state}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">District</label>
              <Select
                value={selectedDistrictName ?? ''}
                onValueChange={(value) => setSelectedDistrictName(value || null)}
                disabled={!stateName}
              >
                <SelectTrigger
                  disabled={!stateName}
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm text-foreground transition hover:border-primary/30 hover:bg-white/[0.04] focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SelectValue placeholder={stateName ? 'Choose district' : 'Select state first'} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl">
                  {districtOptions.length > 0 ? (
                    districtOptions
                      .sort()
                      .map((district) => (
                        <SelectItem
                          key={district}
                          value={district}
                          className="cursor-pointer rounded-lg px-3 py-2 text-sm transition hover:bg-primary/10 focus:bg-primary/10"
                        >
                          {district}
                        </SelectItem>
                      ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No districts available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Area / neighbourhood</label>
            <div className="relative">
              <Input
                ref={areaInputRef}
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                onKeyDown={(event) => {
                  // Handle keyboard navigation for suggestions
                  if (!areaSuggestions.length) return;
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setActiveSuggestionIndex((prev) => (prev + 1) % areaSuggestions.length);
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setActiveSuggestionIndex((prev) => (prev - 1 + areaSuggestions.length) % areaSuggestions.length);
                  } else if (event.key === 'Enter') {
                    event.preventDefault();
                    const suggestion = areaSuggestions[activeSuggestionIndex >= 0 ? activeSuggestionIndex : 0];
                    if (suggestion) handleSuggestionSelect(suggestion);
                  }
                }}
                placeholder={
                  !stateName || !selectedDistrictName
                    ? 'Select state and district first'
                    : 'Search area, colony, ward, street...'
                }
                disabled={!stateName || !selectedDistrictName}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition hover:border-primary/30 hover:bg-white/[0.04] focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {(areaLoading || isGooglePlacesLoading || isReverseGeocoding) && (
                <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-primary/50 border-t-transparent" aria-label="Loading suggestions" />
              )}
            </div>
            {googlePlacesError && !isGooglePlacesReady && (
              <p className="text-xs text-muted-foreground">Google Places widget unavailable, using alternative search.</p>
            )}
            {areaError && <p className="text-xs text-destructive">{areaError}</p>}
            {areaSuggestions.length === 0 && areaInput.trim().length >= 3 && !areaLoading && (
              <p className="text-xs text-muted-foreground">No matches found — try another spelling or drop a pin.</p>
            )}
            {/* Always show suggestions when available (works with or without Google Places widget) */}
            {areaSuggestions.length > 0 && (
              <div className="max-h-48 overflow-auto rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-lg">
                {areaSuggestions.map((suggestion, index) => (
                  <button
                    type="button"
                    key={suggestion.id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left text-sm transition ${
                      index === activeSuggestionIndex
                        ? 'bg-primary/10 text-foreground'
                        : 'hover:bg-white/5 text-foreground'
                    }`}
                  >
                    <span className="font-medium">{suggestion.label}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {suggestion.source === 'google' ? 'Google' : suggestion.source === 'nominatim' ? 'OpenStreetMap' : 'Local'} suggestion
                    </span>
                  </button>
                ))}
              </div>
            )}
            {enableManualPinToggle && (
              <Button
                type="button"
                size="sm"
                variant={manualPinMode ? 'default' : 'outline'}
                className="mt-2 w-full justify-center rounded-xl border border-dashed border-primary/40 bg-white/[0.02] text-sm font-medium transition hover:border-primary/60 hover:bg-primary/5"
                onClick={() => setManualPinMode((prev) => !prev)}
              >
                {manualPinMode ? '✓ Manual pin mode enabled' : 'Drop a pin manually'}
              </Button>
            )}
          </div>
        </div>
      )}

      {geoJsonError && !compact && (
        <p className="text-xs text-muted-foreground">{geoJsonError}</p>
      )}

      <div className={`rounded-lg border border-white/10 ${manualPinMode ? 'ring-2 ring-primary/50' : ''}`}>
        <MapContainer
          center={selected ? [selected.lat, selected.lng] : [defaultCenter.lat, defaultCenter.lng]}
          zoom={selected ? 13 : 5}
          style={containerStyle}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
          <ClickHandler onClick={handleManualPin} allowClicks={allowMapClicks} />
          <MapController setMap={setMap} />
          {highlightFeature && (
            <GeoJSON data={highlightFeature as any} style={() => districtStyle} />
          )}
          {!highlightFeature && selected && (
            <Circle center={[selected.lat, selected.lng]} radius={1500} pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.08 }} />
          )}
          {selected && (
            <Marker
              position={[selected.lat, selected.lng]}
              draggable
              eventHandlers={{
                dragend: async (event) => {
                  const marker = event.target as L.Marker;
                  const latlng = marker.getLatLng();
                  setSelected({ lat: latlng.lat, lng: latlng.lng });
                  setConfidence('low');
                  
                  // Reverse geocode on drag end
                  const result = await reverseGeocode(latlng.lat, latlng.lng);
                  if (result) {
                    // Update state and district if found
                    if (result.state && Object.keys(STATE_DISTRICTS).includes(result.state)) {
                      setStateName(result.state);
                      if (result.district) {
                        const districts = getDistrictsForState(result.state);
                        if (districts.includes(result.district)) {
                          setSelectedDistrictName(result.district);
                        }
                      }
                    }
                    
                    // Update area input with reverse geocoded address
                    if (result.area || result.address) {
                      setAreaInput(result.area || result.address);
                    }
                  }
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          {selected ? (
            <>
              <p className="font-mono text-foreground">{selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {stateName && <span>State: {stateName}</span>}
                {selectedDistrictName && <span>District: {selectedDistrictName}</span>}
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' : confidence === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/30 text-slate-200'}`}>
                  {confidence} confidence
                </span>
              </div>
            </>
          ) : (
            <p>Select a mode to drop the first pin.</p>
          )}
        </div>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={!selected}
          className="rounded-lg bg-primary/80 px-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Use this location
        </Button>
      </div>
    </div>
  );
}

async function fetchAreaSuggestions(
  query: string,
  stateName: string,
  districtName: string | undefined,
  googleKey: string | null,
  signal: AbortSignal,
): Promise<AreaSuggestion[]> {
  // Try Google Places REST API if key is provided
  if (googleKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:in&key=${googleKey}`;
      const res = await fetch(url, { signal });
      
      if (!res.ok) {
        throw new Error(`Google Places API returned ${res.status}`);
      }
      
      const data = await res.json();
      
      // Check for API errors
      if (data.status === 'OK' && data.predictions) {
        const predictions = data.predictions ?? [];
        if (predictions.length > 0) {
          return predictions.slice(0, 6).map((prediction: any) => ({
            id: prediction.place_id,
            label: prediction.description,
            source: 'google',
            placeId: prediction.place_id,
            state: stateName,
            district: districtName,
          }));
        }
      } else if (data.status === 'REQUEST_DENIED' || data.status === 'INVALID_REQUEST') {
        console.warn('Google Places API error:', data.status, data.error_message);
        // Fall through to Nominatim
      }
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') {
        console.warn('Google Places REST API error:', error);
        // Fall through to Nominatim
      } else {
        throw error; // Re-throw abort errors
      }
    }
  }

  // Fallback to Nominatim (OpenStreetMap) - Always available
  try {
    const parts = [query];
    if (districtName) parts.push(districtName);
    if (stateName) parts.push(stateName);
    parts.push('India');
    const search = parts.join(', ');
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=in&addressdetails=1&q=${encodeURIComponent(search)}`;
    const res = await fetch(nominatimUrl, {
      signal,
      headers: {
        'Accept-Language': 'en',
      },
    });
    
    if (!res.ok) {
      console.warn(`Nominatim API error: ${res.status}`, nominatimUrl);
      return [];
    }
    
    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) {
      console.debug(`Nominatim returned no results for: "${search}"`);
      return [];
    }
    
    const results = json.map((entry: any) => ({
      id: entry.place_id || `nominatim-${entry.osm_id}`,
      label: entry.display_name,
      lat: Number(entry.lat),
      lng: Number(entry.lon),
      source: 'nominatim' as const,
      osmId: `${entry.osm_type?.[0] ?? 'N'}${entry.osm_id}`,
      state: entry.address?.state ?? stateName,
      district: entry.address?.county ?? entry.address?.district ?? districtName,
    } as AreaSuggestion));
    
    console.debug(`Nominatim returned ${results.length} results for: "${search}"`);
    return results;
  } catch (error) {
    if ((error as DOMException).name !== 'AbortError') {
      console.error('Nominatim error:', error);
    }
    return [];
  }
}
