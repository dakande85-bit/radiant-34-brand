/// <reference types="node" />

import { customerAuthConfigured } from './_supabaseAuth.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.SUPABASE_URL?.replace(/\/$/, '') ?? '';
  return res.status(200).json({
    configured: customerAuthConfigured(),
    supabaseUrl: customerAuthConfigured() ? url : '',
    providers: ['google', 'facebook'],
  });
}
