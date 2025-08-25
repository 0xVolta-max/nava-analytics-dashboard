import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey || !turnstileSecretKey) {
  throw new Error('Missing required environment variables for Supabase or Turnstile.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password, turnstileToken } = req.body;

  if (!email || !password || !turnstileToken) {
    return res.status(400).json({ message: 'Email, password, and turnstileToken are required.' });
  }

  // 1. Verify Turnstile token
  try {
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: turnstileSecretKey,
        response: turnstileToken,
      }),
    });

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      console.error('Turnstile verification failed:', turnstileResult['error-codes']);
      return res.status(401).json({ message: 'CAPTCHA verification failed. Please try again.' });
    }

    console.log('✅ [API/SIGNUP] Turnstile verification successful');
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return res.status(500).json({ message: 'An error occurred during CAPTCHA verification.' });
  }

  // 2. Sign up user with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Supabase signup error:', error.message);
    return res.status(400).json({ message: error.message });
  }

  // Supabase returns a user object on successful sign-up, but the session is null until email confirmation.
  if (!data.user) {
    return res.status(500).json({ message: 'Signup failed, no user data returned.' });
  }

  // 3. Return success message
  console.log(`✅ [API/SIGNUP] User ${email} successfully signed up. Waiting for email confirmation.`);
  return res.status(200).json({ message: 'Signup successful. Please check your email to confirm your account.', user: data.user });
}
