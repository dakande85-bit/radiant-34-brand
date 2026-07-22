(() => {
  const hoverByTitle = {
    'Radiant 34 Signature Hoodie': 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-signature-hoodie-model-hover.png?v=1784722071',
    'Radiant 34 White Hoodie': 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-white-hoodie-hover_b7f76499-7092-4ce3-812d-d6f986730c9d.png?v=1784709841',
    'Radiant 34 Ringer T-Shirt': 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-ringer-tee-model-hover.png?v=1784722093',
    'Radiant 34 Backpack': 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-backpack-model-hover.png?v=1784722113',
    'Radiant 34 Duffle Bag': 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-duffle-bag-lifestyle-hover.png?v=1784722136',
    'Radiant 34 Mug': 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-logo-mug-lifestyle-hover.png?v=1784722165',
    'Radiant 34 Phone Case': 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-phone-case-lifestyle-hover.png?v=1784722184',
    'Radiant 34 Keyring': 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-keyring-lifestyle-hover.png?v=1784722213',
  };

  const apply = () => {
    document.querySelectorAll('.shopify-card').forEach((card) => {
      const titleNode = card.querySelector('.shopify-card__body strong');
      const title = titleNode?.textContent?.trim();
      const hoverUrl = title ? hoverByTitle[title] : null;
      if (!hoverUrl) return;

      const imageWrap = card.querySelector('.shopify-card__image');
      if (!imageWrap) return;

      let hover = imageWrap.querySelector('.shopify-card__hover');
      if (!hover) {
        hover = document.createElement('img');
        hover.className = 'shopify-card__hover';
        hover.alt = '';
        hover.loading = 'lazy';
        const firstImage = imageWrap.querySelector('img');
        if (firstImage?.nextSibling) imageWrap.insertBefore(hover, firstImage.nextSibling);
        else imageWrap.appendChild(hover);
      }

      if (hover.getAttribute('src') !== hoverUrl) {
        hover.setAttribute('src', hoverUrl);
        hover.removeAttribute('srcset');
      }
    });
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
  document.addEventListener('click', () => setTimeout(queue, 0));
  apply();
})();