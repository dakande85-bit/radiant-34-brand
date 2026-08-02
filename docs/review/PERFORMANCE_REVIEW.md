# Performance Review

## Build Output

`npm run build` passed. Vite output:

- `dist/index.html`: 4.12 kB
- CSS asset: 32.83 kB, gzip 6.75 kB
- JS asset: 265.54 kB, gzip 78.01 kB

## Static Performance Risks

- No route-level code splitting; whole app appears bundled as one main JS asset.
- Many render-blocking public CSS files are loaded from `index.html`.
- Many public JS patch scripts are loaded on every route.
- MutationObservers run across document subtree in multiple scripts.
- Product/category scripts perform repeated DOM scans and text classification.
- Large images rely on Shopify CDN/local assets, but image dimensions/optimization strategy is inconsistent.
- No preconnect/preload strategy documented.

## Browser Measurement

Playwright e2e was run locally, but no Lighthouse/Core Web Vitals score was generated. Do not treat this review as a Lighthouse pass.

## Core Web Vitals Readiness

- LCP: At risk from large hero imagery and render-blocking scripts/styles.
- CLS: At risk from post-render DOM injection/category/gallery replacement.
- INP: At risk from MutationObserver activity, large DOM scans, and patch click interception.

## Recommendation

Remove patch scripts, split routes, optimize hero/product media, add preview performance smoke and Lighthouse/CrUX monitoring before production approval.
