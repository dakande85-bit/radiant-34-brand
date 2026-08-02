# Architecture Review

## Summary

The architecture is not production-grade for a commercial storefront yet. The core issue is not whether React renders; it is ownership. React, `index.html`, public patch scripts, public CSS, Vercel redirects and Shopify proxy code all participate in business-critical behavior.

## Ownership Diagrams

```mermaid
flowchart TD
  Index["index.html"] --> React["src/main.tsx"]
  Index --> PublicScripts["20 public JS patch scripts"]
  Index --> PublicCss["public CSS overrides"]
  React --> DOM["Product/nav/page/cart DOM"]
  PublicScripts --> DOM
  PublicCss --> DOM
```

```mermaid
flowchart TD
  Load["Browser loads /index.html"] --> RouteClass["Inline route class script wraps history"]
  Load --> ReactBoot["React boot"]
  ReactBoot --> Render["Render route/page"]
  Render --> Effects["React effects fetch Shopify/reviews/cart"]
  Effects --> PatchObservers["Public MutationObservers react to DOM"]
  PatchObservers --> MutatedDom["Post-render DOM mutations"]
```

```mermaid
flowchart TD
  ShopifyAdmin["Shopify Admin products"] --> Proxy["api/shopify-storefront.ts"]
  StorefrontValidation["Storefront products/variants"] --> Proxy
  Proxy --> Transform["toStorefrontProduct"]
  Transform --> ClientTransform["src/main.tsx toShopifyProduct"]
  ClientTransform --> BrandOverrides["brandOverrides"]
  BrandOverrides --> Cards["Shop cards/Product pages"]
  Cards --> PublicPatch["shop-catalog/live-sync patches"]
```

```mermaid
flowchart TD
  UserClick["User nav click"] --> ReactPush["React pushState"]
  PublicMenu["menu-fixes.js"] --> PushState["pushState / location.assign"]
  Inline["index.html route class script"] --> WrapHistory["wraps pushState/replaceState"]
  Back["Browser Back"] --> Popstate["popstate"]
  Popstate --> ReactSync["React syncPage"]
  Popstate --> PatchSync["Patch script sync"]
```

```mermaid
flowchart TD
  ProductButton["Quick Add / Buy Now"] --> ClientCart["src/lib/shopify.ts"]
  ClientCart --> Proxy["/api/shopify-storefront"]
  Proxy --> StorefrontCart["cartCreate/cartLinesAdd"]
  StorefrontCart --> LocalStorage["radiant34CartId localStorage"]
  StorefrontCart --> CheckoutUrl["checkoutUrl"]
  CheckoutUrl --> Redirect["window.location.href"]
```

```mermaid
flowchart TD
  AccountButton["customer-account.js"] --> Config["/api/auth/config"]
  Config --> SupabaseUrl["Supabase URL if configured"]
  AccountButton --> OAuth["Supabase OAuth provider URL"]
  OAuth --> Hash["access_token/refresh_token hash"]
  Hash --> LocalStorage["radiant34CustomerSession"]
  LocalStorage --> Session["/api/auth/session"]
```

## Scores

| Area | Score | Explanation |
| --- | ---: | --- |
| Separation of concerns | 2/10 | `src/main.tsx` is a 1900+ line mixed application; public scripts also own UI. |
| Testability | 4/10 | Playwright exists but coverage is narrow and over-mocked; APIs lack unit tests. |
| Maintainability | 2/10 | Patch layer, duplicated product manifests and routing ownership make changes fragile. |
| Reliability | 3/10 | Build passes, but lint fails and commerce invariants are violated by code. |
| Change safety | 2/10 | Small UI changes can be overwritten by MutationObservers/CSS patches. |
| Ecommerce suitability | 3/10 | Shopify integration exists, but Admin/Storefront variant identity is unsafe. |

## Findings

See `R34-P0-001`, `R34-P1-001`, `R34-P1-002`, `R34-P2-001`.
