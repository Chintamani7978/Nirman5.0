import React, { useEffect, useState, useMemo } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const defaultCenter: { lat: number; lng: number } = { lat: 20.5937, lng: 78.9629 };

type Props = {
  initial?: { lat: number; lng: number } | null;
  onConfirm: (lat: number, lng: number) => void;
};

const containerStyle = { width: '100%', height: '280px' } as const;

const ManualLocationPicker: React.FC<Props> = ({ initial = null, onConfirm }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });

  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(initial);

  useEffect(() => {
    if (initial) setSelected(initial);
  }, [initial]);

  const center = useMemo(() => (initial ? { lat: initial.lat, lng: initial.lng } : defaultCenter), [initial]);

  if (loadError) {
    return <div className="text-red-600 p-2">Map failed to load: {String(loadError)}</div>;
  }

  if (!isLoaded) {
    return <div className="p-2">Loading map...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="rounded-lg overflow-hidden border border-white/10 bg-white/2">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onClick={(e) => {
            const lat = e.latLng?.lat();
            const lng = e.latLng?.lng();
            if (lat != null && lng != null) setSelected({ lat, lng });
          }}
        >
          {selected ? (
            <Marker
              position={selected}
              draggable
              onDragEnd={(e) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();
                if (lat != null && lng != null) setSelected({ lat, lng });
              }}
            />
          ) : (
            <Marker
              position={center}
              draggable
              onDragEnd={(e) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();
                if (lat != null && lng != null) setSelected({ lat, lng });
              }}
            />
          )}
        </GoogleMap>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selected ? (
            <>
              <span className="font-mono">{selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}</span>
              <div className="text-xs text-muted-foreground">Drag marker or click on map to pick location</div>
            </>
          ) : (
            <span className="text-sm">No location selected yet. Drag the marker or click the map.</span>
          )}
        </div>

        <div className="flex-shrink-0">
          <Button
            type="button"
            onClick={() => selected && onConfirm(selected.lat, selected.lng)}
            disabled={!selected}
            className="rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <MapPin className="h-4 w-4 mr-2 inline" /> Use This Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManualLocationPicker;
