(() => {
  const DRESS_TITLE = 'Radiant 34 Renewed Daily T-Shirt Dress';
  const DRESS_DESCRIPTION = 'An oversized T-shirt dress featuring the Renewed Daily design, inspired by Lamentations 3:22–23. Made from smooth stretch fabric with a relaxed drop-shoulder fit for comfortable everyday wear.';

  const text = (node) => node?.textContent?.trim() ?? '';
  const containsAny = (value, terms) => terms.some((term) => value.includes(term));

  const isDressPage = (detail) => {
    const title = text(detail.querySelector('.product-detail__copy h2'));
    const category = text(detail.querySelector('.product-category'));
    const imageAlts = Array.from(detail.querySelectorAll('.product-gallery img'))
      .map((image) => image.getAttribute('alt') || '')
      .join(' ');
    const value = `${title} ${category} ${imageAlts}`.toLowerCase();
    return containsAny(value, ['t-shirt dress', 'tshirt dress', 'renewed daily']);
  };

  const replaceBadges = (detail, labels) => {
    const row = detail.querySelector('.product-badge-row');
    if (!row) return;
    row.innerHTML = '';
    labels.forEach((label) => {
      const badge = document.createElement('span');
      badge.className = 'status-badge';
      badge.textContent = label;
      row.appendChild(badge);
    });
  };

  const updateAccordions = (detail) => {
    const details = Array.from(detail.querySelectorAll('.product-accordions details'));
    const fabric = details.find((item) => text(item.querySelector('summary')).toLowerCase().includes('fabric'));
    const care = details.find((item) => text(item.querySelector('summary')).toLowerCase().includes('care'));

    if (fabric?.querySelector('p')) {
      fabric.querySelector('p').textContent = 'Relaxed oversized fit with a dropped shoulder, wide sleeves and smooth stretch fabric. Polyester–spandex blend; composition varies slightly by fulfilment region.';
    }

    if (care?.querySelector('p')) {
      care.querySelector('p').textContent = 'Machine wash cold with similar colours. Do not bleach. Tumble dry low or air dry. Do not iron directly over the print.';
    }
  };

  const cleanDressPage = (detail) => {
    if (!isDressPage(detail)) return;

    const title = detail.querySelector('.product-detail__copy h2');
    const category = detail.querySelector('.product-category');
    const eyebrow = detail.querySelector('.product-detail__copy > .eyebrow');
    const descriptions = Array.from(detail.querySelectorAll('.product-detail__copy > .product-description'));

    if (title) title.textContent = DRESS_TITLE;
    if (category) category.textContent = 'Women’s T-Shirt Dress';
    if (eyebrow) eyebrow.textContent = 'Women’s Collection';

    if (descriptions[0]) descriptions[0].textContent = DRESS_DESCRIPTION;
    descriptions.slice(1).forEach((paragraph) => paragraph.remove());

    replaceBadges(detail, [
      'WOMEN',
      'LAMENTATIONS 3:22–23',
      'OVERSIZED FIT',
      'SOFT STRETCH',
    ]);

    updateAccordions(detail);
  };

  const createLightbox = () => {
    let lightbox = document.querySelector('.r34-product-lightbox');
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.className = 'r34-product-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded product image');
    lightbox.innerHTML = '<button class="r34-product-lightbox__close" type="button" aria-label="Close image">×</button><img alt="">';

    const close = () => {
      lightbox.hidden = true;
      document.body.style.removeProperty('overflow');
    };

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.closest('.r34-product-lightbox__close')) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) close();
    });

    document.body.appendChild(lightbox);
    return lightbox;
  };

  const enableGalleryZoom = (detail) => {
    const lightbox = createLightbox();
    const expandedImage = lightbox.querySelector('img');

    detail.querySelectorAll('.product-gallery img').forEach((image) => {
      if (image.dataset.r34ZoomReady === 'true') return;
      image.dataset.r34ZoomReady = 'true';
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `Expand ${image.getAttribute('alt') || 'product image'}`);

      const open = () => {
        expandedImage.src = image.currentSrc || image.src;
        expandedImage.alt = image.getAttribute('alt') || 'Expanded product image';
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.r34-product-lightbox__close')?.focus();
      };

      image.addEventListener('click', open);
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
  };

  const apply = () => {
    const detail = document.querySelector('.product-detail');
    if (!detail) return;
    cleanDressPage(detail);
    enableGalleryZoom(detail);
  };

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        queued = false;
        apply();
      });
    });
  };

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener('DOMContentLoaded', queue);
  window.addEventListener('popstate', queue);
  queue();
})();