import { setSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return res.status(503).json({ error: 'Authentication is not configured.' });
  try {
    const { email, password } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: process.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await response.json();
    if (!response.ok || !data.access_token) return res.status(401).json({ error: 'Invalid email or password.' });
    setSessionCookie(res, data.access_token);
    return res.status(200).json({ user: { id: data.user.id, email: data.user.email, role: data.user.app_metadata?.role || null } });
  } catch {
    return res.status(400).json({ error: 'Invalid authentication request.' });
  }
}
