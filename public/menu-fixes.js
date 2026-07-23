(() => {
  const blockedLabels = new Set(['drop 001', 'lookbook']);
  const shopLabels = new Set(['shop', 'search', 'shop all products']);
  const normalize = (value) => (value || '').trim().replace(/\s+/g, ' ').toLowerCase();

  const navigateInternally = (path) => {
    if (window.location.pathname === path) return;
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createContactLink = () => {
    const link = document.createElement('a');
    link.href = '/contact';
    link.textContent = 'Contact';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigateInternally('/contact');
    });
    return link;
  };

  const isDrop001Control = (element) => {
    const label = normalize(element.textContent);
    const href = element.getAttribute?.('href') || '';
    return label.includes('drop 001')
      || href === '/drop-001'
      || href.startsWith('/drop-001?')
      || href.startsWith('/drop-001#')
      || href.includes('radiant34.com/drop-001');
  };

  const removeDrop001Links = () => {
    document.querySelectorAll('a, button').forEach((element) => {
      if (isDrop001Control(element)) element.remove();
    });
  };

  const updatePrimaryNavigation = () => {
    const nav = document.querySelector('.main-nav, nav[aria-label="Primary navigation"]');
    if (!nav) return;

    [...nav.querySelectorAll(':scope > a')].forEach((link) => {
      if (blockedLabels.has(normalize(link.textContent)) || isDrop001Control(link)) link.remove();
    });

    const directLinks = [...nav.querySelectorAll(':scope > a')];
    const hasContact = directLinks.some((link) => normalize(link.textContent) === 'contact');
    if (!hasContact) {
      const mobileActions = nav.querySelector('.mobile-nav-actions');
      nav.insertBefore(createContactLink(), mobileActions || null);
    }
  };

  const updateFooterNavigation = () => {
    document.querySelectorAll('footer a, footer button, .site-footer a, .site-footer button, .footer a, .footer button').forEach((link) => {
      if (blockedLabels.has(normalize(link.textContent)) || isDrop001Control(link)) link.remove();
    });
  };

  const updateContactActions = () => {
    document.querySelectorAll('button, a').forEach((element) => {
      if (normalize(element.textContent) === 'get drop alert') {
        element.textContent = 'Contact';
      }
    });
  };

  const isShopControl = (element) => {
    const label = normalize(element.textContent);
    const href = element.getAttribute?.('href') || '';
    return shopLabels.has(label) || href === '/shop' || href.startsWith('/shop?') || href.startsWith('/shop#');
  };

  const useReliableShopNavigation = (event) => {
    if (window.location.pathname === '/shop') return;
    const control = event.target.closest?.('a, button');
    if (!control || !isShopControl(control)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.location.assign('/shop');
  };

  const applyNavigationFixes = () => {
    removeDrop001Links();
    updatePrimaryNavigation();
    updateFooterNavigation();
    updateContactActions();
  };

  document.addEventListener('click', useReliableShopNavigation, true);

  const observer = new MutationObserver(applyNavigationFixes);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', applyNavigationFixes);
  window.addEventListener('popstate', applyNavigationFixes);
  applyNavigationFixes();
})();