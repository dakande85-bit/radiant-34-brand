# Current Cart Failures

Branch: `hotfix/cart-checkout-recovery-2026-08-03`

Production was not touched. These findings were reproduced by source inspection and local commerce-path mapping before code changes. A full live checkout test still requires owner-approved preview credentials and manual checkout validation.

## P0: Admin Variant IDs Can Reach Customer Cart Paths

- Reproduction steps: Load Shopify products through `/api/shopify-storefront` when an Admin product is active but not Storefront-visible, or when Storefront validation returns no available variant.
- Expected result: Product remains visible but purchase controls are disabled with `This product is temporarily unavailable.`
- Actual result before fix: `api/shopify-storefront.ts` could fall back from Storefront variants to Admin variants and assign that ID to `storefrontVariantId`.
- Network evidence: Shopify cart mutations reject Admin-only merchandise IDs with messages such as `The merchandise with id ... does not exist.`
- Console evidence: Frontend reported Add to Cart / Buy Now failures from `src/lib/shopify.ts`.
- Source file: `api/shopify-storefront.ts`
- Function: `toStorefrontProduct`
- Likely cause: `checkoutVariant = storefrontVariant ?? adminVariant`
- Severity: P0, checkout-blocking.

## P0: Client Re-Enables Checkout From Display Variants

- Reproduction steps: Render a product where `storefrontVariantId` is missing but variants are present for display.
- Expected result: No Add to Cart or Buy Now mutation is attempted.
- Actual result before fix: `src/main.tsx` used `product.storefrontVariantId ?? variant?.id`, allowing a display variant to become the checkout variant.
- Network evidence: Cart mutation body could include a variant ID not proven to be Storefront-visible for that product.
- Console evidence: Customer-facing `Unable to add product` or Shopify merchandise errors.
- Source file: `src/main.tsx`
- Function: `toShopifyProduct`
- Likely cause: Checkout ID fallback in client mapping.
- Severity: P0, checkout-blocking.

## P1: Product Card Purchase Controls Hidden

- Reproduction steps: Open `/shop` and inspect `.shopify-card__actions`.
- Expected result: Quick Add, Buy Now, or a disabled unavailable state is visible and reachable.
- Actual result before fix: `public/shop-grid-integrity.css` set `.shop-page .shopify-card__actions { display: none !important; }`.
- Network evidence: No commerce request can be initiated from hidden card controls.
- Console evidence: No direct console error; the UI control is absent.
- Source file: `public/shop-grid-integrity.css`
- Function: CSS rule ownership.
- Likely cause: Old catalogue integrity stylesheet suppressed duplicated controls after React had become the owner.
- Severity: P1, purchase-path blocking from the shop page.

## P1: Variant Matching Used One Option

- Reproduction steps: Open a product with Size and Colour variants, select a specific Size and Colour, then Add to Cart.
- Expected result: Cart mutation uses the Storefront variant matching every selected option.
- Actual result before fix: Product detail matched only the primary option, usually Size.
- Network evidence: Cart mutation could contain a valid Storefront variant for the wrong Colour.
- Console evidence: No direct console error; wrong item risk appears in Shopify checkout/cart.
- Source file: `src/main.tsx`
- Function: `findVariantForOption`
- Likely cause: Single-option variant resolver.
- Severity: P1, wrong-variant risk.
