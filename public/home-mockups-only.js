(() => {
  const HOME_PATHS = new Set(['/', '']);

  const applyHomeMockupMode = () => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const isHome = HOME_PATHS.has(path);
    document.documentElement.classList.toggle('home-mockups-only', isHome);

    if (!isHome) return;

    document.querySelectorAll('main .product-card').forEach((card) => {
      card.setAttribute('aria-label', 'Radiant 34 product mockup');
      card.querySelectorAll('.product-card__body, .notify-link, .product-card__badges, .product-card__overlay, .product-price, .shopify-card__actions, .shopify-card__body').forEach((element) => {
        element.setAttribute('hidden', '');
      });
    });
  };

  const style = document.createElement('style');
  style.textContent = `
    .home-mockups-only main .product-card {
      border: 0;
      background: transparent;
      box-shadow: none;
      cursor: default;
      pointer-events: none;
    }

    .home-mockups-only main .product-card:hover,
    .home-mockups-only main .product-card:focus-visible {
      transform: none;
      box-shadow: none;
    }

    .home-mockups-only main .product-card__visual {
      border-radius: 10px;
      background: transparent;
    }

    .home-mockups-only main .product-card__body,
    .home-mockups-only main .notify-link,
    .home-mockups-only main .product-card__badges,
    .home-mockups-only main .product-card__overlay,
    .home-mockups-only main .product-price,
    .home-mockups-only main .shopify-card__actions,
    .home-mockups-only main .shopify-card__body {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  let queued = false;
  const queueApply = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyHomeMockupMode();
    });
  };

  new MutationObserver(queueApply).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('popstate', queueApply);
  document.addEventListener('click', () => setTimeout(queueApply, 0));
  applyHomeMockupMode();
})();
