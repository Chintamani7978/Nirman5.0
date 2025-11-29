import { test, expect } from '@playwright/test';

test('MapPage loads and shows map', async ({ page }) => {
    // Navigate to the map page
    await page.goto('http://localhost:5173/');

    // Expect to be redirected to /map or just be on /map
    await expect(page).toHaveURL(/.*\/map/);

    // Check for the map container
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();

    // Check for the "You are here" marker popup or at least a marker
    // Note: Geolocation might be blocked or default to London.
    // We can just check if any marker exists if we expect one, 
    // but initially there might be none if no requests and geolocation takes time.
    // However, the code adds a "You are here" marker when position is set.
    // We might need to mock geolocation or wait.

    // For a minimal test, just checking the map container is a good start.
    // Let's try to wait for the "You are here" text in a popup if we click a marker?
    // Or just check if the text "Loading location..." disappears.
    await expect(page.getByText('Loading location...')).toBeHidden({ timeout: 10000 });
});
