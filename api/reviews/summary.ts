/// <reference types="node" />

import { reviewsConfigured, supabaseRequest, type ReviewRecord } from './_supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!reviewsConfigured()) {
    return res.status(200).json({ unavailable: true, error: 'Reviews are temporarily unavailable', summaries: {} });
  }

  const response = await supabaseRequest(
    'product_reviews?status=eq.approved&select=product_handle,rating',
    { method: 'GET' },
  );
  const body = await response.json().catch(() => []);
  if (!response.ok) return res.status(response.status).json({ error: 'Reviews are temporarily unavailable', summaries: {} });

  const summaries = (body as Pick<ReviewRecord, 'product_handle' | 'rating'>[]).reduce<Record<string, { total: number; count: number; averageRating: number; reviewCount: number }>>((acc, review) => {
    if (!review.product_handle) return acc;
    const entry = acc[review.product_handle] ?? { total: 0, count: 0, averageRating: 0, reviewCount: 0 };
    entry.total += Number(review.rating) || 0;
    entry.count += 1;
    entry.reviewCount = entry.count;
    entry.averageRating = Number((entry.total / entry.count).toFixed(1));
    acc[review.product_handle] = entry;
    return acc;
  }, {});

  return res.status(200).json({
    summaries: Object.fromEntries(
      Object.entries(summaries).map(([handle, summary]) => [
        handle,
        { averageRating: summary.averageRating, reviewCount: summary.reviewCount },
      ]),
    ),
  });
}
