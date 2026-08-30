import { initAnalytics } from './analytics.js';
import { applyReleaseMeta } from './social-meta.js';
import { applyTheme, deriveThemeFromImage, defaultTheme, themeSwatches } from './theme.js';

const icon = '/assets/radarmusic-icon.webp';
const artistVisual = '/assets/radarcharts-opening.gif';
const controls = { play: '/assets/icons/play.webp', headphones: '/assets/icons/headphones.webp', playlist: '/assets/icons/playlist.webp', share: '/assets/icons/share.webp', volume: '/assets/icons/volume.webp' };
const app = document.querySelector('#root');
const DRAFT_KEY = 'radarmusic-creator-draft-v1';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const demoRelease = {
  slug: 'cut-to-the-feeling', artist: 'Carly Rae Jepsen', title: 'Cut To The Feeling', type: 'Single', label: 'Spotify preview', date: 'Matched source', artwork: icon, artistImage: artistVisual, backgroundImage: '', source: 'Spotify', sourceUrl: 'https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl',
  destinations: [
    { name: 'Spotify', status: 'verified', url: 'https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl', id: '11dFghVXANMlKmJXsNCbNl' },
    { name: 'Apple Music', status: 'review', url: 'https://music.apple.com/us/search?term=Carly%20Rae%20Jepsen%20Cut%20To%20The%20Feeling' },
    { name: 'Audiomack', status: 'review', url: 'https://audiomack.com/search?search=Carly%20Rae%20Jepsen%20Cut%20To%20The%20Feeling' },
    { name: 'Boomplay', status: 'review', url: 'https://boomplay.com/search/default?query=Carly%20Rae%20Jepsen%20Cut%20To%20The%20Feeling' },
    { name: 'Deezer', status: 'review', url: 'https://deezer.com/search?q=Carly%20Rae%20Jepsen%20Cut%20To%20The%20Feeling' },
    { name: 'TIDAL', status: 'review', url: 'https://tidal.com/search?q=Carly%20Rae%20Jepsen%20Cut%20To%20The%20Feeling' },
    { name: 'Amazon Music', status: 'review', url: 'https://music.amazon.com/search?query=Carly%20Rae%20Jepsen%20Cut%20To%20The%20Feeling' },
    { name: 'YouTube Music', status: 'review', url: 'https://music.youtube.com/search?q=Carly%20Rae%20Jepsen%20Cut%20To%20The%20Feeling' },
  ],
  biography: 'A release world shaped for listening, watching and returning.',
  description: 'One signal, every platform, one visual identity.',
  watch: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
  shorts: [],
  press: [{ title: 'Behind the release.', url: 'https://www.youtube.com' }],
};

const state = { tab: 'home', release: { ...demoRelease }, theme: defaultTheme(), themeRequest: 0, studio: false };
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const isHttpUrl = (value) => { try { const parsed = new URL(String(value)); return parsed.protocol === 'https:'; } catch { return false; } };
const safeLink = (value, fallback = '#') => isHttpUrl(value) ? String(value) : fallback;
const formatDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Release date pending';

app.innerHTML = `
  <div class="welcome" id="welcome" role="status" aria-label="RADARMusic is loading"><img class="welcome__logo" src="${icon}" alt="RADARMusic logo" /></div>
  <main class="experience" data-tab="home">
    <div class="stage" aria-hidden="true"><div class="stage__asset stage__asset--home"></div><div class="stage__asset stage__asset--stream"></div><div class="stage__asset stage__asset--youtube"></div><div class="stage__asset stage__asset--profile"></div><div class="stage__wash"></div><div class="stage__grain"></div></div>
    <header class="topbar"><a class="brand" href="#" aria-label="RADARMusic home"><img src="${icon}" alt="" /><span>RADAR<em>Music</em></span></a><div class="topbar__meta"><span>ARTIST RELEASE PORTAL</span><a href="/dashboard">Creator Studio ↗</a></div></header>
    <nav class="tab-rail" aria-label="Release navigation"><button class="is-active" data-tab-target="home" type="button"><img src="${controls.volume}" alt="" /><span>01</span>Home</button><button data-tab-target="stream" type="button"><img src="${controls.headphones}" alt="" /><span>02</span>Stream</button><button data-tab-target="youtube" type="button"><img src="${controls.play}" alt="" /><span>03</span>Watch</button><button data-tab-target="profile" type="button"><img src="${controls.playlist}" alt="" /><span>04</span>Profile</button></nav>
    <section class="view view--home is-active" data-view="home"><div class="view__intro"><p class="kicker">RADAR ARTIST · CURRENT SIGNAL</p><h1 id="home-artist"></h1><p class="display-italic" id="home-title"></p><div class="meta-line" id="home-meta"></div><button class="primary-action" data-open-tab="stream" type="button"><img src="${controls.play}" alt="" />Enter the release <span>↗</span></button></div><div class="identity-card"><img id="identity-art" src="${icon}" alt="release artwork" /><div><span id="identity-state">NOW FEATURED</span><strong id="identity-title"></strong><small id="identity-artist"></small></div><button data-open-tab="stream" type="button" aria-label="Open stream tab"><img src="${controls.play}" alt="" /></button></div></section>
    <section class="view view--stream" data-view="stream"><div class="view__intro"><p class="kicker" id="stream-kicker">STREAM · VERIFIED SOURCE</p><h2 id="stream-title"></h2><p class="display-italic" id="stream-tagline">Everywhere out.</p><p class="view__copy" id="stream-copy"></p></div><div class="content-panel stream-panel"><div class="embed-frame" id="stream-embed"></div><div class="store-strip" id="store-strip"></div></div></section>
    <section class="view view--youtube" data-view="youtube"><div class="view__intro"><p class="kicker">WATCH · OFFICIAL CHANNEL</p><h2>Inside the<br />visual world.</h2><p class="display-italic">Play it here.</p><p class="view__copy" id="watch-copy"></p></div><div class="content-panel video-panel"><div class="video-frame" id="watch-frame"></div><div class="panel-note" id="watch-note"></div><div class="content-section" id="shorts-section"></div></div></section>
    <section class="view view--profile" data-view="profile"><div class="view__intro"><p class="kicker">PROFILE · RELEASE POSTS</p><h2 id="profile-artist"></h2><p class="display-italic">The story continues.</p><p class="view__copy">Artist identity, release notes, campaign posts and the one-link portal creator live in the same profile space.</p></div><div class="content-panel profile-panel"><article class="profile-card"><img id="profile-image" src="${artistVisual}" alt="artist profile" /><div><span>ARTIST PROFILE</span><h3 id="profile-name"></h3><p id="profile-bio"></p></div></article><div class="post-grid" id="post-grid"></div><div class="content-section" id="press-section"></div><form class="sync-form" id="sync-form"><label for="release-url">Create a release or pre-save portal</label><div><input id="release-url" name="url" type="url" placeholder="Paste Spotify, Apple Music, or pre-save link" required /><button type="submit">Match link ↗</button></div><p id="sync-result" role="status">Official release links and supported public pre-save pages only. Every destination remains reviewable.</p></form><section class="manual-fallback" id="manual-fallback" aria-labelledby="manual-fallback-title" hidden></section></div></section>
    <footer class="statusbar"><span id="status-tab">01 / HOME</span><span>RADARCHARTS.NET</span><button id="share-button" type="button"><img src="${controls.share}" alt="" />Share portal ↗</button></footer>
    <aside class="dashboard" id="dashboard" hidden><button class="dashboard__close" id="dashboard-close" type="button" aria-label="Close Creator Studio">×</button><div id="dashboard-content"></div></aside>
  </main>`;

function youtubeEmbed(raw) {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let id = url.searchParams.get('v');
    if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname.startsWith('/shorts/')) id = url.pathname.split('/')[2];
      if (url.pathname.startsWith('/embed/')) id = url.pathname.split('/')[2];
    }
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : '';
  } catch { return ''; }
}

function renderThemePreview() {
  const node = document.querySelector('#theme-preview');
  if (node) node.innerHTML = `<span>Your portal theme</span><div class="theme-swatches">${themeSwatches(state.theme)}</div><small>Derived automatically from the current cover artwork.</small>`;
}

function renderRelease() {
  const r = state.release;
  document.querySelector('#home-artist').textContent = r.artist || 'Artist name';
  document.querySelector('#home-title').textContent = r.title || 'Release title';
  document.querySelector('#home-meta').textContent = `${r.type || 'Release'} · ${r.label || 'Independent'} · ${r.releaseDate ? formatDate(r.releaseDate) : r.date || 'Release date pending'}`;
  const identityArtwork = document.querySelector('#identity-art');
  identityArtwork.onerror = () => { identityArtwork.onerror = null; identityArtwork.src = icon; };
  identityArtwork.src = r.artwork || icon;
  identityArtwork.alt = `${r.artist || 'Artist'} release artwork`;
  document.querySelector('#identity-title').textContent = r.title || 'Release title';
  document.querySelector('#identity-artist').textContent = r.artist || 'Artist name';
  document.querySelector('#stream-title').textContent = r.title || 'Release title';
  const isPresave = r.mode === 'presave';
  const isManual = r.provenance === 'creator-entered';
  document.querySelector('#identity-state').textContent = isManual ? 'UPCOMING · CREATOR-ENTERED' : isPresave ? 'UPCOMING · PRE-SAVE' : 'NOW FEATURED';
  document.querySelector('#stream-kicker').textContent = isManual ? 'PRE-SAVE · MANUAL FALLBACK' : isPresave ? 'PRE-SAVE · OFFICIAL FLOW' : 'STREAM · VERIFIED SOURCE';
  document.querySelector('#stream-tagline').textContent = isPresave ? 'Save it before it lands.' : 'Everywhere out.';
  document.querySelector('#stream-copy').textContent = isPresave ? 'Continue through the verified campaign page to authorize the pre-save with your chosen music service.' : 'The current release stays central while every approved listening destination sits one step away.';
  document.querySelector('#profile-artist').textContent = r.artist || 'Artist name';
  document.querySelector('#profile-name').textContent = r.artist || 'Artist name';
  document.querySelector('#profile-bio').textContent = r.biography || 'Artist identity, release notes and approved campaign content live here.';
  const profileImage = document.querySelector('#profile-image');
  profileImage.onerror = () => { profileImage.onerror = null; profileImage.src = artistVisual; };
  profileImage.src = r.artistImage || artistVisual;
  profileImage.alt = `${r.artist || 'Artist'} profile image`;
  const source = (r.destinations || []).find((item) => item.status === 'verified') || (r.destinations || [])[0];
  const streamEmbed = document.querySelector('#stream-embed');
  streamEmbed.innerHTML = r.mode === 'presave' ? `<div class="presave-card"><img src="${escapeHTML(r.artwork || icon)}" alt="" onerror="this.onerror=null;this.src='${icon}'" /><span>${isManual ? 'CREATOR-ENTERED DETAILS · VERIFY BEFORE PUBLISHING' : 'VERIFIED PRE-SAVE PAGE'}</span><strong>${escapeHTML(r.title || 'Upcoming release')}</strong><small>${escapeHTML(r.artist || 'Upcoming artist')}</small><p>${isManual ? 'The campaign URL is supported, but its metadata could not be read automatically. Review these creator-entered details before publishing.' : 'Finish securely with the campaign provider. You may be asked to sign in to Spotify, Apple Music, or another supported service.'}</p><a href="${escapeHTML(safeLink(r.actionUrl || r.sourceUrl))}" target="_blank" rel="noreferrer">Continue to pre-save ↗</a></div>` : source?.name === 'Spotify' && source.id ? `<iframe title="${escapeHTML(r.title || 'Release')} on Spotify" src="https://open.spotify.com/embed/track/${encodeURIComponent(source.id)}?utm_source=generator&theme=0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>` : `<div class="source-fallback"><span>VERIFIED SOURCE</span><strong>${escapeHTML(source?.name || 'Music store')}</strong><a href="${escapeHTML(safeLink(source?.url))}" target="_blank" rel="noreferrer">Open source ↗</a></div>`;
  document.querySelector('#store-strip').innerHTML = (r.destinations || []).map((store) => `<a href="${escapeHTML(safeLink(store.url))}" target="_blank" rel="noreferrer"><span>${escapeHTML((store.name || '?').slice(0, 1))}</span><strong>${escapeHTML(store.name || 'Store')}</strong><small>${store.status === 'verified' ? isManual ? 'Verified link' : 'Verified' : 'Review match'}</small></a>`).join('');
  const watch = (r.watch || []).find((item) => isHttpUrl(item));
  const watchEmbed = watch && youtubeEmbed(watch);
  document.querySelector('#watch-copy').textContent = watch ? 'Official video content stays close to the release, with approved short-form clips below.' : 'Add an approved official video from Creator Studio to populate this release surface.';
  document.querySelector('#watch-frame').innerHTML = watchEmbed ? `<iframe title="${escapeHTML(r.title || 'Release')} official video" src="${watchEmbed}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : `<div class="empty-content"><span>WATCH · NEEDS CONTENT</span><strong>No official video has been added yet.</strong></div>`;
  document.querySelector('#watch-note').innerHTML = watch ? `<span>OFFICIAL VIDEO</span><strong>Approved release visual</strong><a href="${escapeHTML(safeLink(watch))}" target="_blank" rel="noreferrer">Open video ↗</a>` : '<span>CREATOR STUDIO</span><strong>Supply an HTTPS YouTube link to enable playback.</strong>';
  const shorts = (r.shorts || []).filter((item) => isHttpUrl(item));
  document.querySelector('#shorts-section').innerHTML = `<div class="section-heading"><span>SHORTS</span><strong>${shorts.length ? 'Short-form content' : 'Shorts are ready for your next drop.'}</strong></div>${shorts.length ? `<div class="link-list">${shorts.map((url, index) => `<a href="${escapeHTML(safeLink(url))}" target="_blank" rel="noreferrer">Short ${index + 1} ↗</a>`).join('')}</div>` : '<p class="section-empty">Add one HTTPS short-form link in Creator Studio.</p>'}`;
  const posts = (r.posts || [{ label: 'RELEASE NOTE', title: 'Made for the moment.', body: r.description || 'One signal, every platform, one visual identity.' }, { label: 'CAMPAIGN POST', title: 'Behind the release.', body: 'Stories, shorts and press gathered around the music.' }]);
  document.querySelector('#post-grid').innerHTML = posts.map((post) => `<article><span>${escapeHTML(post.label || 'RELEASE POST')}</span><h3>${escapeHTML(post.title || '')}</h3><p>${escapeHTML(post.body || '')}</p></article>`).join('');
  const press = (r.press || []).filter((item) => item && isHttpUrl(item.url));
  document.querySelector('#press-section').innerHTML = `<div class="section-heading"><span>PRESS</span><strong>${press.length ? 'Editorial and media' : 'Press links are ready to add.'}</strong></div>${press.length ? `<div class="link-list">${press.map((item) => `<a href="${escapeHTML(safeLink(item.url))}" target="_blank" rel="noreferrer">${escapeHTML(item.title || 'Read feature')} ↗</a>`).join('')}</div>` : '<p class="section-empty">Add a headline and HTTPS URL in Creator Studio.</p>'}`;
  const releaseArtwork = r.artwork && (/^(https:\/\/|\/|data:image\/)/.test(r.artwork)) ? r.artwork : icon;
  const backgroundArtwork = r.backgroundImage && (/^(https:\/\/|\/|data:image\/)/.test(r.backgroundImage)) ? r.backgroundImage : '';
  const experience = document.querySelector('.experience');
  experience.style.setProperty('--release-art', `url("${releaseArtwork.replace(/["\\)]/g, '')}")`);
  experience.style.setProperty('--portal-background', backgroundArtwork ? `url("${backgroundArtwork.replace(/["\\)]/g, '')}")` : 'none');
  applyTheme(experience, state.theme);
  renderThemePreview();
  applyReleaseMeta({ title: r.title, artist: r.artist, artwork: r.artwork, sourceUrl: r.sourceUrl, source: r.source });
}

async function refreshTheme() {
  const request = ++state.themeRequest;
  const theme = state.release.artwork ? await deriveThemeFromImage(state.release.artwork) : defaultTheme();
  if (request !== state.themeRequest) return;
  state.theme = theme;
  renderRelease();
}

function openTab(tab) {
  state.tab = tab;
  document.querySelector('.experience').dataset.tab = tab;
  document.querySelectorAll('[data-tab-target]').forEach((button) => button.classList.toggle('is-active', button.dataset.tabTarget === tab));
  document.querySelectorAll('[data-view]').forEach((view) => view.classList.toggle('is-active', view.dataset.view === tab));
  document.querySelector('#status-tab').textContent = `${String(['home', 'stream', 'youtube', 'profile'].indexOf(tab) + 1).padStart(2, '0')} / ${tab.toUpperCase()}`;
}
document.querySelectorAll('[data-tab-target],[data-open-tab]').forEach((button) => button.addEventListener('click', () => openTab(button.dataset.tabTarget || button.dataset.openTab)));

function applyResolvedRelease(result) {
  const sourceId = result.metadata.source === 'Spotify' ? new URL(result.metadata.sourceUrl).pathname.split('/').filter(Boolean).pop() : null;
  state.release = { ...state.release, ...result.metadata, destinations: result.stores.map((store) => ({ name: store.name, url: store.url, status: store.status === 'verified' ? 'verified' : 'review', type: store.type, id: store.name === 'Spotify' && result.metadata.mode !== 'presave' ? sourceId : null })) };
  renderRelease();
  refreshTheme();
  openTab('stream');
}

function showManualFallback(fallback, scrapeError) {
  const panel = document.querySelector('#manual-fallback');
  panel.hidden = false;
  panel.innerHTML = `<div class="manual-fallback__head"><span>AUTOMATIC FALLBACK · ${escapeHTML(fallback.provider)}</span><h3 id="manual-fallback-title">Add the missing release details</h3><p>We kept the verified campaign URL, but could not read its public metadata. Complete the fields below; creator-entered details will remain clearly labelled.</p><small>${escapeHTML(scrapeError)}</small></div><form id="manual-metadata-form"><label>Release title<input name="title" type="text" maxlength="140" required /></label><label>Artist name<input name="artist" type="text" maxlength="140" required /></label><label>Artwork URL<input name="artwork" type="url" inputmode="url" placeholder="https://…" /></label><label>Release date<input name="releaseDate" type="date" /></label><label class="manual-fallback__wide">Description<textarea name="description" maxlength="320" rows="3"></textarea></label><div class="manual-fallback__actions"><button type="submit">Build manual pre-save ↗</button><button type="button" data-cancel-fallback>Cancel</button></div><p id="manual-message" role="status"></p></form>`;
  panel.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  panel.querySelector('[data-cancel-fallback]').addEventListener('click', () => { panel.hidden = true; panel.innerHTML = ''; });
  panel.querySelector('#manual-metadata-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = panel.querySelector('#manual-message');
    const manual = Object.fromEntries(new FormData(event.currentTarget));
    message.textContent = 'Validating creator-entered metadata…';
    try {
      const response = await fetch('/api/release/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: fallback.sourceUrl, manual }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The manual metadata could not be accepted.');
      panel.hidden = true; panel.innerHTML = '';
      applyResolvedRelease(result);
    } catch (error) { message.textContent = error.message; }
  });
}

document.querySelector('#sync-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const resultNode = document.querySelector('#sync-result');
  const url = new FormData(event.currentTarget).get('url');
  const fallbackPanel = document.querySelector('#manual-fallback');
  fallbackPanel.hidden = true; fallbackPanel.innerHTML = '';
  resultNode.textContent = 'Reading release metadata and matching stores…';
  try {
    const response = await fetch('/api/release/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
    const result = await response.json();
    if (!response.ok && result.fallback?.eligible) { resultNode.textContent = 'Automatic lookup failed. Use the guided fallback below.'; showManualFallback(result.fallback, result.error || 'Public metadata was unavailable.'); return; }
    if (!response.ok) throw new Error(result.error || 'Unable to resolve release.');
    applyResolvedRelease(result);
    resultNode.textContent = state.release.mode === 'presave' ? `Pre-save page matched for ${state.release.title}. Fans can continue through the verified campaign flow.` : `Matched ${state.release.title} by ${state.release.artist}. Review every destination before publishing.`;
  } catch (error) { resultNode.textContent = error.message; }
});

document.querySelector('#share-button').addEventListener('click', async () => { const data = { title: `${state.release.title} · ${state.release.artist}`, url: window.location.href }; if (navigator.share) await navigator.share(data).catch(() => {}); else { await navigator.clipboard?.writeText(window.location.href); document.querySelector('#share-button').innerHTML = `<img src="${controls.share}" alt="" />Link copied`; } });

function loadDraft() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch { return {}; }
}
function persistDraft(draft) { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* storage can be unavailable in private mode */ } }
function imageDataUrl(file) {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('The image could not be read.')); reader.readAsDataURL(file); });
}
function validateImage(file) {
  if (!file) return;
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error('Use a JPG, PNG, WebP, or GIF image.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Images must be 5 MB or smaller.');
}
function parseLinks(value) { return String(value || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean); }
function parsePress(value) { return parseLinks(value).map((item) => { const [title, url] = item.split('|').map((part) => part.trim()); return { title: title || 'Read feature', url: url || title }; }); }
function serialiseLinks(items = []) { return items.map((item) => typeof item === 'string' ? item : item.url).filter(Boolean).join('\n'); }
function readiness(draft) {
  const checks = [
    ['Release information', Boolean(draft.artist?.trim() && draft.title?.trim())],
    ['Cover artwork', Boolean(draft.artwork)],
    ['Artist image', Boolean(draft.artistImage)],
    ['Background', Boolean(draft.backgroundImage)],
    ['Listening destinations', (draft.destinations || []).some((item) => isHttpUrl(item.url))],
    ['Video', (draft.watch || []).some((item) => youtubeEmbed(item))],
    ['Shorts', (draft.shorts || []).some((item) => isHttpUrl(item))],
    ['Press', (draft.press || []).some((item) => isHttpUrl(item.url))],
  ];
  return { checks, ready: checks.every(([, complete]) => complete) };
}
function draftFromForm(form) {
  const data = Object.fromEntries(new FormData(form));
  delete data.artworkFile;
  delete data.backgroundImageFile;
  delete data.artistImageFile;
  const destinations = parseLinks(data.listen).map((entry) => { const [name, url] = entry.split('|').map((part) => part.trim()); return { name: name || 'Listening destination', url: url || name, status: 'review' }; }).filter((item) => item.name && item.url);
  return { ...data, destinations, watch: parseLinks(data.watch), shorts: parseLinks(data.shorts), press: parsePress(data.press), type: data.type || 'Single', label: data.label || 'Independent', releaseDate: data.releaseDate || '', date: data.releaseDate ? formatDate(data.releaseDate) : 'Release date pending', source: 'Creator submission', sourceUrl: '', actionUrl: '', mode: 'release', posts: [{ label: 'RELEASE NOTE', title: 'Made for the moment.', body: data.description || 'One signal, every platform, one visual identity.' }, { label: 'CAMPAIGN POST', title: 'Behind the release.', body: 'Stories, shorts and press gathered around the music.' }] };
}
function studioMarkup(draft) {
  const status = readiness(draft);
  return `<div class="studio-header"><div><p class="kicker">CREATOR STUDIO · DRAFT</p><h2>Build the release portal.</h2><p class="studio-lede">Supply the approved assets and links once. The public portal and its live preview use the same release model.</p></div><div class="studio-actions"><button type="button" class="secondary-action" id="preview-portal">Preview portal ↗</button><button type="button" class="secondary-action" id="clear-draft">Clear draft</button></div></div><div class="studio-layout"><form class="studio-form" id="creator-form"><fieldset><legend>01 · Release information</legend><div class="form-grid"><label>Artist name<input name="artist" value="${escapeHTML(draft.artist || '')}" maxlength="140" required /></label><label>Release title<input name="title" value="${escapeHTML(draft.title || '')}" maxlength="140" required /></label><label>Release type<select name="type"><option ${draft.type === 'Single' ? 'selected' : ''}>Single</option><option ${draft.type === 'EP' ? 'selected' : ''}>EP</option><option ${draft.type === 'Album' ? 'selected' : ''}>Album</option></select></label><label>Release date<input name="releaseDate" type="date" value="${escapeHTML(draft.releaseDate || '')}" /></label></div><label>Release description<textarea name="description" maxlength="320" rows="3">${escapeHTML(draft.description || '')}</textarea></label></fieldset><fieldset><legend>02 · Required visual identity</legend><div class="asset-grid"><label class="asset-input">Cover artwork<input name="artworkFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /><span>${draft.artwork ? 'Replace cover artwork' : 'Upload cover artwork'}</span></label><label class="asset-input">Portal background<input name="backgroundImageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /><span>${draft.backgroundImage ? 'Replace background image' : 'Upload custom background'}</span></label><label class="asset-input">Artist profile image<input name="artistImageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /><span>${draft.artistImage ? 'Replace profile image' : 'Upload artist image'}</span></label></div><div class="asset-preview-grid">${draft.artwork ? `<div><img src="${escapeHTML(draft.artwork)}" alt="cover preview" /><button type="button" data-remove-asset="artwork">Remove cover</button></div>` : ''}${draft.backgroundImage ? `<div><img src="${escapeHTML(draft.backgroundImage)}" alt="background preview" /><button type="button" data-remove-asset="backgroundImage">Remove background</button></div>` : ''}${draft.artistImage ? `<div><img src="${escapeHTML(draft.artistImage)}" alt="profile preview" /><button type="button" data-remove-asset="artistImage">Remove profile</button></div>` : ''}</div></fieldset><fieldset><legend>03 · Portal content</legend><label>Listening destinations <small>One per line: Service name | HTTPS URL</small><textarea name="listen" rows="4" placeholder="Spotify | https://open.spotify.com/...">${escapeHTML((draft.destinations || []).map((item) => `${item.name} | ${item.url}`).join('\n'))}</textarea></label><label>Official video links <small>One HTTPS YouTube URL per line</small><textarea name="watch" rows="2" placeholder="https://www.youtube.com/watch?v=...">${escapeHTML(serialiseLinks(draft.watch))}</textarea></label><label>Shorts links <small>One HTTPS URL per line</small><textarea name="shorts" rows="2" placeholder="https://www.youtube.com/shorts/...">${escapeHTML(serialiseLinks(draft.shorts))}</textarea></label><label>Press links <small>One per line: Headline | HTTPS URL</small><textarea name="press" rows="2" placeholder="Read the feature | https://...">${escapeHTML((draft.press || []).map((item) => `${item.title} | ${item.url}`).join('\n'))}</textarea></label></fieldset><div class="studio-form-footer"><span id="save-status" role="status">Draft autosaves in this browser.</span><button class="primary-action studio-submit" type="submit">Save submission ↗</button></div></form><section class="studio-side"><div class="readiness-card"><span class="kicker">PORTAL READINESS</span><div id="readiness-list">${status.checks.map(([label, complete]) => `<div class="readiness-row ${complete ? 'is-complete' : ''}"><strong>${complete ? '✓' : '○'}</strong><span>${label}</span></div>`).join('')}</div><p id="readiness-message">${status.ready ? 'READY TO SUBMIT' : 'ACTION REQUIRED · Complete the highlighted items before submission.'}</p><button type="button" class="primary-action" id="submit-portal" ${status.ready ? '' : 'disabled'}>Submit for review ↗</button></div><div class="theme-card" id="theme-preview"><span>Your portal theme</span><div class="theme-swatches">${themeSwatches(state.theme)}</div><small>Derived automatically from the current cover artwork.</small></div><div class="preview-card"><span class="kicker">LIVE PREVIEW</span><strong>${escapeHTML(draft.title || 'Your release')}</strong><small>${escapeHTML(draft.artist || 'Artist name')}</small><p>The preview button opens the same portal surface used for publication.</p><button type="button" class="secondary-action" id="preview-portal-side">Open live preview ↗</button></div></section></div>`;
}

function setupStudio(draft) {
  const dashboard = document.querySelector('#dashboard');
  dashboard.innerHTML = `<div id="dashboard-content">${studioMarkup(draft)}</div>`;
  let currentDraft = { ...draft };
  let saveTimer;
  const form = dashboard.querySelector('#creator-form');
  const refresh = (nextDraft, message = 'Draft autosaves in this browser.') => { currentDraft = nextDraft; persistDraft(nextDraft); dashboard.querySelector('#dashboard-content')?.setAttribute('data-studio-ready', 'true'); const content = document.querySelector('#dashboard-content'); content.innerHTML = studioMarkup(nextDraft); bindStudio(nextDraft); const statusNode = content.querySelector('#save-status'); if (statusNode) statusNode.textContent = message; };
  const updateReadiness = (draftState) => { const result = readiness(draftState); const list = dashboard.querySelector('#readiness-list'); if (list) list.innerHTML = result.checks.map(([label, complete]) => `<div class="readiness-row ${complete ? 'is-complete' : ''}"><strong>${complete ? '✓' : '○'}</strong><span>${label}</span></div>`).join(''); const message = dashboard.querySelector('#readiness-message'); if (message) message.textContent = result.ready ? 'READY TO SUBMIT' : 'ACTION REQUIRED · Complete the highlighted items before submission.'; const submit = dashboard.querySelector('#submit-portal'); if (submit) submit.disabled = !result.ready; };
  const bindStudio = (boundDraft) => {
    const activeForm = dashboard.querySelector('#creator-form');
    const scheduleSave = () => { const formDraft = draftFromForm(activeForm); const next = { ...currentDraft, ...formDraft }; updateReadiness(next); clearTimeout(saveTimer); saveTimer = setTimeout(() => { persistDraft(next); currentDraft = next; const node = dashboard.querySelector('#save-status'); if (node) node.textContent = 'Draft saved just now.'; }, 300); };
    activeForm.querySelectorAll('input:not([type=file]), textarea, select').forEach((input) => input.addEventListener('input', scheduleSave));
    activeForm.addEventListener('submit', (event) => { event.preventDefault(); const next = { ...currentDraft, ...draftFromForm(activeForm) }; const result = readiness(next); if (!result.ready) { dashboard.querySelector('#readiness-message').textContent = 'ACTION REQUIRED · Complete the highlighted items before submission.'; return; } persistDraft(next); currentDraft = next; dashboard.querySelector('#save-status').textContent = 'Submission saved as ready for review.'; });
    activeForm.querySelectorAll('input[type=file]').forEach((input) => input.addEventListener('change', async () => { const file = input.files?.[0]; if (!file) return; const message = dashboard.querySelector('#save-status'); try { validateImage(file); const dataUrl = await imageDataUrl(file); const next = { ...currentDraft, [input.name.replace('File', '')]: dataUrl }; persistDraft(next); currentDraft = next; state.release = { ...state.release, ...next, artwork: next.artwork || state.release.artwork, artistImage: next.artistImage || state.release.artistImage }; renderRelease(); refreshTheme(); refresh(next, `${input.labels?.[0]?.textContent || 'Image'} updated.`); } catch (error) { message.textContent = error.message; } }));
    dashboard.querySelectorAll('[data-remove-asset]').forEach((button) => button.addEventListener('click', () => { const next = { ...currentDraft, [button.dataset.removeAsset]: '' }; refresh(next, 'Asset removed.'); state.release = { ...state.release, ...next }; renderRelease(); refreshTheme(); }));
    dashboard.querySelectorAll('#preview-portal,#preview-portal-side').forEach((button) => button.addEventListener('click', () => { const next = { ...currentDraft, ...draftFromForm(dashboard.querySelector('#creator-form')) }; persistDraft(next); currentDraft = next; state.release = { ...state.release, ...next }; renderRelease(); refreshTheme(); dashboard.hidden = true; state.studio = false; openTab('home'); }));
    dashboard.querySelector('#clear-draft').addEventListener('click', () => { localStorage.removeItem(DRAFT_KEY); setupStudio({}); });
    dashboard.querySelector('#submit-portal').addEventListener('click', () => { const next = { ...currentDraft, ...draftFromForm(dashboard.querySelector('#creator-form')) }; const result = readiness(next); dashboard.querySelector('#readiness-message').textContent = result.ready ? 'SUBMITTED · Ready for editorial review.' : 'ACTION REQUIRED · Complete the highlighted items before submission.'; });
  };
  bindStudio(draft);
}

async function setupDashboard() {
  if (!window.location.pathname.startsWith('/dashboard')) return;
  const dashboard = document.querySelector('#dashboard'); dashboard.hidden = false; document.body.classList.remove('welcome-active'); document.querySelector('#welcome')?.remove();
  document.querySelector('#dashboard-content').innerHTML = '<form class="auth-form" id="auth-form"><p class="kicker">CREATOR ACCESS</p><h2>Release management</h2><label>Email<input name="email" type="email" autocomplete="email" required /></label><label>Password<input name="password" type="password" autocomplete="current-password" required /></label><button type="submit">Sign in ↗</button><p id="auth-message" role="status"></p></form>';
  document.querySelector('#auth-form').addEventListener('submit', async (event) => { event.preventDefault(); const message = document.querySelector('#auth-message'); message.textContent = 'Signing in…'; try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Sign-in failed.'); const draft = { ...loadDraft(), artist: loadDraft().artist || '', title: loadDraft().title || '', destinations: loadDraft().destinations || [], watch: loadDraft().watch || [], shorts: loadDraft().shorts || [], press: loadDraft().press || [] }; setupStudio(draft); state.studio = true; } catch (error) { message.textContent = error.message; } });
  document.querySelector('#dashboard-close').addEventListener('click', () => { dashboard.hidden = true; if (state.studio) { state.studio = false; location.href = '/'; } else location.href = '/'; });
}

const welcome = document.querySelector('#welcome');
const dismiss = () => { if (!welcome) return; welcome.classList.add('is-exiting'); document.body.classList.remove('welcome-active'); window.setTimeout(() => welcome.remove(), 550); };
document.body.classList.add('welcome-active'); window.setTimeout(dismiss, 1900); if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) dismiss();
renderRelease(); refreshTheme(); initAnalytics(); setupDashboard();
