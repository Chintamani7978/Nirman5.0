import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Fix for default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '320px',
};

const defaultCenter: [number, number] = [20.5937, 78.9629];

export interface Correlation {
  region_id: string;
  city: string;
  region: string;
  category_a: string;
  category_b: string;
  correlation_score: number;
  co_occurrence: number;
  latest_problem_date: string;
  center_point_wkt?: string; // This will be calculated client-side if needed
}

export interface MinistryMapFilters {
    dateRange?: { from: Date | undefined; to: Date | undefined };
    categories?: string[];
    city?: string;
}

interface MinistryMapProps {
    filters: MinistryMapFilters;
    onDataLoad: (data: Correlation[]) => void;
}

const fetchFilteredCorrelations = async (filters: MinistryMapProps['filters']) => {
  const { data, error } = await supabase.rpc('get_filtered_correlations', {
    start_date: filters.dateRange?.from?.toISOString(),
    end_date: filters.dateRange?.to?.toISOString(),
    cat_filter: filters.categories,
    city_filter: filters.city,
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
    roads: '#6b7280', water: '#3b82f6', electricity: '#f59e0b',
    sanitation: '#10b981', education: '#8b5cf6', healthcare: '#ef4444',
    pollution: '#d97706', safety: '#ec4899', other: '#a1a1aa',
};

const getBlendedColor = (catA: string, catB: string) => {
    const colorA = categoryColors[catA] || categoryColors['other'];
    const colorB = categoryColors[catB] || categoryColors['other'];
    return `linear-gradient(45deg, ${colorA}, ${colorB})`;
};

const MinistryMap: React.FC<MinistryMapProps> = ({ filters, onDataLoad }) => {
  const { data: correlations = [], isLoading: correlationsLoading } = useQuery({
    queryKey: ['filteredCorrelations', filters],
    queryFn: async () => {
        const data = await fetchFilteredCorrelations(filters);
        onDataLoad(data); // Pass data up to the parent dashboard
        return data;
    },
  });

  if (correlationsLoading) {
    return <div className="flex items-center justify-center h-full"><p>Loading map data...</p></div>;
  }

  return (
    <div className="h-full w-full rounded-2xl border border-border bg-card shadow-sm">
      <MapContainer center={defaultCenter} zoom={5} style={containerStyle} className="h-full w-full rounded-2xl">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {correlations.map((c) => {
        // Note: The RPC function get_filtered_correlations doesn't return center_point_wkt
        // because it's not needed for a national-level view. We use region_id which is the grid cell.
        const position = parseWktPoint(c.region_id);
        if (!position) return null;

        const iconSize = 20 + (c.correlation_score * 30);
        const iconColor = getBlendedColor(c.category_a, c.category_b);

        const customIcon = new L.DivIcon({
          className: 'custom-div-icon',
          html: `<div style="background:${iconColor};width:${iconSize}px;height:${iconSize}px;border-radius:50%;opacity:0.75;border:2px solid rgba(255,255,255,0.8);"></div>`,
          iconSize: [iconSize, iconSize],
          iconAnchor: [iconSize / 2, iconSize / 2]
        });

        return (
          <Marker key={c.region_id + c.category_a + c.category_b} position={position} icon={customIcon}>
            <Popup>
              <Card className="border border-border bg-white p-2 text-sm text-foreground shadow-lg">
                <CardHeader className="p-0 pb-1">
                  <CardTitle className="text-base font-semibold">Correlation Insight</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-1">
                  <p><span className="font-medium">City:</span> {c.city || 'N/A'}</p>
                  <p><span className="font-medium">Categories:</span> {c.category_a} ↔ {c.category_b}</p>
                  <p><span className="font-medium">Score:</span> {c.correlation_score.toFixed(2)}</p>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        );
      })}
      </MapContainer>
    </div>
  );
};

export default MinistryMap;
