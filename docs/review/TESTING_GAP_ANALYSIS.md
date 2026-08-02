# Testing Gap Analysis

## Current Tests

- `tests/e2e/shop-hover-images.spec.ts`
- `tests/e2e/shop-category-classification.spec.ts`

`npm run test:e2e` passed locally: 4 tests.

## Missing Coverage

- Unit tests: NOT CONFIGURED.
- API route tests: missing.
- Shopify product/variant invariant tests: missing.
- Cart Add to Cart/Buy Now real integration tests: missing.
- Expired cart and multi-tab behavior: missing.
- Product not found/direct route refresh: missing.
- Auth callback/session/refresh/logout: missing.
- Mobile menu and cart drawer keyboard/focus: missing.
- Accessibility automated tests: missing.
- Preview smoke tests: missing.
- Production smoke tests: missing.

## Over-Mocking Risk

Current Playwright tests mock Shopify APIs. They catch UI regressions but cannot prove production Shopify publication, variants, checkout or fulfilment.

## Required Future Matrix

Chromium desktop, Firefox desktop, WebKit desktop, Chromium mobile, WebKit/iPhone viewport.
