(() => {
  const isContactRoute = () => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    return path === '/contact';
  };

  const syncRouteClass = () => {
    document.documentElement.classList.toggle('r34-contact-route', isContactRoute());
  };

  const buildSignup = () => {
    const wrapper = document.createElement('section');
    wrapper.className = 'r34-contact-signup';
    wrapper.setAttribute('aria-label', 'Join the Radiant 34 list');

    const hasJoined = Boolean(window.localStorage.getItem('radiant34LaunchEmail'));

    wrapper.innerHTML = `
      <div class="r34-contact-signup__head">
        <div>
          <span>Radiant Club</span>
          <strong>Be first to see what comes next.</strong>
        </div>
      </div>
      <p class="r34-contact-signup__copy">
        Get new releases, product stories and mission updates directly in your inbox.
      </p>
      ${hasJoined ? `
        <div class="r34-contact-success" role="status">
          You are already on the Radiant 34 list.
        </div>
      ` : `
        <form class="r34-contact-form">
          <input type="email" name="email" autocomplete="email" placeholder="Your email address" aria-label="Email address" required>
          <button type="submit">Join the list</button>
        </form>
      `}
      <div class="r34-contact-benefits" aria-label="What subscribers receive">
        <div><strong>New releases</strong><span>First access to new Radiant 34 products.</span></div>
        <div><strong>Product stories</strong><span>The Scripture and design thinking behind each piece.</span></div>
        <div><strong>Mission updates</strong><span>See how the message continues beyond the product.</span></div>
      </div>
      <p class="r34-contact-privacy">No spam. Unsubscribe at any time.</p>
    `;

    const form = wrapper.querySelector('.r34-contact-form');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value.trim();
      if (!email) return;

      window.localStorage.setItem('radiant34LaunchEmail', email);
      form.replaceWith(Object.assign(document.createElement('div'), {
        className: 'r34-contact-success',
        textContent: 'Thank you. You are now on the Radiant 34 list.',
      }));
    });

    return wrapper;
  };

  const apply = () => {
    syncRouteClass();
    if (!isContactRoute()) return;

    const hero = document.querySelector('main .page-hero--editorial');
    const originalSignup = document.querySelector('main .launch-section');
    if (!hero) return;

    hero.classList.add('r34-contact-hero');

    const copy = hero.querySelector(':scope > div');
    const image = hero.querySelector(':scope > img');
    if (!copy) return;

    copy.classList.add('r34-contact-copy');
    image?.classList.add('r34-contact-visual');

    const eyebrow = copy.querySelector('.eyebrow');
    const heading = copy.querySelector('h1');
    const intro = copy.querySelector('p:not(.eyebrow)');

    if (eyebrow) eyebrow.textContent = 'Contact';
    if (heading) heading.textContent = 'Stay connected with Radiant 34.';
    if (intro) {
      intro.textContent = 'Join the list for new releases, product stories and mission updates. Everything important is now available in one clear place.';
    }

    if (!copy.querySelector('.r34-contact-signup')) {
      copy.appendChild(buildSignup());
    }

    if (originalSignup) originalSignup.classList.add('r34-contact-original-signup');
  };

  const schedule = () => {
    syncRouteClass();
    [0, 80, 220, 500].forEach((delay) => window.setTimeout(apply, delay));
  };

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args) => {
    const result = originalPushState(...args);
    schedule();
    return result;
  };

  window.history.replaceState = (...args) => {
    const result = originalReplaceState(...args);
    schedule();
    return result;
  };

  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('popstate', schedule);
  schedule();
})();