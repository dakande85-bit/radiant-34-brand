(() => {
  const isShop = () => window.location.pathname.replace(/\/$/, '') === '/shop';

  const resetVisibleCard = (card) => {
    card.hidden = false;
    card.removeAttribute('hidden');
    card.setAttribute('aria-hidden', 'false');

    [
      'display', 'visibility', 'opacity', 'position', 'left', 'right', 'top', 'bottom',
      'grid-column', 'grid-row', 'grid-area', 'order', 'width', 'max-width', 'margin',
    ].forEach((property) => card.style.removeProperty(property));

    card.querySelectorAll(
      '.shopify-card__main, .shopify-card__image, .shopify-card__body, .product-card__category, .shopify-card__description, .shopify-card__meta, .shopify-card__view',
    ).forEach((node) => {
      node.removeAttribute('hidden');
      ['display', 'visibility', 'opacity', 'position', 'grid-column', 'grid-row', 'order']
        .forEach((property) => node.style.removeProperty(property));
    });
  };

  const normalize = () => {
    if (!isShop()) return;

    const shopPage = document.querySelector('.shop-page');
    const grid = shopPage?.querySelector('.product-grid--shop');
    if (!shopPage || !grid || grid.hidden) return;

    const selectedCategory = shopPage.dataset.r34SelectedCategory;
    const cards = Array.from(grid.querySelectorAll(':scope > .shopify-card'));

    cards.forEach((card) => {
      const explicitlyHidden = card.getAttribute('aria-hidden') === 'true';
      const hasProductContent = Boolean(
        card.querySelector('.shopify-card__body strong') || card.querySelector('.shopify-card__image img'),
      );

      if (explicitlyHidden || !hasProductContent) {
        card.hidden = true;
        card.style.setProperty('display', 'none', 'important');
        return;
      }

      resetVisibleCard(card);
    });

    /* In All Products, no legacy filter is allowed to leave a product invisible. */
    if (selectedCategory === 'all') {
      cards.forEach((card) => {
        const hasProductContent = Boolean(
          card.querySelector('.shopify-card__body strong') || card.querySelector('.shopify-card__image img'),
        );
        if (hasProductContent) resetVisibleCard(card);
      });
    }
  };

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        queued = false;
        normalize();
      });
    });
  };

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['hidden', 'aria-hidden', 'style', 'data-r34-selected-category'],
  });

  window.addEventListener('popstate', queue);
  window.addEventListener('resize', queue);
  document.addEventListener('DOMContentLoaded', queue);
  document.addEventListener('click', () => setTimeout(queue, 0));
  queue();
})();