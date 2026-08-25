import './styles.css';
import { initAnalytics } from './analytics.js';
import { applyReleaseMeta } from './social-meta.js';

const icon = '/assets/radarmusic-icon.webp';
const opening = '/assets/radarcharts-opening.gif';
const app = document.querySelector('#root');

const state = {
  tab: 'listen',
  release: {
    slug: 'release-001',
    artist: 'Carly Rae Jepsen',
    title: 'Cut To The Feeling',
    type: 'Single',
    label: 'Spotify preview',
    date: 'Matched source',
    artwork: icon,
    source: 'Spotify',
    sourceUrl: 'https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl',
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
    videos: [{ title: 'Demo visual placeholder', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }, { title: 'Replace with official visual', url: 'https://www.youtube.com' }],
    shorts: [{ label: 'SHORT 01', title: 'The first transmission', url: 'https://www.youtube.com/shorts' }, { label: 'SHORT 02', title: 'In the room', url: 'https://www.youtube.com/shorts' }, { label: 'SHORT 03', title: 'After the light', url: 'https://www.youtube.com/shorts' }],
    press: [{ publication: 'RADARCharts', headline: 'Where the next wave finds its voice.', quote: 'A release built like a world, not a file.', url: '#story' }, { publication: 'FIELD NOTES', headline: 'The visual language of a moment in motion.', quote: 'Listen closer. There is more arriving.', url: '#story' }],
  },
};

const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const searchDestination = (name) => state.release.destinations.find((item) => item.name === name);

app.innerHTML = `
  <div class="welcome" id="welcome" role="dialog" aria-label="RADARMusic welcome animation" aria-modal="true"><img class="welcome__media" src="${opening}" alt="" aria-hidden="true" /><div class="welcome__veil" aria-hidden="true"></div><div class="welcome__caption"><span>THE</span><strong>RADAR<span>Music</span></strong></div><button class="welcome__skip" id="skip-welcome" type="button">Enter experience</button></div>
  <main class="site-shell" id="top">
    <nav class="nav" aria-label="Primary navigation"><a class="brand" href="#top" aria-label="The RADARMusic home"><img src="${icon}" alt="" /><span>THE<br /><b>RADAR</b>MUSIC</span></a><div class="nav__links"><a href="#portal">Portal</a><a href="#story">Story</a><a href="#credits">Credits</a><a href="/dashboard">Creator login</a></div><button class="nav__menu" type="button" aria-label="Open menu"><i></i><i></i></button></nav>
    <section class="hero" id="portal"><div class="hero__backdrop"><img src="${state.release.artwork}" alt="" /></div><div class="hero__identity"><div class="identity__art"><img id="hero-art" src="${state.release.artwork}" alt="${state.release.artist} artwork" /></div><p class="eyebrow">RADARMUSIC · SPOTIFY PREVIEW</p><h1 id="hero-artist">${state.release.artist}</h1><h2 id="hero-title">${state.release.title}</h2><p class="identity__meta" id="hero-meta">${state.release.type} · ${state.release.label} · ${state.release.date}</p><a class="button button--solid" href="#listen">Listen now <span>↗</span></a></div><div class="hero__meta"><span>01 / 04</span><span>RADARCHARTS.NET</span><span>SCROLL TO DISCOVER ↓</span></div></section>
    <section class="portal" aria-label="Release content"><nav class="segment-nav" aria-label="Release surfaces"><button class="is-active" data-tab="listen" type="button">Listen</button><button data-tab="watch" type="button">Watch</button><button data-tab="shorts" type="button">Shorts</button><button data-tab="press" type="button">Press</button></nav><div class="surface-stack"><section class="surface is-active" data-surface="listen" id="listen"><div class="surface__heading"><p class="eyebrow">01 — LISTEN</p><h2>Every doorway.<br /><em>Choose yours.</em></h2><p>One release, every destination. The verified source is expanded here; every other link stays transparent until it is confirmed.</p></div><div class="listen-layout" id="listen-surface"></div></section><section class="surface" data-surface="watch" id="watch"><div class="surface__heading"><p class="eyebrow">02 — WATCH</p><h2>See the world<br /><em>around the sound.</em></h2><p>Official visual material, presented in the same space as the release.</p></div><div class="watch-layout" id="watch-surface"></div></section><section class="surface" data-surface="shorts" id="shorts"><div class="surface__heading"><p class="eyebrow">03 — SHORTS</p><h2>Small frames.<br /><em>Big signal.</em></h2><p>Scroll through the fragments, gestures and moments that carry the release outward.</p></div><div class="shorts-rail" id="shorts-surface"></div></section><section class="surface" data-surface="press" id="press"><div class="surface__heading"><p class="eyebrow">04 — PRESS</p><h2>More than<br /><em>a release.</em></h2><p>Stories and context from the people following the signal.</p></div><div class="press-grid" id="press-surface"></div></section></div></section>
    <section class="story" id="story"><div class="story__visual"><img src="${icon}" alt="Silver RADARMusic note emblem" /></div><div class="story__copy"><p class="eyebrow">THE RELEASE NOTE</p><h2>Sound with<br /><em>a point of view.</em></h2><p>The RADARMusic is a beautiful front door to a release. It brings the sound, the story and the people behind it into one considered experience — made to be shared, saved and returned to.</p><p class="story__note">A RADARCharts original<br /><span>Music, in context.</span></p></div></section>
    <section class="sync-panel" id="sync" aria-labelledby="sync-title"><div class="sync-panel__intro"><p class="eyebrow">CREATE YOUR RELEASE PORTAL</p><h2 id="sync-title">One link in.<br /><em>Everywhere out.</em></h2><p>Paste a Spotify or Apple Music release link to replace this example identity with a matched release.</p></div><form class="sync-form" id="sync-form"><label for="release-url">Spotify or Apple Music URL</label><div class="sync-form__row"><input id="release-url" name="url" type="url" placeholder="https://open.spotify.com/track/..." required /><button class="button button--solid" type="submit">Find release <span>↗</span></button></div><p class="sync-form__hint">Official links only. No passwords, streams, or protected content are collected.</p></form><div class="sync-result" id="sync-result" aria-live="polite"></div><section class="analytics-panel" id="analytics-panel" aria-labelledby="analytics-title" hidden><div><p class="eyebrow">CREATOR VIEW · LAST 30 DAYS</p><h3 id="analytics-title">Release analytics</h3></div><div class="analytics-grid" id="analytics-grid"><p>Sign in to view private metrics.</p></div></section></section>
    <section class="credits" id="credits"><p class="eyebrow">THE DETAILS</p><div class="credits__grid"><div><h2>Built to be<br /><em>remembered.</em></h2></div><dl><div><dt>Presented by</dt><dd>RADARCharts</dd></div><div><dt>Format</dt><dd>Digital release portal</dd></div><div><dt>Edition</dt><dd>Vol. 01 / 2026</dd></div><div><dt>Contact</dt><dd>hello@radarcharts.net</dd></div></dl></div></section>
    <footer class="footer"><div class="brand brand--footer"><img src="${icon}" alt="" /><span>THE<br /><b>RADAR</b>MUSIC</span></div><p>Make room for what moves you.</p><span>© RADARCHARTS 2026</span></footer>
  </main><div class="mini-player" id="mini-player"><div class="mini-player__art"><img id="mini-art" src="${state.release.artwork}" alt="" /></div><div><span>NOW PLAYING</span><strong id="mini-title">${state.release.title}</strong></div><button type="button" aria-label="Play release" id="play-toggle">▶</button></div>`;

function renderIdentity() {
  document.querySelector('#hero-art').src = state.release.artwork || icon;
  document.querySelector('#hero-art').alt = `${state.release.artist} artwork`;
  document.querySelector('#hero-artist').textContent = state.release.artist;
  document.querySelector('#hero-title').textContent = state.release.title;
  document.querySelector('#hero-meta').textContent = `${state.release.type || 'Release'} · ${state.release.label || 'Independent'} · ${state.release.date || 'Now'}`;
  document.querySelector('#mini-art').src = state.release.artwork || icon;
  document.querySelector('#mini-title').textContent = state.release.title;
  applyReleaseMeta({ title: state.release.title, artist: state.release.artist, artwork: state.release.artwork, sourceUrl: state.release.sourceUrl, source: state.release.source });
}

function renderListen() {
  const source = state.release.destinations.find((item) => item.status === 'verified') || state.release.destinations[0];
  const embed = source?.name === 'Spotify' && source.id ? `<div class="embed-frame"><iframe title="${escapeHTML(state.release.title)} on Spotify" src="https://open.spotify.com/embed/track/${encodeURIComponent(source.id)}?utm_source=generator&theme=0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>` : `<div class="embed-placeholder"><span class="eyebrow">OFFICIAL SOURCE</span><strong>${escapeHTML(source?.name || 'Source')}</strong><p>Open the verified source to listen to this release.</p><a class="button button--solid" href="${source?.url || '#'}" target="_blank" rel="noreferrer">Open source <span>↗</span></a></div>`;
  const rows = state.release.destinations.map((destination) => `<a class="store-row" href="${destination.url}" target="_blank" rel="noreferrer"><span class="store-row__mark">${escapeHTML(destination.name.slice(0, 1))}</span><span><strong>${escapeHTML(destination.name)}</strong><small>${destination.status === 'verified' ? 'Verified source' : 'Search destination · review match'}</small></span><b>↗</b></a>`).join('');
  document.querySelector('#listen-surface').innerHTML = `<div>${embed}</div><div class="store-list"><div class="store-list__header"><span>AVAILABLE ON</span><span>${state.release.destinations.length} DOORWAYS</span></div>${rows}</div>`;
}
function renderWatch() { document.querySelector('#watch-surface').innerHTML = `<div class="video-frame"><iframe title="${escapeHTML(state.release.videos[0].title)}" src="${state.release.videos[0].url}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="alternate-rail">${state.release.videos.slice(1).map((video) => `<a href="${video.url}" target="_blank" rel="noreferrer"><span class="eyebrow">ALTERNATE VISUAL</span><strong>${escapeHTML(video.title)}</strong><b>↗</b></a>`).join('')}</div>`; }
function renderShorts() { document.querySelector('#shorts-surface').innerHTML = state.release.shorts.map((short) => `<a class="short-card" href="${short.url}" target="_blank" rel="noreferrer"><span>${short.label}</span><strong>${escapeHTML(short.title)}</strong><b>↗</b></a>`).join(''); }
function renderPress() { document.querySelector('#press-surface').innerHTML = state.release.press.map((item) => `<a class="press-card" href="${item.url}"><span>${escapeHTML(item.publication)}</span><h3>${escapeHTML(item.headline)}</h3><blockquote>“${escapeHTML(item.quote)}”</blockquote><b>Read feature ↗</b></a>`).join(''); }
function renderAll() { renderIdentity(); renderListen(); renderWatch(); renderShorts(); renderPress(); }

function setTab(tab) { state.tab = tab; document.querySelectorAll('[data-tab]').forEach((button) => button.classList.toggle('is-active', button.dataset.tab === tab)); document.querySelectorAll('[data-surface]').forEach((surface) => surface.classList.toggle('is-active', surface.dataset.surface === tab)); document.querySelector(`#${tab}`).scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => setTab(button.dataset.tab)));

document.querySelector('#sync-form').addEventListener('submit', async (event) => { event.preventDefault(); const url = new FormData(event.currentTarget).get('url'); const resultNode = document.querySelector('#sync-result'); resultNode.className = 'sync-result is-loading'; resultNode.innerHTML = '<span class="sync-result__spinner"></span><p>Reading release identity and searching destinations…</p>'; try { const response = await fetch('/api/release/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to resolve this release.'); state.release = { ...state.release, ...result.metadata, destinations: result.stores.map((store) => ({ name: store.name, url: store.url, status: store.status === 'verified' ? 'verified' : 'review', id: new URL(store.url).pathname.split('/').filter(Boolean).pop() })) }; renderAll(); resultNode.className = 'sync-result is-ready'; resultNode.innerHTML = `<div class="release-preview"><img src="${escapeHTML(result.metadata.artwork || icon)}" alt="" /><div><span class="eyebrow">MATCHED RELEASE · ${escapeHTML(result.metadata.source)}</span><h3>${escapeHTML(result.metadata.title)}</h3><p>${escapeHTML(result.metadata.artist)}${result.metadata.album ? ` · ${escapeHTML(result.metadata.album)}` : ''}</p></div></div><p class="sync-result__policy">${escapeHTML(result.policy)}</p>`; } catch (error) { resultNode.className = 'sync-result is-error'; resultNode.innerHTML = `<p><strong>Couldn’t find that release.</strong> ${escapeHTML(error.message)}</p>`; } });

const welcome = document.querySelector('#welcome'); const dismiss = () => { if (!welcome) return; welcome.classList.add('is-exiting'); document.body.classList.remove('welcome-active'); window.setTimeout(() => welcome.remove(), 900); }; document.body.classList.add('welcome-active'); window.setTimeout(dismiss, 3600); document.querySelector('#skip-welcome').addEventListener('click', dismiss); if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) dismiss();
const player = document.querySelector('#mini-player'); const toggle = document.querySelector('#play-toggle'); let playing = false; toggle.addEventListener('click', () => { playing = !playing; toggle.textContent = playing ? 'Ⅱ' : '▶'; player.classList.toggle('is-playing', playing); }); document.querySelectorAll('a[href="#listen"]').forEach((link) => link.addEventListener('click', () => player.classList.add('is-visible')));

initAnalytics();
const analyticsPanel = document.querySelector('#analytics-panel');
if (window.location.pathname.startsWith('/dashboard') && analyticsPanel) {
  analyticsPanel.hidden = false;
  document.querySelector('#analytics-grid').innerHTML = '<form class="auth-form" id="auth-form"><label for="creator-email">Creator email</label><input id="creator-email" name="email" type="email" autocomplete="email" required /><label for="creator-password">Password</label><input id="creator-password" name="password" type="password" autocomplete="current-password" required /><button class="button button--solid" type="submit">Sign in <span>↗</span></button><p id="auth-message" role="status"></p></form>';
  document.querySelector('#auth-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.querySelector('#auth-message');
    message.textContent = 'Signing in…';
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields) });
      const result = await response.json();
      if (!response.ok) { message.textContent = result.error || 'Sign-in failed.'; return; }
      message.textContent = 'Signed in. Loading analytics…';
      const slug = new URLSearchParams(window.location.search).get('release') || 'home';
      const summaryResponse = await fetch(`/api/analytics/summary?slug=${encodeURIComponent(slug)}`);
      const summary = await summaryResponse.json();
      if (!summaryResponse.ok) throw new Error(summary.error || 'Analytics could not be loaded.');
      document.querySelector('#analytics-grid').innerHTML = `<div><strong>${summary.views}</strong><span>Page views</span></div><div><strong>${summary.unique_sessions}</strong><span>Unique sessions</span></div><div><strong>${summary.clicks}</strong><span>Store clicks</span></div><div><strong>${summary.top_provider}</strong><span>Top destination</span></div><form class="notification-form" id="notification-form"><label for="notification-channel">Click alert channel</label><select id="notification-channel" name="channel"><option value="email">Email</option><option value="sms">SMS</option></select><label for="notification-destination">Destination</label><input id="notification-destination" name="destination" type="text" placeholder="creator@example.com or +15551234567" required /><label class="consent-check"><input name="consent" type="checkbox" required /> I agree to receive click-through alerts for this release.</label><button class="button button--solid" type="submit">Enable alerts <span>↗</span></button><p id="notification-message" role="status"></p></form><button class="button button--quiet" id="sign-out" type="button">Sign out</button>`;
      document.querySelector('#notification-form').addEventListener('submit', async (notificationEvent) => {
        notificationEvent.preventDefault();
        const formData = Object.fromEntries(new FormData(notificationEvent.currentTarget));
        const notificationResponse = await fetch('/api/notifications/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, release_slug: slug }) });
        const notificationResult = await notificationResponse.json();
        document.querySelector('#notification-message').textContent = notificationResponse.ok ? 'Alerts enabled.' : notificationResult.error || 'Unable to enable alerts.';
      });
      document.querySelector('#sign-out').addEventListener('click', async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.reload(); });
    } catch (error) { message.textContent = error.message; }
  });
}

renderAll();
