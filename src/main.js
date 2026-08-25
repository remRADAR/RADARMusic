import './styles.css';
import { initAnalytics } from './analytics.js';

const icon = '/assets/radarmusic-icon.webp';
const opening = '/assets/radarcharts-opening.gif';

const app = document.querySelector('#root');

app.innerHTML = `
  <div class="welcome" id="welcome" role="dialog" aria-label="RADARMusic welcome animation" aria-modal="true">
    <img class="welcome__media" src="${opening}" alt="" aria-hidden="true" />
    <div class="welcome__veil" aria-hidden="true"></div>
    <div class="welcome__caption"><span>THE</span><strong>RADAR<span>Music</span></strong></div>
    <button class="welcome__skip" id="skip-welcome" type="button">Enter experience</button>
  </div>

  <main class="site-shell">
    <nav class="nav" aria-label="Primary navigation">
      <a class="brand" href="#top" aria-label="The RADARMusic home"><img src="${icon}" alt="" /><span>THE<br /><b>RADAR</b>MUSIC</span></a>
      <div class="nav__links"><a href="#listen">Listen</a><a href="#story">Story</a><a href="#credits">Credits</a><a href="/dashboard">Creator login</a></div>
      <button class="nav__menu" type="button" aria-label="Open menu"><i></i><i></i></button>
    </nav>

    <section class="hero" id="top">
      <div class="hero__glow"></div>
      <div class="hero__copy">
        <p class="eyebrow">THE RADARMUSIC · RELEASE 001</p>
        <h1>Made for<br /><em>the moment.</em></h1>
        <p class="hero__intro">A living front door to the music, stories and worlds shaping the next wave.</p>
        <div class="hero__actions"><a class="button button--solid" href="#listen">Play release <span>↗</span></a><a class="button button--quiet" href="#story">Explore the story</a></div>
      </div>
      <div class="hero__art"><div class="art-ring"></div><img src="${icon}" alt="The RADARMusic chrome note mark" /></div>
      <div class="hero__meta"><span>01 / 04</span><span>RADARCHARTS.NET</span><span>SCROLL TO DISCOVER ↓</span></div>
    </section>

    <section class="sync-panel" id="sync" aria-labelledby="sync-title"><div class="sync-panel__intro"><p class="eyebrow">CREATE YOUR RELEASE PORTAL</p><h2 id="sync-title">One link in.<br /><em>Everywhere out.</em></h2><p>Paste a Spotify or Apple Music release link. We’ll normalize the release identity, find the best available destinations, and let you review every match before publishing.</p></div><form class="sync-form" id="sync-form"><label for="release-url">Spotify or Apple Music URL</label><div class="sync-form__row"><input id="release-url" name="url" type="url" placeholder="https://open.spotify.com/track/..." required /><button class="button button--solid" type="submit">Find release <span>↗</span></button></div><p class="sync-form__hint">Official links only. No passwords, streams, or protected content are collected.</p></form><div class="sync-result" id="sync-result" aria-live="polite"></div><section class="analytics-panel" id="analytics-panel" aria-labelledby="analytics-title" hidden><div><p class="eyebrow">CREATOR VIEW · LAST 30 DAYS</p><h3 id="analytics-title">Release analytics</h3></div><div class="analytics-grid" id="analytics-grid"><p>Loading analytics…</p></div></section></section>

    <section class="marquee" aria-label="RADARMusic statement"><div>LISTEN · DISCOVER · CONNECT · LISTEN · DISCOVER · CONNECT · </div></section>

    <section class="section listen" id="listen">
      <div class="section__heading"><p class="eyebrow">01 — THE DESTINATIONS</p><h2>Press play.<br /><em>Go deeper.</em></h2><p>One release, every doorway. Start here, then move through the places where the sound lives.</p></div>
      <div class="destination-grid">
        <a class="destination destination--featured" href="https://www.youtube.com" target="_blank" rel="noreferrer"><div><span class="destination__index">A / PLAY HERE</span><h3>Watch the visual</h3><p>Step inside the official visual world on YouTube.</p></div><span class="destination__arrow">↗</span></a>
        <a class="destination" href="https://open.spotify.com" target="_blank" rel="noreferrer"><span class="destination__index">B / LISTEN ON</span><h3>Spotify</h3><span class="destination__arrow">↗</span></a>
        <a class="destination" href="https://music.apple.com" target="_blank" rel="noreferrer"><span class="destination__index">C / LISTEN ON</span><h3>Apple Music</h3><span class="destination__arrow">↗</span></a>
        <a class="destination" href="https://soundcloud.com" target="_blank" rel="noreferrer"><span class="destination__index">D / PLAY HERE</span><h3>SoundCloud</h3><span class="destination__arrow">↗</span></a>
      </div>
    </section>

    <section class="section story" id="story"><div class="story__visual"><img src="${icon}" alt="Silver RADARMusic note emblem" /></div><div class="story__copy"><p class="eyebrow">02 — ABOUT THE RELEASE</p><h2>Sound with<br /><em>a point of view.</em></h2><p>The RADARMusic is the beautiful front door to a release. It brings the sound, the story and the people behind it into one considered experience — made to be shared, saved and returned to.</p><p class="story__note">A RADARCharts original<br /><span>Music, in context.</span></p></div></section>

    <section class="section journal"><div class="section__heading"><p class="eyebrow">03 — FROM THE JOURNAL</p><h2>More than<br /><em>a release.</em></h2></div><div class="journal__grid"><article><span>01 / ESSAY</span><h3>Where the next wave finds its voice.</h3><a href="#top">Read story ↗</a></article><article><span>02 / INTERVIEW</span><h3>In conversation: building a world around the sound.</h3><a href="#top">Read story ↗</a></article><article><span>03 / FIELD NOTES</span><h3>The visual language of a moment in motion.</h3><a href="#top">Read story ↗</a></article></div></section>

    <section class="section credits" id="credits"><p class="eyebrow">04 — THE DETAILS</p><div class="credits__grid"><div><h2>Built to be<br /><em>remembered.</em></h2></div><dl><div><dt>Presented by</dt><dd>RADARCharts</dd></div><div><dt>Format</dt><dd>Digital release portal</dd></div><div><dt>Edition</dt><dd>Vol. 01 / 2026</dd></div><div><dt>Contact</dt><dd>hello@radarcharts.net</dd></div></dl></div></section>

    <footer class="footer"><div class="brand brand--footer"><img src="${icon}" alt="" /><span>THE<br /><b>RADAR</b>MUSIC</span></div><p>Make room for what moves you.</p><span>© RADARCHARTS 2026</span></footer>
  </main>
  <div class="mini-player" id="mini-player"><div class="mini-player__art"><img src="${icon}" alt="" /></div><div><span>NOW PLAYING</span><strong>The RADARMusic</strong></div><button type="button" aria-label="Play release" id="play-toggle">▶</button></div>
`;

const welcome = document.querySelector('#welcome');
const dismiss = () => { welcome.classList.add('is-exiting'); document.body.classList.remove('welcome-active'); window.setTimeout(() => welcome.remove(), 900); };
document.body.classList.add('welcome-active');
window.setTimeout(dismiss, 3600);
document.querySelector('#skip-welcome').addEventListener('click', dismiss);

const player = document.querySelector('#mini-player');
const toggle = document.querySelector('#play-toggle');
let playing = false;
toggle.addEventListener('click', () => { playing = !playing; toggle.textContent = playing ? 'Ⅱ' : '▶'; player.classList.toggle('is-playing', playing); });
document.querySelectorAll('a[href="#listen"]').forEach((link) => link.addEventListener('click', () => player.classList.add('is-visible')));

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) dismiss();

const syncForm = document.querySelector('#sync-form');
const syncResult = document.querySelector('#sync-result');
syncForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = new FormData(syncForm).get('url');
  syncResult.className = 'sync-result is-loading';
  syncResult.innerHTML = '<span class="sync-result__spinner"></span><p>Reading release identity and searching destinations…</p>';
  try {
    const response = await fetch('/api/release/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to resolve this release.');
    syncResult.className = 'sync-result is-ready';
    syncResult.innerHTML = `<div class="release-preview">${result.metadata.artwork ? `<img src="${result.metadata.artwork}" alt="" />` : `<img src="${icon}" alt="" />`}<div><span class="eyebrow">MATCHED RELEASE · ${result.metadata.source}</span><h3>${result.metadata.title}</h3><p>${result.metadata.artist}${result.metadata.album ? ` · ${result.metadata.album}` : ''}</p></div></div><div class="match-list"><div class="match-list__header"><span>DESTINATIONS</span><span>${result.stores.length} FOUND · REVIEW BEFORE PUBLISHING</span></div>${result.stores.map((store) => `<a class="match" href="${store.url}" target="_blank" rel="noreferrer"><span class="match__status ${store.status}"></span><strong>${store.name}</strong><span>${store.status === 'verified' ? 'Verified source' : 'Search destination'}</span><b>↗</b></a>`).join('')}</div><p class="sync-result__policy">${result.policy}</p>`;
    document.querySelector('#sync').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    syncResult.className = 'sync-result is-error';
    syncResult.innerHTML = `<p><strong>Couldn’t find that release.</strong> ${error.message}</p>`;
  }
});


initAnalytics();
const analyticsPanel = document.querySelector('#analytics-panel');
if (window.location.pathname.startsWith('/dashboard')) {
  analyticsPanel.hidden = false;
  document.querySelector('#analytics-grid').innerHTML = '<form class="auth-form" id="auth-form"><label for="creator-email">Creator email</label><input id="creator-email" name="email" type="email" autocomplete="email" required /><label for="creator-password">Password</label><input id="creator-password" name="password" type="password" autocomplete="current-password" required /><button class="button button--solid" type="submit">Sign in <span>↗</span></button><p id="auth-message" role="status"></p></form>';
  document.querySelector('#auth-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.querySelector('#auth-message');
    message.textContent = 'Signing in…';
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields) });
    const result = await response.json();
    if (!response.ok) { message.textContent = result.error || 'Sign-in failed.'; return; }
    message.textContent = 'Signed in. Loading analytics…';
    const summary = await fetch(`/api/analytics/summary?slug=${encodeURIComponent(window.location.pathname.split('/').filter(Boolean).pop() || 'home')}`).then((item) => item.json());
    document.querySelector('#analytics-grid').innerHTML = `<div><strong>${summary.views}</strong><span>Page views</span></div><div><strong>${summary.unique_sessions}</strong><span>Unique sessions</span></div><div><strong>${summary.clicks}</strong><span>Store clicks</span></div><div><strong>${summary.top_provider}</strong><span>Top destination</span></div><button class="button button--quiet" id="sign-out" type="button">Sign out</button>`;
    document.querySelector('#sign-out').addEventListener('click', async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.reload(); });
  });
}
