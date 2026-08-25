const allowedEvents = new Set(['page_view', 'store_click']);

function clean(value, max = 500) {
  return typeof value === 'string' ? value.slice(0, max) : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!allowedEvents.has(body.event)) return res.status(400).json({ error: 'Unsupported analytics event.' });
    if (!body.release_slug || !body.session_id) return res.status(400).json({ error: 'Missing analytics fields.' });
    const row = {
      event_name: body.event,
      release_slug: clean(body.release_slug, 120),
      session_id: clean(body.session_id, 80),
      provider: clean(body.provider, 80),
      target_url: clean(body.target_url, 500),
      referrer_origin: clean(body.referrer_origin, 200),
      viewport_bucket: ['mobile', 'tablet', 'desktop'].includes(body.viewport_bucket) ? body.viewport_bucket : 'unknown',
    };
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(202).json({ accepted: true, persisted: false });
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/radarmusic_analytics_events`, {
      method: 'POST',
      headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    });
    if (!response.ok) return res.status(502).json({ error: 'Analytics storage unavailable.' });
    return res.status(202).json({ accepted: true, persisted: true });
  } catch {
    return res.status(400).json({ error: 'Invalid analytics payload.' });
  }
}
