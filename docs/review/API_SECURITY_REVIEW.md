# API And Server Security Review

## Route Inventory

- Shopify: `_shopifyAuth.ts`, `shopify-token.ts`, `shopify-storefront.ts`, `shopify-debug.ts`
- Auth: `auth/config.ts`, `auth/session.ts`, `auth/refresh.ts`, `auth/_supabaseAuth.ts`
- Reviews: `reviews/index.ts`, `summary.ts`, `eligibility.ts`, `admin.ts`, `_purchase.ts`, `_supabase.ts`

## Security Findings

| Severity | Finding | Evidence |
| --- | --- | --- |
| P1 | Public arbitrary Storefront GraphQL proxy | `api/shopify-storefront.ts:365-430` accepts query string and forwards unexpected operations. |
| P1 | Admin variant fallback can corrupt checkout capability | `api/shopify-storefront.ts:211-247`. |
| P1 | Weak review admin access model | `/admin/reviews` client route and API key header model. |
| P2 | Debug endpoints expose operational state | `api/shopify-debug.ts` returns env existence, product titles/handles, status and cart test details. |
| P2 | No rate limiting/body-size/schema validation in route code | All public API routes. |
| P2 | Error logging may include provider errors/product IDs | Shopify/Supabase console logging. |

## Secrets

Server secrets are read from `process.env`; no secret values were printed. `SHOPIFY_CLIENT_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` remain server-side in code, but debug routes expose whether they exist.

## Required Remediation

Allowlist operations, validate inputs, add rate limiting, protect debug/admin routes, sanitize errors, and implement structured logging with redaction.
