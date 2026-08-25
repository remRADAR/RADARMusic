# RADARMusic

RADARMusic is a lightweight release-portal starter with a Push.fm-inspired artist workflow: paste one Spotify or Apple Music release URL, resolve its canonical metadata, discover listening destinations, review the matches, and publish only approved official links.

## Current flow

The browser submits the source URL to `POST /api/release/resolve`. The serverless handler validates that the URL belongs to Spotify or Apple Music, calls a provider-supported metadata endpoint, normalizes the release identity, and returns a source link plus provider-specific search/deep-link destinations. The UI marks the original source as **verified** and all catalog search destinations as **needs review** until the artist confirms them.

The implementation deliberately does not scrape protected store pages, bypass authentication, proxy copyrighted streams, or fabricate an embed. A store is rendered as an outbound listening destination unless an official embed URL is explicitly known and approved by that provider.

## Provider notes

Spotify source metadata currently resolves through Spotify’s public oEmbed endpoint, with the Spotify Web API adapter reserved for richer metadata when server-side credentials are configured. Apple Music source metadata currently resolves through the public iTunes Lookup endpoint. Audiomack, Boomplay, Deezer, TIDAL, Amazon Music, and YouTube Music are returned as official search destinations in this lightweight slice; they can be promoted to verified matches by adding authenticated provider adapters and a review/persistence step.

## Deployment

This repository is structured for a Vite build with Vercel-style serverless functions under `api/`. Run:

```bash
npm install
npm run build
```

For richer Spotify resolution, configure the server-side credentials in the deployment environment and extend `api/release/resolve.js` to use Spotify’s Web API. Never expose provider secrets in browser code. If persistent artist portals are added, store only normalized metadata and artist-approved canonical URLs in a server-side database.

## Assets

The opening animation is `public/assets/radarcharts-opening.gif`. The supplied RADARMusic WEBP is `public/assets/radarmusic-icon.webp` and is used as the page icon, favicon, Apple touch icon, hero mark, and portal artwork.

## Analytics

Every published page records a `page_view` event and every outbound HTTP store link records a `store_click` event. Events contain the release slug, a browser-generated pseudonymous session ID, provider label, target URL, referrer origin, and a coarse viewport bucket; raw IP addresses, user-agent strings, and full referrer URLs are not stored. The creator summary is intentionally gated behind `?manage=1` in this lightweight slice and reports page views, unique sessions, total store clicks, and top destination.

For production persistence, apply `docs/analytics-migration.sql` to the chosen Postgres project and configure `SUPABASE_URL` plus the server-only `SUPABASE_SERVICE_ROLE_KEY` from `.env.example`. The current repository does not automatically apply this migration to the available Supabase project because that project is named `NairaLeap`; selecting a production analytics database requires explicit project confirmation.

## Creator authentication and roles

The creator dashboard is available at `/dashboard` and no longer relies on `?manage=1`. Sign-in is handled by Supabase Auth through a server-side session cookie named `__Host-radarmusic_session`, configured as `HttpOnly`, `Secure`, `SameSite=Lax`, and one-hour expiry. The browser never receives or stores the Supabase access token.

Roles are read from server-managed Supabase `app_metadata.role` values. Supported roles are `creator` and `admin`; unknown or missing roles are denied by default. A creator may access only release slugs listed in `app_metadata.release_slugs`, while an administrator may access all release analytics. The summary endpoint enforces both authentication and ownership server-side, so hiding the dashboard in the browser is not treated as authorization.

Set `SUPABASE_ANON_KEY` in addition to the existing Supabase URL and service-role key. The service-role key must remain server-only. The auth flow assumes email/password sign-in is enabled in Supabase Auth and that role metadata is assigned through a trusted administrative process, never from client input.

## Social sharing metadata

The page head now includes canonical URL, Open Graph, and Twitter Card tags with the RADARMusic title, description, and WEBP artwork fallback. When a release is resolved, the browser updates the document title, canonical URL, Open Graph title/description/image, and Twitter title/description/image to the matched release identity. Published release routes should set the same values during server-side or static page generation so social crawlers receive release-specific cards without executing browser JavaScript.
