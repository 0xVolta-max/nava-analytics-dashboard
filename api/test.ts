import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      headers: req.headers,
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      message: 'POST request received',
      timestamp: new Date().toISOString(),
      method: req.method,
      body: req.body,
      headers: req.headers,
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
