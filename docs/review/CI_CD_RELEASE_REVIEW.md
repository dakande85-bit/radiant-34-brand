# CI/CD And Release Review

## Findings

- No `.github/` workflow files were found in tracked inventory.
- Branch protection and required checks were not verifiable from local files.
- Vercel project config exists locally under ignored `.vercel/`, but production settings/aliases were not modified or verified.
- Recovery branch is ahead of `origin/main` by four local commits at review baseline.
- A successful Vercel build can be incorrectly treated as customer-journey success because checkout/auth/product runtime tests are separate.

## Required Release Controls

- Required PR checks: install, typecheck, lint, build, browser smoke, API invariant tests.
- Vercel preview smoke before production.
- Production synthetic smoke after deployment.
- Manual approval gate for production alias.
- Rollback runbook with known-good commit and Vercel deployment.
- Change log/release note for commerce-affecting changes.
