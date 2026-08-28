import './styles.css';
import { initAnalytics } from './analytics.js';
import { applyReleaseMeta } from './social-meta.js';

const icon = '/assets/radarmusic-icon.webp';
const artistVisual = '/assets/radarcharts-opening.gif';
const controls = { play: '/assets/icons/play.webp', headphones: '/assets/icons/headphones.webp', playlist: '/assets/icons/playlist.webp', share: '/assets/icons/share.webp', volume: '/assets/icons/volume.webp' };
const app = document.querySelector('#root');

const state = {
  tab: 'home',
  release: {
    slug: 'cut-to-the-feeling', artist: 'Carly Rae Jepsen', title: 'Cut To The Feeling', type: 'Single', label: 'Spotify preview', date: 'Matched source', artwork: icon, source: 'Spotify', sourceUrl: 'https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl',
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
  },
};

const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

app.innerHTML = `
  <div class="welcome" id="welcome" role="status" aria-label="RADARMusic is loading"><img class="welcome__logo" src="${icon}" alt="RADARMusic logo" /></div>
  <main class="experience" data-tab="home">
    <div class="stage" aria-hidden="true"><div class="stage__asset stage__asset--home"></div><div class="stage__asset stage__asset--stream"></div><div class="stage__asset stage__asset--youtube"></div><div class="stage__asset stage__asset--profile"></div><div class="stage__wash"></div><div class="stage__grain"></div></div>
    <header class="topbar"><a class="brand" href="#" aria-label="RADARMusic home"><img src="${icon}" alt="" /><span>RADAR<em>Music</em></span></a><div class="topbar__meta"><span>ARTIST RELEASE PORTAL</span><a href="/dashboard">Creator login</a></div></header>
    <nav class="tab-rail" aria-label="Release navigation"><button class="is-active" data-tab-target="home" type="button"><img src="${controls.volume}" alt="" /><span>01</span>Home</button><button data-tab-target="stream" type="button"><img src="${controls.headphones}" alt="" /><span>02</span>Stream</button><button data-tab-target="youtube" type="button"><img src="${controls.play}" alt="" /><span>03</span>YouTube</button><button data-tab-target="profile" type="button"><img src="${controls.playlist}" alt="" /><span>04</span>Profile</button></nav>
    <section class="view view--home is-active" data-view="home"><div class="view__intro"><p class="kicker">RADAR ARTIST · CURRENT SIGNAL</p><h1 id="home-artist">${state.release.artist}</h1><p class="display-italic" id="home-title">${state.release.title}</p><div class="meta-line" id="home-meta">${state.release.type} · ${state.release.label} · ${state.release.date}</div><button class="primary-action" data-open-tab="stream" type="button"><img src="${controls.play}" alt="" />Enter the release <span>↗</span></button></div><div class="identity-card"><img id="identity-art" src="${state.release.artwork}" alt="${state.release.artist} release artwork" /><div><span id="identity-state">NOW FEATURED</span><strong id="identity-title">${state.release.title}</strong><small id="identity-artist">${state.release.artist}</small></div><button data-open-tab="stream" type="button" aria-label="Open stream tab"><img src="${controls.play}" alt="" /></button></div></section>
    <section class="view view--stream" data-view="stream"><div class="view__intro"><p class="kicker" id="stream-kicker">STREAM · VERIFIED SOURCE</p><h2 id="stream-title">${state.release.title}</h2><p class="display-italic" id="stream-tagline">Everywhere out.</p><p class="view__copy" id="stream-copy">The current release stays central while every approved listening destination sits one step away.</p></div><div class="content-panel stream-panel"><div class="embed-frame" id="stream-embed"></div><div class="store-strip" id="store-strip"></div></div></section>
    <section class="view view--youtube" data-view="youtube"><div class="view__intro"><p class="kicker">WATCH · OFFICIAL CHANNEL</p><h2>Inside the<br />visual world.</h2><p class="display-italic">Play it here.</p><p class="view__copy">The channel cover owns the background while the official video stays playable in-page.</p></div><div class="content-panel video-panel"><div class="video-frame"><iframe title="Demo YouTube video placeholder" src="https://www.youtube.com/embed/dQw4w9WgXcQ" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="panel-note"><span>DEMO CHANNEL COVER</span><strong>Replace with the artist’s official visual</strong><a href="https://www.youtube.com" target="_blank" rel="noreferrer">Open channel ↗</a></div></div></section>
    <section class="view view--profile" data-view="profile"><div class="view__intro"><p class="kicker">PROFILE · RELEASE POSTS</p><h2 id="profile-artist">${state.release.artist}</h2><p class="display-italic">The story continues.</p><p class="view__copy">Artist identity, release notes, campaign posts and the one-link portal creator live in the same profile space.</p></div><div class="content-panel profile-panel"><article class="profile-card"><img src="${artistVisual}" alt="RADAR artist portrait placeholder" /><div><span>ARTIST PROFILE</span><h3 id="profile-name">${state.release.artist}</h3><p>A release world shaped for listening, watching and returning.</p></div></article><div class="post-grid"><article><span>RELEASE NOTE</span><h3>Made for the moment.</h3><p>One signal, every platform, one visual identity.</p></article><article><span>CAMPAIGN POST</span><h3>Behind the release.</h3><p>Stories, shorts and press gathered around the music.</p></article></div><form class="sync-form" id="sync-form"><label for="release-url">Create a release or pre-save portal</label><div><input id="release-url" name="url" type="url" placeholder="Paste Spotify, Apple Music, or pre-save link" required /><button type="submit">Match link ↗</button></div><p id="sync-result" role="status">Official release links and supported public pre-save pages only. Every destination remains reviewable.</p></form><section class="manual-fallback" id="manual-fallback" aria-labelledby="manual-fallback-title" hidden></section></div></section>
    <footer class="statusbar"><span id="status-tab">01 / HOME</span><span>RADARCHARTS.NET</span><button id="share-button" type="button"><img src="${controls.share}" alt="" />Share portal ↗</button></footer>
    <aside class="dashboard" id="dashboard" hidden><button class="dashboard__close" id="dashboard-close" type="button" aria-label="Close dashboard">×</button><p class="kicker">CREATOR ACCESS</p><h2>Release management</h2><div id="dashboard-content"></div></aside>
  </main>`;

function renderRelease() {
  const r = state.release;
  document.querySelector('#home-artist').textContent = r.artist;
  document.querySelector('#home-title').textContent = r.title;
  document.querySelector('#home-meta').textContent = `${r.type || 'Release'} · ${r.label || 'Independent'} · ${r.releaseDate || r.date || 'Now'}`;
  const identityArtwork = document.querySelector('#identity-art');
  identityArtwork.onerror = () => { identityArtwork.onerror = null; identityArtwork.src = icon; };
  identityArtwork.src = r.artwork || icon;
  document.querySelector('#identity-title').textContent = r.title;
  document.querySelector('#identity-artist').textContent = r.artist;
  document.querySelector('#stream-title').textContent = r.title;
  const isPresave = r.mode === 'presave';
  const isManual = r.provenance === 'creator-entered';
  document.querySelector('#identity-state').textContent = isManual ? 'UPCOMING · CREATOR-ENTERED' : isPresave ? 'UPCOMING · PRE-SAVE' : 'NOW FEATURED';
  document.querySelector('#stream-kicker').textContent = isManual ? 'PRE-SAVE · MANUAL FALLBACK' : isPresave ? 'PRE-SAVE · OFFICIAL FLOW' : 'STREAM · VERIFIED SOURCE';
  document.querySelector('#stream-tagline').textContent = isPresave ? 'Save it before it lands.' : 'Everywhere out.';
  document.querySelector('#stream-copy').textContent = isPresave ? 'Continue through the verified campaign page to authorize the pre-save with your chosen music service.' : 'The current release stays central while every approved listening destination sits one step away.';
  document.querySelector('#profile-artist').textContent = r.artist;
  document.querySelector('#profile-name').textContent = r.artist;
  const source = r.destinations.find((item) => item.status === 'verified') || r.destinations[0];
  document.querySelector('#stream-embed').innerHTML = r.mode === 'presave' ? `<div class="presave-card"><img src="${escapeHTML(r.artwork || icon)}" alt="" onerror="this.onerror=null;this.src='${icon}'" /><span>${isManual ? 'CREATOR-ENTERED DETAILS · VERIFY BEFORE PUBLISHING' : 'VERIFIED PRE-SAVE PAGE'}</span><strong>${escapeHTML(r.title)}</strong><small>${escapeHTML(r.artist)}</small><p>${isManual ? 'The campaign URL is supported, but its metadata could not be read automatically. Review these creator-entered details before publishing.' : 'Finish securely with the campaign provider. You may be asked to sign in to Spotify, Apple Music, or another supported service.'}</p><a href="${escapeHTML(r.actionUrl || r.sourceUrl)}" target="_blank" rel="noreferrer">Continue to pre-save ↗</a></div>` : source?.name === 'Spotify' && source.id ? `<iframe title="${escapeHTML(r.title)} on Spotify" src="https://open.spotify.com/embed/track/${encodeURIComponent(source.id)}?utm_source=generator&theme=0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>` : `<div class="source-fallback"><span>VERIFIED SOURCE</span><strong>${escapeHTML(source?.name || 'Music store')}</strong><a href="${source?.url || '#'}" target="_blank" rel="noreferrer">Open source ↗</a></div>`;
  document.querySelector('#store-strip').innerHTML = r.destinations.map((store) => `<a href="${store.url}" target="_blank" rel="noreferrer"><span>${escapeHTML(store.name.slice(0,1))}</span><strong>${escapeHTML(store.name)}</strong><small>${store.status === 'verified' ? isManual ? 'Verified link' : 'Verified' : 'Review match'}</small></a>`).join('');
  const backgroundArtwork = /^(https:\/\/|\/)/.test(r.artwork || '') ? r.artwork : icon;
  document.querySelector('.experience').style.setProperty('--release-art', `url("${backgroundArtwork.replace(/["\\]/g, '')}")`);
  applyReleaseMeta({ title: r.title, artist: r.artist, artwork: r.artwork, sourceUrl: r.sourceUrl, source: r.source });
}

function openTab(tab) {
  state.tab = tab;
  document.querySelector('.experience').dataset.tab = tab;
  document.querySelectorAll('[data-tab-target]').forEach((button) => button.classList.toggle('is-active', button.dataset.tabTarget === tab));
  document.querySelectorAll('[data-view]').forEach((view) => view.classList.toggle('is-active', view.dataset.view === tab));
  document.querySelector('#status-tab').textContent = `${String(['home','stream','youtube','profile'].indexOf(tab) + 1).padStart(2,'0')} / ${tab.toUpperCase()}`;
}
document.querySelectorAll('[data-tab-target],[data-open-tab]').forEach((button) => button.addEventListener('click', () => openTab(button.dataset.tabTarget || button.dataset.openTab)));

function applyResolvedRelease(result) {
  const sourceId = result.metadata.source === 'Spotify' ? new URL(result.metadata.sourceUrl).pathname.split('/').filter(Boolean).pop() : null;
  state.release = { ...state.release, ...result.metadata, destinations: result.stores.map((store) => ({ name: store.name, url: store.url, status: store.status === 'verified' ? 'verified' : 'review', type: store.type, id: store.name === 'Spotify' && result.metadata.mode !== 'presave' ? sourceId : null })) };
  renderRelease();
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
    if (!response.ok && result.fallback?.eligible) {
      resultNode.textContent = 'Automatic lookup failed. Use the guided fallback below.';
      showManualFallback(result.fallback, result.error || 'Public metadata was unavailable.');
      return;
    }
    if (!response.ok) throw new Error(result.error || 'Unable to resolve release.');
    applyResolvedRelease(result);
    resultNode.textContent = state.release.mode === 'presave' ? `Pre-save page matched for ${state.release.title}. Fans can continue through the verified campaign flow.` : `Matched ${state.release.title} by ${state.release.artist}. Review every destination before publishing.`;
  } catch (error) { resultNode.textContent = error.message; }
});

document.querySelector('#share-button').addEventListener('click', async () => { const data = { title: `${state.release.title} · ${state.release.artist}`, url: window.location.href }; if (navigator.share) await navigator.share(data).catch(() => {}); else { await navigator.clipboard?.writeText(window.location.href); document.querySelector('#share-button').innerHTML = `<img src="${controls.share}" alt="" />Link copied`; } });

const welcome = document.querySelector('#welcome'); const dismiss = () => { if (!welcome) return; welcome.classList.add('is-exiting'); document.body.classList.remove('welcome-active'); window.setTimeout(() => welcome.remove(), 550); }; document.body.classList.add('welcome-active'); window.setTimeout(dismiss, 1900); if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) dismiss();

async function setupDashboard() {
  if (!window.location.pathname.startsWith('/dashboard')) return;
  const dashboard = document.querySelector('#dashboard'); dashboard.hidden = false; document.body.classList.remove('welcome-active'); welcome?.remove();
  document.querySelector('#dashboard-content').innerHTML = '<form class="auth-form" id="auth-form"><label>Email<input name="email" type="email" autocomplete="email" required /></label><label>Password<input name="password" type="password" autocomplete="current-password" required /></label><button type="submit">Sign in ↗</button><p id="auth-message" role="status"></p></form>';
  document.querySelector('#auth-form').addEventListener('submit', async (event) => { event.preventDefault(); const message = document.querySelector('#auth-message'); message.textContent = 'Signing in…'; try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Sign-in failed.'); const slug = new URLSearchParams(location.search).get('release') || state.release.slug; const summaryResponse = await fetch(`/api/analytics/summary?slug=${encodeURIComponent(slug)}`); const summary = await summaryResponse.json(); if (!summaryResponse.ok) throw new Error(summary.error || 'Analytics unavailable.'); document.querySelector('#dashboard-content').innerHTML = `<div class="metric-grid"><div><strong>${summary.views}</strong><span>Views</span></div><div><strong>${summary.unique_sessions}</strong><span>Sessions</span></div><div><strong>${summary.clicks}</strong><span>Clicks</span></div><div><strong>${summary.top_provider}</strong><span>Top store</span></div></div><button class="sign-out" id="sign-out" type="button">Sign out</button>`; document.querySelector('#sign-out').addEventListener('click', async () => { await fetch('/api/auth/logout', { method: 'POST' }); location.reload(); }); } catch (error) { message.textContent = error.message; } });
  document.querySelector('#dashboard-close').addEventListener('click', () => { location.href = '/'; });
}

renderRelease(); initAnalytics(); setupDashboard();
