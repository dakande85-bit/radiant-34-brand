# Privacy And Customer Data Review

This is a technical privacy review, not legal advice.

## Data Stores

- `localStorage`: launch email, cart ID, checkout URL, customer account tokens, review auth session.
- API logs: Shopify and Supabase errors may include operational details.
- Review submissions: name, email, order reference, review body.
- OAuth: access and refresh tokens handled by browser script.

## Risks

- Refresh tokens in localStorage increase customer-data exposure risk.
- No consent/analytics system was found; if analytics/pixels are later added, consent state is needed.
- No privacy-policy link review was completed in this pass.
- PII retention/deletion/export implementation was not found.
- Server logs should redact emails, tokens, order references and provider errors.

## Required Confirmation

Legal/policy owner must confirm privacy policy, cookie policy, review data retention, OAuth data handling, and EU/UK customer rights process.
