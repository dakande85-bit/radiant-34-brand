(() => {
  const HIDDEN_CLASS = 'r34-shop-force-hidden';
  const SELECTED_CLASS = 'r34-shop-category-card--selected';

  const CATEGORY_IMAGES = {
    women: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-womens-dress-editorial.png?v=1784775279',
    men: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-follow-god-not-man-snapback-model.png?v=1784775143',
    womensOuterwear: '/images/radiant-cream-hoodie.png',
    mensOuterwear: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-unisex-bomber-jacket-white-front-6a6170040175a.jpg?v=1784770593',
    dresses: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-t-shirt-dress-white-front-6a61f2fc0fdf2.jpg?v=1784804134',
    tshirts: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/228c2e23-e93d-46ac-a7c0-f0e9d9b3d17f.webp?v=1784711348',
    tanks: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/bf1822ec-2f59-4a22-9850-6ff6ed0887bf.jpg?v=1784727959',
    headwear: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/classic-snapback-dark-navy-front-6a617b2f5d17f.jpg?v=1784773446',
    drinkware: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-his-peace-calmed-a-storm-mug-primary.png?v=1784714241',
    bags: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-duffle-bag-white-front-6a524d6683378.jpg?v=1783778670',
    accessories: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/d13309a6-e4d7-4c11-b7c2-1ac2f6451217.webp?v=1783929907',
    all: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-signature-hoodie-cream-primary_128d2f24-8bd2-4f6b-bdcc-bd432ee36ee6.png?v=1784758611',
  };

  const categories = [
    {
      key: 'women',
      label: 'Women',
      description: 'Dresses, T-shirts, tanks and selected Radiant 34 layers styled for women.',
      image: CATEGORY_IMAGES.women,
    },
    {
      key: 'men',
      label: 'Men',
      description: 'T-shirts, tanks, outerwear and headwear styled for men.',
      image: CATEGORY_IMAGES.men,
    },
    {
      key: 'womens-outerwear',
      label: "Women’s Outerwear",
      description: 'Hoodies and selected outerwear available for women in the current collection.',
      image: CATEGORY_IMAGES.womensOuterwear,
    },
    {
      key: 'mens-outerwear',
      label: "Men’s Outerwear",
      description: 'Bomber jackets and hoodies available for men in the current collection.',
      image: CATEGORY_IMAGES.mensOuterwear,
    },
    {
      key: 'dresses',
      label: 'Dresses',
      description: 'Statement T-shirt dresses created specifically for the women’s collection.',
      image: CATEGORY_IMAGES.dresses,
    },
    {
      key: 'tshirts',
      label: 'T-Shirts',
      description: 'Heavyweight, ringer and everyday Scripture T-shirts.',
      image: CATEGORY_IMAGES.tshirts,
    },
    {
      key: 'tanks',
      label: 'Tank Tops',
      description: 'Lightweight unisex Scripture tank tops for warm days and training.',
      image: CATEGORY_IMAGES.tanks,
    },
    {
      key: 'headwear',
      label: 'Headwear',
      description: 'Snapbacks and caps carrying clear Scripture-led statements.',
      image: CATEGORY_IMAGES.headwear,
    },
    {
      key: 'drinkware',
      label: 'Mugs & Drinkware',
      description: 'Scripture-led mugs and daily drinkware.',
      image: CATEGORY_IMAGES.drinkware,
    },
    {
      key: 'bags',
      label: 'Bags',
      description: 'Backpacks, totes and travel bags.',
      image: CATEGORY_IMAGES.bags,
    },
    {
      key: 'accessories',
      label: 'Accessories',
      description: 'Phone cases, keyrings and small everyday accessories.',
      image: CATEGORY_IMAGES.accessories,
    },
    {
      key: 'all',
      label: 'All Products',
      description: 'Browse every active Radiant 34 product.',
      image: CATEGORY_IMAGES.all,
    },
  ];

  const text = (node) => node?.textContent?.trim() ?? '';
  const containsAny = (value, terms) => terms.some((term) => value.includes(term));

  const productSignal = (card) => {
    const category = text(card.querySelector('.product-card__category'));
    const title = text(card.querySelector('.shopify-card__body strong'));
    const image = card.querySelector('.shopify-card__image img');
    const imageAlt = image?.getAttribute('alt') ?? '';
    const imageSrc = image?.getAttribute('src') ?? '';
    return `${category} ${title} ${imageAlt} ${imageSrc}`.toLowerCase();
  };

  const classifyCard = (card) => {
    const value = productSignal(card);
    const isDress = value.includes('dress');
    const isHeadwear = containsAny(value, ['snapback', 'dad hat', ' hat', 'cap', 'headwear']);
    const isBomber = value.includes('bomber');
    const isJacket = containsAny(value, ['jacket', 'outerwear']);
    const isHoodie = containsAny(value, ['hoodie', 'sweatshirt']);
    const isOuterwear = isBomber || isJacket || isHoodie;
    const isTank = value.includes('tank');
    const isTshirt = !isDress && containsAny(value, ['t-shirt', 'tshirt', 'ringer t-shirt', 'heavyweight scripture']);
    const isDrinkware = containsAny(value, ['mug', 'drinkware', 'bottle']);
    const isBag = containsAny(value, ['bag', 'backpack', 'duffle', 'tote']);
    const isAccessory = containsAny(value, ['phone case', 'tough case', 'keyring', 'keychain', 'accessories']);
    const explicitWomen = containsAny(value, [' women ', " women's ", ' womens ', 'female', 'ladies', '6a61746d245cf']);
    const explicitMen = containsAny(value, [' men ', " men's ", ' mens ', 'male', '6a6170040175a']);
    const menOnlyOuterwear = isOuterwear && (explicitMen || (isBomber && !explicitWomen));
    const womenOnlyOuterwear = isOuterwear && explicitWomen && !explicitMen;

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
      menOnlyOuterwear,
      womenOnlyOuterwear,
    };
  };

  const cardMatchesCategory = (card, category) => {
    if (category.key === 'all') return true;

    const kind = classifyCard(card);

    switch (category.key) {
      case 'women':
        return kind.isDress
          || kind.isTshirt
          || kind.isTank
          || (kind.isOuterwear && !kind.menOnlyOuterwear);
      case 'men':
        return !kind.isDress
          && !kind.womenOnlyOuterwear
          && (kind.isTshirt || kind.isTank || kind.isOuterwear || kind.isHeadwear);
      case 'womens-outerwear':
        return kind.isOuterwear && !kind.menOnlyOuterwear && !kind.isHeadwear && !kind.isDress;
      case 'mens-outerwear':
        return kind.isOuterwear && !kind.womenOnlyOuterwear && !kind.isHeadwear && !kind.isDress;
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
    const combinedSignature = `gender-separated-outerwear-v6|${signature}`;

    if (grid.dataset.r34CatalogSignature !== combinedSignature) {
      grid.dataset.r34CatalogSignature = combinedSignature;
      grid.innerHTML = '';

      categories.forEach((category) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'r34-shop-category-card';
        button.setAttribute('aria-label', `Shop ${category.label}`);
        button.setAttribute('aria-pressed', 'false');
        button.dataset.r34CategoryKey = category.key;
        button.innerHTML = `
          <img src="${category.image}" alt="${category.label}">
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