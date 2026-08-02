# Cart And Checkout Review

## Journey Status

| Journey | Status | Evidence |
| --- | --- | --- |
| Quick Add | REQUIRES RUNTIME TEST | Code exists in `src/main.tsx:1219-1245`; CSS can hide actions. |
| Choose Options | CONFIRMED BY CODE | Multi-variant cards route to product page, but option matching is incomplete. |
| Add to Cart | REQUIRES RUNTIME TEST | `addVariantToCart` uses Storefront cart mutations via proxy. |
| Buy Now | REQUIRES RUNTIME TEST | Uses `buyNowVariant` -> `createCart` -> checkout URL redirect. |
| Cart creation | CONFIRMED BY CODE | `src/lib/shopify.ts:247-278`. |
| Stored cart retrieval | CONFIRMED BY CODE | `getCart`, localStorage cart ID. |
| Cart line addition | CONFIRMED BY CODE | `cartLinesAdd`. |
| Quantity update | CONFIRMED BY CODE | `cartLinesUpdate`. |
| Line removal | CONFIRMED BY CODE | `cartLinesRemove`. |
| Cart count | CONFIRMED BY CODE | `refreshCartCount`. |
| Expired cart recovery | CONFIRMED BY CODE | stale cart errors clear/recreate in add path. |
| Checkout redirect | REQUIRES RUNTIME TEST | `window.location.href = cart.checkoutUrl`. |

## Risks

- Purchase buttons can be hidden by `public/shop-grid-integrity.css`.
- Checkout URL is normalized only for known Radiant hosted cart paths and Shopify cart paths; no explicit final allowlist assertion before redirect.
- Rapid clicks are partially disabled by `addingHandle`, but multi-tab conflicts are unhandled.
- Cart IDs live in localStorage; no cross-tab sync or storage event handling.
- Quantity boundaries are enforced in product detail but cart line updates can increment indefinitely from UI.
- Unavailable variants already in cart depend on Shopify mutation response.
- Error messages are customer-safe but can hide operational details without observability.

## CSS Review

High-risk CSS patterns found:

- `public/shop-grid-integrity.css:44-45` hides `.shopify-card__actions`.
- Multiple public CSS files use `!important` against product/card/gallery controls.
- Hover image swapping is now gated in `src/styles.css`, but other public CSS should still be audited before release.

## Release Blockers

`R34-P0-001`, `R34-P1-002`.
