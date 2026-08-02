# Accessibility Review

## Static Findings

- Landmarks exist through `header`, `main`, `footer`.
- Many navigation controls are buttons used as links, which reduces expected link behavior.
- Cart drawer lacks a documented focus trap and focus restoration.
- Account modal is injected by public script and needs focus/escape verification.
- Category cards are buttons with labels but horizontal scroller keyboard behavior needs testing.
- Product hover overlays must not be sole access path; View Product text exists in cards.
- No automated a11y tooling is installed.
- No route announcement/live region strategy for SPA navigation found.
- Cart updates are not announced through ARIA live region.
- Colour contrast was not measured with tooling.

## WCAG 2.2 AA Readiness

Not ready for approval. Requires keyboard-only journey testing, screen-reader smoke, focus management, modal semantics, and contrast audit.
