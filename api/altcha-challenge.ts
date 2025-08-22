import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateChallenge } from 'altcha';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const secretKey = process.env.ALTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('ALTCHA_SECRET_KEY is not set in environment variables.');
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    const challenge = await generateChallenge({ secret: secretKey });
    return res.status(200).json(challenge);
  } catch (error) {
    console.error('Error generating Altcha challenge:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during challenge generation' });
  }
}