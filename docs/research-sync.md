# RADARMusic sync research

## Push.fm public workflow

Push.fm presents Smart Links as a customizable landing page that houses multiple content, social, and streaming links under one URL. Its Fan Link workflow asks for one store link, uses an auto-lookup step to find matching store links, then lets the creator review, edit, enable, or disable the discovered links before publishing. Push.fm also describes artwork and metadata as editable and warns creators to check auto-lookup results because matches can occasionally be incorrect.

Sources:

- https://push.fm/product/smart-links
- https://blog.push.fm/6021/push-fm-smart-links-marketing-tools-for-every-creator-brand-business/
- https://blog.push.fm/7161/create-free-fan-link-for-your-music-links/

## Provider constraints

Spotify’s official Web API supports retrieving content metadata and searching the catalog, with developer application credentials and access tokens required. Apple Music API supports catalog search and retrieving album, song, artist, and artwork metadata, with developer-token authentication. Audiomack publishes an official data API using OAuth 1.0a. Amazon Music documents a metadata Web API, but its documentation states that the API is currently closed beta and access is limited to approved developers.

The implementation must therefore use provider adapters and explicit confidence/review states. It must not scrape protected pages, bypass authentication, proxy copyrighted streams, or claim an embed exists when only an outbound destination is available.

Sources:

- https://developer.spotify.com/documentation/web-api
- https://developer.apple.com/documentation/applemusicapi
- https://audiomack.com/data-api/docs
- https://developer.amazon.com/docs/music/API_web_overview.html

## Product decision

Use a lightweight, production-minded flow:

1. Artist submits a Spotify or Apple Music URL.
2. Server parses the provider and resource identifier, then fetches canonical metadata from the official provider API.
3. Provider adapters search supported catalogs using normalized artist, title, album, ISRC, and duration where available.
4. The UI shows discovered results with confidence and requires artist confirmation for uncertain matches.
5. The published portal stores only approved canonical URLs and renders official embeds where supported; other providers appear as deep-link listening cards.
