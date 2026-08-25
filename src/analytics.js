const STORAGE_KEY = 'radarmusic_analytics_session';

function sessionId() {
  let value = localStorage.getItem(STORAGE_KEY);
  if (!value) {
    value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(STORAGE_KEY, value);
  }
  return value;
}

function releaseSlug() {
  return window.location.pathname.split('/').filter(Boolean).pop() || 'home';
}

export function trackEvent(event, details = {}) {
  const payload = {
    event,
    release_slug: releaseSlug(),
    session_id: sessionId(),
    provider: details.provider || null,
    target_url: details.targetUrl || null,
    referrer_origin: document.referrer ? new URL(document.referrer).origin : null,
    viewport_bucket: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1200 ? 'tablet' : 'desktop',
  };
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/event', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  } else {
    fetch('/api/analytics/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  }
}

export function initAnalytics() {
  trackEvent('page_view');
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || !link.href.startsWith('http')) return;
    const provider = link.textContent.trim().split(/\s+/)[0] || new URL(link.href).hostname;
    trackEvent('store_click', { provider, targetUrl: link.href });
  }, { passive: true });
}
