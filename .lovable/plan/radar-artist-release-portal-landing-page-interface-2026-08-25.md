# RADAR — Artist Release Portal (Landing Page Interface)

## The idea, in one paragraph

RADAR is a hosted front door for every RADAR artist release. One link — one cinematic, mobile-first page — where a fan lands and instantly gets the artwork, the story, and every way to consume it: streaming stores, the official video, reels and shorts, press features, and campaign assets. Instead of a wall of buttons, the page behaves like a mobile app: a smooth-scrolling, glassmorphic stack of frosted panels where the top-level nav switches the *embed surface* — Listen, Watch, Shorts, Press — while the release identity (artwork, artist, title) stays fixed above it like a persistent player. link.me gives us the hero: a single, confident identity card with the artist at the center. hype.co gives us the body: live embeds, not dead links.

## The master build prompt

> Design and build a mobile-app-style artist release portal for RADARMusic.
>
> **Hero (link.me DNA):** full-bleed release artwork blurred and scaled behind a frosted glass identity card. Centered circular/rounded artwork, artist name in tight display type, release title in serif italic contrast, a monospace metadata line (type · label · release date). One primary action. Nothing else competes. Blue-to-white gradient light source falls from the top, so the hero glows and the page cools as you scroll.
>
> **Body (hype.co DNA):** a pill-shaped segmented nav — Listen / Watch / Shorts / Press — pinned under the hero on a translucent bar. Selecting a segment smooth-scrolls and cross-fades the embed surface below it. Every surface hosts *playable* content in-page, never a bare outbound list:
> - **Listen** — provider cards (Spotify, Apple, Audiomack, Boomplay, Deezer, TIDAL, Amazon, YouTube Music) with the verified source expanded as a live embedded player and the remaining destinations as glass rows with provider marks and a review state.
> - **Watch** — official video embed in a 16:9 glass frame, with a horizontal rail of alternates.
> - **Shorts** — a 9:16 vertical carousel of reels/shorts, snap-scrolling, one card in focus with its neighbours dimmed and scaled back.
> - **Press** — editorial cards for releases and features: publication mark, headline in serif, pull-quote, outbound read link.
>
> **Aesthetic:** glassmorphism — frosted panels with soft inner light, 1px luminous borders, layered depth via stacked translucency and long soft shadows. Gradient palette moving from deep blue to white. Generous negative space, large typographic hierarchy, monospace labels, restrained motion (fades, parallax, snap). Rounded geometry throughout. High-detail rendering.
>
> **Avoid:** low contrast, harsh shadows, cluttered layout, oversaturated colour, sharp edges, watermarks, distorted elements, generic SaaS card grids.
>
> **Frame:** designed 9:16 mobile-first, gracefully widened to a centered desktop column with the artwork bleeding into the margins.

## What gets built

```text
/                     Release portal (mobile-first, 9:16 column)
  ├─ Hero            artwork + identity card + primary action
  ├─ Segmented nav   Listen · Watch · Shorts · Press  (sticky, glass)
  ├─ Listen          embedded player + destination rows
  ├─ Watch           video embed + alternates rail
  ├─ Shorts          vertical snap carousel
  ├─ Press           editorial feature cards
  └─ Footer          RADAR mark, share, credits
```

- Smooth-scroll + scroll-spy so the nav pill tracks the active section and clicking a segment glides to it.
- Persistent mini-bar at the bottom on mobile (artwork thumb + title + primary listen action) once the hero scrolls away.
- Reduced-motion respected: cross-fades collapse to instant swaps.

## Technical notes

- TanStack Start route at `src/routes/index.tsx`; sections as components under `src/components/portal/`.
- Design tokens (blue→white gradient, glass surface, blur radii, border-radius, shadow ramps) defined in `src/styles.css` as semantic oklch tokens — no hardcoded colours in components.
- Embeds rendered through a single `<EmbedFrame provider=... id=... ratio=... />` that maps provider → official iframe/oEmbed URL, so no scraping and no fabricated players. Providers without a sanctioned embed fall back to a glass destination row.
- Release content driven by one typed `release` object (artwork, title, artist, metadata, destinations[], videos[], shorts[], press[]) so the same page renders any release. This build ships with one populated example release; wiring it to the resolver API and per-release slugs is the next step.
- Per-route `head()` metadata: title, description, og/twitter title+description, plus og:image once the release artwork is an absolute URL.

## Out of scope for this pass

Auth, dashboard, analytics ingestion, notifications, and the Spotify/Apple resolver endpoint from the master breakdown. This pass is the public-facing portal surface; the backend slice plugs in behind the same `release` shape afterwards.
