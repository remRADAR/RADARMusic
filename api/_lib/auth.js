const COOKIE = '__Host-radarmusic_session';

function cookieValue(header = '') {
  const found = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
  return found ? decodeURIComponent(found.slice(COOKIE.length + 1)) : null;
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

export async function currentUser(req) {
  const token = cookieValue(req.headers.cookie);
  if (!token || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return null;
  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, { headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` } });
  if (!response.ok) return null;
  const user = await response.json();
  const role = user.app_metadata?.role;
  if (!['creator', 'admin'].includes(role)) return null;
  return { id: user.id, email: user.email, role, releaseSlugs: user.app_metadata?.release_slugs || [] };
}

export async function requireRole(req, res, roles = ['creator', 'admin']) {
  const user = await currentUser(req);
  if (!user || !roles.includes(user.role)) {
    res.status(401).json({ error: 'Authentication required.' });
    return null;
  }
  return user;
}

export { COOKIE };
