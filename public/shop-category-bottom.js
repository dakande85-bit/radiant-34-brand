(() => {
  const SELECTED_CLASS = 'r34-shop-category-card--selected';

  const installStyles = () => {
    if (document.getElementById('r34-shop-category-bottom-styles')) return;

    const style = document.createElement('style');
    style.id = 'r34-shop-category-bottom-styles';
    style.textContent = `
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

  const text = (node) => node?.textContent?.trim() ?? '';

  const ensureResultsHeading = (shopPage, selectedCard) => {
    const controls = shopPage.querySelector('.shop-controls');
    if (!controls) return;

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
    heading.hidden = false;
  };

  const keepCategoriesAboveProducts = (shopPage, selectedCard) => {
    const chooser = shopPage.querySelector('.r34-shop-categories');
    const controls = shopPage.querySelector('.shop-controls');
    const productGrid = shopPage.querySelector('.product-grid--shop');
    const backButton = shopPage.querySelector('.r34-shop-back');

    shopPage.dataset.r34CategoryOpen = 'true';
    if (chooser) chooser.hidden = false;
    if (controls) controls.hidden = false;
    if (productGrid) productGrid.hidden = false;
    if (backButton) backButton.hidden = true;

    shopPage.querySelectorAll('.r34-shop-category-card').forEach((card) => {
      card.classList.toggle(SELECTED_CLASS, card === selectedCard);
      card.setAttribute('aria-pressed', card === selectedCard ? 'true' : 'false');
    });

    ensureResultsHeading(shopPage, selectedCard);
  };

  const enforceInitialState = () => {
    if (window.location.pathname !== '/shop') return;

    installStyles();
    const shopPage = document.querySelector('.shop-page');
    if (!shopPage) return;

    const chooser = shopPage.querySelector('.r34-shop-categories');
    const controls = shopPage.querySelector('.shop-controls');
    const productGrid = shopPage.querySelector('.product-grid--shop');
    const backButton = shopPage.querySelector('.r34-shop-back');
    const resultsHeading = shopPage.querySelector('.r34-shop-results-heading');

    if (shopPage.dataset.r34CategoryOpen !== 'true') {
      if (chooser) chooser.hidden = false;
      if (controls) controls.hidden = true;
      if (productGrid) productGrid.hidden = true;
      if (backButton) backButton.hidden = true;
      if (resultsHeading) resultsHeading.hidden = true;
    } else if (backButton) {
      backButton.hidden = true;
    }
  };

  document.addEventListener('click', (event) => {
    const card = event.target.closest?.('.r34-shop-category-card');
    if (!card || window.location.pathname !== '/shop') return;

    const shopPage = card.closest('.shop-page');
    if (!shopPage) return;

    window.setTimeout(() => keepCategoriesAboveProducts(shopPage, card), 0);
  }, true);

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enforceInitialState();
    });
  };

  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', queue);
  queue();
})();