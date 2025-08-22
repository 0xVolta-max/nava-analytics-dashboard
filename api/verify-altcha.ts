import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyChallenge } from 'altcha';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const csrfTokenFromCookie = req.cookies['csrf-token'];
  const csrfTokenFromHeader = req.headers['x-csrf-token'];

  if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
    return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
  }

  const { challenge } = req.body;

  if (!challenge) {
    return res.status(400).json({ success: false, error: 'Missing Altcha challenge response' });
  }

  const secretKey = process.env.ALTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('ALTCHA_SECRET_KEY is not set in environment variables.');
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    const result = await verifyChallenge({ challenge, secret: secretKey });

    if (result.verified) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Altcha verification failed:', result.error);
      return res.status(400).json({ success: false, error: 'Altcha verification failed', errorDetails: result.error });
    }
  } catch (error) {
    console.error('Error verifying Altcha challenge:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during verification' });
  }
}