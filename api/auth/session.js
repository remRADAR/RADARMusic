import { currentUser } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const user = await currentUser(req);
  if (!user) return res.status(401).json({ authenticated: false });
  return res.status(200).json({ authenticated: true, user });
}
