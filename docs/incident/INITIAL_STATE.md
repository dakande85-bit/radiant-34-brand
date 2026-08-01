# Radiant 34 Initial State

Date captured: 2026-08-01

Complete raw command transcript: `docs/incident/baseline-command-output.txt`.

## Git State

- Current branch: `recovery/storefront-stabilization-2026-08-01`
- Recovery branch SHA: `75d9f6b0ff56bf1c61988cd9b2c03e59ca9d757e`
- Current `origin/main` SHA: `75d9f6b0ff56bf1c61988cd9b2c03e59ca9d757e`
- Local `main` SHA: `f9b76aca38bb2559277fc03d4e8a4a9c9393f4c6`
- Backup branch SHA: `origin/backup/pre-rollback-2026-08-01` at `ebcc7bea4db306dc503595b6f82c3d80d18f2d84`
- `git diff origin/main...HEAD`: no output
- Repository status before audit docs: clean tracked tree with unrelated untracked design assets:
  - `separated-collage-contact-sheet.png`
  - `separated-collage-images.zip`
  - `separated-collage-images/`
  - `separated-designs-2026-07-25.zip`
  - `separated-designs-2026-07-25/`

## Runtime And Dependency State

- `node --version`: `v24.16.0`
- Requested literal `npm --version`: failed under PowerShell execution policy because `npm.ps1` cannot be loaded.
- Operational npm command: `npm.cmd --version` returned `11.13.0`.
- `npm ci`: exit code 0, installed 157 packages, reported 2 high severity vulnerabilities.
- No package-lock change was required by `npm ci`.

## Package Scripts

Available scripts in `package.json`:

- `npm run dev`: `vite`
- `npm run build`: `tsc -b && vite build`
- `npm run preview`: `vite preview`
- `npm run lint`: `eslint .`

Not available:

- `npm run typecheck`
- `npm test`
- `npm run test`

## Baseline Results

- Build: `npm run build` exit code 0. Current commit is locally buildable.
- Lint: `npm run lint` exit code 1. Main categories are explicit `any` in API routes, unused symbols, React hook compiler errors, and caught-error preservation issues.
- TypeScript: `npx tsc --noEmit` exit code 0.
- Tests: no test script exists.

Commit `75d9f6b0ff56bf1c61988cd9b2c03e59ca9d757e` is buildable. It is not proven functionally stable because no runtime browser checkout test was performed during this read-only phase, lint fails, and multiple public scripts can mutate React-rendered commerce UI after render.

## Vercel Summary

- `.vercel/project.json` project name: `radiant-34-brand`
- Project ID: `prj_Vpf79w2J82UYWnzw4u5wGDHCh238`
- Framework: `vite`
- Vercel node version: `24.x`
- `vercel.json` redirects:
  - `/drop-001` and `/drop-001/:path*` permanently redirect to `/shop`.
  - `/cart/:path*` redirects to Shopify cart.
  - `/checkout/:path*` redirects to Shopify checkout.
- `vercel.json` SPA rewrite:
  - `/((?!api/|cart/|checkout/).*)` rewrites to `/index.html`.

## Required Environment Variables

Values were not read or printed.

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_CLIENT_ID`
- `SHOPIFY_CLIENT_SECRET`
- `SHOPIFY_API_VERSION`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` optional in code but referenced
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_REVIEW_KEY`

## Known Production Risks

- Public patch scripts loaded by `index.html` mutate navigation, shop cards, product galleries, mission content, account UI, and category selection outside React.
- `public/shop-grid-integrity.css` hides `.shopify-card__actions` with `display: none !important`, which can make Quick Add and Buy Now unavailable even when React renders them.
- `api/shopify-storefront.ts` still permits Admin variant fallback when Storefront validation does not return a variant.
- Product list rendering filters out products unless `canCheckout` or `storefrontVariantId` is true, so active but unpublished or validation-delayed products can disappear.
- `/drop-001` is both a React page and a Vercel permanent redirect to `/shop`, creating route-contract ambiguity.
- Social auth depends on Supabase environment and provider setup that cannot be verified from the repo alone.
- There are no automated browser tests for shop, product direct routes, cart drawer, Buy Now, checkout redirect, auth callback, or mobile menu.

## Unavailable Access Or Evidence

- No Vercel production deployment was triggered in this phase.
- No production alias, DNS, or `www.radiant34.com` attachment was modified or verified.
- Shopify Admin catalogue, Storefront publication state, checkout, Gelato order routing, and Printful order routing were not modified or proven.
- Google/Facebook provider credentials and Supabase redirect allowlist were not available.
