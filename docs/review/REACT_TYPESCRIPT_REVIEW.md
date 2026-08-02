# React And TypeScript Review

## React

- `src/main.tsx` mixes route handling, data transforms, UI components, cart, reviews, and admin page logic.
- Routing is manual (`window.history.pushState`, `popstate`, pathname parsing) rather than router-owned.
- React and public scripts both mutate navigation/product DOM.
- No error boundary was found.
- Loading states exist for shop/cart but are not route-level boundaries.
- Product card uses a button for navigation-like behavior; semantic link behavior is inconsistent.
- Cart drawer is rendered inline, not via a portal; focus trap/restoration is not implemented.
- Effects perform fetches without `AbortController` cancellation in several places.
- Lint reports React compiler errors for synchronous state updates in effects.

## TypeScript

- `tsc --noEmit` passes.
- Lint fails with 43 errors and 1 warning.
- API handlers use broad `any` for `req` and `res`.
- Several domain values are broad strings: `variantId`, `adminVariantId`, `storefrontVariantId`, `checkoutUrl`, `price`, `category`.
- API responses are cast/trusted rather than runtime validated.
- Product state allows invalid combinations such as `canCheckout:true` with an Admin-derived ID.
- Currency is rendered from price range, not necessarily selected variant.
- `shopifyConfigured` is hardcoded true in client code.

## Type Safety Hotspots

| Pattern | Evidence | Review decision |
| --- | --- | --- |
| `any` | Lint errors in API routes and Shopify debug/storefront handlers | Not justified for public API boundaries. |
| `as` assertions | API payload parsing and tests | Some test casts acceptable; API casts require validation. |
| Optional product fields | `ShopifyProduct` and `ShopifyProductNode` allow many optional commerce fields | Masks invalid commercial states. |
| Non-null assertions | React root lookup | Acceptable if root is guaranteed by `index.html`, but should be isolated. |
| `eslint-disable` | `react-refresh/only-export-components` in `src/main.tsx` | Symptom of oversized mixed module. |

## Required Remediation

Split UI modules, add typed API request/response schemas, model Admin vs Storefront IDs as distinct branded types, remove checkout-capable state from optional booleans, and make lint passing a release gate.
