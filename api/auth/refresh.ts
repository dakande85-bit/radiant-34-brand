/// <reference types="node" />

import { customerAuthConfigured, refreshCustomerSession } from './_supabaseAuth.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!customerAuthConfigured()) {
    return res.status(503).json({ error: 'Customer sign-in is not configured.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
  const refreshToken = String(body.refresh_token ?? '').trim();
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required.' });

  const session = await refreshCustomerSession(refreshToken);
  if (!session) return res.status(401).json({ error: 'Please sign in again.' });

  return res.status(200).json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    token_type: session.token_type,
  });
}
