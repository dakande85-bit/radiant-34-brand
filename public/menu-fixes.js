(() => {
  const blockedLabels = new Set(['drop 001', 'lookbook']);
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

  const updatePrimaryNavigation = () => {
    const nav = document.querySelector('.main-nav, nav[aria-label="Primary navigation"]');
    if (!nav) return;

    [...nav.querySelectorAll(':scope > a')].forEach((link) => {
      if (blockedLabels.has(normalize(link.textContent))) link.remove();
    });

    const directLinks = [...nav.querySelectorAll(':scope > a')];
    const hasContact = directLinks.some((link) => normalize(link.textContent) === 'contact');
    if (!hasContact) {
      const mobileActions = nav.querySelector('.mobile-nav-actions');
      nav.insertBefore(createContactLink(), mobileActions || null);
    }
  };

  const updateFooterNavigation = () => {
    document.querySelectorAll('footer a, .site-footer a, .footer a').forEach((link) => {
      if (blockedLabels.has(normalize(link.textContent))) link.remove();
    });
  };

  const updateContactActions = () => {
    document.querySelectorAll('button, a').forEach((element) => {
      if (normalize(element.textContent) === 'get drop alert') {
        element.textContent = 'Contact';
      }
    });
  };

  const applyNavigationFixes = () => {
    updatePrimaryNavigation();
    updateFooterNavigation();
    updateContactActions();
  };

  const observer = new MutationObserver(applyNavigationFixes);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', applyNavigationFixes);
  window.addEventListener('popstate', applyNavigationFixes);
  applyNavigationFixes();
})();