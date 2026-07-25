(() => {
  const PRODUCT_TITLE = 'Radiant 34 Men’s Bomber Jacket';
  const PRODUCT_CATEGORY = 'Men’s Outerwear';
  const PRODUCT_DESCRIPTION = 'A lightweight men’s bomber jacket featuring original Radiant 34 artwork.';

  const text = (node) => node?.textContent?.trim() ?? '';
  const isBomberText = (value) => {
    const normalized = String(value || '').toLowerCase();
    return normalized.includes('bomber jacket') || normalized.includes('unisex bomber');
  };

  const selectedCategoryAllowsBomber = (selectedKey) =>
    !selectedKey || ['all', 'men', 'mens-outerwear'].includes(selectedKey);

  const fixShopCards = () => {
    if (window.location.pathname !== '/shop') return;

    const shopPage = document.querySelector('.shop-page');
    if (!shopPage) return;

    const selectedKey = shopPage.dataset.r34SelectedCategory || '';

    shopPage.querySelectorAll('.product-grid--shop .shopify-card').forEach((card) => {
      const titleNode = card.querySelector('.shopify-card__body strong');
      const imageAlt = card.querySelector('.shopify-card__image img')?.getAttribute('alt') ?? '';
      if (!isBomberText(`${text(titleNode)} ${imageAlt}`)) return;

      if (titleNode) titleNode.textContent = PRODUCT_TITLE;

      const categoryNode = card.querySelector('.product-card__category');
      if (categoryNode) categoryNode.textContent = PRODUCT_CATEGORY;

      const descriptionNode = card.querySelector('.shopify-card__description');
      if (descriptionNode) descriptionNode.textContent = PRODUCT_DESCRIPTION;

      card.dataset.r34ProductKind = 'outerwear';
      card.dataset.r34MenOnlyOuterwear = 'true';
      card.dataset.r34WomenOnlyOuterwear = 'false';

      const visible = selectedCategoryAllowsBomber(selectedKey);
      if (visible) {
        card.style.removeProperty('display');
        card.hidden = false;
      } else {
        card.style.setProperty('display', 'none', 'important');
      }
      card.setAttribute('aria-hidden', visible ? 'false' : 'true');
    });
  };

  const fixProductPage = () => {
    const detail = document.querySelector('.product-detail');
    if (!detail) return;

    const titleNode = detail.querySelector('.product-detail__copy h2');
    const imageAlts = Array.from(detail.querySelectorAll('.product-gallery img'))
      .map((image) => image.getAttribute('alt') || '')
      .join(' ');
    if (!isBomberText(`${text(titleNode)} ${imageAlts}`)) return;

    if (titleNode) titleNode.textContent = PRODUCT_TITLE;

    const categoryNode = detail.querySelector('.product-category');
    if (categoryNode) categoryNode.textContent = PRODUCT_CATEGORY;

    const descriptionNode = detail.querySelector('.product-description');
    if (descriptionNode) descriptionNode.textContent = PRODUCT_DESCRIPTION;
  };

  const fixCartTitles = () => {
    document.querySelectorAll('.cart-line strong').forEach((titleNode) => {
      if (isBomberText(text(titleNode))) titleNode.textContent = PRODUCT_TITLE;
    });
  };

  const apply = () => {
    fixShopCards();
    fixProductPage();
    fixCartTitles();
  };

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        queued = false;
        apply();
      });
    });
  };

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener('DOMContentLoaded', queue);
  document.addEventListener('click', () => window.setTimeout(queue, 100), true);
  window.addEventListener('popstate', queue);
  queue();
})();