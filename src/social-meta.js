function setMeta(attribute, value, content) {
  let node = document.head.querySelector(`meta[${attribute}="${value}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, value);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content || '');
}

export function applyReleaseMeta(metadata) {
  const title = metadata.title ? `${metadata.title} · ${metadata.artist || 'The RADARMusic'}` : 'The RADARMusic — Release Portal';
  const description = metadata.artist ? `Listen to ${metadata.title} by ${metadata.artist} across every destination curated by The RADARMusic.` : 'The beautiful front door to a release: sound, story, and every listening destination in one place.';
  const canonical = new URL(window.location.pathname, window.location.origin).href;
  document.title = title;
  document.head.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', canonical);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  if (metadata.artwork) {
    setMeta('property', 'og:image', metadata.artwork);
    setMeta('property', 'og:image:alt', `${title} artwork`);
    setMeta('name', 'twitter:image', metadata.artwork);
    setMeta('name', 'twitter:image:alt', `${title} artwork`);
  }
}
