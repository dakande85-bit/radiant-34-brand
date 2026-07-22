(() => {
  const text = (node) => node?.textContent?.trim() ?? '';

  const curatedProducts = [
    {
      title: 'Radiant Hoodie',
      category: 'Hoodie',
      price: '€30.00',
      handle: 'radiant-hoodie',
      primary: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/ChatGPT_Image_Jul_11_2026_09_40_54_PM.png?v=1783802517',
      hover: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-signature-hoodie-hover.png?v=1784706366',
    },
    {
      title: 'Radiant Backpack',
      category: 'Bag',
      price: '€44.00',
      handle: 'radiant-backpack',
      primary: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-minimalist-backpack-white-front-6a524c3c3e332.jpg?v=1783778371',
      hover: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-backpack-hover.png?v=1784706394',
    },
    {
      title: 'Radiant Duffle Bag',
      category: 'Bag',
      price: '€70.00',
      handle: 'radiant-duffle-bag',
      primary: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-duffle-bag-white-front-6a524d6683378.jpg?v=1783778670',
      hover: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-duffle-bag-hover.png?v=1784706416',
    },
    {
      title: 'Radiant Mug',
      category: 'Drinkware',
      price: '€10.00',
      handle: 'radiant-mug',
      primary: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/white-glossy-mug-white-11-oz-front-view-6a52535d7767d.jpg?v=1783780195',
      hover: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-mug-hover.png?v=1784706439',
    },
  ];

  const replaceExactText = (from, to) => {
    document.querySelectorAll('a, button, h1, h2, p, span').forEach((node) => {
      if (node.childElementCount === 0 && text(node) === from) node.textContent = to;
    });
  };

  const hideSectionContaining = (phrase) => {
    document.querySelectorAll('main section').forEach((section) => {
      if (text(section).includes(phrase)) section.hidden = true;
    });
  };

  const installCuratedStyles = () => {
    if (document.getElementById('r34-curated-product-styles')) return;
    const style = document.createElement('style');
    style.id = 'r34-curated-product-styles';
    style.textContent = `
      .r34-curated-card { display:flex; flex-direction:column; min-width:0; color:inherit; text-decoration:none; }
      .r34-curated-card__visual { position:relative; overflow:hidden; aspect-ratio:4/5; background:#f0e5d2; }
      .r34-curated-card__visual img { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; transition:opacity .28s ease, transform .28s ease; }
      .r34-curated-card__visual img:last-child { opacity:0; object-fit:cover; }
      .r34-curated-card:hover .r34-curated-card__visual img:first-child { opacity:0; transform:scale(1.015); }
      .r34-curated-card:hover .r34-curated-card__visual img:last-child { opacity:1; transform:scale(1.015); }
      .r34-curated-card__body { display:grid; grid-template-columns:1fr auto; gap:8px 18px; padding:18px 0 0; }
      .r34-curated-card__category { grid-column:1/-1; color:#b98529; font-size:.66rem; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }
      .r34-curated-card__title { font-family:Georgia,serif; font-size:1.22rem; font-weight:400; }
      .r34-curated-card__price { font-size:.82rem; font-weight:900; }
      .r34-curated-card__link { grid-column:1/-1; margin-top:4px; font-size:.66rem; font-weight:900; letter-spacing:.14em; text-decoration:underline; text-transform:uppercase; }
      @media (max-width:720px) { .r34-curated-card__visual { aspect-ratio:1/1.2; } }
    `;
    document.head.appendChild(style);
  };

  const simplifyNavigation = () => {
    document.querySelectorAll('.main-nav > a').forEach((link) => {
      const label = text(link).toLowerCase();
      if (label === 'lookbook' || label === 'mission') link.remove();
    });

    replaceExactText('Get Drop Alert', 'Contact');
  };

  const curatedCardMarkup = (product) => `
    <a class="r34-curated-card" href="/products/${product.handle}" aria-label="View ${product.title}">
      <span class="r34-curated-card__visual">
        <img src="${product.primary}" alt="${product.title}" loading="lazy">
        <img src="${product.hover}" alt="${product.title} lifestyle view" loading="lazy">
      </span>
      <span class="r34-curated-card__body">
        <span class="r34-curated-card__category">${product.category}</span>
        <strong class="r34-curated-card__title">${product.title}</strong>
        <span class="r34-curated-card__price">${product.price}</span>
        <span class="r34-curated-card__link">View Product</span>
      </span>
    </a>`;

  const restructureHome = () => {
    if (window.location.pathname !== '/') return;

    installCuratedStyles();
    const featuredSection = document.querySelector('.drop-band');
    if (featuredSection) {
      const eyebrow = featuredSection.querySelector('.eyebrow');
      const heading = featuredSection.querySelector('h2');
      const intro = featuredSection.querySelector('.section-head p:last-child');
      const action = featuredSection.querySelector('.center-actions button');
      const grid = featuredSection.querySelector('.product-grid');

      if (eyebrow) eyebrow.textContent = 'Featured products';
      if (heading) heading.textContent = 'Selected from the live collection.';
      if (intro) intro.textContent = 'Four active products, chosen to introduce Radiant 34 without turning the homepage into a catalogue.';
      if (action) action.textContent = 'Shop All Products';

      if (grid && grid.dataset.r34Curated !== 'true') {
        grid.innerHTML = curatedProducts.map(curatedCardMarkup).join('');
        grid.dataset.r34Curated = 'true';
      }
    }

    hideSectionContaining('Warm light, clean silhouettes');
    hideSectionContaining('Clothing that funds the telling');

    const story = document.querySelector('.about-section');
    if (story) {
      const eyebrow = story.querySelector('.eyebrow');
      const heading = story.querySelector('h2');
      if (eyebrow) eyebrow.textContent = 'Our Story';
      if (heading) heading.textContent = 'A psalm, worn.';
    }

    const newsletter = document.querySelector('.launch-section');
    if (newsletter) {
      const eyebrow = newsletter.querySelector('.eyebrow');
      const heading = newsletter.querySelector('h2');
      const copy = newsletter.querySelector('.launch-card > p:not(.eyebrow)');
      if (eyebrow) eyebrow.textContent = 'Stay close';
      if (heading) heading.textContent = 'Be first to see what comes next.';
      if (copy) copy.textContent = 'Join the Radiant 34 list for new designs, future drops, and the story behind each release.';
    }
  };

  const restructureDrop = () => {
    if (window.location.pathname !== '/drop-001') return;

    document.querySelectorAll('.drop-strip__item').forEach((item, index) => {
      item.hidden = index >= 6;
    });

    document.querySelectorAll('.lookbook, .campaign-grid').forEach((section) => {
      section.hidden = true;
    });

    const statement = document.querySelector('.campaign-statement');
    if (statement) {
      const eyebrow = statement.querySelector('.eyebrow');
      const heading = statement.querySelector('h2');
      const copy = statement.querySelector('p:last-child');
      if (eyebrow) eyebrow.textContent = 'The first collection';
      if (heading) heading.textContent = 'Drop 001 begins with Psalm 34:5.';
      if (copy) copy.textContent = 'A focused collection built around deliverance, testimony, and the quiet confidence that comes from looking to Christ.';
    }
  };

  const applyShopHoverMockups = () => {
    document.querySelectorAll('.shopify-card').forEach((card) => {
      const title = text(card.querySelector('.shopify-card__body strong'));
      const product = curatedProducts.find((item) => item.title === title);
      if (!product) return;
      const imageWrap = card.querySelector('.shopify-card__image');
      if (!imageWrap) return;
      let hover = imageWrap.querySelector('.shopify-card__hover');
      if (!hover) {
        hover = document.createElement('img');
        hover.className = 'shopify-card__hover';
        hover.alt = '';
        hover.loading = 'lazy';
        imageWrap.insertBefore(hover, imageWrap.querySelector('.product-card__badges'));
      }
      if (hover.getAttribute('src') !== product.hover) hover.setAttribute('src', product.hover);
    });
  };

  const restructureShop = () => {
    if (window.location.pathname !== '/shop') return;

    const head = document.querySelector('.shop-page .section-head');
    if (head) {
      const eyebrow = head.querySelector('.eyebrow');
      const heading = head.querySelector('h1');
      const copy = head.querySelector(':scope > p');
      if (eyebrow) eyebrow.textContent = 'All products';
      if (heading) heading.textContent = 'Shop Radiant 34.';
      if (copy) copy.textContent = 'Browse every active product. Search by name, filter by category, and sort the full collection.';
    }

    applyShopHoverMockups();
  };

  const applyStoryCopy = () => {
    replaceExactText('About', 'Our Story');

    if (window.location.pathname === '/about') {
      const h1 = document.querySelector('main h1');
      if (h1) h1.textContent = 'Our Story';
      const blocks = document.querySelectorAll('main p');
      const copy = [
        'Radiant 34 began with one verse: “Those who look to Him are radiant; their faces are never covered with shame.” — Psalm 34:5.',
        'Psalm 34 is a testimony written from the other side of fear, shame and deliverance. Radiant 34 turns that testimony into clothing and everyday pieces designed to carry Scripture naturally into real life.',
        'Every collection begins with the Bible. Every design is created to point beyond the product and back to Jesus Christ — with confidence, clarity and no compromise.',
      ];
      blocks.forEach((node, index) => { if (copy[index]) node.textContent = copy[index]; });
    }
  };

  const applyLaunchContent = () => {
    simplifyNavigation();
    restructureHome();
    restructureDrop();
    restructureShop();
    applyStoryCopy();
  };

  let queued = false;
  const queueApply = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyLaunchContent();
    });
  };

  const observer = new MutationObserver(queueApply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', queueApply);
  document.addEventListener('click', () => setTimeout(queueApply, 0));
  applyLaunchContent();
})();