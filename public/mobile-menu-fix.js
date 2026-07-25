(() => {
  const STYLE_ID = 'r34-mobile-menu-fix-styles';

  const installStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @media (max-width: 820px) {
        .site-header .main-nav {
          position: fixed !important;
          top: var(--header) !important;
          left: 0 !important;
          right: 0 !important;
          bottom: auto !important;
          width: 100% !important;
          max-height: calc(100dvh - var(--header)) !important;
          overflow-y: auto !important;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          z-index: 9998 !important;
        }

        .site-header .main-nav--open {
          display: flex !important;
        }

        .site-header .menu-btn {
          position: relative;
          z-index: 9999 !important;
        }

        body.r34-mobile-menu-open {
          overflow: hidden !important;
          touch-action: none;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const menuButton = () => document.querySelector('.menu-btn');
  const menuIsOpen = () => menuButton()?.getAttribute('aria-expanded') === 'true';

  const syncBodyState = () => {
    document.body.classList.toggle('r34-mobile-menu-open', menuIsOpen());
  };

  const closeMenu = () => {
    const button = menuButton();
    if (button?.getAttribute('aria-expanded') === 'true') button.click();
    document.body.classList.remove('r34-mobile-menu-open');
  };

  document.addEventListener('click', (event) => {
    const target = event.target.closest?.('.main-nav a, .mobile-nav-actions button');
    if (!target) {
      window.setTimeout(syncBodyState, 0);
      return;
    }

    window.setTimeout(closeMenu, 0);
  }, true);

  window.addEventListener('popstate', () => window.setTimeout(closeMenu, 0));
  window.addEventListener('pageshow', () => window.setTimeout(closeMenu, 0));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
    else syncBodyState();
  });

  new MutationObserver(syncBodyState).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'aria-expanded'],
  });

  installStyles();
  document.addEventListener('DOMContentLoaded', () => {
    installStyles();
    syncBodyState();
  });
  syncBodyState();
})();