import './styles.css';

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
      <div class="nav__links"><a href="#listen">Listen</a><a href="#story">Story</a><a href="#credits">Credits</a></div>
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
