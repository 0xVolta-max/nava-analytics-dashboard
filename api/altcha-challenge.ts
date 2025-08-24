import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';
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

  const { action = 'login' } = req.body;
  const secretKey = process.env.ALTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('ALTCHA_SECRET_KEY is not set in environment variables.');
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    // Generate a random challenge string
    const challenge = randomBytes(32).toString('base64url');
    const salt = randomBytes(16).toString('base64url');

    // Create signature: HMAC-SHA256 of (challenge + action + salt)
    const signatureData = `${challenge}${action}${salt}`;
    const signature = createHmac('sha256', secretKey)
      .update(signatureData)
      .digest('base64url');

    return res.status(200).json({
      success: true,
      challenge: challenge,
      salt: salt,
      signature: signature,
      algorithm: 'SHA-256'
    });
  } catch (error) {
    console.error('Error generating Altcha challenge:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate challenge' });
  }
}
