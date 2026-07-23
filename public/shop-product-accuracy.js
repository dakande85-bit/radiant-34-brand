(() => {
  const STYLE_ID = 'r34-shop-product-accuracy-styles';

  const text = (node) => node?.textContent?.trim() ?? '';
  const containsAny = (value, terms) => terms.some((term) => value.includes(term));

  const installStyles = () => {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Category selection is handled by the visual category cards above the products. */
      .shop-page .shop-controls .filters {
        display: none !important;
      }

      /* Keep every product card compact and aligned even when Shopify copy is verbose. */
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
    const title = text(card.querySelector('.shopify-card__body strong'));
    const imageAlt = card.querySelector('.shopify-card__image img')?.getAttribute('alt') ?? '';
    return `${title} ${imageAlt}`.toLowerCase();
  };

  const classifySignal = (value) => {
    const isDress = containsAny(value, ['t-shirt dress', 'tshirt dress', ' dress']);
    const isHeadwear = containsAny(value, ['snapback', 'dad hat', 'baseball cap', ' cap', 'headwear']);
    const isOuterwear = containsAny(value, ['hoodie', 'sweatshirt', 'bomber', 'jacket', 'outerwear']);
    const isTank = containsAny(value, ['tank top', ' tank']);
    const isDrinkware = containsAny(value, ['mug', 'drinkware', 'water bottle', 'tumbler']);
    const isBag = containsAny(value, ['backpack', 'duffle', 'tote bag', 'shoulder bag', ' bag']);
    const isAccessory = containsAny(value, ['phone case', 'tough case', 'keyring', 'keychain', 'bracelet', 'accessor']);
    const isTshirt = !isDress
      && !isHeadwear
      && !isOuterwear
      && !isTank
      && containsAny(value, ['t-shirt', 'tshirt', 'tee', 'crewneck shirt']);

    return {
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
    if (kind.isOuterwear) return 'A unisex outerwear piece featuring original Radiant 34 artwork.';
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
      publicTitle = 'Radiant 34 All-Over Print Bomber Jacket';
      publicDescription = 'A lightweight unisex bomber jacket featuring original Radiant 34 artwork.';
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

    const kind = classifySignal(`${publicTitle} ${card.querySelector('.shopify-card__image img')?.getAttribute('alt') ?? ''}`.toLowerCase());
    const correctCategory = categoryLabel(kind);
    if (categoryNode.textContent !== correctCategory) categoryNode.textContent = correctCategory;

    if (descriptionNode) {
      const currentDescription = publicDescription || text(descriptionNode);
      const correctDescription = supplierCopy(currentDescription)
        ? genericDescription(kind)
        : currentDescription;
      if (descriptionNode.textContent !== correctDescription) descriptionNode.textContent = correctDescription;
    }

    card.dataset.r34ProductKind = correctCategory.toLowerCase();
  };

  const matchesSelectedCategory = (card, selectedKey) => {
    if (!selectedKey || selectedKey === 'all') return true;

    const kind = classifySignal(signalForCard(card));
    switch (selectedKey) {
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
        return kind.isHeadwear;
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

  const enforceAccuracy = () => {
    if (window.location.pathname !== '/shop') return;

    installStyles();
    const shopPage = document.querySelector('.shop-page');
    if (!shopPage) return;

    const cards = Array.from(shopPage.querySelectorAll('.product-grid--shop .shopify-card'));
    cards.forEach(normalizeCard);

    const selectedKey = shopPage.dataset.r34SelectedCategory;
    if (selectedKey) {
      let visibleCount = 0;
      cards.forEach((card) => {
        const visible = matchesSelectedCategory(card, selectedKey);
        card.style.setProperty('display', visible ? '' : 'none', visible ? '' : 'important');
        card.setAttribute('aria-hidden', visible ? 'false' : 'true');
        if (visible) visibleCount += 1;
      });

      const empty = shopPage.querySelector('.r34-taxonomy-empty');
      if (empty) empty.style.display = visibleCount ? 'none' : '';
    }
  };

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        queued = false;
        enforceAccuracy();
      });
    });
  };

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener('DOMContentLoaded', queue);
  document.addEventListener('click', () => window.setTimeout(queue, 140), true);
  window.addEventListener('popstate', queue);
  queue();
})();