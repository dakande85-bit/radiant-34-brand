(() => {
  const blockedLabels = new Set(['drop 001', 'lookbook']);
  const shopLabels = new Set(['shop', 'shop all products']);
  const normalize = (value) => (value || '').trim().replace(/\s+/g, ' ').toLowerCase();

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

  const removeSearchTabs = () => {
    document.querySelectorAll(
      '.site-header a, .site-header button, .main-nav a, .main-nav button, nav[aria-label="Primary navigation"] a, nav[aria-label="Primary navigation"] button',
    ).forEach((element) => {
      if (normalize(element.textContent) === 'search') element.remove();
    });
  };

  const updatePrimaryNavigation = () => {
    const nav = document.querySelector('.main-nav, nav[aria-label="Primary navigation"]');
    if (!nav) return;

    [...nav.querySelectorAll(':scope > a')].forEach((link) => {
      if (blockedLabels.has(normalize(link.textContent)) || isDrop001Control(link)) link.remove();
    });

    [...nav.querySelectorAll(':scope > a')].forEach((link) => {
      if (normalize(link.textContent) === 'contact') link.remove();
    });
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
    removeSearchTabs();
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
