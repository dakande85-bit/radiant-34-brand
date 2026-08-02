# Shopify Commerce Review

## Lifecycle Trace

Shopify Admin API -> `api/shopify-storefront.ts` -> Storefront product validation -> `toStorefrontProduct` -> `src/main.tsx` `toShopifyProduct` -> `brandOverrides` -> React cards/pages -> option selection -> `storefrontVariantId` -> `src/lib/shopify.ts` cart mutation -> Shopify checkout URL.

## Invariant Review

| Invariant | Status | Evidence |
| --- | --- | --- |
| Admin variant IDs must never be cart merchandise IDs | CONFIRMED BROKEN | `api/shopify-storefront.ts:211-247` can fall back to Admin variant. |
| Checkout-capable variant must be Storefront-visible | CONFIRMED BROKEN | Fallback permits checkoutVariant from Admin when Storefront missing. |
| Product publication must be verified | PARTIAL | Storefront validation exists, but fallback undermines it. |
| Lookup failures must not show unrelated product | HIGHLY LIKELY RISK | `fallbackForShopifyProduct` can choose local products by title/index. |
| Title overrides must not control identity | PARTIAL | Current deleted hover title script helped, but other public scripts still classify by rendered text. |
| Images attached to stable handles/IDs | PARTIAL | `brandOverrides`/`radiantProductImages` are handle-based; public category scripts still use text/card heuristics. |
| Product not purchasable without Storefront variant | CONFIRMED BROKEN | `toShopifyProduct` also sets fallback `variant?.id`. |
| Multi-option products match all selected options | CONFIRMED BROKEN BY CODE | `findVariantForOption` matches one primary option, usually size. |
| Price/currency from selected variant | NOT IMPLEMENTED | Price uses product price range. |
| Shopify errors not silently mocked | PARTIAL | User messages hide details; production mock fallback not present, but local fallbacks can hide identity failure. |

## Product Data Findings

See `R34-P0-001`.

Additional issue: `src/main.tsx:1150` filters final shop products to `product.canCheckout || product.storefrontVariantId`. This ties catalogue visibility to cart validation. A product can disappear from shop instead of displaying an honest unavailable state.

## API Route Review

`api/shopify-storefront.ts` mixes Admin product catalogue reads, Storefront validation, Storefront GraphQL proxying, retry behavior, cache behavior and error logging. It does not allowlist arbitrary Storefront operations, does not validate request shape beyond query existence, and does not enforce body size/rate limiting in code.

## Required Tests

- Admin active product but Storefront unpublished -> no `storefrontVariantId`.
- Multi-option product requires all selected options.
- Product handle not found -> product-not-found UI, not unrelated local fallback.
- Price changes with selected variant where variants differ.
- Proxy rejects unknown GraphQL operations.
