(() => {
  const organisations = [
    {
      name: "Equip God's People UK",
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-mission-equip-gods-people.jpg?v=1784769711',
      alt: "Equip God's People ministering and praying with children",
      description: "A Christian ministry equipping believers, strengthening churches and taking the Gospel to the nations through teaching, mission and practical ministry.",
      website: 'https://www.equipgodspeople.co.uk/',
      donate: 'https://www.equipgodspeople.co.uk/give',
    },
  ];

  const installStyles = () => {
    if (document.getElementById('r34-mission-styles')) return;

    const style = document.createElement('style');
    style.id = 'r34-mission-styles';
    style.textContent = `
      .main-nav > a[data-r34-mission-link] { display:inline-flex; }
      .site-footer nav a[data-r34-mission-link] {
        appearance:none;
        border:0;
        background:transparent;
        color:#11100d;
        cursor:pointer;
        font:inherit;
        text-decoration:none;
      }
      .site-footer nav a[data-r34-mission-link]:hover { color:#b98529; }

      .r34-mission-page {
        background:#f7efe0;
        color:#11100d;
      }
      .r34-mission-hero {
        padding:clamp(86px,11vw,150px) clamp(24px,6vw,92px) clamp(56px,8vw,100px);
        border-bottom:1px solid rgba(17,16,13,.12);
      }
      .r34-mission-hero__inner {
        max-width:920px;
        margin:0 auto;
        text-align:center;
      }
      .r34-mission-eyebrow {
        margin:0 0 18px;
        color:#b98529;
        font-size:.72rem;
        font-weight:900;
        letter-spacing:.18em;
        text-transform:uppercase;
      }
      .r34-mission-hero h1 {
        max-width:12ch;
        margin:0 auto;
        font-family:Georgia, 'Times New Roman', serif;
        font-size:clamp(3.4rem,8vw,7.8rem);
        font-weight:400;
        letter-spacing:-.055em;
        line-height:.92;
      }
      .r34-mission-hero p:last-child {
        max-width:720px;
        margin:28px auto 0;
        color:#655945;
        font-size:clamp(1rem,1.5vw,1.2rem);
        line-height:1.75;
      }
      .r34-mission-organisations {
        max-width:1500px;
        margin:0 auto;
        padding:clamp(54px,7vw,100px) clamp(20px,5vw,76px) clamp(76px,9vw,130px);
      }
      .r34-mission-grid {
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));
        gap:clamp(20px,2.5vw,36px);
      }
      .r34-mission-card {
        display:flex;
        min-width:0;
        flex-direction:column;
        overflow:hidden;
        border:1px solid rgba(17,16,13,.12);
        border-radius:10px;
        background:#fffaf0;
        box-shadow:0 24px 55px rgba(43,36,26,.09);
      }
      .r34-mission-card__image {
        position:relative;
        aspect-ratio:4 / 3;
        overflow:hidden;
        background:#dfceb0;
      }
      .r34-mission-card__image img {
        width:100%;
        height:100%;
        object-fit:cover;
        object-position:center;
        transition:transform .5s ease;
      }
      .r34-mission-card:hover .r34-mission-card__image img { transform:scale(1.025); }
      .r34-mission-card__body {
        display:flex;
        flex:1;
        flex-direction:column;
        padding:clamp(24px,3vw,38px);
      }
      .r34-mission-card__body h2 {
        margin:0;
        font-family:Georgia, 'Times New Roman', serif;
        font-size:clamp(1.8rem,2.6vw,2.8rem);
        font-weight:400;
        line-height:1.05;
      }
      .r34-mission-card__body p {
        margin:18px 0 0;
        color:#655945;
        line-height:1.7;
      }
      .r34-mission-card__actions {
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin-top:auto;
        padding-top:28px;
      }
      .r34-mission-card__actions a {
        display:inline-flex;
        min-height:46px;
        align-items:center;
        justify-content:center;
        padding:0 19px;
        border:1px solid #11100d;
        border-radius:999px;
        color:#11100d;
        font-size:.7rem;
        font-weight:900;
        letter-spacing:.12em;
        text-decoration:none;
        text-transform:uppercase;
      }
      .r34-mission-card__actions a:first-child {
        border-color:#b98529;
        background:#b98529;
        color:#fffaf0;
      }
      .r34-mission-card__actions a:hover { transform:translateY(-1px); }
      .r34-mission-note {
        max-width:760px;
        margin:52px auto 0;
        color:#74654e;
        font-size:.88rem;
        line-height:1.7;
        text-align:center;
      }
      @media (max-width:980px) {
        .r34-mission-grid { grid-template-columns:1fr; }
        .r34-mission-card { display:grid; grid-template-columns:minmax(240px,.85fr) minmax(320px,1.15fr); }
        .r34-mission-card__image { aspect-ratio:auto; min-height:360px; }
      }
      @media (max-width:680px) {
        .r34-mission-card { display:flex; }
        .r34-mission-card__image { aspect-ratio:4 / 3; min-height:0; }
        .r34-mission-card__actions { flex-direction:column; }
        .r34-mission-card__actions a { width:100%; }
      }
    `;
    document.head.appendChild(style);
  };

  const navigateToMission = (event) => {
    if (event) event.preventDefault();
    if (window.location.pathname === '/mission') return;
    window.history.pushState(null, '', '/mission');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const ensureNavigation = () => {
    const nav = document.querySelector('.main-nav');
    if (nav && !nav.querySelector('[data-r34-mission-link]')) {
      const link = document.createElement('a');
      link.href = '/mission';
      link.textContent = 'Our Mission';
      link.dataset.r34MissionLink = 'true';
      link.addEventListener('click', navigateToMission);
      const mobileActions = nav.querySelector('.mobile-nav-actions');
      nav.insertBefore(link, mobileActions ?? null);
    }

    const footerNav = document.querySelector('.site-footer nav');
    if (footerNav && !footerNav.querySelector('[data-r34-mission-link]')) {
      const link = document.createElement('a');
      link.href = '/mission';
      link.textContent = 'Our Mission';
      link.dataset.r34MissionLink = 'true';
      link.addEventListener('click', navigateToMission);
      footerNav.appendChild(link);
    }
  };

  const renderMissionPage = () => {
    const main = document.querySelector('main');
    if (!main) return;

    if (window.location.pathname !== '/mission') {
      delete main.dataset.r34MissionRendered;
      return;
    }

    if (main.dataset.r34MissionRendered === 'true') return;
    main.dataset.r34MissionRendered = 'true';
    document.title = 'Our Mission | Radiant 34';

    const cards = organisations.map((organisation) => `
      <article class="r34-mission-card">
        <div class="r34-mission-card__image">
          <img src="${organisation.image}" alt="${organisation.alt}" loading="lazy">
        </div>
        <div class="r34-mission-card__body">
          <p class="r34-mission-eyebrow">Organisation we support</p>
          <h2>${organisation.name}</h2>
          <p>${organisation.description}</p>
          <div class="r34-mission-card__actions">
            <a href="${organisation.donate}" target="_blank" rel="noopener noreferrer">Donate</a>
            <a href="${organisation.website}" target="_blank" rel="noopener noreferrer">Visit organisation</a>
          </div>
        </div>
      </article>
    `).join('');

    main.innerHTML = `
      <div class="r34-mission-page">
        <section class="r34-mission-hero">
          <div class="r34-mission-hero__inner">
            <p class="r34-mission-eyebrow">Our Mission</p>
            <h1>Faith should move beyond words.</h1>
            <p>Radiant 34 supports Christian organisations that equip believers, strengthen local communities, relieve poverty and share the Gospel through practical action.</p>
          </div>
        </section>
        <section class="r34-mission-organisations" aria-label="Organisations supported by Radiant 34">
          <div class="r34-mission-grid">${cards}</div>
          <p class="r34-mission-note">Donations are made directly through each organisation's official website. Radiant 34 does not process or retain these donations.</p>
        </section>
      </div>
    `;
  };

  let queued = false;
  const apply = () => {
    installStyles();
    ensureNavigation();
    renderMissionPage();
  };

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
  apply();
})();
