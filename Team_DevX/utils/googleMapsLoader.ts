/**
 * Dynamic Google Maps Script Loader
 * Loads Google Maps JavaScript API with Places library only once
 */

let scriptLoadingPromise: Promise<void> | null = null;
let isScriptLoaded = false;

export interface LoadGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
}

/**
 * Loads Google Maps JavaScript API script dynamically
 * @param options Configuration options
 * @returns Promise that resolves when script is loaded
 */
export function loadGoogleMapsScript(options: LoadGoogleMapsOptions): Promise<void> {
  // If already loaded, return resolved promise
  if (isScriptLoaded && window.google?.maps) {
    return Promise.resolve();
  }

  // If already loading, return existing promise
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  // Check if script tag already exists
  const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
  if (existingScript) {
    // Script tag exists, wait for it to load
    scriptLoadingPromise = new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkInterval);
          isScriptLoaded = true;
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google?.maps) {
          reject(new Error('Google Maps script failed to load'));
        }
      }, 10000);
    });
    return scriptLoadingPromise;
  }

  // Create new script loading promise
  scriptLoadingPromise = new Promise((resolve, reject) => {
    const { apiKey, libraries = ['places'], language = 'en', region = 'in' } = options;

    const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
    const languageParam = language ? `&language=${language}` : '';
    const regionParam = region ? `&region=${region}` : '';

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${librariesParam}${languageParam}${regionParam}`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';

    script.onload = () => {
      // Wait a bit for Google Maps to fully initialize
      let retryCount = 0;
      const maxRetries = 50; // 5 seconds max
      
      const checkInit = () => {
        if (window.google?.maps) {
          isScriptLoaded = true;
          resolve();
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkInit, 100);
        } else {
          const scriptElement = document.getElementById('google-maps-script');
          if (scriptElement) {
            scriptElement.remove();
          }
          reject(new Error('Google Maps API failed to initialize after timeout'));
        }
      };
      
      checkInit();
    };

    script.onerror = () => {
      const scriptElement = document.getElementById('google-maps-script');
      if (scriptElement) {
        scriptElement.remove();
      }
      reject(new Error('Failed to load Google Maps script. Please check your API key and network connection.'));
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

/**
 * Check if Google Maps is already loaded
 */
export function isGoogleMapsLoaded(): boolean {
  return isScriptLoaded && !!window.google?.maps;
}

/**
 * Reset the loader state (useful for testing or re-initialization)
 */
export function resetGoogleMapsLoader(): void {
  scriptLoadingPromise = null;
  isScriptLoaded = false;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (inputField: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => google.maps.places.Autocomplete;
          PlacesService: new (attrContainer: HTMLElement) => google.maps.places.PlacesService;
          PlacesServiceStatus: typeof google.maps.places.PlacesServiceStatus;
        };
        Geocoder: new () => google.maps.Geocoder;
        GeocoderStatus: typeof google.maps.GeocoderStatus;
        event?: {
          removeListener: (listener: google.maps.MapsEventListener) => void;
        };
      };
    };
  }
}

