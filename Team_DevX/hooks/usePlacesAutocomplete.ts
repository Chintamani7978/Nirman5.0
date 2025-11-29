import { useEffect, useState, useCallback } from 'react';

export interface PlaceResult {
  placeId: string;
  description: string;
  lat?: number;
  lng?: number;
  addressComponents?: google.maps.places.PlaceResult['address_components'];
}

export interface UsePlacesAutocompleteOptions {
  apiKey: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  onPlaceSelect?: (place: PlaceResult) => void;
  enabled?: boolean;
  componentRestrictions?: { country: string | string[] };
  types?: string[];
  fields?: string[];
}

/**
 * Hook for Google Places Autocomplete integration
 * Uses REST API only (no JavaScript API widget) to avoid error overlays
 * Falls back gracefully if Google API is unavailable
 */
export function usePlacesAutocomplete({
  apiKey,
  inputRef,
  onPlaceSelect,
  enabled = true,
  componentRestrictions = { country: 'in' },
  types = ['geocode'],
  fields = ['geometry', 'address_components', 'formatted_address', 'place_id'],
}: UsePlacesAutocompleteOptions) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Don't load Google Maps JavaScript API - use REST API only
  // This prevents the error overlay from appearing
  useEffect(() => {
    if (!enabled || !apiKey) {
      setIsReady(false);
      setIsLoading(false);
      return;
    }

    // Mark as ready if API key is available (REST API will be used)
    // The actual autocomplete will be handled by the REST API in fetchAreaSuggestions
    setIsReady(true);
    setIsLoading(false);
    setError(null);
  }, [apiKey, enabled]);

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<PlaceResult | null> => {
      if (!isReady || !apiKey) {
        return null;
      }

      // Use REST API instead of JavaScript API
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,address_components,formatted_address,place_id&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'OK' && data.result) {
          const place = data.result;
          const result: PlaceResult = {
            placeId: place.place_id || '',
            description: place.formatted_address || '',
            addressComponents: place.address_components,
          };

          if (place.geometry?.location) {
            result.lat = place.geometry.location.lat;
            result.lng = place.geometry.location.lng;
          }

          return result;
        }
      } catch (error) {
        console.error('Failed to fetch place details:', error);
      }

      return null;
    },
    [isReady, apiKey]
  );

  return {
    isReady,
    isLoading,
    error,
    getPlaceDetails,
  };
}

