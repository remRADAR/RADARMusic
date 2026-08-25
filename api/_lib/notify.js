const WINDOW_MS = 15 * 60 * 1000;

async function supabase(path, options = {}) {
  return fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, { ...options, headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
}

async function sendEmail(destination, event) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_FROM_EMAIL) return false;
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.NOTIFY_FROM_EMAIL, to: [destination], subject: `New ${event.provider || 'store'} click for ${event.release_slug}`, text: `A fan clicked through to ${event.provider || 'a music store'} from ${event.release_slug}. This alert is rate-limited to one notification per 15 minutes.` }) });
  return response.ok;
}

async function sendSms(destination, event) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM_NUMBER) return false;
  const body = new URLSearchParams({ To: destination, From: process.env.TWILIO_FROM_NUMBER, Body: `RADARMusic: a fan clicked ${event.provider || 'a store'} from ${event.release_slug}.` });
  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  return response.ok;
}

export async function notifyCreatorOfClick(event) {
  if (event.event_name !== 'store_click' || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const subs = await supabase(`radarmusic_notification_subscriptions?select=id,channel,destination&release_slug=eq.${encodeURIComponent(event.release_slug)}&enabled=eq.true&limit=50`);
  if (!subs.ok) return;
  const subscriptions = await subs.json();
  for (const subscription of subscriptions) {
    const recent = await supabase(`radarmusic_notification_deliveries?select=id&subscription_id=eq.${subscription.id}&created_at=gte.${encodeURIComponent(new Date(Date.now() - WINDOW_MS).toISOString())}&limit=1`);
    if (!recent.ok || (await recent.json()).length) continue;
    const sent = subscription.channel === 'email' ? await sendEmail(subscription.destination, event) : subscription.channel === 'sms' ? await sendSms(subscription.destination, event) : false;
    if (sent) await supabase('radarmusic_notification_deliveries', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ subscription_id: subscription.id, event_name: event.event_name, provider: event.provider }) });
  }
}
