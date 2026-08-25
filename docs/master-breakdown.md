# RADARMusic — Master Project Breakdown

**Repository:** [remRADAR/RADARMusic](https://github.com/remRADAR/RADARMusic)  
**Current branch:** `main`  
**Current commit:** `82cc2d9` — Improve Spotify release metadata matching  
**Project type:** Vite single-page release portal with Vercel-style serverless endpoints and optional Supabase-backed services.

## 1. Executive summary

RADARMusic is a premium artist release-portal concept designed to give each release a considered front door. The product combines a cinematic public-facing music page with an artist workflow that accepts a Spotify or Apple Music URL, normalizes the release identity, generates official store destinations, and lets the creator review matches before publishing.

The project has expanded beyond a static landing page. It now includes first-party analytics, secure creator authentication, role-based dashboard access, opt-in email/SMS click-through notifications, social sharing metadata, and server-side provider resolution. The current implementation is a strong production-oriented vertical slice, but it is not yet a fully deployed multi-tenant publishing platform because persistent release records, a confirmed production database, provider credentials, and a complete authenticated publishing workflow still need to be connected.

## 2. Product purpose and users

The primary user is an artist, label, or campaign owner who wants to turn one streaming-store URL into a shareable release destination. The primary audience is the fan: the public page should load quickly, establish a visual identity, present the release story, and make it easy to move to the store where the fan prefers to listen.

A secondary user is the creator or administrator who needs to review release metadata, inspect store destinations, view click-through performance, and configure operational alerts. The current dashboard is intentionally lightweight and is accessed at `/dashboard`; it uses server-validated authentication rather than a client-only visibility flag.

| User | Main objective | Current support |
|---|---|---|
| Fan | Discover a release and choose a listening destination | Public release page, store cards, outbound destinations, page-view and click tracking |
| Artist/creator | Submit a source link, review matches, inspect performance, configure alerts | Resolver form, authenticated dashboard, analytics summary, notification setup |
| Administrator | Manage all creators and releases | `admin` role can access all analytics slugs; broader management controls are not yet implemented |

## 3. Public experience

The public experience is a dark, editorial release page built around the supplied RADARCharts opening GIF and RADARMusic chrome-note WEBP. The opening layer covers the viewport, provides an “Enter experience” action, dismisses automatically after a short interval, and respects reduced-motion preferences.

The page includes a navigation bar, large hero statement, icon-led artwork, release metadata, destination cards, release story, journal cards, credits, footer, and a persistent mini-player control. The visual system uses restrained green accents, fine borders, serif italic contrast, monospace metadata labels, large typographic hierarchy, and responsive mobile rules.

The supplied assets are used as follows:

| Asset | Location | Usage |
|---|---|---|
| Opening GIF | `public/assets/radarcharts-opening.gif` | Full-screen welcome animation |
| RADARMusic WEBP | `public/assets/radarmusic-icon.webp` | Navigation mark, hero art, story art, favicon, Apple touch icon, social fallback artwork, mini-player artwork |

## 4. Artist release workflow

The release workflow begins with the “Create Your Release Portal” form. An artist pastes a Spotify or Apple Music URL. The browser posts the URL to `POST /api/release/resolve`.

The resolver validates the hostname, extracts the provider and source identifier, requests metadata, and returns a normalized metadata object. The UI then displays the matched title, artist, artwork, and source provider, followed by a list of official store search or source destinations.

The match model deliberately distinguishes source certainty from discovery certainty. The submitted Spotify or Apple Music source is labeled `verified`. Other destinations are labeled `needs-review` because a search URL is not proof that the exact recording exists on that service. This prevents the product from presenting an unconfirmed match as a canonical store link.

### Current provider behavior

| Provider | Input source | Current resolution behavior | Current status |
|---|---:|---|---|
| Spotify | Yes | Spotify Web API track lookup when credentials exist; public oEmbed fallback otherwise | Verified source; fallback may lack artist metadata |
| Apple Music | Yes | iTunes Lookup endpoint | Verified source when lookup succeeds |
| Audiomack | No | Official search/deep-link destination | Needs review |
| Boomplay | No | Official search/deep-link destination | Needs review |
| Deezer | No | Official search/deep-link destination | Needs review |
| TIDAL | No | Official search/deep-link destination | Needs review |
| Amazon Music | No | Official search/deep-link destination | Needs review |
| YouTube Music | No | Official search/deep-link destination | Needs review |

The resolver does not scrape protected pages, bypass authentication, proxy streams, or fabricate embeds. It returns official outbound destinations unless a provider-approved embed URL is explicitly available.

## 5. Backend/API architecture

The repository uses Vite for the client build and Vercel-style serverless functions under `api/`. There is no traditional Express server and no persistent local server process in the repository. Production deployment should provide a platform that supports the `api/` function convention or adapt these handlers to the chosen hosting platform.

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/release/resolve` | `POST` | Validate Spotify/Apple URL and resolve metadata plus store destinations | Public, input restricted to supported providers |
| `/api/analytics/event` | `POST` | Persist page views and store clicks | Public event ingestion with payload validation |
| `/api/analytics/summary` | `GET` | Return views, unique sessions, clicks, and top provider | Authenticated creator/admin; creator ownership enforced |
| `/api/auth/login` | `POST` | Exchange Supabase email/password credentials for a server session cookie | Public login endpoint |
| `/api/auth/session` | `GET` | Return the authenticated user identity and role | Cookie-authenticated |
| `/api/auth/logout` | `POST` | Clear the server session cookie | Public cookie-clearing endpoint |
| `/api/notifications/subscribe` | `POST` | Create an email/SMS click-alert subscription | Authenticated creator/admin with release access |
| `/api/notifications/unsubscribe` | `GET`/`POST` | Disable a subscription using its token | Token-authenticated |

The shared auth helper is in `api/_lib/auth.js`. The shared notification provider logic is in `api/_lib/notify.js`.

## 6. Authentication and authorization

The dashboard no longer relies on `?manage=1`. The current route is `/dashboard`, with an optional `release` query parameter identifying the release whose metrics are being viewed. The query parameter selects the target release; it does not grant access.

Supabase Auth handles email/password verification. On successful login, the backend stores the Supabase access token in a `__Host-radarmusic_session` cookie with `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, and one-hour expiry settings. The browser does not receive or store the raw access token.

The server reads the role from Supabase-managed `app_metadata.role`. Supported roles are:

| Role | Access model |
|---|---|
| `creator` | Can view analytics and configure notifications only for release slugs in `app_metadata.release_slugs` |
| `admin` | Can view analytics and manage notification subscriptions for all release slugs |
| Missing/unknown | Denied by default |

The role and release assignment must be set by a trusted administrative process. Client input cannot assign a role. The current implementation protects analytics summaries and notification subscription creation server-side.

## 7. Analytics and click-through tracking

The client initializes analytics on every page. A `page_view` event is sent through `navigator.sendBeacon`, with a `fetch` fallback. Every outbound HTTP link click is recorded as a `store_click` event with the provider label and target URL.

The event payload includes:

- `event_name`: `page_view` or `store_click`.
- `release_slug`: current path-derived release identifier.
- `session_id`: browser-generated pseudonymous identifier stored in local storage.
- `provider`: link/provider label when applicable.
- `target_url`: outbound destination when applicable.
- `referrer_origin`: origin only, not the full referrer URL.
- `viewport_bucket`: `mobile`, `tablet`, `desktop`, or `unknown`.

The analytics migration is in `docs/analytics-migration.sql`. It creates `radarmusic_analytics_events`, adds indexes for release/time and release/event queries, enables RLS, and revokes anonymous/authenticated table access so the service role is required for persistence and reporting.

The creator dashboard summary currently returns page views, unique sessions, total store clicks, and top destination. The summary endpoint reads up to 5,000 rows per request and performs aggregation in the serverless function. For higher traffic, aggregation should move to SQL views, materialized rollups, or a dedicated analytics service.

## 8. Email and SMS notifications

Creators can configure click-through alerts from the authenticated dashboard. The creator selects `email` or `sms`, enters a destination, and checks an explicit consent box. Email addresses are validated with a basic format check; SMS numbers require international `+` notation.

The notification path is:

1. A fan clicks an outbound store link.
2. The analytics event is persisted.
3. The server finds enabled subscriptions for the release slug.
4. The server checks the last delivery time for each subscription.
5. The server sends through Resend or Twilio when the corresponding credentials are configured.
6. A delivery record is stored after a successful send.

Delivery is rate-limited to one notification per subscription per 15 minutes. Unsubscribe tokens are generated server-side and disable the subscription without requiring a login.

The notification migration is in `docs/notifications-migration.sql`. It creates `radarmusic_notification_subscriptions` and `radarmusic_notification_deliveries`, with unique unsubscribe tokens, ownership fields, consent timestamps, enablement state, delivery indexes, RLS, and revoked anonymous/authenticated access.

## 9. Social sharing metadata

`index.html` includes baseline canonical, Open Graph, and Twitter Card metadata. The fallback card uses the RADARMusic title, description, canonical URL, and supplied WEBP artwork.

`src/social-meta.js` updates the browser document after a release is resolved. It changes the title, canonical URL, Open Graph title/description/url/image, and Twitter title/description/image to reflect the matched release.

For true release-specific social cards on published pages, the future publishing layer must render the same metadata server-side or generate static HTML per release. Social crawlers may not execute the client-side resolver code.

## 10. Environment and deployment configuration

The environment template is `.env.example`. Variables currently cover Supabase, Spotify metadata enrichment, Resend, and Twilio.

| Variable group | Variables | Purpose |
|---|---|---|
| Supabase | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Auth, event persistence, subscription persistence, reporting |
| Spotify | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Accurate artist, album, release-date, and artwork metadata through the Spotify Web API |
| Resend | `RESEND_API_KEY`, `NOTIFY_FROM_EMAIL` | Email notifications |
| Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | SMS notifications |

The service-role key, Spotify client secret, Resend key, and Twilio auth token must remain server-side. They must never be placed in `src/` or exposed through `VITE_` variables.

The repository currently has only Vite as a dependency and uses the following commands:

```bash
npm install
npm run dev
npm run build
npm run preview
```

`vite.config.js` permits `localhost` and the temporary `.manus.computer` preview host for development inspection. This host allowlist is not a production access-control mechanism.

## 11. QA history and current verification state

The project has been repeatedly built and visually inspected during implementation. The latest QA pass confirmed that the temporary preview responds with HTTP 200, the public page renders, the opening animation loads, the dashboard route shows the sign-in state, and the browser console reported no runtime errors during the inspected flows.

A QA defect was found and fixed: the creator analytics panel was visible on the public page because the CSS display rule overrode the HTML `hidden` attribute. The project now includes `[hidden]{display:none!important}`.

A Spotify resolver test used the public track URL `https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl`. The resolver returned `Cut To The Feeling`, Spotify artwork, one verified Spotify source, and seven review-required destinations. Without Spotify Web API credentials, the fallback returned `Unknown artist`, which is expected from the public oEmbed response and is documented in `docs/spotify-test-2026-08-25.md`.

The branch is currently clean and synchronized with `origin/main` at commit `82cc2d9`.

## 12. Current production readiness

The project is visually polished and functionally coherent as a prototype or production-oriented vertical slice. The public experience, provider-safe resolution, auth boundary, analytics model, social metadata, and notification adapters are present.

It is not yet production-complete for a public multi-artist service. The most important missing pieces are persistent release and portal records, a confirmed production Supabase project, applied migrations, verified authentication setup, release ownership management, server-rendered published pages, complete provider adapters, and operational observability.

| Area | Status | Meaning |
|---|---|---|
| Public visual experience | Ready for preview | Core page and assets render correctly |
| Spotify/Apple source submission | Functional slice | Serverless handler works; Spotify artist enrichment needs credentials |
| Cross-store matching | Review-based | Search destinations are not canonical matches until confirmed |
| Analytics | Implemented, configuration-dependent | Storage requires migration and Supabase environment variables |
| Creator authentication | Implemented, configuration-dependent | Supabase Auth and role metadata must be configured |
| Notifications | Implemented, configuration-dependent | Database migration and Resend/Twilio credentials required |
| Social cards | Baseline ready | Dynamic crawler-ready cards require server/static publishing |
| Multi-tenant publishing | Not complete | Needs release records, slugs, ownership, publishing state, and CRUD |
| Compliance operations | Partial | Consent/unsubscribe foundations exist; legal policy and retention controls remain |

## 13. Highest-priority roadmap

**Phase 1 — Make the data model real.** Create a confirmed RADARMusic Supabase project and apply the analytics and notification migrations. Add `releases`, `release_destinations`, `creator_release_access`, and `published_pages` tables. Replace app metadata release arrays with relational ownership records once the number of creators grows.

**Phase 2 — Complete creator management.** Add authenticated release creation, draft/published states, destination approval, release slug generation, artwork management, and notification preference management. Add administrator tools for assigning creator access and reviewing provider matches.

**Phase 3 — Make published pages crawler-ready.** Generate server-rendered or static HTML per published slug with release-specific canonical, Open Graph, Twitter, JSON-LD, and artwork tags. Connect public pages to persistent release data rather than the current hard-coded release narrative.

**Phase 4 — Improve matching quality.** Add authenticated Spotify metadata, a stronger Apple Music catalog path, provider adapters for Deezer and YouTube, approved integrations for Audiomack and Boomplay, and a normalized match score based on title, artist, album, duration, ISRC, and release date. Keep human review for uncertain matches.

**Phase 5 — Harden operations and compliance.** Add authentication rate limiting, CSRF protection for state-changing browser requests, event deduplication, bot filtering, retention policies, notification delivery retries, provider error telemetry, audit logs, consent records, privacy/terms pages, and production monitoring.

## 14. Bottom line

RADARMusic is currently a strong branded release-portal foundation with a working public experience and several production-minded backend slices. Its largest gap is not visual quality; it is the transition from a polished single-page vertical slice to a persistent, multi-tenant publishing platform. The next engineering investment should therefore focus on the confirmed database model, release ownership and publishing lifecycle, server-rendered release routes, and authenticated provider matching rather than additional surface-level visual features.
