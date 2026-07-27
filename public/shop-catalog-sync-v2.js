(() => {
  const STYLE_ID = 'r34-shop-catalog-v2-styles';
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
    ['women', 'Women', 'Dresses, T-shirts, tanks and selected layers styled for women.', CATEGORY_IMAGES.women],
    ['men', 'Men', 'T-shirts, tanks, outerwear and headwear styled for men.', CATEGORY_IMAGES.men],
    ['womens-outerwear', 'Women’s Outerwear', 'Hoodies and outerwear selected for women.', CATEGORY_IMAGES.womensOuterwear],
    ['mens-outerwear', 'Men’s Outerwear', 'Bomber jackets and hoodies for men.', CATEGORY_IMAGES.mensOuterwear],
    ['dresses', 'Dresses', 'Statement T-shirt dresses from the women’s collection.', CATEGORY_IMAGES.dresses],
    ['tshirts', 'T-Shirts', 'Heavyweight, ringer and everyday Scripture T-shirts.', CATEGORY_IMAGES.tshirts],
    ['tanks', 'Tank Tops', 'Lightweight Scripture tank tops for warm days and training.', CATEGORY_IMAGES.tanks],
    ['headwear', 'Headwear', 'Snapbacks, dad hats and caps.', CATEGORY_IMAGES.headwear],
    ['drinkware', 'Mugs & Drinkware', 'Scripture-led mugs and daily drinkware.', CATEGORY_IMAGES.drinkware],
    ['bags', 'Bags', 'Backpacks, totes and travel bags.', CATEGORY_IMAGES.bags],
    ['accessories', 'Accessories', 'Phone cases, keyrings and everyday accessories.', CATEGORY_IMAGES.accessories],
    ['all', 'All Products', 'Browse every active Radiant 34 product.', CATEGORY_IMAGES.all],
  ].map(([key, label, description, image]) => ({ key, label, description, image }));

  const text = (node) => node?.textContent?.trim() ?? '';
  const containsAny = (value, terms) => terms.some((term) => value.includes(term));

  const installStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .shop-page[data-r34-category-open="false"] .shop-controls,
      .shop-page[data-r34-category-open="false"] .product-grid--shop,
      .shop-page[data-r34-category-open="false"] .r34-shop-results-heading,
      .shop-page[data-r34-category-open="false"] .r34-taxonomy-empty { display:none !important; }
      .shop-page .shop-controls .filters { display:none !important; }
      .r34-shop-category-card--selected { outline:3px solid #b98529 !important; outline-offset:3px; }
      .r34-shop-results-heading { margin:64px 0 24px; padding-top:34px; border-top:1px solid rgba(17,16,13,.16); }
      .r34-shop-results-heading .eyebrow { margin:0 0 10px; color:#b98529; font-size:.72rem; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }
      .r34-shop-results-heading h2 { margin:0; font-family:Georgia,'Times New Roman',serif; font-size:clamp(2rem,4vw,4rem); font-weight:400; line-height:1; }
      .r34-shop-results-heading p { max-width:620px; margin:14px 0 0; color:#74654e; line-height:1.65; }
      .shopify-card__description { min-height:3.3em; display:-webkit-box !important; overflow:hidden; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
    `;
    document.head.appendChild(style);
  };

  const signalForCard = (card) => {
    const category = text(card.querySelector('.product-card__category'));
    const title = text(card.querySelector('.shopify-card__body strong'));
    const image = card.querySelector('.shopify-card__image img');
    const link = card.querySelector('a[href*="/products/"]');
    return `${category} ${title} ${image?.alt ?? ''} ${image?.src ?? ''} ${link?.getAttribute('href') ?? ''}`.toLowerCase();
  };

  const classifyCard = (card) => {
    const value = signalForCard(card);
    const dress = containsAny(value, ['t-shirt dress', 'tshirt dress', ' dress']);
    const headwear = containsAny(value, ['snapback', 'dad hat', 'baseball cap', ' cap', ' hat', 'headwear']);
    const bomber = value.includes('bomber');
    const hoodie = containsAny(value, ['hoodie', 'sweatshirt']);
    const outerwear = bomber || hoodie || containsAny(value, ['jacket', 'outerwear']);
    const tank = !dress && containsAny(value, ['tank top', ' tank', 'tank']);
    const tshirt = !dress && !headwear && !outerwear && !tank
      && containsAny(value, ['t-shirt', 'tshirt', 'tee', 'crewneck shirt', 'heavyweight scripture']);
    const drinkware = containsAny(value, ['mug', 'drinkware', 'water bottle', 'bottle', 'tumbler']);
    const bag = containsAny(value, ['backpack', 'duffle', 'tote bag', 'shoulder bag', ' bag']);
    const accessory = containsAny(value, ['phone case', 'tough case', 'keyring', 'keychain', 'bracelet', 'accessor']);

    const explicitWomen = containsAny(value, [
      ' women ', " women's ", ' women’s ', ' womens ', 'female', 'ladies',
      '6a61746d245cf', '/products/unisex-bomber-jacket-1',
    ]);
    const explicitMen = !explicitWomen && containsAny(value, [
      ' men ', " men's ", ' men’s ', ' mens ', 'male',
      '6a6170040175a', '/products/unisex-bomber-jacket',
    ]);

    const menOnlyOuterwear = outerwear && explicitMen;
    const womenOnlyOuterwear = outerwear && explicitWomen;

    return {
      value, dress, headwear, bomber, hoodie, outerwear, tank, tshirt,
      drinkware, bag, accessory, menOnlyOuterwear, womenOnlyOuterwear,
    };
  };

  const categoryLabel = (kind) => {
    if (kind.dress) return 'Dress';
    if (kind.headwear) return 'Headwear';
    if (kind.outerwear && kind.womenOnlyOuterwear) return 'Women’s Outerwear';
    if (kind.outerwear && kind.menOnlyOuterwear) return 'Men’s Outerwear';
    if (kind.outerwear) return 'Outerwear';
    if (kind.tank) return 'Tank Top';
    if (kind.tshirt) return 'T-Shirt';
    if (kind.drinkware) return 'Drinkware';
    if (kind.bag) return 'Bag';
    if (kind.accessory) return 'Accessories';
    return 'Radiant 34';
  };

  const genericDescription = (kind) => {
    if (kind.dress) return 'A relaxed statement dress featuring original Radiant 34 artwork.';
    if (kind.headwear) return 'Everyday headwear carrying a clear Radiant 34 faith-led statement.';
    if (kind.outerwear && kind.womenOnlyOuterwear) return 'A women’s outerwear piece featuring original Radiant 34 artwork.';
    if (kind.outerwear && kind.menOnlyOuterwear) return 'A men’s outerwear piece featuring original Radiant 34 artwork.';
    if (kind.outerwear) return 'A Radiant 34 outerwear piece featuring original faith-led artwork.';
    if (kind.tank) return 'A lightweight tank top featuring original Radiant 34 artwork.';
    if (kind.tshirt) return 'A T-shirt featuring original Radiant 34 faith-led artwork.';
    if (kind.drinkware) return 'Everyday drinkware carrying a Radiant 34 faith-led design.';
    if (kind.bag) return 'An everyday bag designed for work, training, church and travel.';
    if (kind.accessory) return 'A practical everyday accessory featuring Radiant 34 artwork.';
    return 'An original Radiant 34 product designed for everyday use.';
  };

  const supplierCopy = (description) => {
    const value = description.toLowerCase();
    return description.length > 165 || containsAny(value, [
      'fabric weight', 'brushed fleece', 'overlock seams', '100% polyester', 'polyester •',
      'customizable', 'stuff of dreams', 'add a little zing', 'may vary by 5%',
      'blank product components', 'sourced from mexico', 'sourced from lithuania',
    ]);
  };

  const normalizeCard = (card) => {
    const titleNode = card.querySelector('.shopify-card__body strong');
    const categoryNode = card.querySelector('.product-card__category');
    const descriptionNode = card.querySelector('.shopify-card__description');
    if (!titleNode || !categoryNode) return;

    const originalSignal = signalForCard(card);
    const lowerTitle = text(titleNode).toLowerCase();
    let title = text(titleNode);
    let description = descriptionNode ? text(descriptionNode) : '';

    const womensBomber = containsAny(originalSignal, ['6a61746d245cf', '/products/unisex-bomber-jacket-1', 'women’s all-over print bomber']);
    const mensBomber = !womensBomber && containsAny(originalSignal, ['6a6170040175a', '/products/unisex-bomber-jacket']);

    if (lowerTitle.includes('bomber jacket') || originalSignal.includes('bomber jacket')) {
      if (womensBomber) {
        title = 'Radiant 34 Women’s All-Over Print Bomber Jacket';
        description = 'A lightweight women’s bomber jacket featuring original Radiant 34 all-over artwork.';
      } else if (mensBomber) {
        title = 'Radiant 34 Men’s Bomber Jacket';
        description = 'A lightweight men’s bomber jacket featuring original Radiant 34 artwork.';
      }
    } else if (lowerTitle.includes('heavyweight scripture t-shirt 04')) {
      title = 'Radiant 34 Faith Over Fear Heavyweight T-Shirt';
      description = 'A heavyweight T-shirt featuring the Faith Over Fear design.';
    } else if (lowerTitle.includes('heavyweight scripture t-shirt 05')) {
      title = 'Radiant 34 Jesus Is King Heavyweight T-Shirt';
      description = 'A heavyweight T-shirt featuring the Jesus Is King design.';
    }

    if (titleNode.textContent !== title) titleNode.textContent = title;
    const kind = classifyCard(card);
    const label = categoryLabel(kind);
    if (categoryNode.textContent !== label) categoryNode.textContent = label;

    if (descriptionNode) {
      const nextDescription = supplierCopy(description) ? genericDescription(kind) : description;
      if (descriptionNode.textContent !== nextDescription) descriptionNode.textContent = nextDescription;
    }

    card.dataset.r34Kind = kind.dress ? 'dress'
      : kind.headwear ? 'headwear'
      : kind.outerwear ? 'outerwear'
      : kind.tank ? 'tank'
      : kind.tshirt ? 'tshirt'
      : kind.drinkware ? 'drinkware'
      : kind.bag ? 'bag'
      : kind.accessory ? 'accessories'
      : 'other';
    card.dataset.r34MenOnlyOuterwear = kind.menOnlyOuterwear ? 'true' : 'false';
    card.dataset.r34WomenOnlyOuterwear = kind.womenOnlyOuterwear ? 'true' : 'false';
  };

  const matchesCategory = (card, key) => {
    if (key === 'all') return true;
    const kind = card.dataset.r34Kind || 'other';
    const menOnly = card.dataset.r34MenOnlyOuterwear === 'true';
    const womenOnly = card.dataset.r34WomenOnlyOuterwear === 'true';

    switch (key) {
      case 'women':
        return ['dress', 'tshirt', 'tank'].includes(kind) || (kind === 'outerwear' && !menOnly);
      case 'men':
        return !womenOnly && ['tshirt', 'tank', 'outerwear', 'headwear'].includes(kind);
      case 'womens-outerwear':
        return kind === 'outerwear' && !menOnly;
      case 'mens-outerwear':
        return kind === 'outerwear' && !womenOnly;
      case 'dresses': return kind === 'dress';
      case 'tshirts': return kind === 'tshirt';
      case 'tanks': return kind === 'tank';
      case 'headwear': return kind === 'headwear';
      case 'drinkware': return kind === 'drinkware';
      case 'bags': return kind === 'bag';
      case 'accessories': return kind === 'accessories';
      default: return false;
    }
  };

  const resetReactFilter = (shopPage) => {
    const allButton = Array.from(shopPage.querySelectorAll('.filters button'))
      .find((button) => text(button).toLowerCase() === 'all');
    allButton?.click();
  };

  const ensureChooser = (shopPage) => {
    const controls = shopPage.querySelector('.shop-controls');
    if (!controls) return null;

    let chooser = shopPage.querySelector('.r34-shop-categories');
    if (!chooser) {
      chooser = document.createElement('section');
      chooser.className = 'r34-shop-categories';
      controls.before(chooser);
    }

    let intro = chooser.querySelector('.r34-shop-category-intro');
    if (!intro) {
      intro = document.createElement('div');
      intro.className = 'r34-shop-category-intro';
      chooser.prepend(intro);
    }
    intro.innerHTML = '<h2>Shop by category.</h2><p>Choose a category to view the matching products.</p>';

    let grid = chooser.querySelector('.r34-shop-category-grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'r34-shop-category-grid';
      chooser.appendChild(grid);
    }

    const signature = 'authoritative-shop-categories-v9-womens-outerwear';
    if (grid.dataset.r34CatalogSignature !== signature) {
      grid.dataset.r34CatalogSignature = signature;
      grid.innerHTML = categories.map((category) => `
        <button type="button" class="r34-shop-category-card" data-r34-category-key="${category.key}" aria-label="Shop ${category.label}" aria-pressed="false">
          <img src="${category.image}" alt="${category.label}">
          <span class="r34-shop-category-card__copy">
            <strong>${category.label}</strong>
            <span>${category.description}</span>
          </span>
        </button>
      `).join('');
    }

    chooser.hidden = false;
    chooser.style.removeProperty('display');
    shopPage.querySelector('.r34-shop-back')?.remove();
    return chooser;
  };

  const ensureResultsHeading = (shopPage, category) => {
    const controls = shopPage.querySelector('.shop-controls');
    if (!controls) return null;
    let heading = shopPage.querySelector('.r34-shop-results-heading');
    if (!heading) {
      heading = document.createElement('div');
      heading.className = 'r34-shop-results-heading';
      controls.before(heading);
    }
    heading.innerHTML = `<p class="eyebrow">Selected category</p><h2>${category.label}</h2><p>${category.description}</p>`;
    heading.hidden = false;
    return heading;
  };

  const applyCategory = (shopPage, key, shouldScroll = false) => {
    const category = categories.find((item) => item.key === key);
    if (!category) return;

    resetReactFilter(shopPage);
    const cards = Array.from(shopPage.querySelectorAll('.product-grid--shop .shopify-card'));
    cards.forEach(normalizeCard);

    let visibleCount = 0;
    cards.forEach((card) => {
      const visible = matchesCategory(card, key);
      if (visible) {
        card.style.removeProperty('display');
        card.hidden = false;
        visibleCount += 1;
      } else {
        card.style.setProperty('display', 'none', 'important');
      }
      card.setAttribute('aria-hidden', visible ? 'false' : 'true');
    });

    shopPage.dataset.r34CategoryOpen = 'true';
    shopPage.dataset.r34SelectedCategory = key;

    const controls = shopPage.querySelector('.shop-controls');
    const productGrid = shopPage.querySelector('.product-grid--shop');
    [controls, productGrid].forEach((node) => {
      if (!node) return;
      node.hidden = false;
      node.style.removeProperty('display');
    });

    shopPage.querySelectorAll('.r34-shop-category-card').forEach((button) => {
      const selected = button.dataset.r34CategoryKey === key;
      button.classList.toggle(SELECTED_CLASS, selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    const heading = ensureResultsHeading(shopPage, category);
    let empty = shopPage.querySelector('.r34-taxonomy-empty');
    if (!empty) {
      empty = document.createElement('p');
      empty.className = 'shop-empty r34-taxonomy-empty';
      productGrid?.before(empty);
    }
    empty.textContent = 'No active products are currently available in this category.';
    empty.style.display = visibleCount ? 'none' : '';

    if (shouldScroll) window.setTimeout(() => heading?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  const showLanding = (shopPage) => {
    shopPage.dataset.r34CategoryOpen = 'false';
    delete shopPage.dataset.r34SelectedCategory;
    const controls = shopPage.querySelector('.shop-controls');
    const productGrid = shopPage.querySelector('.product-grid--shop');
    if (controls) controls.hidden = true;
    if (productGrid) productGrid.hidden = true;
    shopPage.querySelectorAll('.r34-shop-category-card').forEach((button) => {
      button.classList.remove(SELECTED_CLASS);
      button.setAttribute('aria-pressed', 'false');
    });
  };

  const sync = () => {
    if (window.location.pathname !== '/shop') return;
    installStyles();

    const shopPage = document.querySelector('.shop-page');
    const productGrid = shopPage?.querySelector('.product-grid--shop');
    const cards = Array.from(productGrid?.querySelectorAll('.shopify-card') ?? []);
    if (!shopPage || !productGrid || !cards.length) return;

    cards.forEach(normalizeCard);
    ensureChooser(shopPage);

    const selectedKey = shopPage.dataset.r34SelectedCategory;
    if (selectedKey) applyCategory(shopPage, selectedKey, false);
    else showLanding(shopPage);
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('.r34-shop-category-card');
    if (!button || window.location.pathname !== '/shop') return;

    const key = button.dataset.r34CategoryKey;
    const shopPage = button.closest('.shop-page');
    if (!key || !shopPage) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    applyCategory(shopPage, key, true);
  }, true);

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    });
  };

  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', queue);
  window.addEventListener('popstate', queue);
  queue();
})();