# Radiant 34 Root Cause Audit

Scope: read-only audit of commit `75d9f6b0ff56bf1c61988cd9b2c03e59ca9d757e`.

## Confirmed Root Causes

### 1. Public patch layer owns React-rendered commerce UI

- File path: `index.html`
- Script area: head and body public script includes
- Relevant line range: `index.html:30-78`
- Technical explanation: `index.html` loads React plus many independent public scripts and CSS files. These scripts run outside React but target the same DOM nodes React renders for routing, navigation, shop cards, product galleries, mission pages, and account controls.
- Customer impact: UI can change after React render, producing cards that render but cannot be clicked, hidden buttons, overwritten titles, or route state that does not match the URL.
- Severity: Critical
- Recommended permanent repair: Move retained behavior into React/TypeScript components and remove DOM-mutating public patches from `index.html`.

### 2. Shop action buttons are hidden by loaded CSS

- File path: `public/shop-grid-integrity.css`
- Script/component: shop grid integrity CSS
- Relevant line range: `public/shop-grid-integrity.css:44-45`
- Technical explanation: `.shop-page .shopify-card__actions { display: none !important; }` hides the React-rendered Quick Add and Buy Now action area.
- Customer impact: Customers can see product cards but may not see or use commerce actions.
- Severity: Critical
- Recommended permanent repair: Remove this override and make the React card layout responsible for visible actions.

### 3. Category and card state is controlled outside React

- File path: `public/shop-catalog-sync-v2.js`
- Script/component: category chooser and card normalizer
- Relevant line range: `public/shop-catalog-sync-v2.js:136-172`, `252-290`, `371-387`
- Technical explanation: The script rewrites product title/category/description text, inserts category UI with `innerHTML`, clicks the React filter button programmatically, hides cards with inline `display:none !important`, intercepts category clicks in capture phase, and runs through a `MutationObserver`.
- Customer impact: React state and actual visible DOM can diverge. Product counts, filters, and visible cards may not match the product data in React.
- Severity: Critical
- Recommended permanent repair: Implement category cards and filtering in React using Shopify product data, then remove this script.

### 4. Admin variant IDs can still become checkout IDs

- File path: `api/shopify-storefront.ts`
- Function/component: `toStorefrontProduct`
- Relevant line range: `api/shopify-storefront.ts:211-247`
- Technical explanation: `checkoutVariant` is set to the first Storefront available variant, but falls back to an Admin variant when no Storefront variant is found and the Admin variant reports `availableForSale`.
- Customer impact: Cart mutations can receive a `gid://shopify/ProductVariant/...` visible to Admin but not Storefront checkout, causing Shopify to reject checkout with a merchandise-not-found error.
- Severity: Critical
- Recommended permanent repair: Set `storefrontVariantId` and `canCheckout` only from Storefront product/variant validation. Keep `adminVariantId` separate and never use it for cart.

### 5. Product page gallery is rewritten after React render

- File path: `public/shopify-live-sync.js`
- Script/component: live Shopify sync patch
- Relevant line range: `public/shopify-live-sync.js:96-123`, `143-152`
- Technical explanation: The script monkey-patches `window.fetch`, captures Shopify product payloads, then replaces `.product-gallery` with `innerHTML`.
- Customer impact: Product pages can show images or gallery order not controlled by React, and updates can race direct product loading.
- Severity: High
- Recommended permanent repair: Pass Shopify gallery data through React state and remove post-render gallery replacement.

### 6. Navigation is rewritten and click-intercepted outside React

- File path: `public/menu-fixes.js`
- Script/component: menu fixes
- Relevant line range: `public/menu-fixes.js:5-18`, `35-94`, `101-109`
- Technical explanation: This script removes links/buttons by label, changes Get Drop Alert to Contact, injects Contact, intercepts Shop clicks in capture phase, calls `window.location.assign('/shop')`, and observes the document.
- Customer impact: Header/menu behavior can differ between React state, URL, and actual DOM. Browser Back and mobile menu behavior can be inconsistent.
- Severity: High
- Recommended permanent repair: Delete the patch after implementing final nav labels and routes in `Header`.

### 7. Mission page can replace the entire React main tree

- File path: `public/mission-support.js`
- Script/component: mission support patch
- Relevant line range: `public/mission-support.js:189-212`, `218-260`, `275-283`
- Technical explanation: The script injects mission navigation, pushes history manually, and uses `main.innerHTML` to replace React-rendered content on `/mission`.
- Customer impact: React app state and DOM become unsynchronized, especially after browser Back or navigation from mission to product/shop.
- Severity: High
- Recommended permanent repair: Keep mission content in React and remove this script.

## Highly Likely Contributing Factors

- `index.html:30-51`, `public/contact-page-upgrade.js:102-118`, `src/main.tsx:1789-1839`, `public/mission-support.js:189-191`, and `public/menu-fixes.js:5-9` all participate in routing/history events.
- `public/shop-hover-mockups.js:22-60` adds or changes hover images based on visible title text, after React has already selected images.
- `public/product-page-content-fix.js:40-75` rewrites product gallery and detail copy for a specific product path after React render.
- `src/main.tsx:1087-1125` filters products to `product.canCheckout || product.storefrontVariantId`, so catalogue visibility depends on checkout validation rather than Shopify active product presence.
- `vercel.json:4-14` redirects `/drop-001` to `/shop` while React still defines a `/drop-001` page.
- Multiple CSS files loaded by `index.html` use `!important` heavily against product and route selectors.

## Suspected Issues Requiring Runtime Evidence

- Product-page Back behavior may send users to `/drop-001`, which Vercel production redirects to `/shop`; browser behavior needs production testing.
- Cart drawer checkout may work if cart creation used Storefront-valid IDs, but no live checkout redirect was performed in this phase.
- Google and Facebook sign-in may appear in UI, but provider redirects require Supabase configuration evidence.
- Direct product URL refresh should route through the SPA rewrite, but actual production behavior was not verified in browser.
- Mobile menu likely opens/closes through React plus `public/mobile-menu-fix.js`; runtime inspection is needed for focus, scroll lock, and route-close behavior.

## Disproven Theories

- The project is not failing to compile locally: `npm run build` passed.
- Frontend code does not expose `SHOPIFY_CLIENT_SECRET`; Shopify server credentials are read in API routes.
- There is not currently a tracked diff from recovery branch to `origin/main`.

## Unavailable Evidence

- Production browser screenshots and incognito checkout test were not run.
- Live `/api/shopify-debug` response was not fetched from production.
- Shopify publication/channel state and fulfilment routing were not available.
- Vercel environment variable values and production alias state were not inspected.
