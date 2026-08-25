import crypto from 'node:crypto';
import { requireRole } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = await requireRole(req, res);
  if (!user) return;
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({ error: 'Notification storage is not configured.' });
  try {
    const { release_slug, channel, destination } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!release_slug || !['email', 'sms'].includes(channel) || typeof destination !== 'string') return res.status(400).json({ error: 'Release, channel, and destination are required.' });
    if (user.role !== 'admin' && !user.releaseSlugs.includes(release_slug)) return res.status(403).json({ error: 'You do not have access to this release.' });
    if (channel === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(destination)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (channel === 'sms' && !/^\+[1-9]\d{7,14}$/.test(destination)) return res.status(400).json({ error: 'Use an international phone number, for example +15551234567.' });
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/radarmusic_notification_subscriptions`, { method: 'POST', headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ release_slug, channel, destination: destination.slice(0, 320), owner_id: user.id, unsubscribe_token: crypto.randomBytes(24).toString('hex'), enabled: true }) });
    if (!response.ok) return res.status(502).json({ error: 'Notification storage unavailable.' });
    const [subscription] = await response.json();
    return res.status(201).json({ id: subscription.id, channel: subscription.channel, release_slug: subscription.release_slug });
  } catch {
    return res.status(400).json({ error: 'Invalid notification subscription.' });
  }
}
