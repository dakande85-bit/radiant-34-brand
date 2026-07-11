/// <reference types="node" />

import { publicReview, reviewsConfigured, supabaseRequest, type ReviewRecord } from './_supabase.js';

const submissions = new Map<string, number[]>();

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 3) return true;
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

export default async function handler(req: any, res: any) {
  if (!reviewsConfigured()) {
    if (req.method === 'GET') return res.status(200).json({ unavailable: true, reviews: [] });
    return res.status(200).json({ unavailable: true, error: 'Reviews are temporarily unavailable' });
  }

  if (req.method === 'GET') {
    const productHandle = String(req.query?.product_handle ?? req.query?.productHandle ?? '').trim();
    if (!productHandle) return res.status(400).json({ error: 'product_handle is required' });

    const response = await supabaseRequest(
      `product_reviews?product_handle=eq.${encodeURIComponent(productHandle)}&status=eq.approved&order=created_at.desc`,
      { method: 'GET' },
    );
    const body = await response.json().catch(() => []);
    if (!response.ok) return res.status(response.status).json({ error: 'Reviews are temporarily unavailable' });
    return res.status(200).json({ reviews: (body as ReviewRecord[]).map(publicReview) });
  }

  if (req.method === 'POST') {
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0];
    if (rateLimited(ip)) return res.status(429).json({ error: 'Please wait before submitting another review.' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
    const productHandle = String(body.product_handle ?? '').trim();
    const customerName = String(body.customer_name ?? '').trim();
    const customerEmail = String(body.customer_email ?? '').trim().toLowerCase();
    const rating = Number(body.rating);
    const reviewBody = String(body.body ?? '').trim();
    const title = String(body.title ?? '').trim();
    const orderReference = String(body.order_reference ?? '').trim();

    if (!productHandle || !customerName || !isValidEmail(customerEmail)) {
      return res.status(400).json({ error: 'Name, email, and product are required.' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    if (reviewBody.length < 10 || reviewBody.length > 2000) {
      return res.status(400).json({ error: 'Review must be between 10 and 2000 characters.' });
    }

    const review: ReviewRecord = {
      product_handle: productHandle,
      shopify_product_id: body.shopify_product_id ? String(body.shopify_product_id) : undefined,
      customer_name: customerName,
      customer_email: customerEmail,
      rating,
      title: title || undefined,
      body: reviewBody,
      verified_purchase: false,
      status: 'pending',
      order_reference: orderReference || undefined,
    };

    const response = await supabaseRequest('product_reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) return res.status(response.status).json({ error: 'Reviews are temporarily unavailable' });
    return res.status(201).json({ ok: true, review: Array.isArray(payload) ? publicReview(payload[0]) : null });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
