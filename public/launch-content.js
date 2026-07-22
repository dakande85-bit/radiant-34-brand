(() => {
  const HOMEPAGE_PSALM_MODEL = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-homepage-psalm-model.jpg?v=1784760824';

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
        grid-template-columns:minmax(280px,.85fr) minmax(420px,1.15fr) !important;
        align-items:stretch !important;
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
      @media (max-width:820px) {
        .r34-psalm-editorial { grid-template-columns:1fr !important; }
        .r34-psalm-editorial > img { min-height:460px !important; }
      }
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
      images[0].src = HOMEPAGE_PSALM_MODEL;
      images[0].alt = 'Radiant 34 model wearing a cream Scripture-inspired T-shirt at golden hour';
      images[0].removeAttribute('srcset');
    }
    images.slice(1).forEach((image) => image.remove());
  };

  const restructureHome = () => {
    if (window.location.pathname !== '/') return;

    installHomepageStyles();
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