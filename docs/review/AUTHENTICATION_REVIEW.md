# Authentication Review

## Intended Model

Supabase-based Google and Facebook authentication is intended. It is not proven configured in production.

## Evidence

- `api/auth/config.ts` returns `providers: ['google', 'facebook']` and a Supabase URL only when configured.
- `public/customer-account.js` builds provider URLs and stores returned tokens in localStorage.
- `api/auth/session.ts` validates bearer token via Supabase `/auth/v1/user`.
- `api/auth/refresh.ts` refreshes sessions using a refresh token sent from browser JavaScript.

## Risks

- Access and refresh tokens are JavaScript-readable in localStorage.
- Provider buttons may appear based on config route but actual provider credentials/redirect allowlist are external and unverified.
- Callback state/nonce/PKCE details are not clearly enforced by local code.
- Sign-out removes local storage only; remote session invalidation was not found.
- Tokens are removed from URL hash with `replaceState`, which is good, but persistence remains risky.

## Status

Google sign-in: NOT CONFIGURED / requires external evidence.  
Facebook sign-in: NOT CONFIGURED / requires external evidence.  
Customer account launch: blocked by `R34-P1-004` until session design is reviewed.
