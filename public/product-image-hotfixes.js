(() => {
  const productPath = '/products/his-peace-calmed-a-storm-mug';
  const correctImage = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-his-peace-calmed-a-storm-mug-primary.png?v=1784714241';
  const badImageTokens = [
    'afd73426-1e13-4c7f-ac6f-fd124a6d0974',
    'radiant34-his-peace-calmed-a-storm-correct-hover',
  ];

  const applyImage = (img) => {
    if (!img) return;
    if (img.getAttribute('src') !== correctImage) img.setAttribute('src', correctImage);
    img.removeAttribute('srcset');
    img.setAttribute('alt', 'Radiant 34 His Peace Calmed a Storm white ceramic mug');
  };

  const fixImages = () => {
    document.querySelectorAll('img').forEach((img) => {
      const src = img.currentSrc || img.getAttribute('src') || '';
      if (badImageTokens.some((token) => src.includes(token))) applyImage(img);
    });

    document.querySelectorAll(`a[href="${productPath}"], a[href$="${productPath}"]`).forEach((link) => {
      const card = link.closest('.shopify-card, .product-card, article, li, div');
      if (!card) return;
      card.querySelectorAll('img').forEach(applyImage);
    });

    if (window.location.pathname === productPath) {
      const main = document.querySelector('main');
      if (!main) return;
      const heading = Array.from(main.querySelectorAll('h1, h2')).find((node) =>
        node.textContent?.toLowerCase().includes('his peace calmed a storm')
      );
      if (!heading) return;

      main.querySelectorAll('img').forEach((img) => {
        const alt = (img.getAttribute('alt') || '').toLowerCase();
        const src = img.currentSrc || img.getAttribute('src') || '';
        if (
          alt.includes('his peace') ||
          alt.includes('storm mug') ||
          badImageTokens.some((token) => src.includes(token))
        ) {
          applyImage(img);
        }
      });
    }
  };

  let queued = false;
  const queueFix = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fixImages();
    });
  };

  new MutationObserver(queueFix).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset'],
  });

  window.addEventListener('popstate', queueFix);
  document.addEventListener('click', () => setTimeout(queueFix, 0));
  fixImages();
})();