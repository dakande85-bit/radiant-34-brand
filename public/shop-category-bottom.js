(() => {
  const SELECTED_CLASS = 'r34-shop-category-card--selected';
  const HIDDEN_CLASS = 'r34-shop-force-hidden';

  const text = (node) => node?.textContent?.trim() ?? '';

  const installStyles = () => {
    if (document.getElementById('r34-shop-category-bottom-styles')) return;

    const style = document.createElement('style');
    style.id = 'r34-shop-category-bottom-styles';
    style.textContent = `
      /* Product controls and product cards must not render before a category click. */
      .shop-page:not([data-r34-category-open="true"]) .shop-controls,
      .shop-page:not([data-r34-category-open="true"]) .product-grid--shop,
      .shop-page:not([data-r34-category-open="true"]) .cart-message,
      .shop-page:not([data-r34-category-open="true"]) .r34-shop-results-heading,
      .r34-shop-force-hidden {
        display:none !important;
      }

      /* Keep the category thumbnails visible after selection. */
      .shop-page[data-r34-category-open="true"] .r34-shop-categories {
        display:block !important;
      }

      .r34-shop-category-card--selected {
        outline:3px solid #b98529 !important;
        outline-offset:3px;
      }
      .r34-shop-results-heading {
        margin:64px 0 24px;
        padding-top:34px;
        border-top:1px solid rgba(17,16,13,.16);
      }
      .r34-shop-results-heading .eyebrow {
        margin:0 0 10px;
        color:#b98529;
        font-size:.72rem;
        font-weight:900;
        letter-spacing:.16em;
        text-transform:uppercase;
      }
      .r34-shop-results-heading h2 {
        margin:0;
        font-family:Georgia, 'Times New Roman', serif;
        font-size:clamp(2rem,4vw,4rem);
        font-weight:400;
        line-height:1;
      }
      .r34-shop-results-heading p {
        max-width:620px;
        margin:14px 0 0;
        color:#74654e;
        line-height:1.65;
      }
    `;
    document.head.appendChild(style);
  };

  const setResultsVisible = (shopPage, visible) => {
    const controls = shopPage.querySelector('.shop-controls');
    const productGrid = shopPage.querySelector('.product-grid--shop');
    const cartMessage = shopPage.querySelector('.cart-message');
    const resultsHeading = shopPage.querySelector('.r34-shop-results-heading');

    [controls, productGrid, cartMessage, resultsHeading].forEach((node) => {
      if (!node) return;
      node.classList.toggle(HIDDEN_CLASS, !visible);
      if (visible) node.removeAttribute('hidden');
    });
  };

  const ensureResultsHeading = (shopPage, selectedCard) => {
    const controls = shopPage.querySelector('.shop-controls');
    if (!controls) return null;

    let heading = shopPage.querySelector('.r34-shop-results-heading');
    if (!heading) {
      heading = document.createElement('div');
      heading.className = 'r34-shop-results-heading';
      controls.before(heading);
    }

    const category = text(selectedCard.querySelector('strong')) || 'Products';
    const description = text(selectedCard.querySelector('.r34-shop-category-card__copy span'));
    heading.innerHTML = `
      <p class="eyebrow">Selected category</p>
      <h2>${category}</h2>
      ${description ? `<p>${description}</p>` : ''}
    `;
    heading.classList.remove(HIDDEN_CLASS);
    heading.removeAttribute('hidden');
    return heading;
  };

  const openCategory = (shopPage, selectedCard) => {
    const chooser = shopPage.querySelector('.r34-shop-categories');
    const backButton = shopPage.querySelector('.r34-shop-back');

    shopPage.dataset.r34CategoryOpen = 'true';
    if (chooser) {
      chooser.hidden = false;
      chooser.style.removeProperty('display');
    }
    if (backButton) backButton.classList.add(HIDDEN_CLASS);

    shopPage.querySelectorAll('.r34-shop-category-card').forEach((card) => {
      const selected = card === selectedCard;
      card.classList.toggle(SELECTED_CLASS, selected);
      card.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    const heading = ensureResultsHeading(shopPage, selectedCard);
    setResultsVisible(shopPage, true);

    window.setTimeout(() => {
      heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const enforceState = () => {
    if (window.location.pathname !== '/shop') return;

    installStyles();
    const shopPage = document.querySelector('.shop-page');
    if (!shopPage) return;

    const chooser = shopPage.querySelector('.r34-shop-categories');
    const backButton = shopPage.querySelector('.r34-shop-back');
    const selectedCard = shopPage.querySelector(`.${SELECTED_CLASS}`);
    const isOpen = shopPage.dataset.r34CategoryOpen === 'true' && Boolean(selectedCard);

    if (!isOpen) {
      shopPage.dataset.r34CategoryOpen = 'false';
      if (chooser) {
        chooser.hidden = false;
        chooser.style.removeProperty('display');
      }
      if (backButton) backButton.classList.add(HIDDEN_CLASS);
      setResultsVisible(shopPage, false);
    } else {
      if (chooser) chooser.hidden = false;
      if (backButton) backButton.classList.add(HIDDEN_CLASS);
      setResultsVisible(shopPage, true);
    }
  };

  document.addEventListener('click', (event) => {
    const card = event.target.closest?.('.r34-shop-category-card');
    if (!card || window.location.pathname !== '/shop') return;

    const shopPage = card.closest('.shop-page');
    if (!shopPage) return;

    /* Run after the original category handler has filtered the React products. */
    window.setTimeout(() => openCategory(shopPage, card), 20);
  }, true);

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enforceState();
    });
  };

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  window.addEventListener('popstate', queue);
  document.addEventListener('DOMContentLoaded', queue);
  installStyles();
  queue();
})();