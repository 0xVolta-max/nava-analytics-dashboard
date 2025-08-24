import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const token = randomBytes(32).toString('hex');

    // Set cookie for server-side verification
    res.setHeader('Set-Cookie', `csrf-token=${token}; HttpOnly; Path=/; SameSite=Strict`);

    // Return token to frontend for use in headers
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('CSRF Token generation error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
