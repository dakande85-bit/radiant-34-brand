(() => {
  const STYLE_ID = 'r34-shop-product-accuracy-styles';

  const text = (node) => node?.textContent?.trim() ?? '';
  const containsAny = (value, terms) => terms.some((term) => value.includes(term));

  const installStyles = () => {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .shop-page .shop-controls .filters {
        display: none !important;
      }

      .shopify-card__description {
        min-height: 3.3em;
        display: -webkit-box !important;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    `;
    document.head.appendChild(style);
  };

  const signalForCard = (card) => {
    const category = text(card.querySelector('.product-card__category'));
    const title = text(card.querySelector('.shopify-card__body strong'));
    const image = card.querySelector('.shopify-card__image img');
    const imageAlt = image?.getAttribute('alt') ?? '';
    const imageSrc = image?.getAttribute('src') ?? '';
    return `${category} ${title} ${imageAlt} ${imageSrc}`.toLowerCase();
  };

  const classifySignal = (value) => {
    const isDress = containsAny(value, ['t-shirt dress', 'tshirt dress', ' dress']);
    const isHeadwear = containsAny(value, ['snapback', 'dad hat', 'baseball cap', ' cap', 'headwear']);
    const isBomber = value.includes('bomber');
    const isJacket = containsAny(value, ['jacket', 'outerwear']);
    const isHoodie = containsAny(value, ['hoodie', 'sweatshirt']);
    const isOuterwear = isBomber || isJacket || isHoodie;
    const isTank = !isDress && containsAny(value, ['tank top', ' tank', 'tank']);
    const isDrinkware = containsAny(value, ['mug', 'drinkware', 'water bottle', 'tumbler']);
    const isBag = containsAny(value, ['backpack', 'duffle', 'tote bag', 'shoulder bag', ' bag']);
    const isAccessory = containsAny(value, ['phone case', 'tough case', 'keyring', 'keychain', 'bracelet', 'accessor']);
    const isTshirt = !isDress
      && !isHeadwear
      && !isOuterwear
      && !isTank
      && containsAny(value, ['t-shirt', 'tshirt', 'tee', 'crewneck shirt', 'heavyweight scripture']);
    const explicitWomen = containsAny(value, [' women ', " women's ", ' womens ', 'female', 'ladies', '6a61746d245cf']);
    const explicitMen = containsAny(value, [' men ', " men's ", ' mens ', 'male', '6a6170040175a']);
    const menOnlyOuterwear = isOuterwear && (explicitMen || (isBomber && !explicitWomen));
    const womenOnlyOuterwear = isOuterwear && explicitWomen && !explicitMen;

    return {
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

  const productKind = (kind) => {
    if (kind.isDress) return 'dress';
    if (kind.isHeadwear) return 'headwear';
    if (kind.isOuterwear) return 'outerwear';
    if (kind.isTank) return 'tank';
    if (kind.isTshirt) return 'tshirt';
    if (kind.isDrinkware) return 'drinkware';
    if (kind.isBag) return 'bag';
    if (kind.isAccessory) return 'accessories';
    return 'other';
  };

  const categoryLabel = (kind) => {
    if (kind.isDress) return 'Dress';
    if (kind.isHeadwear) return 'Headwear';
    if (kind.isOuterwear) return 'Outerwear';
    if (kind.isTank) return 'Tank';
    if (kind.isTshirt) return 'T-Shirt';
    if (kind.isDrinkware) return 'Drinkware';
    if (kind.isBag) return 'Bag';
    if (kind.isAccessory) return 'Accessories';
    return 'Radiant 34';
  };

  const genericDescription = (kind) => {
    if (kind.isDress) return 'A relaxed statement dress featuring original Radiant 34 artwork.';
    if (kind.isHeadwear) return 'Everyday headwear carrying a clear Radiant 34 faith-led statement.';
    if (kind.isOuterwear) return 'A Radiant 34 outerwear piece featuring original faith-led artwork.';
    if (kind.isTank) return 'A lightweight unisex tank top featuring Radiant 34 artwork.';
    if (kind.isTshirt) return 'A unisex T-shirt featuring original Radiant 34 faith-led artwork.';
    if (kind.isDrinkware) return 'Everyday drinkware carrying a Radiant 34 faith-led design.';
    if (kind.isBag) return 'An everyday bag designed for work, training, church and travel.';
    if (kind.isAccessory) return 'A practical everyday accessory featuring Radiant 34 artwork.';
    return 'An original Radiant 34 product designed for everyday use.';
  };

  const supplierCopy = (description) => {
    const value = description.toLowerCase();
    return description.length > 165
      || containsAny(value, [
        'fabric weight',
        'brushed fleece',
        'overlock seams',
        '100% polyester',
        'polyester •',
        'customizable',
        'stuff of dreams',
        'add a little zing',
        'may vary by 5%',
      ]);
  };

  const normalizeCard = (card) => {
    const titleNode = card.querySelector('.shopify-card__body strong');
    const categoryNode = card.querySelector('.product-card__category');
    const descriptionNode = card.querySelector('.shopify-card__description');
    if (!titleNode || !categoryNode) return;

    const originalTitle = text(titleNode);
    const lowerTitle = originalTitle.toLowerCase();

    let publicTitle = originalTitle;
    let publicDescription = descriptionNode ? text(descriptionNode) : '';

    if (lowerTitle === 'unisex bomber jacket' || (lowerTitle.includes('bomber jacket') && !lowerTitle.includes('radiant 34'))) {
      publicTitle = 'Radiant 34 Men’s All-Over Print Bomber Jacket';
      publicDescription = 'A lightweight men’s bomber jacket featuring original Radiant 34 artwork.';
    }

    if (lowerTitle.includes('heavyweight scripture t-shirt 04')) {
      publicTitle = 'Radiant 34 Faith Over Fear Heavyweight T-Shirt';
      publicDescription = 'A heavyweight unisex T-shirt featuring the Faith Over Fear design.';
    }

    if (lowerTitle.includes('heavyweight scripture t-shirt 05')) {
      publicTitle = 'Radiant 34 Jesus Is King Heavyweight T-Shirt';
      publicDescription = 'A heavyweight unisex T-shirt featuring the Jesus Is King design.';
    }

    if (titleNode.textContent !== publicTitle) titleNode.textContent = publicTitle;

    const kind = classifySignal(`${publicTitle} ${categoryNode.textContent ?? ''} ${signalForCard(card)}`.toLowerCase());
    const correctCategory = categoryLabel(kind);
    if (categoryNode.textContent !== correctCategory) categoryNode.textContent = correctCategory;

    if (descriptionNode) {
      const currentDescription = publicDescription || text(descriptionNode);
      const correctDescription = supplierCopy(currentDescription)
        ? genericDescription(kind)
        : currentDescription;
      if (descriptionNode.textContent !== correctDescription) descriptionNode.textContent = correctDescription;
    }

    card.dataset.r34ProductKind = productKind(kind);
    card.dataset.r34MenOnlyOuterwear = kind.menOnlyOuterwear ? 'true' : 'false';
    card.dataset.r34WomenOnlyOuterwear = kind.womenOnlyOuterwear ? 'true' : 'false';
  };

  const matchesSelectedCategory = (card, selectedKey) => {
    if (!selectedKey || selectedKey === 'all') return true;

    const kind = card.dataset.r34ProductKind || productKind(classifySignal(signalForCard(card)));
    const menOnlyOuterwear = card.dataset.r34MenOnlyOuterwear === 'true';
    const womenOnlyOuterwear = card.dataset.r34WomenOnlyOuterwear === 'true';

    switch (selectedKey) {
      case 'women':
        return ['dress', 'tshirt', 'tank'].includes(kind)
          || (kind === 'outerwear' && !menOnlyOuterwear);
      case 'men':
        return !womenOnlyOuterwear && ['tshirt', 'tank', 'outerwear', 'headwear'].includes(kind);
      case 'womens-outerwear':
        return kind === 'outerwear' && !menOnlyOuterwear;
      case 'mens-outerwear':
        return kind === 'outerwear' && !womenOnlyOuterwear;
      case 'dresses':
        return kind === 'dress';
      case 'tshirts':
        return kind === 'tshirt';
      case 'tanks':
        return kind === 'tank';
      case 'headwear':
        return kind === 'headwear';
      case 'drinkware':
        return kind === 'drinkware';
      case 'bags':
        return kind === 'bag';
      case 'accessories':
        return kind === 'accessories';
      default:
        return true;
    }
  };

  const resetReactFilter = (shopPage) => {
    const allButton = Array.from(shopPage.querySelectorAll('.filters button'))
      .find((button) => text(button).toLowerCase() === 'all');
    allButton?.click();
  };

  const selectedKeyFromCard = (card) => {
    if (card.dataset.r34CategoryKey) return card.dataset.r34CategoryKey;
    const label = text(card.querySelector('strong')).toLowerCase();
    const labels = {
      women: 'women',
      men: 'men',
      'women’s outerwear': 'womens-outerwear',
      "women's outerwear": 'womens-outerwear',
      'men’s outerwear': 'mens-outerwear',
      "men's outerwear": 'mens-outerwear',
      dresses: 'dresses',
      't-shirts': 'tshirts',
      'tank tops': 'tanks',
      headwear: 'headwear',
      'mugs & drinkware': 'drinkware',
      bags: 'bags',
      accessories: 'accessories',
      'all products': 'all',
    };
    return labels[label] || '';
  };

  const applySelectedCategory = () => {
    if (window.location.pathname !== '/shop') return;

    installStyles();
    const shopPage = document.querySelector('.shop-page');
    if (!shopPage) return;

    const cards = Array.from(shopPage.querySelectorAll('.product-grid--shop .shopify-card'));
    cards.forEach(normalizeCard);

    const selectedKey = shopPage.dataset.r34SelectedCategory;
    if (!selectedKey) return;

    let visibleCount = 0;
    cards.forEach((card) => {
      const visible = matchesSelectedCategory(card, selectedKey);
      if (visible) {
        card.style.removeProperty('display');
        card.hidden = false;
        visibleCount += 1;
      } else {
        card.style.setProperty('display', 'none', 'important');
      }
      card.setAttribute('aria-hidden', visible ? 'false' : 'true');
    });

    shopPage.querySelectorAll('.shop-empty').forEach((empty) => {
      const copy = text(empty).toLowerCase();
      if (copy.includes('no products') || empty.classList.contains('r34-taxonomy-empty')) {
        empty.style.display = visibleCount ? 'none' : '';
      }
    });
  };

  const queueRepeatedApply = () => {
    [0, 60, 180, 420].forEach((delay) => window.setTimeout(applySelectedCategory, delay));
  };

  document.addEventListener('click', (event) => {
    const card = event.target.closest?.('.r34-shop-category-card');
    if (!card || window.location.pathname !== '/shop') return;

    const shopPage = card.closest('.shop-page');
    const selectedKey = selectedKeyFromCard(card);
    if (!shopPage || !selectedKey) return;

    shopPage.dataset.r34SelectedCategory = selectedKey;
    shopPage.dataset.r34CategoryOpen = 'true';
    resetReactFilter(shopPage);
    queueRepeatedApply();
  }, true);

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        queued = false;
        applySelectedCategory();
      });
    });
  };

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener('DOMContentLoaded', queue);
  window.addEventListener('popstate', queueRepeatedApply);
  queue();
})();