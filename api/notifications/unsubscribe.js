export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({ error: 'Notification storage is not configured.' });
  const token = req.method === 'GET' ? req.query?.token : (typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}).token;
  if (typeof token !== 'string' || !/^[a-f0-9]{48}$/.test(token)) return res.status(400).json({ error: 'Invalid unsubscribe token.' });
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/radarmusic_notification_subscriptions?unsubscribe_token=eq.${token}`, { method: 'PATCH', headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ enabled: false, unsubscribed_at: new Date().toISOString() }) });
  if (!response.ok) return res.status(502).json({ error: 'Notification storage unavailable.' });
  return res.status(200).json({ unsubscribed: true });
}
