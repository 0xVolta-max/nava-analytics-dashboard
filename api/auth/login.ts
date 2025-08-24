import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
const { verifyChallenge } = require('altcha');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const altchaSecret = process.env.ALTCHA_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey || !altchaSecret) {
  throw new Error('Missing required environment variables for Supabase or Altcha.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, altchaPayload } = req.body;

  if (!email || !password || !altchaPayload) {
    return res.status(400).json({ error: 'Email, password, and altchaPayload are required.' });
  }

  // 1. Verify Altcha challenge
  const altchaResult = await verifyChallenge(altchaPayload, altchaSecret);
  if (!altchaResult.verified) {
    console.error('Altcha verification failed:', altchaResult.error);
    return res.status(401).json({ error: 'CAPTCHA verification failed.' });
  }

  // 2. Authenticate with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (!data.session) {
      return res.status(401).json({ error: 'Authentication failed, no session returned.' });
  }

  // 3. Return session data
  return res.status(200).json({ session: data.session });
}
