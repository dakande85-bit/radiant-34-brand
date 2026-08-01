# Radiant 34 launch hotfixes — 1 August 2026

## Implemented

- Shop category chooser changed from a tall multi-row grid to a horizontal scroll-snap strip.
- Homepage mission section moved to the final position.
- Primary navigation now removes duplicate mission links and keeps **Our Mission** as the final main menu item.
- Women’s Outerwear category thumbnail changed to the women’s bomber product image.
- Customer account script simplified to Google and Facebook only; unsupported TikTok sign-in removed.
- Social sign-in now uses one root callback URL and preserves the customer’s previous path.
- Required Supabase environment variables and redirect configuration added to `.env.example`.

## Still requires external configuration

Social sign-in cannot complete until the production Supabase project has:

1. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in Vercel.
2. Google and Facebook providers enabled with valid OAuth credentials.
3. `https://www.radiant34.com/` and relevant preview URLs added to the Supabase redirect allowlist.

## Remaining launch blockers

- Unify Buy Now and the normal cart onto one tested Shopify cart implementation.
- Replace remaining post-render MutationObserver patches with React/TypeScript source-level components.
- Add automated browser tests for navigation, category filtering, account sign-in, cart and checkout.
