# Repository Inventory

Baseline branch: `recovery/storefront-stabilization-2026-08-01`

## Counts

- Tracked files: 133
- Source/config/doc files counted: 78
- Public JavaScript patch scripts: 20
- API route/helper TypeScript files: 14
- Test files: 2
- Approximate workspace size including ignored dependencies/builds/assets: 353,535,159 bytes
- Ignored configuration/runtime dirs: `.vercel/`, `dist/`, `node_modules/`
- Untracked files: `docs/review/` during review, `separated-collage-contact-sheet.png`, `separated-collage-images.zip`, `separated-collage-images/`, `separated-designs-2026-07-25.zip`, `separated-designs-2026-07-25/`

## File Inventory

| File/group | Responsibility | Approx size | Owner/domain | Runtime | Dependencies | Duplicate responsibility | Review risk | Recommendation |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| `index.html` | App shell, global metadata, route-class patch, public script loading | Small | Frontend platform | Browser | Vite, public JS/CSS | Bootstrap/routing overlaps React and public scripts | High | Keep as shell only; remove business logic/script patch layer. |
| `src/main.tsx` | Entire React app, routing, pages, product transforms, shop, product detail, cart drawer, reviews admin | Very large | Frontend/app/commerce | Browser | React, local Shopify lib/data | Owns same UI as public scripts | High | Split into route modules, commerce hooks, cart provider and components. |
| `src/lib/shopify.ts` | Client Shopify proxy calls and cart mutations | Medium | Commerce frontend | Browser | Storefront proxy | Cart state also affected by CSS/patches | High | Keep, but add typed errors, checkout URL tests, tab-state strategy. |
| `src/data/products.ts` | Local launch product manifest | Large | Product/content | Browser build | `import.meta.env.BASE_URL` | Duplicates Shopify product source | Medium | Keep only for local branding/fallback content with explicit source-of-truth rules. |
| `src/data/brandOverrides.ts` | Shopify handle to public brand overrides | Medium | Product/content | Browser build | Base URL helper | Product identity/title mappings overlap product transforms and public scripts | High | Use stable Shopify handles/IDs only; no title-based identity. |
| `src/data/radiantProductImages.ts` | Local product image mappings | Small | Product/media | Browser build | Base URL helper | Overlaps Shopify image order/public image patches | Medium | Keep as typed override manifest; remove runtime image rewriting. |
| `src/data/siteAssets.ts` | Page-level imagery | Small | Content | Browser build | Products asset helper | Overlaps homepage image patches | Medium | Make page imagery source-owned in React only. |
| `src/styles.css` | Main app styling | Large | Frontend design | Browser | CSS | Public CSS overrides duplicate/override it | Medium | Consolidate styles and remove behavior-critical CSS. |
| `public/*.js` | Post-render hotfixes for shop/nav/home/contact/mission/account/reviews | Mixed | Legacy patch layer | Browser | DOM APIs | Duplicates React ownership | High | Migrate retained behavior into React and remove from `index.html`. |
| `public/*.css` | Patch-layer styling | Mixed | Legacy patch layer | Browser | CSS | Overrides source styles | Medium/high | Fold into source CSS/components. |
| `api/_shopifyAuth.ts` | Shopify client-credentials token cache | Medium | Server commerce | Vercel function | `process.env`, fetch | Shared by token/storefront/debug/reviews purchase | High | Validate env at startup and keep secrets server-only. |
| `api/shopify-storefront.ts` | Admin-backed product proxy plus Storefront proxy/cart forwarding | Large | Server commerce | Vercel function | Shopify Admin/Storefront | Mixes Admin and Storefront concerns | Critical | Split product read, Storefront validation and cart proxy; allowlist operations. |
| `api/shopify-token.ts` | Token diagnostics route | Small | Server commerce | Vercel function | Shopify auth helper | Debug/config visibility | Medium | Restrict or remove in production. |
| `api/shopify-debug.ts` | Shopify diagnostic endpoint | Large | Server diagnostics | Vercel function | Admin/Storefront APIs | Exposes environment state/product handles | Medium/high | Protect, redact and disable in production. |
| `api/auth/*.ts` | Supabase customer auth config/session/refresh | Small/medium | Server auth | Vercel function | Supabase REST | Public account script handles tokens | High | Replace localStorage token flow with safer session design. |
| `api/reviews/*.ts` | Review CRUD/admin/purchase verification | Medium | Server reviews | Vercel function | Supabase, Shopify Admin | Client review script and React review form overlap | Medium/high | Add typed validation, authz, rate limiting. |
| `vercel.json` | Redirects and SPA rewrite | Small | Hosting | Vercel | Vercel routes | `/drop-001` redirect conflicts with React route | Medium | Align routing contract with React routes. |
| `package.json` / lockfile | Dependency and scripts | Medium | Build | Node/npm | Vite/React/Playwright/ESLint | None | Medium | Pin versions deliberately; resolve audit. |
| `tests/e2e/*.spec.ts` | Browser regression tests | Small | QA | Playwright | Mocked APIs | Limited coverage only | Medium | Expand to commerce/auth/mobile matrix. |
| `docs/**` | Incident and review docs | Medium | Governance | N/A | N/A | N/A | Low | Keep as release audit trail. |

## Static Search Summary

Review searches found extensive use of `MutationObserver`, `pushState`, `replaceState`, `popstate`, `window.location`, `document.querySelector`, `innerHTML`, `localStorage`, `fetch`, `process.env`, `Authorization`, `access_token`, `refresh_token`, `adminVariantId`, `storefrontVariantId`, and `checkoutUrl`. The main evidence is preserved in `docs/review/raw-quality-gate-output.txt`.
