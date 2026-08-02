# SEO And Discoverability Review

## Findings

- Global metadata exists in `index.html`, but route/product-specific metadata is client-side only.
- No tracked `robots.txt` or `sitemap.xml` found.
- No canonical link strategy found.
- No Product structured data found.
- No Organisation structured data found.
- SPA fallback can serve `index.html` for invalid routes; 404 behavior is unclear.
- `/drop-001` redirects to `/shop` in Vercel while React has a `/drop-001` page.
- Product route social previews likely show generic homepage metadata.

## Recommendation

Add route/product metadata, canonical URLs, Product JSON-LD based on real Shopify price/availability, sitemap/robots, and explicit invalid-route handling.
