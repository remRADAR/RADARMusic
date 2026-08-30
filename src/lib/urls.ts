export function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isSupportedEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return host === "open.spotify.com" || host === "youtube.com" || host === "youtube-nocookie.com";
  } catch {
    return false;
  }
}
