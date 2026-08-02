# Review Findings Register

## R34-P0-001

ID: R34-P0-001
Severity: P0
Category: Commerce / Shopify variants
Status: CONFIRMED
File: `api/shopify-storefront.ts`
Line range: `211-247`
Function/component: `toStorefrontProduct`
Evidence: `checkoutVariant` falls back from Storefront variants to `adminVariant` and then assigns `storefrontVariantId: checkoutVariant?.id`.
Technical explanation: Admin variants can exist while unavailable to the Storefront API/cart. A cart merchandise ID must be a Storefront-visible `ProductVariant` GID. The current mapping can label Admin-only variants as checkout-capable when Storefront validation returns no available variant.
Customer impact: Customer can click Buy Now/Add to Cart and receive a Shopify merchandise-not-found failure or be unable to check out.
Business impact: Direct revenue loss and failed paid traffic conversion.
Exploit/failure scenario: Product is active in Admin but unpublished or unavailable in Storefront; server returns Admin variant as `storefrontVariantId`; cartCreate rejects it.
Recommended remediation: Keep `adminVariantId` informational only. Set `storefrontVariantId` and `canCheckout` exclusively from Storefront product publication plus available variant validation.
Required test: API unit/integration test where Admin product has an available variant but Storefront product is null; assert `canCheckout:false` and no `storefrontVariantId`.
Release blocking: Yes.
Confidence: High.

## R34-P1-001

ID: R34-P1-001
Severity: P1
Category: Architecture / DOM ownership
Status: CONFIRMED
File: `index.html`, `public/*.js`, `src/main.tsx`
Line range: `index.html:30-77`, `public/shop-catalog-sync-v2.js:237-404`, `public/shopify-live-sync.js:96-143`, `src/main.tsx:1763-1918`
Function/component: Application bootstrap and public patch layer
Evidence: 20 tracked public scripts exist; several use `MutationObserver`, `innerHTML`, `querySelector`, `pushState`, and `popstate` against React-rendered nodes.
Technical explanation: React and non-React scripts both own the same DOM for navigation, product cards, category filters, product galleries, contact, mission, and customer account. Mutation scripts can rewrite DOM after React reconciliation.
Customer impact: Product cards, navigation, galleries, and buttons can change after render and behave inconsistently across devices.
Business impact: Unstable shop experience and high regression risk for every launch change.
Exploit/failure scenario: React renders a correct product card, then a public script rewrites the image/title/filter state or hides it with inline style.
Recommended remediation: Move retained behavior into React source, remove public mutation scripts from `index.html`, and make React the single owner of rendered UI.
Required test: Browser smoke test asserting no public MutationObserver changes product card image/title/action sources after initial render.
Release blocking: Yes.
Confidence: High.

## R34-P1-002

ID: R34-P1-002
Severity: P1
Category: Cart / Purchase controls
Status: CONFIRMED
File: `public/shop-grid-integrity.css`
Line range: `44-45`
Function/component: Shop grid CSS
Evidence: `.shop-page .shopify-card__actions { display: none !important; }`
Technical explanation: CSS can hide React-rendered purchase controls regardless of product checkout state.
Customer impact: Customers may not see Quick Add or Buy Now.
Business impact: Purchase path blocked.
Exploit/failure scenario: Product has valid Storefront variant, React renders buttons, CSS hides the entire action row.
Recommended remediation: Remove commerce-control visibility from patch CSS; make button rendering and visibility explicit in React.
Required test: Product card with checkout-capable variant must expose accessible Quick Add and Buy Now buttons on desktop and mobile.
Release blocking: Yes.
Confidence: High.

## R34-P1-003

ID: R34-P1-003
Severity: P1
Category: API security
Status: CONFIRMED
File: `api/shopify-storefront.ts`
Line range: `365-430`
Function/component: `/api/shopify-storefront`
Evidence: Route accepts arbitrary `query` and `variables`, forwards non-product operations to Storefront GraphQL, and has no operation allowlist, schema validation, rate limit, or body-size control in code.
Technical explanation: A public serverless endpoint can be abused as a Shopify GraphQL proxy. Even if secrets are not exposed, the endpoint can generate cost, enumerate data, or amplify traffic.
Customer impact: Storefront instability under abuse; degraded product/cart performance.
Business impact: Higher Shopify/Vercel usage, possible outage, incident response burden.
Exploit/failure scenario: Bot repeatedly posts expensive or unexpected Storefront queries through the proxy.
Recommended remediation: Allowlist named operations used by the frontend, validate variables, enforce request size, add rate limiting/abuse controls, and set explicit cache/error policy.
Required test: Unknown operation returns 400; oversized body returns 413; valid cart/product operations still pass.
Release blocking: Yes.
Confidence: High.

## R34-P1-004

ID: R34-P1-004
Severity: P1
Category: Authentication
Status: CONFIRMED
File: `public/customer-account.js`
Line range: `13-31`, `37-51`, `251-284`
Function/component: Customer account script
Evidence: OAuth `access_token` and `refresh_token` are parsed from URL hash and stored in `localStorage` under `radiant34CustomerSession`.
Technical explanation: Refresh tokens in JavaScript-accessible localStorage increase blast radius of any XSS or malicious third-party script. Callback fragment is removed with `replaceState`, but tokens still persist client-side.
Customer impact: Customer account session theft if XSS occurs.
Business impact: Privacy/security incident risk.
Exploit/failure scenario: Injected script reads localStorage and exfiltrates Supabase refresh token.
Recommended remediation: Use secure server-managed session cookies or Supabase PKCE flow with careful storage strategy; avoid persistent refresh tokens in localStorage.
Required test: Auth callback does not persist refresh token in localStorage; session expires and refreshes through secure server flow.
Release blocking: Yes for account launch.
Confidence: High.

## R34-P1-005

ID: R34-P1-005
Severity: P1
Category: Reviews admin security
Status: HIGHLY LIKELY
File: `src/main.tsx`, `api/reviews/admin.ts`
Line range: `src/main.tsx:1670-1727`, `api/reviews/admin.ts:1-90`
Function/component: `/admin/reviews` page and admin reviews API
Evidence: Admin UI is reachable as a client route; API protection appears to rely on a shared `X-Admin-Review-Key` header, with no user identity or role model.
Technical explanation: Shared secret admin controls are weaker than authenticated authorization and are vulnerable to leakage/reuse.
Customer impact: Review moderation could be abused if key leaks.
Business impact: Brand trust and review integrity risk.
Exploit/failure scenario: Any party with the static key approves/rejects reviews.
Recommended remediation: Require authenticated admin identity, role authorization, audit logging, and rate limiting.
Required test: Unauthenticated, missing role, and wrong key requests are denied; authorized admin action is logged.
Release blocking: Yes for public admin use.
Confidence: Medium.

## R34-P2-001

ID: R34-P2-001
Severity: P2
Category: React / Maintainability
Status: CONFIRMED
File: `src/main.tsx`
Line range: `1-1919`
Function/component: Entire React application
Evidence: Single file contains routing, header, pages, product card, product page, reviews, shop, cart drawer, auth-adjacent admin page, and utility transforms.
Technical explanation: Oversized component module mixes domains and makes change safety poor.
Customer impact: Higher chance of regressions in unrelated features.
Business impact: Slower incident recovery and launch iteration.
Exploit/failure scenario: Header/shop fix unintentionally changes product route state because responsibilities are coupled.
Recommended remediation: Split into route components, commerce domain hooks, cart provider, product transforms, and page modules.
Required test: Route/component-level tests for extracted units.
Release blocking: No, but required before major feature expansion.
Confidence: High.

## R34-P2-002

ID: R34-P2-002
Severity: P2
Category: TypeScript
Status: CONFIRMED
File: `api/**/*.ts`, `src/main.tsx`, `src/lib/shopify.ts`
Line range: Multiple; see `docs/review/raw-quality-gate-output.txt`
Function/component: API handlers and client commerce code
Evidence: `npm run lint` fails with 43 errors and 1 warning, including many `Unexpected any`, React compiler hook errors, unused symbols, and caught-error preservation issues.
Technical explanation: Type coverage and hook correctness are not at production gate quality.
Customer impact: Runtime edge cases less likely to be caught before deployment.
Business impact: Increased defect rate.
Exploit/failure scenario: API request shape changes and `any` handler accepts invalid input without compile-time pressure.
Recommended remediation: Type Vercel request/response contracts, model API bodies, fix React hook errors, and enforce lint in CI.
Required test: CI lint must pass before preview/prod deploy.
Release blocking: Yes for production approval gate, but not an immediate containment P0.
Confidence: High.

## R34-P2-003

ID: R34-P2-003
Severity: P2
Category: SEO
Status: CONFIRMED
File: `index.html`, `src/main.tsx`, `vercel.json`
Line range: `index.html:8-25`, `src/main.tsx:75-86`, `vercel.json:3-24`
Function/component: Metadata/routing
Evidence: SPA has global meta tags only; page titles change client-side; no tracked `sitemap.xml`, `robots.txt`, canonical links, product structured data, or server-rendered product metadata found.
Technical explanation: Product routes are not independently described to crawlers/social previews before JS execution.
Customer impact: Poor product discoverability and social sharing previews.
Business impact: Lower organic acquisition.
Exploit/failure scenario: `/products/radiant-scripture-tough-case` shares with generic homepage metadata.
Recommended remediation: Add route-aware metadata/structured data generation or SSR/prerender strategy, sitemap, robots, canonical URLs.
Required test: Product route HTML/meta snapshot validates title, description, canonical, OG image, and Product JSON-LD.
Release blocking: No for checkout, yes for marketing launch quality.
Confidence: High.

## R34-P2-004

ID: R34-P2-004
Severity: P2
Category: Dependency management
Status: CONFIRMED
File: `package.json`
Line range: `1-30`
Function/component: Dependencies
Evidence: Several dependencies use `latest`; `npm audit --json` exits 1 and `npm ci` reports 2 high severity vulnerabilities.
Technical explanation: Floating ranges reduce reproducibility for future installs and vulnerabilities are unresolved.
Customer impact: Build drift and security exposure risk over time.
Business impact: Release unpredictability.
Exploit/failure scenario: Fresh install resolves a new breaking dependency version.
Recommended remediation: Pin deliberate versions, review audit findings, update through tested PRs.
Required test: Clean install/build/e2e on CI with lockfile unchanged.
Release blocking: Medium; audit findings need review before production approval.
Confidence: High.

## R34-P2-005

ID: R34-P2-005
Severity: P2
Category: Observability
Status: NOT IMPLEMENTED
File: Repository-wide
Line range: Not applicable
Function/component: Monitoring/error tracking
Evidence: No Sentry, OpenTelemetry, uptime checks, synthetic checkout checks, alert rules, or runbooks found in tracked files.
Technical explanation: Production failures are unlikely to be detected automatically beyond platform logs.
Customer impact: Broken checkout/product pages can persist until customer reports.
Business impact: Revenue loss and slow incident response.
Exploit/failure scenario: Shopify proxy starts returning 500s; no alert is emitted.
Recommended remediation: Add client error reporting, server structured logs/correlation IDs, uptime checks, synthetic product/cart/checkout smoke.
Required test: Simulated proxy failure creates alert/test failure.
Release blocking: No for remediation branch, yes for mature production operations.
Confidence: High.

## R34-P3-001

ID: R34-P3-001
Severity: P3
Category: Repository hygiene
Status: CONFIRMED
File: Working tree
Line range: Not applicable
Function/component: Local workspace
Evidence: Untracked design image/zips and `test-results/` appeared during review; `.vercel`, `dist`, and `node_modules` are ignored.
Technical explanation: Non-source artifacts can confuse release review if accidentally staged.
Customer impact: None directly.
Business impact: Review noise and accidental commit risk.
Exploit/failure scenario: Large generated assets are accidentally committed.
Recommended remediation: Keep workspace clean before release branches; extend `.gitignore` for generated review outputs if needed.
Required test: CI status check fails on unexpected untracked/generated artifacts only where appropriate.
Release blocking: No.
Confidence: High.
