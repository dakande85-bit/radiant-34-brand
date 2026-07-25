/// <reference types="node" />

import { getAuthenticatedCustomer } from '../auth/_supabaseAuth.js';
import { publicReview, reviewsConfigured, supabaseRequest, type ReviewRecord } from './_supabase.js';
import { verifyPaidProductPurchase } from './_purchase.js';

const submissions = new Map<string, number[]>();

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
    return res.status(503).json({ unavailable: true, error: 'Reviews are temporarily unavailable' });
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

    const customer = await getAuthenticatedCustomer(req);
    if (!customer) return res.status(401).json({ error: 'Please sign in before leaving a review.' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
    const productHandle = String(body.product_handle ?? '').trim();
    const rating = Number(body.rating);
    const reviewBody = String(body.body ?? '').trim();
    const title = String(body.title ?? '').trim();

    if (!productHandle) return res.status(400).json({ error: 'Product is required.' });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    if (reviewBody.length < 10 || reviewBody.length > 2000) {
      return res.status(400).json({ error: 'Review must be between 10 and 2000 characters.' });
    }

    let purchase;
    try {
      purchase = await verifyPaidProductPurchase(customer.email, productHandle);
    } catch (error) {
      return res.status(503).json({
        error: error instanceof Error ? error.message : 'Purchase verification is temporarily unavailable.',
      });
    }

    if (!purchase.verified) {
      return res.status(403).json({ error: 'Only customers who purchased this product can leave a review.' });
    }

    const duplicateResponse = await supabaseRequest(
      `product_reviews?product_handle=eq.${encodeURIComponent(productHandle)}&customer_email=eq.${encodeURIComponent(customer.email)}&status=in.(pending,approved)&limit=1`,
      { method: 'GET' },
    );
    const duplicates = await duplicateResponse.json().catch(() => []);
    if (duplicateResponse.ok && Array.isArray(duplicates) && duplicates.length) {
      return res.status(409).json({ error: 'You have already submitted a review for this product.' });
    }

    const review: ReviewRecord = {
      product_handle: productHandle,
      shopify_product_id: body.shopify_product_id ? String(body.shopify_product_id) : undefined,
      customer_name: customer.name,
      customer_email: customer.email,
      rating,
      title: title || undefined,
      body: reviewBody,
      verified_purchase: true,
      status: 'pending',
      order_reference: purchase.orderReference,
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
