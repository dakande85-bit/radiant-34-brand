# Current Architecture

Commit audited: `75d9f6b0ff56bf1c61988cd9b2c03e59ca9d757e`.

## Browser Rendering Flow

```mermaid
flowchart TD
  Browser["Browser loads index.html"] --> CSS["Public CSS overrides plus src/styles.css"]
  Browser --> Patches["Public JS patches"]
  Browser --> React["React entry src/main.tsx"]
  React --> Components["Header, pages, shop cards, product page, cart drawer"]
  Patches --> DOM["Mutate rendered DOM"]
  CSS --> DOM
  Components --> DOM
```

## Shopify Product-Data Flow

```mermaid
flowchart TD
  ShopPage["ShopifyProducts in src/main.tsx"] --> Proxy["POST /api/shopify-storefront"]
  Proxy --> AdminToken["getShopifyAccessToken from client credentials"]
  AdminToken --> AdminAPI["Shopify Admin GraphQL active products"]
  Proxy --> StorefrontAPI["Storefront GraphQL products for cart validation"]
  AdminAPI --> Mapper["toStorefrontProduct"]
  StorefrontAPI --> Mapper
  Mapper --> Client["Storefront-shaped product list"]
  Client --> Overrides["brandOverrides and radiantProductImages"]
  Overrides --> Cards["React shop cards"]
  Cards --> PublicScripts["Public shop scripts may rewrite cards"]
```

## Cart And Checkout Flow

```mermaid
flowchart TD
  Card["Quick Add / Buy Now"] --> Variant["storefrontVariantId expected"]
  Variant --> Lib["src/lib/shopify.ts"]
  Lib --> Proxy["/api/shopify-storefront"]
  Proxy --> StorefrontCart["Storefront cartCreate/cartLinesAdd/cartLinesUpdate/cartLinesRemove"]
  StorefrontCart --> CartId["radiant34CartId localStorage"]
  StorefrontCart --> CheckoutUrl["Shopify checkoutUrl"]
  CheckoutUrl --> Redirect["Browser redirects to checkout"]
```

Current risk: `api/shopify-storefront.ts` can still derive `storefrontVariantId` from an Admin variant fallback when Storefront validation is unavailable.

## Authentication Flow

```mermaid
flowchart TD
  AccountScript["public/customer-account.js"] --> Config["GET /api/auth/config"]
  Config --> SupabaseEnv["SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY"]
  AccountScript --> ProviderRedirect["Supabase OAuth provider redirect"]
  ProviderRedirect --> Hash["access_token / refresh_token in URL hash"]
  AccountScript --> SessionStore["radiant34CustomerSession localStorage"]
  AccountScript --> SessionAPI["GET /api/auth/session"]
  SessionAPI --> SupabaseUser["Supabase auth/v1/user"]
```

Google and Facebook are listed by `api/auth/config.ts`, but provider readiness depends on external Supabase configuration.

## Routing And History Flow

```mermaid
flowchart TD
  Link["React navigation click"] --> ReactPush["src/main.tsx window.history.pushState"]
  ReactPush --> ReactPage["setPage"]
  BrowserBack["Browser Back"] --> Popstate["popstate"]
  Popstate --> ReactSync["React syncPage"]
  Popstate --> PatchListeners["Public patch listeners"]
  PatchListeners --> DOMMutations["DOM/link/content mutations"]
  VercelRewrite["Vercel SPA rewrite"] --> Index["index.html"]
  VercelRedirect["/drop-001 permanent redirect"] --> Shop["/shop"]
```

Current risk: routing ownership is split between React, public scripts, and Vercel redirects.

## Commercial Function Status

No item below is marked working without runtime evidence.

| Item | Status | Evidence |
| --- | --- | --- |
| Live homepage | UNVERIFIED | Build passed, production not manually tested. |
| Shop page | UNVERIFIED | React renders shop, public patches can hide/mutate UI. |
| Product-page loading | UNVERIFIED | Direct route code exists; production refresh not tested. |
| Product images | UNVERIFIED | Multiple source and post-render image overrides exist. |
| Product variants | UNVERIFIED | Admin and Storefront variant fields are mixed. |
| Add to Cart | UNVERIFIED | Storefront cart code exists; buttons may be hidden by CSS. |
| Cart drawer | UNVERIFIED | React drawer exists; not runtime tested. |
| Cart persistence | UNVERIFIED | `radiant34CartId` localStorage exists; expiry not runtime tested. |
| Quantity update | UNVERIFIED | Mutation exists; not runtime tested. |
| Remove item | UNVERIFIED | Mutation exists; not runtime tested. |
| Buy Now | UNVERIFIED | Uses Storefront cartCreate; no checkout redirect test performed. |
| Checkout redirect | UNVERIFIED | Checkout URL normalization exists; no live redirect confirmed. |
| Google sign-in | NOT CONFIGURED | Requires external Supabase/provider setup. |
| Facebook sign-in | NOT CONFIGURED | Requires external Supabase/provider setup. |
| Mobile menu | UNVERIFIED | React and public menu script both affect it. |
| Browser Back | UNVERIFIED | Multiple popstate handlers exist. |
| Direct product URL refresh | UNVERIFIED | SPA rewrite exists, production browser not tested. |
| Printful order routing | UNVERIFIED | No repo evidence proving routing. |
| Gelato order routing | UNVERIFIED | No repo evidence proving routing. |
