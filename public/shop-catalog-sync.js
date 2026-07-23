(() => {
  const HIDDEN_CLASS = 'r34-shop-force-hidden';
  const SELECTED_CLASS = 'r34-shop-category-card--selected';

  const UNISEX_APPAREL = ['t-shirt', 'tee', 'shirt', 'tank', 'hoodie', 'sweatshirt', 'jacket', 'bomber'];
  const OUTERWEAR = ['hoodie', 'sweatshirt', 'jacket', 'bomber', 'outerwear'];

  const categories = [
    {
      label: 'Women',
      description: 'Dresses and unisex Radiant 34 clothing styled for women.',
      matches: [...UNISEX_APPAREL, 'dress', 'women', 'woman', 'female'],
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-womens-dress-editorial.png?v=1784775279',
    },
    {
      label: 'Men',
      description: 'Unisex T-shirts, tanks, layers and headwear styled for men.',
      matches: [...UNISEX_APPAREL, 'snapback', 'hat', 'cap', 'headwear'],
      excludes: ['dress'],
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-follow-god-not-man-snapback-model.png?v=1784775143',
    },
    {
      label: "Women’s Outerwear",
      description: 'Unisex bombers and hoodies available for women in the current collection.',
      matches: OUTERWEAR,
    },
    {
      label: "Men’s Outerwear",
      description: 'Unisex bombers and hoodies available for men in the current collection.',
      matches: OUTERWEAR,
    },
    {
      label: 'Dresses',
      description: 'Statement T-shirt dresses created specifically for the women’s collection.',
      matches: ['dress'],
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-womens-dress-editorial.png?v=1784775279',
    },
    {
      label: 'T-Shirts',
      description: 'Heavyweight, ringer and everyday Scripture T-shirts.',
      matches: ['t-shirt', 'tee', 'shirt'],
      excludes: ['dress'],
    },
    {
      label: 'Tank Tops',
      description: 'Lightweight unisex Scripture tank tops for warm days and training.',
      matches: ['tank'],
    },
    {
      label: 'Headwear',
      description: 'Snapbacks and caps carrying clear Scripture-led statements.',
      matches: ['snapback', 'hat', 'cap', 'headwear'],
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-follow-god-not-man-snapback-model.png?v=1784775143',
    },
    {
      label: 'Mugs & Drinkware',
      description: 'Scripture-led mugs and daily drinkware.',
      matches: ['drinkware', 'mug', 'bottle', 'drink'],
    },
    {
      label: 'Bags',
      description: 'Backpacks, totes and travel bags.',
      matches: ['bag', 'backpack', 'duffle', 'tote'],
    },
    {
      label: 'Accessories',
      description: 'Phone cases, keyrings and small everyday accessories.',
      matches: ['accessories', 'case', 'keyring', 'keychain'],
    },
    {
      label: 'All Products',
      description: 'Browse every active Radiant 34 product.',
      matches: [],
    },
  ];

  const text = (node) => node?.textContent?.trim() ?? '';

  const cardHaystack = (card) =>
    `${text(card.querySelector('.product-card__category'))} ${text(card.querySelector('.shopify-card__body strong'))} ${text(card.querySelector('.shopify-card__description'))}`.toLowerCase();

  const cardMatchesCategory = (card, category) => {
    if (!category.matches.length) return true;
    const haystack = cardHaystack(card);
    const included = category.matches.some((term) => haystack.includes(term));
    const excluded = (category.excludes ?? []).some((term) => haystack.includes(term));
    return included && !excluded;
  };

  const matchingCard = (cards, category) => {
    if (!category.matches.length) return cards[0] ?? null;
    return cards.find((card) => cardMatchesCategory(card, category)) ?? null;
  };

  const resetReactFilter = (shopPage) => {
    const allButton = Array.from(shopPage.querySelectorAll('.filters button'))
      .find((item) => text(item).toLowerCase() === 'all');
    allButton?.click();
  };

  const applySelectedCategory = (shopPage) => {
    const selectedLabel = shopPage.dataset.r34SelectedCategory;
    if (!selectedLabel) return;

    const category = categories.find((item) => item.label === selectedLabel);
    if (!category) return;

    const cards = Array.from(shopPage.querySelectorAll('.product-grid--shop .shopify-card'));
    let visibleCount = 0;

    cards.forEach((card) => {
      const visible = cardMatchesCategory(card, category);
      card.style.display = visible ? '' : 'none';
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
    shopPage.dataset.r34SelectedCategory = category.label;
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
    }, 50);
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
    const taxonomyVersion = 'gender-outerwear-v2';
    const combinedSignature = `${taxonomyVersion}|${signature}`;

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