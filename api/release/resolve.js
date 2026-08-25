const STORE_SEARCHES = [
  ['Audiomack', 'audiomack.com/search', 'search'],
  ['Boomplay', 'boomplay.com/search/default', 'query'],
  ['Deezer', 'deezer.com/search', 'q'],
  ['TIDAL', 'tidal.com/search', 'q'],
  ['Amazon Music', 'music.amazon.com/search', 'query'],
  ['YouTube Music', 'music.youtube.com/search', 'q'],
];

function sourceFromUrl(raw) {
  const url = new URL(raw);
  if (url.hostname.includes('spotify.com')) return { provider: 'Spotify', id: url.pathname.split('/').filter(Boolean).pop() };
  if (url.hostname.includes('apple.com') || url.hostname.includes('itunes.apple.com')) return { provider: 'Apple Music', id: url.searchParams.get('i') || url.pathname.split('/').filter(Boolean).pop() };
  throw new Error('Only Spotify and Apple Music links are supported as source links.');
}

function searchUrl(name, base, key, provider) {
  const params = new URLSearchParams({ [key]: name });
  return `https://${base}?${params.toString()}`;
}

async function spotifyOembed(raw) {
  const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(raw)}`);
  if (!response.ok) throw new Error('Spotify could not resolve that link.');
  const data = await response.json();
  const parts = (data.title || '').split(' - ');
  return { title: parts[0] || data.title || 'Untitled release', artist: parts[1] || 'Unknown artist', artwork: data.thumbnail_url || '', sourceUrl: raw, source: 'Spotify' };
}

async function appleLookup(raw, id) {
  const response = await fetch(`https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error('Apple Music could not resolve that link.');
  const data = await response.json();
  const item = data.results?.[0];
  if (!item) throw new Error('No Apple Music release was found for that link.');
  return { title: item.trackName || item.collectionName || 'Untitled release', artist: item.artistName || 'Unknown artist', album: item.collectionName || '', artwork: (item.artworkUrl100 || '').replace('100x100', '600x600'), releaseDate: item.releaseDate || '', sourceUrl: raw, source: 'Apple Music', genre: item.primaryGenreName || '' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { url } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!url) return res.status(400).json({ error: 'A Spotify or Apple Music URL is required.' });
    const source = sourceFromUrl(url);
    const metadata = source.provider === 'Spotify' ? await spotifyOembed(url) : await appleLookup(url, source.id);
    const verified = [
      { name: metadata.source, url: metadata.sourceUrl, type: 'source', status: 'verified', label: 'Source link' },
      { name: 'Apple Music', url: metadata.source === 'Apple Music' ? metadata.sourceUrl : searchUrl(`${metadata.artist} ${metadata.title}`, 'music.apple.com/us/search', 'term'), type: metadata.source === 'Apple Music' ? 'source' : 'deep-link', status: metadata.source === 'Apple Music' ? 'verified' : 'search' },
      { name: 'Spotify', url: metadata.source === 'Spotify' ? metadata.sourceUrl : searchUrl(`${metadata.artist} ${metadata.title}`, 'open.spotify.com/search', 'query'), type: metadata.source === 'Spotify' ? 'source' : 'deep-link', status: metadata.source === 'Spotify' ? 'verified' : 'search' },
    ];
    const discovered = STORE_SEARCHES.map(([name, base, key]) => ({ name, url: searchUrl(`${metadata.artist} ${metadata.title}`, base, key), type: 'deep-link', status: 'needs-review', label: 'Search destination' }));
    return res.status(200).json({ metadata, stores: [...verified, ...discovered], policy: 'Only source URLs and official search/deep-link destinations are returned. No protected pages or streams are scraped.' });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to resolve this release.' });
  }
}
