const STORE_SEARCHES = [
  ['Audiomack', 'audiomack.com/search', 'search'],
  ['Boomplay', 'boomplay.com/search/default', 'query'],
  ['Deezer', 'deezer.com/search', 'q'],
  ['TIDAL', 'tidal.com/search', 'q'],
  ['Amazon Music', 'music.amazon.com/search', 'query'],
  ['YouTube Music', 'music.youtube.com/search', 'q'],
];

const PRESAVE_HOSTS = [
  ['ffm.to', 'Feature.fm'],
  ['feature.fm', 'Feature.fm'],
  ['lnk.to', 'Linkfire'],
  ['linkfire.com', 'Linkfire'],
  ['presave.link', 'PreSave'],
  ['push.fm', 'PUSH.fm'],
  ['hyperfollow.com', 'HyperFollow'],
  ['distrokid.com', 'DistroKid'],
  ['found.ee', 'Found.ee'],
  ['fanlink.to', 'FanLink'],
  ['share.amuse.io', 'Amuse'],
  ['hypeddit.com', 'Hypeddit'],
  ['toneden.io', 'ToneDen'],
  ['laylo.com', 'Laylo'],
  ['orcd.co', 'OrchardGo'],
];

function normalizedHost(url) {
  return url.hostname.toLowerCase().replace(/^www\./, '');
}

function presaveProvider(url) {
  const host = normalizedHost(url);
  return PRESAVE_HOSTS.find(([suffix]) => host === suffix || host.endsWith(`.${suffix}`))?.[1] || null;
}

function sourceFromUrl(raw) {
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error('Only secure HTTPS links are supported.');
  const host = normalizedHost(url);
  if (host === 'open.spotify.com') return { provider: 'Spotify', id: url.pathname.split('/').filter(Boolean).pop(), mode: 'release' };
  if (host.endsWith('apple.com') || host === 'itunes.apple.com') return { provider: 'Apple Music', id: url.searchParams.get('i') || url.pathname.split('/').filter(Boolean).pop(), mode: 'release' };
  const provider = presaveProvider(url);
  if (provider) return { provider, id: url.pathname.split('/').filter(Boolean).pop() || host, mode: 'presave' };
  throw new Error('Use a Spotify, Apple Music, or supported public pre-save link.');
}

function searchUrl(name, base, key) {
  const params = new URLSearchParams({ [key]: name });
  return `https://${base}?${params.toString()}`;
}

async function spotifyOembed(raw) {
  const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(raw)}`);
  if (!response.ok) throw new Error('Spotify could not resolve that link.');
  const data = await response.json();
  return { title: data.title || 'Untitled release', artist: 'Unknown artist', artwork: data.thumbnail_url || '', sourceUrl: raw, actionUrl: raw, source: 'Spotify', mode: 'release' };
}

async function spotifyTrack(raw, id) {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) return spotifyOembed(raw);
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  if (!tokenResponse.ok) return spotifyOembed(raw);
  const token = await tokenResponse.json();
  const response = await fetch(`https://api.spotify.com/v1/tracks/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token.access_token}` } });
  if (!response.ok) return spotifyOembed(raw);
  const data = await response.json();
  return { title: data.name || 'Untitled release', artist: data.artists?.map((artist) => artist.name).join(', ') || 'Unknown artist', album: data.album?.name || '', artwork: data.album?.images?.[0]?.url || '', releaseDate: data.album?.release_date || '', sourceUrl: raw, actionUrl: raw, source: 'Spotify', genre: '', mode: 'release' };
}

async function appleLookup(raw, id) {
  const response = await fetch(`https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error('Apple Music could not resolve that link.');
  const data = await response.json();
  const item = data.results?.find((entry) => entry.wrapperType === 'track' || entry.collectionType) || data.results?.[0];
  if (!item) throw new Error('No Apple Music release was found for that link.');
  return { title: item.trackName || item.collectionName || 'Untitled release', artist: item.artistName || 'Unknown artist', album: item.collectionName || '', artwork: (item.artworkUrl100 || '').replace('100x100', '600x600'), releaseDate: item.releaseDate || '', sourceUrl: raw, actionUrl: raw, source: 'Apple Music', genre: item.primaryGenreName || '', mode: 'release' };
}

function decodeEntities(value = '') {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').trim();
}

function metaTags(html) {
  const values = new Map();
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attributes = {};
    for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gi)) attributes[match[1].toLowerCase()] = decodeEntities(match[3]);
    const key = (attributes.property || attributes.name || '').toLowerCase();
    if (key && attributes.content && !values.has(key)) values.set(key, attributes.content);
  }
  return values;
}

function safeHttpsUrl(value, base) {
  try {
    const url = new URL(value, base);
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function splitReleaseIdentity(rawTitle, description) {
  const cleaned = decodeEntities(rawTitle || '').replace(/\s*[|·-]\s*(pre-save|presave|pre-add|smart link).*$/i, '').trim();
  const byMatch = cleaned.match(/^(.+?)\s+by\s+(.+)$/i);
  if (byMatch) return { title: byMatch[1].trim(), artist: byMatch[2].trim() };
  const dash = cleaned.split(/\s+[–—-]\s+/).map((part) => part.trim()).filter(Boolean);
  if (dash.length >= 2) return { artist: dash[0], title: dash.slice(1).join(' — ') };
  const descriptionArtist = decodeEntities(description || '').match(/(?:by|from)\s+([^|.]+)/i)?.[1]?.trim();
  return { title: cleaned || 'Upcoming release', artist: descriptionArtist || 'Upcoming artist' };
}

async function fetchPresave(raw, provider) {
  let current = new URL(raw);
  let html = '';
  for (let redirect = 0; redirect < 4; redirect += 1) {
    if (!presaveProvider(current)) break;
    const response = await fetch(current, { redirect: 'manual', headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': 'RADARMusic-LinkPreview/1.0' }, signal: AbortSignal.timeout(8000) });
    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      const next = new URL(response.headers.get('location'), current);
      if (next.protocol !== 'https:') throw new Error('The pre-save provider returned an insecure redirect.');
      current = next;
      if (!presaveProvider(next)) break;
      continue;
    }
    if (!response.ok) throw new Error('The pre-save page could not be read.');
    const contentType = response.headers.get('content-type') || '';
    const contentLength = Number(response.headers.get('content-length') || 0);
    if (!contentType.includes('text/html')) throw new Error('The pre-save link did not return a public landing page.');
    if (contentLength > 2000000) throw new Error('The pre-save page is too large to inspect safely.');
    html = (await response.text()).slice(0, 750000);
    break;
  }
  const tags = metaTags(html);
  const htmlTitle = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '') || '');
  const socialTitle = tags.get('og:title') || tags.get('twitter:title') || htmlTitle;
  const description = tags.get('og:description') || tags.get('twitter:description') || tags.get('description') || '';
  const identity = splitReleaseIdentity(socialTitle, description);
  return {
    ...identity,
    album: identity.title,
    artwork: safeHttpsUrl(tags.get('og:image') || tags.get('twitter:image') || '', current),
    releaseDate: tags.get('music:release_date') || '',
    sourceUrl: raw,
    actionUrl: current.toString(),
    source: provider,
    label: `${provider} pre-save`,
    type: 'Pre-save',
    genre: '',
    description,
    mode: 'presave',
  };
}

function buildStores(metadata) {
  const stores = [{ name: metadata.source, url: metadata.actionUrl || metadata.sourceUrl, type: metadata.mode === 'presave' ? 'presave' : 'source', status: 'verified', label: metadata.mode === 'presave' ? 'Continue pre-save' : 'Source link' }];
  for (const [name, base, key] of [['Apple Music', 'music.apple.com/us/search', 'term'], ['Spotify', 'open.spotify.com/search', 'query'], ...STORE_SEARCHES]) {
    if (metadata.mode !== 'presave' && name === metadata.source) continue;
    stores.push({ name, url: searchUrl(`${metadata.artist} ${metadata.title}`, base, key), type: 'deep-link', status: 'needs-review', label: metadata.mode === 'presave' ? 'Post-release search' : 'Search destination' });
  }
  return stores;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { url } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!url) return res.status(400).json({ error: 'A Spotify, Apple Music, or pre-save URL is required.' });
    const source = sourceFromUrl(url);
    const metadata = source.mode === 'presave' ? await fetchPresave(url, source.provider) : source.provider === 'Spotify' ? await spotifyTrack(url, source.id) : await appleLookup(url, source.id);
    return res.status(200).json({ metadata, stores: buildStores(metadata), policy: metadata.mode === 'presave' ? 'Public pre-save metadata is read from supported campaign pages. Fans complete authorization with the original provider; RADARMusic does not collect music-service credentials or claim a completed save.' : 'Only source URLs and official search/deep-link destinations are returned. No protected pages or streams are scraped.' });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to resolve this release or pre-save link.' });
  }
}
