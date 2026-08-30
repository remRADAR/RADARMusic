const EMBED_HOSTS = new Set([
  "open.spotify.com",
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]);

function parseHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export function safeExternalUrl(value: string): string | null {
  return parseHttpsUrl(value)?.toString() ?? null;
}

export function safeEmbedUrl(value: string): string | null {
  const url = parseHttpsUrl(value);
  if (!url || !EMBED_HOSTS.has(url.hostname.toLowerCase())) return null;

  const hostname = url.hostname.toLowerCase();
  const isSpotifyEmbed = hostname === "open.spotify.com" && url.pathname.startsWith("/embed/");
  const isYouTubeEmbed =
    (hostname === "www.youtube.com" ||
      hostname === "youtube.com" ||
      hostname.includes("youtube-nocookie.com")) &&
    url.pathname.startsWith("/embed/");

  return isSpotifyEmbed || isYouTubeEmbed ? url.toString() : null;
}
