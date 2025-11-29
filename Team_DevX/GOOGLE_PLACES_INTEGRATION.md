# Google Places Autocomplete Integration

This document describes the Google Places Autocomplete integration in the VoiceUp project.

## Overview

The integration provides seamless location search using Google Places Autocomplete with automatic fallback to Nominatim (OpenStreetMap) when Google API is unavailable.

## Architecture

### Components

1. **`src/utils/googleMapsLoader.ts`**
   - Dynamic Google Maps script loader
   - Prevents duplicate script loading
   - Handles script loading errors gracefully

2. **`src/hooks/usePlacesAutocomplete.ts`**
   - React hook for Google Places Autocomplete
   - Integrates with input fields
   - Handles place selection and address component extraction

3. **`src/hooks/useReverseGeocode.ts`**
   - Reverse geocoding hook (coordinates → address)
   - Uses Google Geocoding API with Nominatim fallback
   - Extracts state, district, area, and pincode

4. **`src/components/location/LocationPicker.tsx`**
   - Main location picker component
   - Integrates Google Places Autocomplete in area input
   - Syncs with Leaflet map
   - Handles marker drag with reverse geocoding

## Features

### Google Places Autocomplete
- **Restricted to India**: `componentRestrictions: { country: 'in' }`
- **Geocode types only**: Returns addresses, not businesses
- **Instant suggestions**: Shows suggestions as user types
- **Auto-fill state/district**: Extracts administrative boundaries from address components
- **Map synchronization**: Automatically moves map and drops marker on selection

### Fallback System
- **Automatic fallback**: If Google API key is missing or fails, uses Nominatim
- **Debounced search**: 300ms debounce for Nominatim queries
- **Fuzzy matching**: Local glossary matching for offline suggestions

### Marker Drag & Reverse Geocoding
- **Draggable markers**: Users can drag markers to fine-tune location
- **Auto reverse geocode**: On drag end, automatically reverse geocodes the new position
- **State/district update**: Updates state and district dropdowns if found
- **Area input update**: Fills area input with reverse geocoded address

## Configuration

### Environment Variables

Add to your `.env` file:

```env
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

Or alternatively:

```env
VITE_GOOGLE_PLACES_API_KEY=your_google_api_key_here
```

### API Key Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create an API key
5. (Recommended) Restrict the API key to:
   - HTTP referrers (for web apps)
   - Specific APIs (Maps JavaScript, Places, Geocoding)

## Usage

### In LocationPicker Component

The `LocationPicker` component automatically uses Google Places Autocomplete when:
- API key is provided via `googlePlacesApiKey` prop or environment variable
- State and district are selected
- Component is not in compact mode

```tsx
<LocationPicker
  googlePlacesApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
  onPlaceSelected={(info) => {
    // Handle place selection
  }}
  onConfirm={(payload) => {
    // Handle location confirmation
  }}
/>
```

### State/District Logic

- **State selection**: Required before area input is enabled
- **District selection**: Required before area input is enabled
- **Area input**: Only enabled after state and district are selected
- **Auto-extraction**: Google Places can auto-fill state/district from address components

### Map Synchronization

- **Place selection**: Automatically moves map to selected location
- **Marker placement**: Drops draggable marker at selected location
- **Marker drag**: Updates location and reverse geocodes on drag end
- **District highlight**: Highlights district polygon when district is selected

## Flow Diagram

```
User selects State
    ↓
User selects District
    ↓
Area input enabled
    ↓
User types in area input
    ↓
[Google API available?]
    ├─ Yes → Google Places Autocomplete suggestions
    └─ No  → Nominatim search (debounced 300ms)
    ↓
User selects suggestion
    ↓
Extract lat/lng
    ↓
Move map to location
    ↓
Drop draggable marker
    ↓
Auto-fill state/district (if found)
    ↓
User can drag marker
    ↓
On drag end → Reverse geocode
    ↓
Update state/district/area
```

## Error Handling

- **Script loading failure**: Falls back to Nominatim
- **API errors**: Shows error message, continues with fallback
- **Network errors**: Gracefully handles and shows user-friendly messages
- **Invalid API key**: Automatically switches to Nominatim without breaking the UI

## Performance

- **Script loading**: Loaded only once, cached for subsequent uses
- **Debouncing**: 300ms debounce for Nominatim queries
- **Abort controllers**: Cancels in-flight requests when user types new query
- **Lazy loading**: Google Maps script only loads when needed

## Testing

To test without Google API key:
1. Remove or comment out `VITE_GOOGLE_API_KEY` in `.env`
2. The app will automatically use Nominatim fallback
3. All features should work except Google Places Autocomplete

To test with Google API key:
1. Add `VITE_GOOGLE_API_KEY` to `.env`
2. Restart dev server
3. Google Places Autocomplete should appear in area input
4. Verify state/district auto-fill works

## Troubleshooting

### Google Places not showing suggestions
- Check API key is correct in `.env`
- Verify Places API is enabled in Google Cloud Console
- Check browser console for errors
- Verify API key restrictions allow your domain

### Reverse geocoding not working
- Check Geocoding API is enabled
- Verify API key has Geocoding API permission
- Check browser console for errors

### Map not updating
- Verify Leaflet map is properly initialized
- Check `map` state is set correctly
- Verify coordinates are valid numbers

## Future Enhancements

- [ ] Add Fuse.js for better fuzzy matching in fallback
- [ ] Cache reverse geocoding results
- [ ] Add place details (photos, reviews) on selection
- [ ] Support for multiple countries (currently restricted to India)
- [ ] Add place autocomplete for businesses/POIs

