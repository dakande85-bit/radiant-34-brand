(() => {
  const HOMEPAGE_BLACK_MALE_MODEL = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-homepage-black-male-cream-tee_875dd493-88c1-48c5-b511-9f9fd3bcb00d.png?v=1784762298';
  const HOMEPAGE_BRUNETTE_MODEL = '/images/radiant-editorial-02.png';

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

  const installStyles = () => {
    if (document.getElementById('r34-launch-styles')) return;

    const style = document.createElement('style');
    style.id = 'r34-launch-styles';
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

      .r34-shop-categories { margin-top:34px; }
      .r34-shop-category-intro { max-width:680px; margin-bottom:30px; }
      .r34-shop-category-intro h2 {
        margin:0;
        font-family:Georgia,'Times New Roman',serif;
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
      .r34-shop-category-card:hover img { transform:scale(1.035); }
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
        font-family:Georgia,'Times New Roman',serif;
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
      if (label === 'lookbook' || label === 'mission' || label === 'drop 001') link.remove();
    });

    const allowedFooterLinks = new Set(['shop', 'our story', 'contact']);
    document.querySelectorAll('.site-footer nav button').forEach((button) => {
      if (!allowedFooterLinks.has(text(button).toLowerCase())) button.remove();
    });

    replaceExactText('Get Drop Alert', 'Contact');
  };

  const restructureHome = () => {
    if (window.location.pathname !== '/') return;

    const hero = document.querySelector('main .hero');
    const intro = hero?.querySelector('.hero-copy > p:not(.eyebrow)');
    if (intro) {
      intro.textContent = 'Faith for everyday life. Radiant 34 creates clothing and essentials inspired by Scripture — designed to carry hope, courage and light wherever you go.';
    }

    document.querySelectorAll('main .drop-band').forEach((section) => section.remove());
    document.querySelectorAll('.r34-home-mockup-grid, .r34-home-mockup').forEach((node) => {
      const section = node.closest('section');
      if (section) section.remove();
      else node.remove();
    });

    const editorial = document.querySelector('main .lookbook');
    if (editorial) {
      editorial.hidden = false;
      editorial.classList.add('r34-psalm-editorial');
      const eyebrow = editorial.querySelector('.eyebrow');
      const heading = editorial.querySelector('h2');
      const paragraphs = Array.from(editorial.querySelectorAll('.lookbook-copy > p')).filter((node) => node !== eyebrow);
      const images = Array.from(editorial.querySelectorAll('img'));

      if (eyebrow) eyebrow.textContent = 'Psalm 34:5';
      if (heading) heading.textContent = 'Look to Him. Walk without shame.';
      if (paragraphs[0]) paragraphs[0].textContent = 'For ordinary days and difficult seasons: turn your eyes toward God. Courage, peace and identity begin there.';
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
    }

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

  const applyStoryCopy = () => {
    replaceExactText('About', 'Our Story');
    if (window.location.pathname !== '/about') return;

    const heading = document.querySelector('main h1');
    if (heading) heading.textContent = 'Our Story';
    const blocks = document.querySelectorAll('main p');
    const copy = [
      'Radiant 34 began with one verse: “Those who look to Him are radiant; their faces are never covered with shame.” — Psalm 34:5.',
      'Radiant 34 creates clothing and everyday pieces inspired by Scripture, designed to carry faith naturally into real life.',
      'Every collection begins with the Bible. Every design points beyond the product and back to Jesus Christ.',
    ];
    blocks.forEach((node, index) => {
      if (copy[index]) node.textContent = copy[index];
    });
  };

  const apply = () => {
    installStyles();
    simplifyNavigation();
    restructureHome();
    applyStoryCopy();
  };

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  };

  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', queue);
  document.addEventListener('DOMContentLoaded', queue);
  queue();
})();