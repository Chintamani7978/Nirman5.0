import { useEffect, useState } from "react";

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

export const useUserLocation = () => {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 1000 * 60 * 5, timeout: 20000 },
    );
  }, []);

  return { position, loading, error } as const;
};

export default useUserLocation;
