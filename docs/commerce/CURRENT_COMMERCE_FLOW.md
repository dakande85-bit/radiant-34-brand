# Current Commerce Flow

Branch: `hotfix/cart-checkout-recovery-2026-08-03`

## Owners

- Product catalogue source: Shopify Admin product list, enriched by Storefront product/variant validation in `api/shopify-storefront.ts`.
- Product branding/media override source: `src/data/brandOverrides.ts` and `src/data/radiantProductImages.ts`.
- Cart API client: `src/lib/shopify.ts`.
- React product cards, product detail, cart drawer: `src/main.tsx`.
- Remaining public DOM scripts: still present and must be audited before this is production-ready. No new MutationObserver was added.

## Product Data To Variant

```mermaid
flowchart TD
  AdminProducts["Shopify Admin active products"] --> Proxy["api/shopify-storefront.ts"]
  StorefrontProducts["Storefront products by handle"] --> Proxy
  Proxy --> Invariant["Only Storefront availableForSale variants may set storefrontVariantId"]
  Invariant --> ReactProduct["src/main.tsx ShopifyProduct"]
  ReactProduct --> Options["Selected Size and Colour"]
  Options --> ExactVariant["Exact Storefront ProductVariant match"]
```

## Add To Cart

```mermaid
flowchart TD
  ExactVariant["Exact selected Storefront variant"] --> Add["addVariantToCart"]
  Add --> Existing["Existing radiant34CartId?"]
  Existing -->|yes| LinesAdd["cartLinesAdd"]
  Existing -->|no| CartCreate["cartCreate"]
  LinesAdd --> Store["storeCart localStorage"]
  CartCreate --> Store
  Store --> Drawer["Cart drawer refresh"]
```

## Buy Now

```mermaid
flowchart TD
  ExactVariant["Exact selected Storefront variant"] --> Buy["buyNowVariant"]
  Buy --> Dedicated["createCart persist=false"]
  Dedicated --> CheckoutUrl["Shopify checkoutUrl from Storefront response"]
  CheckoutUrl --> Redirect["Browser redirect"]
```

## Cart Persistence

```mermaid
flowchart TD
  CartResponse["Shopify cart response"] --> Normalize["normalizeCheckoutUrl"]
  Normalize --> Storage["localStorage radiant34CartId / radiant34CheckoutUrl"]
  Storage --> Refresh["refreshCartCount / getCart"]
  Refresh --> Stale["Clear stale or missing cart"]
```

## Duplicate Or Conflicting Owners

- `public/shop-grid-integrity.css` previously hid React-owned purchase actions. That rule was removed.
- `public/shop-catalog-sync-v2.js`, `public/shopify-live-sync.js`, `public/shop-grid-normalizer.js`, and `public/product-page-content-fix.js` still run on the page and must be removed or migrated before production readiness can be claimed.
- `/api/shopify-storefront` still accepts GraphQL text from the frontend, but now rejects unsupported operations and invalid variant IDs. A stricter enum endpoint remains the better final architecture.
