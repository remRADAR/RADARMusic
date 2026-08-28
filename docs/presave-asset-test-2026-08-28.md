# RADARMusic font, icon, and pre-save verification

**Date:** 2026-08-28  
**Status:** Passed with stated production limitations

## Asset integration

The supplied `ShareTechMono-Regular.ttf` file is self-hosted and loaded through `@font-face`. Browser inspection confirmed that `document.fonts.check('16px "Share Tech Mono"')` returned `true`.

The supplied multimedia artwork was converted from the provided high-resolution source into optimized transparent WebP controls. Browser inspection found seven control instances in the current Home view and no failed icon images. The opening state was visually inspected and showed only the RADARMusic page logo; the former RADARMusic text lockup and Enter control are absent.

## Controlled pre-save resolver test

The serverless resolver was exercised with a controlled Feature.fm response at `https://ffm.to/before-sunrise`. The sample public page exposed the following Open Graph metadata:

| Field | Parsed value |
|---|---|
| Artist | Nova Rey |
| Title | Before Sunrise |
| Artwork | `https://cdn.example.com/before-sunrise.jpg` |
| Release date | 2026-09-18 |
| Provider | Feature.fm |
| Mode | `presave` |

The resolver returned the Feature.fm campaign as a verified `presave` action and generated post-release search destinations for Apple Music, Spotify, Audiomack, Boomplay, Deezer, TIDAL, Amazon Music, and YouTube Music. An unsupported `example.com` campaign URL returned HTTP 400. Inputs and followed redirects are restricted to HTTPS, HTML responses are bounded, and artwork URLs are restricted to HTTPS.

## Controlled browser workflow test

The browser client was supplied the same controlled resolver response. It changed automatically from Profile to Stream, changed the release identity to `Before Sunrise` by `Nova Rey`, displayed `PRE-SAVE · OFFICIAL FLOW`, rendered the verified pre-save assistance card, and exposed the original Feature.fm campaign as the `Continue to pre-save` action. No music-service credentials were collected and no completed save was claimed.

## Remaining verification

Metadata extraction against a user-supplied live campaign URL remains **UNVERIFIED** because no real pre-save URL was provided. Provider pages can change their markup or block automated metadata requests, so production monitoring and a manual metadata fallback remain necessary. Actual Spotify or Apple Music authorization occurs on the original campaign provider and is outside RADARMusic’s control.

## Automatic manual fallback verification

A controlled provider failure returned HTTP 422 with `fallback.eligible: true`, the original Feature.fm campaign URL, the identified provider, and the required fallback-field contract. Submitting valid manual metadata returned HTTP 200 with `provenance: creator-entered` and `scrapeStatus: manual-fallback`; the preserved campaign remained the verified pre-save action and store searches were regenerated from the creator-entered artist/title pair.

The server rejected a `javascript:` artwork value and requires optional artwork to use HTTPS. The browser flow was exercised from the original Profile form through automatic fallback display, title/artist/artwork/date/description entry, server acceptance, automatic transition to Stream, and the explicit `PRE-SAVE · MANUAL FALLBACK` provenance state. A failed remote artwork request also falls back to the RADARMusic page icon.
