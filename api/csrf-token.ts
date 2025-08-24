import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const token = randomBytes(32).toString('hex');

  // Set cookie for server-side verification
  res.setHeader('Set-Cookie', `csrf-token=${token}; HttpOnly; Path=/; SameSite=Strict`);

  // Return token to frontend for use in headers
  res.status(200).json({ success: true, token });
}
