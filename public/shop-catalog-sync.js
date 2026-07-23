(() => {
  const HIDDEN_CLASS = 'r34-shop-force-hidden';
  const SELECTED_CLASS = 'r34-shop-category-card--selected';

  const WOMENS_CAMPAIGN_IMAGE = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-womens-dress-editorial.png?v=1784775279';
  const MENS_CAMPAIGN_IMAGE = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-follow-god-not-man-snapback-model.png?v=1784775143';
  const WOMENS_OUTERWEAR_IMAGE = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-unisex-bomber-jacket-white-front-6a61746d245cf.jpg?v=1784771725';
  const MENS_OUTERWEAR_IMAGE = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-unisex-bomber-jacket-white-front-6a6170040175a.jpg?v=1784770593';

  const categories = [
    {
      key: 'women',
      label: 'Women',
      description: 'Dresses and selected unisex Radiant 34 clothing styled for women.',
      image: WOMENS_CAMPAIGN_IMAGE,
    },
    {
      key: 'men',
      label: 'Men',
      description: 'Unisex T-shirts, tanks, layers and headwear styled for men.',
      image: MENS_CAMPAIGN_IMAGE,
    },
    {
      key: 'womens-outerwear',
      label: "Women’s Outerwear",
      description: 'Bomber jackets and hoodies available for women in the current collection.',
      image: WOMENS_OUTERWEAR_IMAGE,
    },
    {
      key: 'mens-outerwear',
      label: "Men’s Outerwear",
      description: 'Bomber jackets and hoodies available for men in the current collection.',
      image: MENS_OUTERWEAR_IMAGE,
    },
    {
      key: 'dresses',
      label: 'Dresses',
      description: 'Statement T-shirt dresses created specifically for the women’s collection.',
      image: WOMENS_CAMPAIGN_IMAGE,
    },
    {
      key: 'tshirts',
      label: 'T-Shirts',
      description: 'Heavyweight, ringer and everyday Scripture T-shirts.',
    },
    {
      key: 'tanks',
      label: 'Tank Tops',
      description: 'Lightweight unisex Scripture tank tops for warm days and training.',
    },
    {
      key: 'headwear',
      label: 'Headwear',
      description: 'Snapbacks and caps carrying clear Scripture-led statements.',
      image: MENS_CAMPAIGN_IMAGE,
    },
    {
      key: 'drinkware',
      label: 'Mugs & Drinkware',
      description: 'Scripture-led mugs and daily drinkware.',
    },
    {
      key: 'bags',
      label: 'Bags',
      description: 'Backpacks, totes and travel bags.',
    },
    {
      key: 'accessories',
      label: 'Accessories',
      description: 'Phone cases, keyrings and small everyday accessories.',
    },
    {
      key: 'all',
      label: 'All Products',
      description: 'Browse every active Radiant 34 product.',
    },
  ];

  const text = (node) => node?.textContent?.trim() ?? '';
  const productText = (card) =>
    `${text(card.querySelector('.product-card__category'))} ${text(card.querySelector('.shopify-card__body strong'))}`.toLowerCase();

  const containsAny = (value, terms) => terms.some((term) => value.includes(term));

  const classifyCard = (card) => {
    const value = productText(card);
    const isDress = value.includes('dress');
    const isHeadwear = containsAny(value, ['snapback', 'dad hat', ' hat', 'cap', 'headwear']);
    const isOuterwear = containsAny(value, ['hoodie', 'sweatshirt', 'bomber', 'jacket', 'outerwear']);
    const isTank = value.includes('tank');
    const isTshirt = !isDress && containsAny(value, ['t-shirt', 'tshirt', 'ringer t-shirt', 'heavyweight scripture']);
    const isDrinkware = containsAny(value, ['mug', 'drinkware', 'bottle']);
    const isBag = containsAny(value, ['bag', 'backpack', 'duffle', 'tote']);
    const isAccessory = containsAny(value, ['phone case', 'tough case', 'keyring', 'keychain', 'accessories']);

    return {
      value,
      isDress,
      isHeadwear,
      isOuterwear,
      isTank,
      isTshirt,
      isDrinkware,
      isBag,
      isAccessory,
    };
  };

  const cardMatchesCategory = (card, category) => {
    if (category.key === 'all') return true;

    const kind = classifyCard(card);

    switch (category.key) {
      case 'women':
        return kind.isDress || kind.isTshirt || kind.isTank || kind.isOuterwear;
      case 'men':
        return !kind.isDress && (kind.isTshirt || kind.isTank || kind.isOuterwear || kind.isHeadwear);
      case 'womens-outerwear':
      case 'mens-outerwear':
        return kind.isOuterwear && !kind.isHeadwear && !kind.isDress;
      case 'dresses':
        return kind.isDress;
      case 'tshirts':
        return kind.isTshirt;
      case 'tanks':
        return kind.isTank;
      case 'headwear':
        return kind.isHeadwear && !kind.isOuterwear;
      case 'drinkware':
        return kind.isDrinkware;
      case 'bags':
        return kind.isBag;
      case 'accessories':
        return kind.isAccessory;
      default:
        return false;
    }
  };

  const matchingCard = (cards, category) => cards.find((card) => cardMatchesCategory(card, category)) ?? null;

  const resetReactFilter = (shopPage) => {
    const allButton = Array.from(shopPage.querySelectorAll('.filters button'))
      .find((item) => text(item).toLowerCase() === 'all');
    allButton?.click();
  };

  const applySelectedCategory = (shopPage) => {
    const selectedKey = shopPage.dataset.r34SelectedCategory;
    if (!selectedKey) return;

    const category = categories.find((item) => item.key === selectedKey);
    if (!category) return;

    const cards = Array.from(shopPage.querySelectorAll('.product-grid--shop .shopify-card'));
    let visibleCount = 0;

    cards.forEach((card) => {
      const visible = cardMatchesCategory(card, category);
      card.style.setProperty('display', visible ? '' : 'none', visible ? '' : 'important');
      card.setAttribute('aria-hidden', visible ? 'false' : 'true');
      if (visible) visibleCount += 1;
    });

    let empty = shopPage.querySelector('.r34-taxonomy-empty');
    if (!empty) {
      empty = document.createElement('p');
      empty.className = 'shop-empty r34-taxonomy-empty';
      empty.textContent = 'No active products are currently available in this category.';
      shopPage.querySelector('.product-grid--shop')?.before(empty);
    }
    empty.style.display = visibleCount ? 'none' : '';
  };

  const showResults = (shopPage, selectedButton, category) => {
    shopPage.dataset.r34CategoryOpen = 'true';
    shopPage.dataset.r34SelectedCategory = category.key;
    resetReactFilter(shopPage);

    const chooser = shopPage.querySelector('.r34-shop-categories');
    const controls = shopPage.querySelector('.shop-controls');
    const productGrid = shopPage.querySelector('.product-grid--shop');

    if (chooser) {
      chooser.hidden = false;
      chooser.style.removeProperty('display');
    }

    [controls, productGrid].forEach((node) => {
      if (!node) return;
      node.hidden = false;
      node.classList.remove(HIDDEN_CLASS);
      node.style.removeProperty('display');
    });

    shopPage.querySelectorAll('.r34-shop-category-card').forEach((button) => {
      const selected = button === selectedButton;
      button.classList.toggle(SELECTED_CLASS, selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    window.setTimeout(() => {
      applySelectedCategory(shopPage);
      const heading = shopPage.querySelector('.r34-shop-results-heading');
      heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const rebuildCategories = () => {
    if (window.location.pathname !== '/shop') return;

    const shopPage = document.querySelector('.shop-page');
    const productGrid = shopPage?.querySelector('.product-grid--shop');
    const cards = Array.from(productGrid?.querySelectorAll('.shopify-card') ?? []);
    if (!shopPage || !productGrid || !cards.length) return;

    const chooser = shopPage.querySelector('.r34-shop-categories');
    const grid = chooser?.querySelector('.r34-shop-category-grid');
    if (!chooser || !grid) return;

    const signature = cards
      .map((card) => `${text(card.querySelector('.product-card__category'))}:${text(card.querySelector('.shopify-card__body strong'))}`)
      .sort()
      .join('|');
    const combinedSignature = `strict-taxonomy-v3|${signature}`;

    if (grid.dataset.r34CatalogSignature !== combinedSignature) {
      grid.dataset.r34CatalogSignature = combinedSignature;
      grid.innerHTML = '';

      categories.forEach((category) => {
        const sourceCard = matchingCard(cards, category);
        if (!sourceCard && !category.image) return;

        const sourceImage = sourceCard?.querySelector('.shopify-card__hover[src]')
          ?? sourceCard?.querySelector('.shopify-card__image img[src]');
        const imageUrl = category.image ?? sourceImage?.src;
        if (!imageUrl) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'r34-shop-category-card';
        button.setAttribute('aria-label', `Shop ${category.label}`);
        button.setAttribute('aria-pressed', 'false');
        button.dataset.r34CategoryKey = category.key;
        button.innerHTML = `
          <img src="${imageUrl}" alt="${category.label}">
          <span class="r34-shop-category-card__copy">
            <strong>${category.label}</strong>
            <span>${category.description}</span>
          </span>
        `;
        button.addEventListener('click', () => showResults(shopPage, button, category));
        grid.appendChild(button);
      });
    }

    applySelectedCategory(shopPage);
  };

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      rebuildCategories();
    });
  };

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  window.addEventListener('popstate', queue);
  document.addEventListener('DOMContentLoaded', queue);
  document.addEventListener('click', () => setTimeout(queue, 0));
  queue();
})();