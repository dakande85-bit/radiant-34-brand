# Public Patch Inventory

Loaded by `index.html` on commit `75d9f6b0ff56bf1c61988cd9b2c03e59ca9d757e`.

## CSS Loaded By `index.html`

| File | Purpose | Risk | Recommendation |
| --- | --- | --- | --- |
| `public/launch-fixes.css` | Product image containment. | Low/medium; overlaps product card CSS. | Migrate if still needed. |
| `public/product-page-fixes.css` | Product page layout overrides. | High; many `!important` product rules. | Migrate to React/CSS source. |
| `public/shop-grid-integrity.css` | Shop grid/card layout overrides. | Critical; hides `.shopify-card__actions`. | Remove after React layout owns shop. |
| `public/shop-category-cards.css` | Category card styling. | Medium; depends on injected DOM. | Migrate with category React component. |
| `public/home-route-guard.css` | Route-specific hiding. | Medium; patches route output. | Remove after source cleanup. |
| `public/contact-page-upgrade.css` | Contact page patch styling. | Medium; supports injected content. | Migrate or remove. |
| `public/about-page-fix.css` | About page layout patch styling. | Medium/high due `!important`. | Migrate or remove. |
| `public/mission-product-slider.css` | Mission slider styling. | Medium; supports injected slider. | Migrate if retained. |

## JavaScript Loaded By `index.html`

| File | Purpose | DOM read | DOM changed | Observer | Click interception | History usage | Shopify/data manipulation | React overlap | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Inline route class script | Adds route classes to `<html>`. | `window.location.pathname` | `<html>` classes | No | No | wraps `pushState`, `replaceState`, listens `popstate` | No | Routing/CSS | Migrate or remove. |
| `public/review-auth.js` | Review auth and review form gate. | Product path, review form, hash params | Inserts auth gate/form with `innerHTML`; localStorage session | Yes | Provider/form clicks | `replaceState` clears hash | Review/customer auth | Product reviews | Migrate retained review auth into React. |
| `public/shopify-live-sync.js` | Captures Shopify responses and syncs images/gallery. | `fetch`, `.shopify-card`, `.product-gallery` | Rewrites hover images and gallery `innerHTML` | Yes | No | `popstate` listener | Yes; captures product payloads | Shop/product gallery | Remove; feed data through React. |
| `public/menu-fixes.js` | Removes/changes nav links and forces shop navigation. | All links/buttons, nav/footer | Removes links, injects Contact, changes button text | Yes | Yes, capture phase | `pushState`, synthetic `popstate`, `window.location.assign` | No | Header/footer/router | Remove after React nav fixed. |
| `public/mobile-menu-fix.js` | Mobile scroll lock and menu close behavior. | `.menu-btn`, `.main-nav` | Body class, injected style | Yes | Yes | `popstate` listener | No | Header/mobile menu | Migrate minimal behavior into React. |
| `public/contact-page-upgrade.js` | Rewrites contact page. | Page hero, launch section | `innerHTML`, text, image classes | No | Form submit | wraps `pushState`, `replaceState`, listens `popstate` | No | Contact page/newsletter | Remove after React contact page owns content. |
| `public/mission-product-slider.js` | Adds homepage mission product slider. | `.mission-band` | Removes/replaces mission image, injects slider | No | Slider controls | path check only | Hardcoded Shopify CDN images | Mission/home | Migrate if retained. |
| `public/shop-hover-mockups.js` | Adds hover mockups by title. | `.shopify-card` titles/images | Adds hover image nodes | Yes | No | `popstate` listener | Hardcoded CDN images by title | Shop card images | Remove; use `radiantProductImages` or Shopify images in React. |
| `public/shop-catalog-sync-v2.js` | Category chooser and card normalizer. | Shop cards, controls, images, links | Injects category grid, headings, text rewrites, inline display hiding | Yes | Yes, capture phase with stopImmediatePropagation | No | Hardcoded categories/CDN; card classification | Shop filters/cards | Remove after React category UI exists. |
| `public/shop-grid-normalizer.js` | Normalizes visible shop cards. | `.shop-page`, grid, cards | Inline styles, hidden/aria-hidden | Yes | Schedules on click | `popstate` listener | No | Shop grid/cards | Remove with category patch. |
| `public/mens-outerwear-thumbnail.js` | Overrides category thumbnail/copy. | Category card and heading | Image src and text content | Yes | No | `popstate` listener | Hardcoded CDN image | Shop category cards | Remove with category patch. |
| `public/product-page-content-fix.js` | Rewrites one product page. | Product detail/gallery | `innerHTML`, text, image order/classes | Yes | No | path checks and popstate | Hardcoded copy/images | Product page | Remove; use product data. |
| `public/mission-support.js` | Mission donations page and nav injection. | Main/nav/footer | Injects nav links, replaces `main.innerHTML` | Yes | Link click | `pushState`, synthetic `popstate` | No | Mission route and nav | Remove; React owns mission page. |
| `public/customer-account.js` | Account modal and social sign-in. | Nav, buttons, URL hash | Injects account button/modal, changes Mission text/title | Yes | Provider/account clicks | `replaceState` clears auth hash | Customer auth | Header/nav/auth | Migrate into React; keep server APIs. |

## Immediate Repair Direction

Retain server-side Shopify proxy, cart library, brand/image manifests, and React card/product components. Remove or migrate the public patch layer incrementally, beginning with commerce blockers:

1. Remove `shop-grid-integrity.css` action hiding.
2. Replace `shop-catalog-sync-v2.js` with React category UI.
3. Remove Shopify/gallery post-render mutation scripts after React owns image mapping.
4. Remove menu/mission/contact/account patches after their behavior is represented in source.
