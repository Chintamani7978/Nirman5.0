import { useState, useCallback } from 'react';

export interface ReverseGeocodeResult {
  lat: number;
  lng: number;
  address: string;
  state?: string;
  district?: string;
  area?: string;
  pincode?: string;
  source: 'google' | 'nominatim';
}

export interface UseReverseGeocodeOptions {
  googleApiKey?: string | null;
}

/**
 * Hook for reverse geocoding coordinates to addresses
 * Uses Google Geocoding API with fallback to Nominatim
 */
export function useReverseGeocode({ googleApiKey }: UseReverseGeocodeOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<ReverseGeocodeResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Try Google Geocoding REST API first if key is available (no JavaScript API needed)
        if (googleApiKey) {
          try {
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`;
            const geocodeRes = await fetch(geocodeUrl);
            const geocodeData = await geocodeRes.json();
            
            if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
              const address = geocodeData.results[0];
              const components = address.address_components || [];

              // Extract address components
              const getComponent = (types: string[]) => {
                const component = components.find((c) =>
                  types.some((type) => c.types.includes(type))
                );
                return component?.long_name || component?.short_name;
              };

              const state = getComponent(['administrative_area_level_1']);
              const district = getComponent(['administrative_area_level_2']);
              const area =
                getComponent(['sublocality', 'sublocality_level_1', 'neighborhood', 'locality']) ||
                getComponent(['political']);
              const pincode = getComponent(['postal_code']);

              setIsLoading(false);
              return {
                lat,
                lng,
                address: address.formatted_address || '',
                state,
                district,
                area,
                pincode,
                source: 'google',
              };
            }
          } catch (googleError) {
            console.warn('Google reverse geocoding failed, falling back to Nominatim:', googleError);
          }
        }

        // Fallback to Nominatim
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
        const response = await fetch(nominatimUrl, {
          headers: {
            'Accept-Language': 'en',
          },
        });

        if (!response.ok) {
          throw new Error('Nominatim reverse geocoding failed');
        }

        const data = await response.json();
        const address = data.address || {};

        setIsLoading(false);
        return {
          lat,
          lng,
          address: data.display_name || '',
          state: address.state,
          district: address.county || address.district,
          area: address.suburb || address.village || address.neighbourhood || address.town || address.city,
          pincode: address.postcode,
          source: 'nominatim',
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Reverse geocoding failed';
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    },
    [googleApiKey]
  );

  return {
    reverseGeocode,
    isLoading,
    error,
  };
}

