# Dependency And Supply Chain Review

## Quality Gate Evidence

- `npm ci`: passed, 160 packages installed, 2 high severity vulnerabilities reported.
- `npm audit --json`: exit code 1.
- `npm outdated`: exit code 1.
- `npm ls --all`: exit code 0.
- Dependencies include several `latest` ranges in `package.json`.

## Dependency Table

| Package | Installed/version policy | Purpose | Vulnerability status | Maintenance concern | Recommended action | Urgency |
| --- | --- | --- | --- | --- | --- | --- |
| `react`, `react-dom` | `latest` | UI runtime | No direct audit detail in summary | Floating major risk | Pin tested version | Medium |
| `vite` | `latest` | Build/dev server | Audit reports high vulns overall | Floating toolchain risk | Review audit and pin | High |
| `typescript` | `latest` | Type checking | No direct audit detail in summary | Floating compiler behavior | Pin tested version | Medium |
| `@vitejs/plugin-react` | `latest` | React build plugin | Unknown direct | Floating build behavior | Pin tested version | Medium |
| `framer-motion` | `latest` | Animation | Unknown direct | Unclear necessity | Confirm used; pin | Low |
| `lucide-react` | `latest` | Icons | Unknown direct | Low | Pin | Low |
| `@playwright/test` | pinned caret | E2E tests | Dev only | Browser download/lifecycle | Keep dev-only; pin deliberately | Low |
| ESLint packages | `latest` | Lint | Dev only | Floating lint output | Pin with CI | Medium |

No dependency updates or audit fixes were performed.
