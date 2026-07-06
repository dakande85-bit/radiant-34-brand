# Radiant 34 — Gelato × Shopify Launch Checklist

> Complete these steps to go live with POD sales.
> Do NOT use the AURA Boxing Shopify store. Radiant 34 needs its own separate store.

---

## 1. Create the Radiant 34 Shopify Store

- [ ] Sign up at shopify.com — new account, separate from any other brand
- [ ] Store name: `Radiant 34` (or `radiant34`)
- [ ] Region/currency: set to your target market (EUR / GBP)
- [ ] Add business details and payment info

---

## 2. Install the Gelato App in Shopify

- [ ] Go to Shopify App Store → search "Gelato"
- [ ] Install the Gelato: Print on Demand app
- [ ] Connect your Gelato account (or create one at gelato.com)
- [ ] Authorise the Shopify–Gelato connection

---

## 3. Upload Print Files to Gelato

- [ ] Prepare the Radiant 34 chest logo as a high-res PNG (300 dpi minimum, transparent background)
- [ ] Logo: hand-drawn lightbulb + "34" inside + "Radiant" brush lettering, black and warm gold
- [ ] Chest placement artwork: sized correctly per Gelato's print file templates
- [ ] Upload files to Gelato product designer

---

## 4. Create POD Products in Gelato

For each product in `src/data/products.ts`:

### Signature Hoodie
- [ ] Create in Gelato → Apparel → Hoodies
- [ ] Color variants: Cream / Sand, Black
- [ ] Sizes: S, M, L, XL, XXL
- [ ] Placement: small left chest
- [ ] Price to customer: €54.99

### Classic Tee
- [ ] Create in Gelato → Apparel → T-Shirts
- [ ] Color variants: Black, Natural/Cream
- [ ] Sizes: S, M, L, XL, XXL
- [ ] Placement: small left chest
- [ ] Price to customer: €34.99

### Everyday Tank
- [ ] Create in Gelato → Apparel → Tank Tops
- [ ] Color variants: Natural/Cream, Black
- [ ] Sizes: S, M, L, XL, XXL
- [ ] Placement: small left chest
- [ ] Price to customer: €29.99

---

## 5. Sync Products to Shopify

- [ ] In Gelato app → "Send to store" for each product
- [ ] Products will appear as drafts in Shopify
- [ ] Review each product listing

---

## 6. Set Product Details in Shopify

For each product:
- [ ] Add the product description from `src/data/products.ts`
- [ ] Upload lifestyle model images (the 3 images in `public/images/model-*.png`)
- [ ] Set the product handle to match `src/data/products.ts` (e.g. `signature-hoodie`)
- [ ] Assign to collection: "Drop 001"
- [ ] Set product type: Hoodie / T-Shirt / Tank Top

---

## 7. Configure Pricing and Shipping

- [ ] Confirm Gelato base cost vs. customer price (ensure margin)
- [ ] Set up shipping profiles in Shopify (Gelato handles fulfilment)
- [ ] Enable international shipping if needed
- [ ] Add VAT/tax settings for your region

---

## 8. Connect the Website to Shopify

- [ ] Create a Storefront API access token in Shopify Admin → Apps → Storefront API
- [ ] Copy `radiant-34-brand/.env.example` → `.env` (do NOT commit .env)
- [ ] Fill in:
  ```
  VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
  VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
  VITE_SHOPIFY_API_VERSION=2025-10
  ```
- [ ] Add the same env vars to Vercel project settings (Settings → Environment Variables)
- [ ] Test that `shopifyConfigured` returns `true` in `src/lib/shopify.ts`

---

## 9. Test a Real Order

- [ ] Place a test order using Shopify's test payment gateway
- [ ] Confirm Gelato receives and processes the order
- [ ] Check fulfilment and shipping notification emails
- [ ] Verify the printed item matches the design

---

## 10. Connect Custom Domain

- [ ] Purchase domain (e.g. `radiant34.com` or `radiant-34.com`)
- [ ] Add domain in Shopify Admin → Online Store → Domains
- [ ] Point DNS to Shopify
- [ ] Set primary domain
- [ ] Enable SSL (automatic in Shopify)
- [ ] Update Vercel with the same domain (or use Shopify's own storefront)

---

## 11. Pre-launch Checks

- [ ] Homepage looks correct on desktop and mobile
- [ ] All 3 products visible in collection
- [ ] No broken images
- [ ] "Discover Drop 001" CTA links to collection
- [ ] Email signup form is live (Klaviyo / Mailchimp / Shopify Email)
- [ ] Social links in footer correct
- [ ] Privacy policy and terms pages added in Shopify

---

## 12. Launch

- [ ] Remove password protection from Shopify store (Online Store → Preferences)
- [ ] Announce on social media
- [ ] Send email to waitlist
- [ ] Monitor first orders and Gelato fulfilment
