import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Missing Turnstile token' });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not set in environment variables.');
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  // Optional: Append remoteip if you want to pass the user's IP for better fraud detection
  // formData.append('remoteip', req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '');

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Turnstile verification failed:', data['error-codes']);
      return res.status(400).json({ success: false, error: 'Turnstile verification failed', errorCodes: data['error-codes'] });
    }
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during verification' });
  }
}