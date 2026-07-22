(() => {
  const HOMEPAGE_BLACK_MALE_MODEL = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-homepage-black-male-cream-tee_875dd493-88c1-48c5-b511-9f9fd3bcb00d.png?v=1784762298';
  const HOMEPAGE_BRUNETTE_MODEL = '/images/radiant-editorial-02.png';

  const SHOP_CATEGORIES = [
    {
      label: 'T-Shirts',
      filter: 'Tees',
      description: 'Everyday tees carrying Scripture with a clean, wearable finish.',
      matches: ['t-shirt', 'tee', 'shirt'],
    },
    {
      label: 'Hoodies',
      filter: 'Hoodies',
      description: 'Premium layers designed for comfort, faith and everyday use.',
      matches: ['hoodie', 'sweatshirt'],
    },
    {
      label: 'Mugs & Drinkware',
      filter: 'Drinkware',
      description: 'Daily reminders for coffee, tea, training and quiet moments.',
      matches: ['drinkware', 'mug', 'bottle', 'drink'],
    },
    {
      label: 'Bags',
      filter: 'Bags',
      description: 'Backpacks, totes and travel pieces made to carry the message.',
      matches: ['bag', 'backpack', 'duffle', 'tote'],
    },
    {
      label: 'Accessories',
      filter: 'Accessories',
      description: 'Small everyday pieces with a clear Radiant 34 identity.',
      matches: ['accessories', 'case', 'keyring', 'keychain', 'hat', 'cap'],
    },
    {
      label: 'All Products',
      filter: 'All',
      description: 'Browse the complete active Radiant 34 collection.',
      matches: [],
    },
  ];

  const text = (node) => node?.textContent?.trim() ?? '';

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

  const installHomepageStyles = () => {
    if (document.getElementById('r34-homepage-launch-styles')) return;
    const style = document.createElement('style');
    style.id = 'r34-homepage-launch-styles';
    style.textContent = `
      .r34-psalm-editorial {
        display:grid !important;
        grid-template-columns:minmax(260px,.8fr) repeat(2,minmax(260px,1fr)) !important;
        align-items:stretch !important;
        gap:18px !important;
      }
      .r34-psalm-editorial > img {
        width:100% !important;
        height:100% !important;
        min-height:560px !important;
        object-fit:cover !important;
        object-position:center !important;
      }
      .r34-psalm-editorial .eyebrow { letter-spacing:.18em; }
      .r34-psalm-editorial h2 { max-width:12ch; }
      .r34-psalm-editorial p { max-width:42ch; }

      .site-footer {
        background:#f7efe0 !important;
        color:#11100d !important;
        border-top:1px solid rgba(185,133,41,.22) !important;
      }
      .site-footer img {
        width:110px !important;
        height:auto !important;
        max-height:none !important;
        object-fit:contain !important;
        opacity:1 !important;
        filter:none !important;
      }
      .site-footer p { color:#2b241a !important; }
      .site-footer nav button { color:#11100d !important; }
      .site-footer nav button:hover { color:#b98529 !important; }
      .site-footer span { color:#74654e !important; }

      .r34-shop-categories {
        margin-top:34px;
      }
      .r34-shop-category-intro {
        max-width:680px;
        margin-bottom:30px;
      }
      .r34-shop-category-intro h2 {
        margin:0;
        font-family:Georgia, 'Times New Roman', serif;
        font-size:clamp(2.35rem,4.8vw,5rem);
        font-weight:400;
        line-height:1;
        letter-spacing:-.04em;
      }
      .r34-shop-category-intro p {
        max-width:580px;
        margin:18px 0 0;
        color:#74654e;
        font-size:1rem;
        line-height:1.7;
      }
      .r34-shop-category-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:clamp(16px,2.2vw,28px);
      }
      .r34-shop-category-card {
        position:relative;
        min-height:430px;
        padding:0;
        overflow:hidden;
        border:0;
        border-radius:8px;
        background:#e7d2aa;
        color:#fffaf0;
        text-align:left;
        box-shadow:0 20px 42px rgba(43,36,26,.12);
      }
      .r34-shop-category-card img {
        width:100%;
        height:100%;
        object-fit:cover;
        object-position:center;
        transition:transform .45s ease;
      }
      .r34-shop-category-card:hover img {
        transform:scale(1.035);
      }
      .r34-shop-category-card::after {
        content:'';
        position:absolute;
        inset:0;
        background:linear-gradient(180deg,transparent 34%,rgba(17,16,13,.78) 100%);
      }
      .r34-shop-category-card__copy {
        position:absolute;
        z-index:1;
        left:0;
        right:0;
        bottom:0;
        padding:28px;
      }
      .r34-shop-category-card__copy strong {
        display:block;
        font-family:Georgia, 'Times New Roman', serif;
        font-size:clamp(1.7rem,2.5vw,2.6rem);
        font-weight:400;
        line-height:1;
      }
      .r34-shop-category-card__copy span {
        display:block;
        max-width:34ch;
        margin-top:10px;
        color:rgba(255,250,240,.82);
        font-size:.88rem;
        line-height:1.55;
      }
      .r34-shop-back {
        width:max-content;
        min-height:44px;
        margin:0 0 24px;
        padding:0 18px;
        border:1px solid rgba(17,16,13,.24);
        border-radius:999px;
        background:transparent;
        color:#11100d;
        font-size:.68rem;
        font-weight:900;
        letter-spacing:.13em;
        text-transform:uppercase;
      }
      .r34-shop-back:hover {
        border-color:#b98529;
        color:#b98529;
      }

      @media (max-width:980px) {
        .r34-psalm-editorial { grid-template-columns:1fr 1fr !important; }
        .r34-psalm-editorial .lookbook-copy { grid-column:1 / -1; }
        .r34-psalm-editorial > img { min-height:460px !important; }
        .r34-shop-category-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
      }
      @media (max-width:680px) {
        .r34-psalm-editorial { grid-template-columns:1fr !important; }
        .r34-psalm-editorial .lookbook-copy { grid-column:auto; }
        .r34-psalm-editorial > img { min-height:420px !important; }
        .site-footer img { width:96px !important; }
        .r34-shop-category-grid { grid-template-columns:1fr; }
        .r34-shop-category-card { min-height:390px; }
      }
    `;
    document.head.appendChild(style);
  };

  const simplifyNavigation = () => {
    document.querySelectorAll('.main-nav > a').forEach((link) => {
      const label = text(link).toLowerCase();
      if (label === 'lookbook' || label === 'mission') link.remove();
    });

    const allowedFooterLinks = new Set(['shop', 'drop 001', 'our story', 'contact']);
    document.querySelectorAll('.site-footer nav button').forEach((button) => {
      if (!allowedFooterLinks.has(text(button).toLowerCase())) button.remove();
    });

    replaceExactText('Get Drop Alert', 'Contact');
  };

  const updateHeroCopy = () => {
    const hero = document.querySelector('main .hero');
    if (!hero) return;

    const intro = hero.querySelector('.hero-copy > p:not(.eyebrow)');
    if (intro) {
      intro.textContent = 'Faith for everyday life. Radiant 34 creates clothing and essentials inspired by Scripture — designed to carry hope, courage and light wherever you go.';
    }
  };

  const removeHomepageProducts = () => {
    document.querySelectorAll('main .drop-band').forEach((section) => {
      section.remove();
    });

    document.querySelectorAll('.r34-home-mockup-grid, .r34-home-mockup').forEach((node) => {
      const section = node.closest('section');
      if (section) section.remove();
      else node.remove();
    });
  };

  const updatePsalmEditorial = () => {
    const section = document.querySelector('main .lookbook');
    if (!section) return;

    section.hidden = false;
    section.classList.add('r34-psalm-editorial');

    const eyebrow = section.querySelector('.eyebrow');
    const heading = section.querySelector('h2');
    const paragraphs = Array.from(section.querySelectorAll('.lookbook-copy > p')).filter((node) => node !== eyebrow);
    const images = Array.from(section.querySelectorAll('img'));

    if (eyebrow) eyebrow.textContent = 'Psalm 34:5';
    if (heading) heading.textContent = 'Look to Him. Walk without shame.';
    if (paragraphs[0]) {
      paragraphs[0].textContent = 'For ordinary days and difficult seasons: turn your eyes toward God. Courage, peace and identity begin there.';
    }
    paragraphs.slice(1).forEach((paragraph) => paragraph.remove());

    if (images[0]) {
      images[0].src = HOMEPAGE_BLACK_MALE_MODEL;
      images[0].alt = 'Black male model wearing the cream Radiant 34 T-shirt';
      images[0].removeAttribute('srcset');
    }
    if (images[1]) {
      images[1].src = HOMEPAGE_BRUNETTE_MODEL;
      images[1].alt = 'White brunette model wearing a Radiant 34 T-shirt';
      images[1].removeAttribute('srcset');
    }
  };

  const restructureHome = () => {
    if (window.location.pathname !== '/') return;

    updateHeroCopy();
    removeHomepageProducts();
    updatePsalmEditorial();
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

  const cardMatchesCategory = (card, category) => {
    if (!category.matches.length) return true;
    const haystack = `${text(card.querySelector('.product-card__category'))} ${text(card.querySelector('strong'))}`.toLowerCase();
    return category.matches.some((term) => haystack.includes(term));
  };

  const chooseCategory = (shopPage, category) => {
    const chooser = shopPage.querySelector('.r34-shop-categories');
    const controls = shopPage.querySelector('.shop-controls');
    const productGrid = shopPage.querySelector('.product-grid--shop');
    const backButton = shopPage.querySelector('.r34-shop-back');
    const filterButton = Array.from(shopPage.querySelectorAll('.filters button'))
      .find((button) => text(button).toLowerCase() === category.filter.toLowerCase());

    shopPage.dataset.r34CategoryOpen = 'true';
    if (filterButton) filterButton.click();
    if (chooser) chooser.hidden = true;
    if (controls) controls.hidden = false;
    if (productGrid) productGrid.hidden = false;
    if (backButton) backButton.hidden = false;

    const heading = shopPage.querySelector('.section-head h1');
    const copy = shopPage.querySelector('.section-head > p');
    if (heading) heading.textContent = category.label;
    if (copy) copy.textContent = category.description;

    window.setTimeout(() => {
      productGrid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  };

  const showCategoryLanding = (shopPage) => {
    const chooser = shopPage.querySelector('.r34-shop-categories');
    const controls = shopPage.querySelector('.shop-controls');
    const productGrid = shopPage.querySelector('.product-grid--shop');
    const backButton = shopPage.querySelector('.r34-shop-back');
    const allFilter = Array.from(shopPage.querySelectorAll('.filters button'))
      .find((button) => text(button).toLowerCase() === 'all');
    const search = shopPage.querySelector('.shop-search input');

    shopPage.dataset.r34CategoryOpen = 'false';
    if (allFilter) allFilter.click();
    if (search) {
      search.value = '';
      search.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (chooser) chooser.hidden = false;
    if (controls) controls.hidden = true;
    if (productGrid) productGrid.hidden = true;
    if (backButton) backButton.hidden = true;

    const eyebrow = shopPage.querySelector('.section-head .eyebrow');
    const heading = shopPage.querySelector('.section-head h1');
    const copy = shopPage.querySelector('.section-head > p');
    if (eyebrow) eyebrow.textContent = 'Shop';
    if (heading) heading.textContent = 'Choose your category.';
    if (copy) copy.textContent = 'Select a category image to explore the products inside.';

    window.setTimeout(() => {
      chooser?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  };

  const buildShopCategories = (shopPage) => {
    const productGrid = shopPage.querySelector('.product-grid--shop');
    const controls = shopPage.querySelector('.shop-controls');
    const cards = Array.from(productGrid?.querySelectorAll('.shopify-card') ?? []);
    if (!productGrid || !controls || !cards.length) return;

    let chooser = shopPage.querySelector('.r34-shop-categories');
    if (!chooser) {
      chooser = document.createElement('section');
      chooser.className = 'r34-shop-categories';

      const intro = document.createElement('div');
      intro.className = 'r34-shop-category-intro';
      intro.innerHTML = '<h2>Shop by category.</h2><p>Choose what you are looking for first. Products will appear after you select a category.</p>';

      const grid = document.createElement('div');
      grid.className = 'r34-shop-category-grid';

      SHOP_CATEGORIES.forEach((category) => {
        const matchingCard = cards.find((card) => cardMatchesCategory(card, category));
        if (!matchingCard) return;

        const image = matchingCard.querySelector('.shopify-card__hover')
          ?? matchingCard.querySelector('.shopify-card__image img');
        if (!image?.src) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'r34-shop-category-card';
        button.setAttribute('aria-label', `Shop ${category.label}`);
        button.innerHTML = `
          <img src="${image.src}" alt="${category.label}">
          <span class="r34-shop-category-card__copy">
            <strong>${category.label}</strong>
            <span>${category.description}</span>
          </span>
        `;
        button.addEventListener('click', () => chooseCategory(shopPage, category));
        grid.appendChild(button);
      });

      chooser.append(intro, grid);
      controls.before(chooser);

      const backButton = document.createElement('button');
      backButton.type = 'button';
      backButton.className = 'r34-shop-back';
      backButton.textContent = 'Back to categories';
      backButton.hidden = true;
      backButton.addEventListener('click', () => showCategoryLanding(shopPage));
      controls.before(backButton);
    }

    if (shopPage.dataset.r34CategoryOpen !== 'true') {
      chooser.hidden = false;
      controls.hidden = true;
      productGrid.hidden = true;
      const backButton = shopPage.querySelector('.r34-shop-back');
      if (backButton) backButton.hidden = true;
    }
  };

  const restructureShop = () => {
    if (window.location.pathname !== '/shop') return;

    const shopPage = document.querySelector('.shop-page');
    if (!shopPage) return;

    const head = shopPage.querySelector('.section-head');
    if (head && shopPage.dataset.r34CategoryOpen !== 'true') {
      const eyebrow = head.querySelector('.eyebrow');
      const heading = head.querySelector('h1');
      const copy = head.querySelector(':scope > p');
      if (eyebrow) eyebrow.textContent = 'Shop';
      if (heading) heading.textContent = 'Choose your category.';
      if (copy) copy.textContent = 'Select a category image to explore the products inside.';
    }

    buildShopCategories(shopPage);
  };

  const applyStoryCopy = () => {
    replaceExactText('About', 'Our Story');

    if (window.location.pathname === '/about') {
      const h1 = document.querySelector('main h1');
      if (h1) h1.textContent = 'Our Story';
      const blocks = document.querySelectorAll('main p');
      const copy = [
        'Radiant 34 began with one verse: “Those who look to Him are radiant; their faces are never covered with shame.” — Psalm 34:5.',
        'Radiant 34 creates clothing and everyday pieces inspired by Scripture, designed to carry faith naturally into real life.',
        'Every collection begins with the Bible. Every design points beyond the product and back to Jesus Christ.',
      ];
      blocks.forEach((node, index) => { if (copy[index]) node.textContent = copy[index]; });
    }
  };

  const applyLaunchContent = () => {
    installHomepageStyles();
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