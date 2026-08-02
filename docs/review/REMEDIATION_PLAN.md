# Remediation Plan

## 1. P0 Containment

- Findings: R34-P0-001
- Files: `api/shopify-storefront.ts`, `src/main.tsx`, tests
- Owner: Commerce/server engineer
- Complexity: Medium
- Dependencies: Shopify test fixtures
- Acceptance: Admin variants never returned as `storefrontVariantId`
- Automated tests: Admin-only variant fixture
- Manual tests: Storefront unpublished product does not show checkout buttons
- Rollback: Revert proxy mapping commit

## 2. Product And Variant Integrity

- Findings: R34-P0-001, R34-P2-001
- Files: Shopify proxy, product transforms, brand/image manifests
- Owner: Ecommerce architect
- Complexity: Large
- Dependencies: Stable product fixtures
- Acceptance: Stable handle/ID identity, all selected options matched
- Tests: Variant matrix, product-not-found, price/currency
- Rollback: Feature flag new product mapper

## 3. Cart And Checkout Integrity

- Findings: R34-P1-002
- Files: `src/lib/shopify.ts`, cart drawer, shop cards, CSS
- Owner: Commerce/frontend engineer
- Complexity: Medium
- Acceptance: Buttons visible, checkout host allowlisted, rapid click safe
- Tests: Add, update, remove, Buy Now, expired cart
- Rollback: Restore previous cart module only if invariant tests pass

## 4. Routing And Application Ownership

- Findings: R34-P1-001
- Files: `index.html`, `public/*.js`, React routes
- Owner: Frontend architect
- Complexity: Large
- Acceptance: React owns route/nav/page DOM; patch scripts removed
- Tests: Browser route/back/direct refresh smoke
- Rollback: Remove migrated route one at a time

## 5. Security

- Findings: R34-P1-003, R34-P1-005
- Files: API routes/debug/admin
- Owner: Security/server engineer
- Complexity: Medium
- Acceptance: Allowlisted operations, protected debug/admin, validation/rate limits
- Tests: unauthorized/unknown/oversized requests rejected
- Rollback: Disable debug/admin endpoints

## 6. Authentication

- Findings: R34-P1-004
- Files: `public/customer-account.js`, `api/auth/*`
- Owner: Auth engineer
- Complexity: Large
- Acceptance: No refresh token in localStorage, provider config proven
- Tests: callback, refresh, logout, expired sessions
- Rollback: Disable account UI

## 7. Removal Of Mutation Patch Layer

- Findings: R34-P1-001
- Files: `public/*.js`, `index.html`
- Owner: Frontend architect
- Complexity: Large
- Acceptance: No MutationObserver controls commerce/nav/page content
- Tests: no post-render DOM mutation on product cards
- Rollback: One patch migration per PR

## 8-14. Follow-On Work

Mobile correctness, accessibility, automated testing, performance, SEO, monitoring and production release controls follow after commerce/security containment. Each needs owner preview, automated coverage and rollback criteria before production approval.
