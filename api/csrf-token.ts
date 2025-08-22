import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const csrfToken = randomBytes(32).toString('hex');

  res.setHeader('Set-Cookie', `csrf-token=${csrfToken}; Path=/; HttpOnly; SameSite=Strict`);

  return res.status(200).json({ success: true });
}