# Incident Timeline

This timeline distinguishes the current recovery branch from pre-rollback comparison commits. A successful Vercel build does not prove functional storefront stability.

## Current Recovery Head

### `75d9f6b0ff56bf1c61988cd9b2c03e59ca9d757e`

- Subject: `Trigger fresh production deployment from restored storefront`
- Parent: `b3d9ec8b8b21534909b7f85c877522509af1dc82`
- Files changed: `index.html`
- Intended purpose: force a fresh production deployment by adding a restore marker comment.
- Likely regressions: none from the comment itself.
- Page loading: no direct change.
- Cart: no direct change.
- Checkout: no direct change.
- Navigation: no direct change.
- Authentication: no direct change.
- Vercel production behavior: likely intended to trigger a new build only.

### `b3d9ec8b8b21534909b7f85c877522509af1dc82`

- Subject: `Use Shopify image order for Fearfully and Wonderfully dress`
- Parent: `bb7f361c5e65a01ab7bf7c8de13317951d5722d0`
- Files changed: `src/data/brandOverrides.ts`
- Intended purpose: use Shopify image order for the dress by setting `useShopifyImages: true` and removing hardcoded dress image/gallery overrides.
- Likely regressions: dress product imagery became dependent on Shopify image order and any public post-render gallery scripts.
- Page loading: no direct change.
- Cart: no direct change.
- Checkout: no direct change.
- Navigation: no direct change.
- Authentication: no direct change.
- Vercel production behavior: no direct change beyond rebuilt assets.

## Pre-Rollback Comparison Commits

These commits exist in the repository but are not ancestors of current `HEAD`.

### `00e2bac8fc8f0642658daa420e877d514ab86dfc`

- Subject: `Restore reliable Buy Now checkout and bound Shopify request time`
- Files changed: `src/lib/shopify.ts`
- Intended purpose: add request timeout and convert Buy Now to a native Shopify cart checkout URL.
- Likely regressions: Buy Now and Add to Cart used different commerce paths; cart version changed from `2` to `3`, invalidating stored carts; numeric variant parsing made Buy Now dependent on variant ID shape.
- Page loading: no direct change.
- Cart: affected persistent cart versioning and request timeout.
- Checkout: affected Buy Now by bypassing Storefront `cartCreate`.
- Navigation: no direct change.
- Authentication: no direct change.
- Vercel production behavior: would change client bundle behavior if deployed.

### `bfeef23d5968d7ae88f381e49bb222cc259cd3cc`

- Subject: `Speed up product pages and prevent stalled Shopify requests`
- Files changed: `api/shopify-storefront.ts`
- Intended purpose: add API request timeout and product cache.
- Likely regressions: removed per-handle Storefront validation and mapped product details from Admin data only, increasing risk that Admin variants appear checkout-enabled.
- Page loading: affected product direct loading and timeout behavior.
- Cart: could affect which variants the client receives.
- Checkout: could re-enable Admin-only variants.
- Navigation: no direct change.
- Authentication: no direct change.
- Vercel production behavior: would affect serverless API responses if deployed.

### `ebcc7bea4db306dc503595b6f82c3d80d18f2d84`

- Subject: `Document current launch hotfixes and remaining blockers`
- Parent: `b7c5df7fd95618756bf903c63b1d8c0dea7b92c1`
- Files changed: `docs/launch-hotfixes-2026-08-01.md`
- Intended purpose: document hotfix status and blockers.
- Likely regressions: none directly; documentation identified unresolved blockers around Buy Now/cart unification and MutationObserver patches.
- Page loading: no direct change.
- Cart: no direct change.
- Checkout: no direct change.
- Navigation: no direct change.
- Authentication: no direct change.
- Vercel production behavior: no direct app behavior change.

## Observed Pattern

The current incident is not explained by a single TypeScript change. The storefront accumulated a public patch layer that kept adding DOM corrections after React rendered. That made local source truth, live DOM truth, and production deployment truth easy to confuse.
