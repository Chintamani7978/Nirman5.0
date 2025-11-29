

# VoiceUp India

VoiceUp India is a citizen engagement platform for reporting, tracking, and analyzing public issues. It features geospatial problem mapping, real-time dashboards, a comment system, and an AI-powered chatbot for civic queries.

## Features

- Report problems with location, category, description, and attachments
- View and upvote/downvote problems in your area
- Comment on problems and discuss solutions
- Geospatial map with problem correlation engine
- Ministry dashboard for analytics and insights
- AI chatbot for public data and civic help
- Real-time notifications and updates

## Tech Stack

- **Frontend:** Vite, React, TypeScript, shadcn-ui, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, PostGIS, RLS, Functions)
- **Mapping:** React-Leaflet, PostGIS
- **State:** TanStack React Query

## Getting Started

### Prerequisites
- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase project (see `supabase/config.toml` for project ID)

### Local Development

```sh
# 1. Clone the repository
git clone https://github.com/Manas-Dikshit/voiceup-india
cd voiceup-india

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### Supabase Setup
- Ensure your Supabase project is linked in `supabase/config.toml`
- Run all migrations in `supabase/migrations/` (or use the consolidated `MANUAL_MIGRATION.sql`)
- Configure storage buckets for attachments

### Supabase Sync Workflow
Keep local SQL, RPCs, and generated types in lockstep with the hosted Supabase project:

1. **Authenticate & link**
	```sh
	supabase login
	supabase link --project-ref wfpxknccdypiwpsoyisx
	```
2. **Pull the remote schema** to refresh the `supabase/` directory (creates a migration if remote differs):
	```sh
	supabase db pull
	```
	Inspect the diff that Supabase emits; commit any newly created migration files.
3. **Apply pending local migrations to the remote project** once the diff looks correct:
	```sh
	supabase db push
	```
4. **Regenerate TypeScript types** so hooks/components reference the latest schema:
	```sh
	supabase gen types typescript --encoded-config supabase/config.toml > src/integrations/supabase/types.ts
	```
5. **Validate locally** by running `npm run build` before deploying.

> If the remote schema was changed outside of migrations, run steps 1–2, resolve conflicts in `supabase/migrations/`, and only then push. This prevents accidental overwrites.

### Environment Variables
Create a `.env` file for any secrets (API keys, bucket names, etc). See `.env.example` if present.

#### Google Maps API Key Setup
1. Get your API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Add to your `.env` file:
   ```
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```
   Or alternatively:
   ```
   VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

The app will automatically use Google Places Autocomplete when the API key is available, with fallback to Nominatim (OpenStreetMap) if the key is missing or unavailable.

## Editing & Deployment

- Edit code in your IDE and push changes to GitHub
- Deploy via your preferred static hosting (e.g., Vercel, Netlify)

## License

MIT
