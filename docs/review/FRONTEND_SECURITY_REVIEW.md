# Frontend Security Review

## Findings

- Extensive `innerHTML` usage in public scripts creates XSS-sensitive surfaces if remote/user data ever reaches those templates.
- OAuth access and refresh tokens are stored in localStorage by `public/customer-account.js`.
- Review auth script also stores session-like data in localStorage.
- Checkout redirects use URL values from Shopify responses; a stricter approved-host check should exist immediately before redirect.
- No CSP, HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options or frame-ancestors configuration was found in `vercel.json`.
- External images are loaded from Shopify CDN and local assets; no image CSP exists.
- Several scripts use `target="_blank"` with `rel` in mission support; this should be verified across all external links.
- Public debug/account scripts reveal configured state and provider options.

## User/Remote Content Flows

| Source | Sink | Risk |
| --- | --- | --- |
| Shopify product title/description/images | Text, `src`, category classification | Attribute/text safe in React, risky in public `innerHTML` if interpolated. |
| Supabase OAuth hash | localStorage/session UI | Token theft if XSS occurs. |
| Review form input | API body and rendered reviews | Needs server validation and escaping. |
| Shopify checkout URL | `window.location.href` | Requires approved-host validation. |

## Primary Security Findings

See `R34-P1-004` and `R34-P1-003`.
