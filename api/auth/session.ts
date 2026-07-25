/// <reference types="node" />

import { customerAuthConfigured, getAuthenticatedCustomer } from './_supabaseAuth.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!customerAuthConfigured()) {
    return res.status(503).json({ error: 'Customer sign-in is not configured.' });
  }

  const customer = await getAuthenticatedCustomer(req);
  if (!customer) return res.status(401).json({ error: 'Your sign-in session has expired.' });

  return res.status(200).json({ customer });
}
