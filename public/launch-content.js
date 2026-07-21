(() => {
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

  const simplifyNavigation = () => {
    document.querySelectorAll('.main-nav > a').forEach((link) => {
      const label = text(link).toLowerCase();
      if (label === 'lookbook' || label === 'mission') link.remove();
    });

    replaceExactText('Get Drop Alert', 'Contact');
  };

  const restructureHome = () => {
    if (window.location.pathname !== '/') return;

    const featuredSection = document.querySelector('.drop-band');
    if (featuredSection) {
      const eyebrow = featuredSection.querySelector('.eyebrow');
      const heading = featuredSection.querySelector('h2');
      const intro = featuredSection.querySelector('.section-head p:last-child');
      const action = featuredSection.querySelector('.center-actions button');

      if (eyebrow) eyebrow.textContent = 'Featured from Drop 001';
      if (heading) heading.textContent = 'The first testimony, carefully selected.';
      if (intro) intro.textContent = 'A focused edit of the pieces that introduce Radiant 34. The full collection lives inside Drop 001.';
      if (action) action.textContent = 'View Full Drop';

      featuredSection.querySelectorAll('.product-grid > *').forEach((card, index) => {
        card.hidden = index >= 4;
      });
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