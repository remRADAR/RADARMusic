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

## RADARMatrix portal surface

The public release experience now follows a mobile-app-style, glassmorphic portal model. A persistent identity hero keeps artwork, artist, title, and release metadata fixed above a segmented surface switcher for Listen, Watch, Shorts, and Press. Listen expands the verified Spotify source through the official Spotify embed and renders the remaining providers as transparent destination rows; Watch uses an official YouTube iframe surface; Shorts uses a horizontal snap-style rail; Press uses editorial feature cards.

The example release is wired to the public Spotify preview for `Cut To The Feeling` by Carly Rae Jepsen so the embedded listening surface is internally coherent. The Watch, Shorts, and Press content includes demo placeholders and should be replaced with approved release-specific assets before publication. The existing resolver remains the source for replacing the example release at runtime, and the analytics, social metadata, authenticated dashboard, and notification foundations remain available behind the same release model.

## Full-background tab experience

The public landing page now uses a four-state, full-viewport presentation inspired by the supplied Framer reference while retaining the original RADARMusic concept and assets. Home uses the artist portrait treatment and release identity; Stream uses the current release cover as the dominant background with the verified Spotify player and store destinations; YouTube uses a channel-cover background with an in-page video surface; Profile uses the artist image behind profile details, release posts, and the Spotify/Apple resolver form.

The tab rail changes the major background and foreground content together without page navigation. Desktop uses a vertical indexed rail, while mobile moves the same controls into a fixed bottom pill. The existing opening GIF, RADARMusic icon/favicon, social metadata, analytics, resolver, sharing control, and authenticated creator route remain integrated. Current YouTube, profile imagery, and release-post content are clearly marked demo content and require artist-approved media before publication.

## Supplied typography and multimedia controls

The interface now self-hosts the user-supplied Share Tech Mono font at `public/assets/fonts/share-tech-mono-regular.ttf`. It replaces the prior remote mono utility face across navigation labels, metadata, status text, and dashboard controls. The supplied multimedia artwork was converted into optimized transparent WebP controls under `public/assets/icons/` and is used for Home, Stream, YouTube, Profile, play, and sharing actions. Verify that the supplied asset licenses permit production redistribution before public launch.

The opening screen is now a logo-only reveal. It displays the RADARMusic page icon without a text lockup or entry button, uses a short pop animation, dismisses automatically, and respects reduced-motion preferences.

## Pre-save links

The release resolver accepts supported public pre-save campaign links in addition to Spotify and Apple Music release URLs. Supported host families currently include Feature.fm/`ffm.to`, Linkfire/`lnk.to`, PreSave, PUSH.fm, HyperFollow/DistroKid, Found.ee, FanLink, Amuse, Hypeddit, ToneDen, Laylo, and OrchardGo.

For a supported pre-save URL, the server reads only public HTML metadata such as Open Graph title, description, artwork, and an exposed release date. It returns the original campaign provider as the verified continuation action and generates transparent post-release search destinations for the major stores. The Stream surface becomes a pre-save assistance card and sends the fan to the original provider to complete authorization.

RADARMusic does not collect a fan’s Spotify or Apple Music password, does not claim that a save is complete, and does not call a provider save endpoint on the fan’s behalf. Spotify library saves require authorized user access, while Apple Music pre-add availability is coordinated through the label or distributor. Feature.fm likewise documents that pre-saving involves fan account authorization and can later convert the same campaign into a released smart link.

References: [Spotify Web API](https://developer.spotify.com/documentation/web-api), [Apple Music pre-adds](https://artists.apple.com/support/1118-apple-music-pre-adds), and [Feature.fm pre-save smart links](https://help.feature.fm/articles/360043281971-Creating-A-Pre-Save-Smart-Link).

## Automatic manual metadata fallback

When a supported pre-save campaign URL is valid but its public metadata cannot be read, the resolver now returns an explicit HTTP 422 fallback contract instead of ending the workflow. The Profile interface opens a guided manual form automatically while preserving the original campaign URL and identified provider.

Creators can enter the release title, artist, optional HTTPS artwork URL, optional release date, and optional description. The server validates lengths, date format, artwork protocol, provider eligibility, and the preserved campaign URL before generating the portal. Manual recovery is available only for supported pre-save hosts; it cannot be used to turn an arbitrary URL into a verified campaign.

Recovered portals carry `provenance: creator-entered` and `scrapeStatus: manual-fallback`. The Stream view displays `PRE-SAVE · MANUAL FALLBACK` and `CREATOR-ENTERED DETAILS · VERIFY BEFORE PUBLISHING`, while the original provider link remains the verified continuation action. Missing or unavailable artwork falls back to the RADARMusic page logo.
