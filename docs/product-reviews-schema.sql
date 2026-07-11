create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_handle text not null,
  shopify_product_id text,
  customer_name text not null,
  customer_email text not null,
  rating integer check (rating between 1 and 5),
  title text,
  body text not null,
  verified_purchase boolean default false,
  status text default 'pending',
  created_at timestamptz default now(),
  approved_at timestamptz,
  order_reference text
);

create index if not exists product_reviews_product_status_idx
  on product_reviews (product_handle, status);

create index if not exists product_reviews_status_created_idx
  on product_reviews (status, created_at desc);

-- Required Vercel environment variables:
-- SUPABASE_URL
-- SUPABASE_SERVICE_ROLE_KEY
-- ADMIN_REVIEW_KEY
