/// <reference types="node" />

import { reviewsConfigured, supabaseRequest } from './_supabase.js';

const authorized = (req: any) => {
  const key = String(req.headers['x-admin-review-key'] ?? '');
  return Boolean(process.env.ADMIN_REVIEW_KEY && key && key === process.env.ADMIN_REVIEW_KEY);
};

export default async function handler(req: any, res: any) {
  if (!reviewsConfigured()) {
    return res.status(503).json({ error: 'Reviews are temporarily unavailable' });
  }
  if (!authorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const status = String(req.query?.status ?? 'pending');
    const response = await supabaseRequest(
      `product_reviews?status=eq.${encodeURIComponent(status)}&order=created_at.desc`,
      { method: 'GET' },
    );
    const body = await response.json().catch(() => []);
    if (!response.ok) return res.status(response.status).json({ error: 'Unable to load reviews' });
    return res.status(200).json({ reviews: body });
  }

  if (req.method === 'PATCH') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
    const id = String(body.id ?? '').trim();
    const action = String(body.action ?? '').trim();
    if (!id || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Review id and action are required' });
    }

    const update = action === 'approve'
      ? { status: 'approved', approved_at: new Date().toISOString() }
      : { status: 'rejected', approved_at: null };
    const response = await supabaseRequest(`product_reviews?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) return res.status(response.status).json({ error: 'Unable to update review' });
    return res.status(200).json({ ok: true, review: Array.isArray(payload) ? payload[0] : null });
  }

  res.setHeader('Allow', 'GET, PATCH');
  return res.status(405).json({ error: 'Method not allowed' });
}
