# Radiant 34 launch rules

These rules apply to Codex and every automated coding agent.

## Do not overwrite working commerce
- Do not replace Shopify cart, checkout, token, proxy, or variant-selection logic unless the task explicitly requires it.
- Do not delete or recreate Shopify variant IDs, SKUs, or Gelato/Printful-connected products.
- Do not reintroduce `Preparing release`, a Psalm-only checkout gate, or a single hard-coded active product.

## Product source of truth
- Shopify controls active products, prices, variants, availability and checkout IDs.
- `src/data/radiantProducts.ts` is the approved branding/route/image override manifest for launch products.
- `src/data/radiantProductImages.ts` is the approved local editorial image mapping.
- When adding a newly published product, append it to both manifests without removing existing products.
- Never replace either manifest with an older version.

## Customer-facing rules
- Never expose Gelato, Printful, Bella + Canvas or supplier template names.
- Use Radiant product names and descriptions.
- Product cards and galleries must use `object-fit: contain`; never crop products.
- Multi-variant apparel must require a customer choice before adding to cart.

## Navigation and content
- Header label is `Our Story`, not `About`.
- Shop is the complete active catalog.
- Drop 001 is an editorial campaign page, not a duplicate Shop page.
- Mission copy must explain: wear the Word, share the Gospel, strengthen the Church.

## Change safety
- Read the latest `main` branch before editing.
- Make additive changes; do not rewrite unrelated files.
- Run `npm run build` before reporting completion.
- Confirm every existing live product still appears and reaches checkout after any catalog change.
