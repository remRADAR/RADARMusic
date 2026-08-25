# Spotify resolver QA — 2026-08-25

Test URL: https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl

The resolver returned HTTP 200 and extracted the title `Cut To The Feeling`, Spotify artwork, source URL, and provider `Spotify`. Without Spotify Web API credentials, the public oEmbed fallback returned `Unknown artist`, so cross-store search URLs contain `Unknown artist`; production should configure `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` for accurate artist and album metadata.

The matching list returned one verified Spotify source and seven non-source destinations marked `needs-review`: Apple Music, Audiomack, Boomplay, Deezer, TIDAL, Amazon Music, and YouTube Music. The duplicate Spotify entry present before the test was removed. The response policy correctly states that only official source/deep-link destinations are returned and protected pages or streams are not scraped.

The public preview loaded without console errors during the visual check. The resolver endpoint itself is not served by the Vite-only development server, so the browser form requires a deployed serverless environment to complete its network call; the handler was exercised directly with a controlled Node harness.
