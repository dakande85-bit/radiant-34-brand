/// <reference types="node" />

export type ReviewRecord = {
  id?: string;
  product_handle: string;
  shopify_product_id?: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  title?: string;
  body: string;
  verified_purchase?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  approved_at?: string | null;
  order_reference?: string;
};

export const reviewsConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseUrl = () => process.env.SUPABASE_URL?.replace(/\/$/, '') ?? '';

export async function supabaseRequest(path: string, init: RequestInit = {}) {
  if (!reviewsConfigured()) {
    return {
      ok: false,
      status: 503,
      json: async () => ({ error: 'Reviews are temporarily unavailable' }),
    } as Response;
  }

  return fetch(`${supabaseUrl()}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
  });
}

export function publicReview(review: ReviewRecord) {
  return {
    id: review.id,
    product_handle: review.product_handle,
    rating: review.rating,
    title: review.title,
    body: review.body,
    customer_name: review.customer_name,
    verified_purchase: Boolean(review.verified_purchase),
    created_at: review.created_at,
  };
}
