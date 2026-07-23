(() => {
  const HIDDEN_CLASS = 'r34-shop-force-hidden';
  const SELECTED_CLASS = 'r34-shop-category-card--selected';

  const categories = [
    {
      label: 'Women',
      filter: 'All',
      description: 'Statement dresses and future women’s pieces in the new Radiant 34 campaign direction.',
      matches: ['dress', 'women', 'woman', 'female'],
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-womens-dress-editorial.png?v=1784775279',
    },
    {
      label: 'T-Shirts',
      filter: 'Tees',
      description: 'Heavyweight, ringer and everyday Scripture T-shirts.',
      matches: ['t-shirt', 'tee', 'shirt'],
      excludes: ['dress'],
    },
    {
      label: 'Tank Tops',
      filter: 'Tanks',
      description: 'Lightweight Scripture tank tops for warm days and training.',
      matches: ['tank'],
    },
    {
      label: 'Hoodies',
      filter: 'Hoodies',
      description: 'Signature and everyday Radiant 34 layers.',
      matches: ['hoodie', 'sweatshirt'],
    },
    {
      label: 'Outerwear',
      filter: 'All',
      description: 'Bomber jackets and statement layers built around the new visual direction.',
      matches: ['jacket', 'bomber', 'outerwear'],
    },
    {
      label: 'Headwear',
      filter: 'All',
      description: 'Snapbacks and caps carrying clear Scripture-led statements.',
      matches: ['snapback', 'hat', 'cap', 'headwear'],
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-follow-god-not-man-snapback-model.png?v=1784775143',
    },
    {
      label: 'Mugs & Drinkware',
      filter: 'Drinkware',
      description: 'Scripture-led mugs and daily drinkware.',
      matches: ['drinkware', 'mug', 'bottle', 'drink'],
    },
    {
      label: 'Bags',
      filter: 'Bags',
      description: 'Backpacks, totes and travel bags.',
      matches: ['bag', 'backpack', 'duffle', 'tote'],
    },
    {
      label: 'Accessories',
      filter: 'Accessories',
      description: 'Phone cases, keyrings and everyday accessories.',
      matches: ['accessories', 'case', 'keyring', 'keychain'],
    },
    {
      label: 'All Products',
      filter: 'All',
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

  const clickFilter = (shopPage, label) => {
    const button = Array.from(shopPage.querySelectorAll('.filters button'))
      .find((item) => text(item).toLowerCase() === label.toLowerCase());
    button?.click();
  };

  const applySelectedCategory = (shopPage) => {
    const selectedLabel = shopPage.dataset.r34SelectedCategory;
    if (!selectedLabel) return;

    const category = categories.find((item) => item.label === selectedLabel);
    if (!category) return;

    const cards = Array.from(shopPage.querySelectorAll('.product-grid--shop .shopify-card'));
    cards.forEach((card) => {
      card.style.display = cardMatchesCategory(card, category) ? '' : 'none';
    });

    const empty = shopPage.querySelector('.shop-empty');
    if (empty && text(empty) === 'No products match this filter.') {
      empty.style.display = cards.some((card) => cardMatchesCategory(card, category)) ? 'none' : '';
    }
  };

  const showResults = (shopPage, selectedButton, category) => {
    shopPage.dataset.r34CategoryOpen = 'true';
    shopPage.dataset.r34SelectedCategory = category.label;
    clickFilter(shopPage, category.filter);

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

    if (grid.dataset.r34CatalogSignature !== signature) {
      grid.dataset.r34CatalogSignature = signature;
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