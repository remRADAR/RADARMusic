import { requireRole } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const user = await requireRole(req, res);
  if (!user) return;
  const slug = typeof req.query?.slug === 'string' ? req.query.slug.slice(0, 120) : 'home';
  if (user.role !== 'admin' && !user.releaseSlugs.includes(slug)) return res.status(403).json({ error: 'You do not have access to this release.' });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(200).json({ configured: false, views: 0, unique_sessions: 0, clicks: 0, top_provider: '—' });
  const query = new URLSearchParams({ select: 'event_name,session_id,provider', release_slug: `eq.${slug}`, limit: '5000' });
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/radarmusic_analytics_events?${query}`, { headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } });
  if (!response.ok) return res.status(502).json({ error: 'Analytics storage unavailable.' });
  const rows = await response.json();
  const views = rows.filter((row) => row.event_name === 'page_view').length;
  const clicks = rows.filter((row) => row.event_name === 'store_click');
  const providers = clicks.reduce((acc, row) => { if (row.provider) acc[row.provider] = (acc[row.provider] || 0) + 1; return acc; }, {});
  const top_provider = Object.entries(providers).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  return res.status(200).json({ configured: true, views, unique_sessions: new Set(rows.map((row) => row.session_id)).size, clicks: clicks.length, top_provider });
}
