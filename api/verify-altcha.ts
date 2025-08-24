import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const csrfTokenFromCookie = req.cookies['csrf-token'];
  const csrfTokenFromHeader = req.headers['x-csrf-token'];

  if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
    return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
  }

  const { payload } = req.body;

  if (!payload) {
    return res.status(400).json({ success: false, error: 'Missing Altcha challenge payload' });
  }

  const secretKey = process.env.ALTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('ALTCHA_SECRET_KEY is not set in environment variables.');
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    // Parse the payload to extract challenge components
    const payloadData = JSON.parse(payload);
    const { challenge, salt, signature, algorithm, action = 'login' } = payloadData;

    if (!challenge || !salt || !signature || !algorithm) {
      return res.status(400).json({ success: false, error: 'Invalid payload structure' });
    }

    // Verify signature: HMAC-SHA256 of (challenge + action + salt)
    const expectedSignature = createHmac('sha256', secretKey)
      .update(`${challenge}${action}${salt}`)
      .digest('base64url');

    if (signature === expectedSignature) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Altcha signature verification failed');
      return res.status(400).json({ success: false, error: 'Altcha verification failed' });
    }
  } catch (error) {
    console.error('Error verifying Altcha challenge:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during verification' });
  }
}
