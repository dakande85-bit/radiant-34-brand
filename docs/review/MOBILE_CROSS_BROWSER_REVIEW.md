# Mobile And Cross-Browser Review

## Evidence

- Playwright mobile hover regression exists for the Scripture Tough Phone Case and passes locally.
- `src/styles.css` now gates primary shop hover swap under `@media (hover: hover) and (pointer: fine)`.
- Other hover/focus rules remain across public CSS and require full audit before launch.
- `public/mobile-menu-fix.js` controls scroll lock and menu close outside React.

## Risks

- iOS sticky hover risk reduced for the specific shop card hover rule but not globally proven absent.
- Mobile menu behavior depends on React plus public script.
- Fixed header and `100dvh/100svh` interactions need iOS Safari verification.
- Cart drawer height/keyboard behavior is untested.
- Horizontal category scroller accessibility and overflow need browser matrix testing.

## Required Browser Matrix

- Chromium desktop
- Firefox desktop
- WebKit desktop
- Chromium mobile
- WebKit/iPhone viewport

## Status

Mobile behavior is READY FOR REMEDIATION, not production approval.
