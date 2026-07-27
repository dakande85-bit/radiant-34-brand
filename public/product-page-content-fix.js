(() => {
  const DRESS_PATH = '/products/t-shirt-dress-5';
  const DRESS_TITLE = 'Radiant 34 Made New T-Shirt Dress';
  const DRESS_DESCRIPTION = 'An oversized T-shirt dress featuring the Made New design, inspired by 2 Corinthians 5:17. The warm tan, black and cream all-over artwork is finished with a relaxed drop-shoulder silhouette for comfortable everyday wear.';

  const text = (node) => node?.textContent?.trim() ?? '';

  const isDressPage = () => window.location.pathname.replace(/\/$/, '') === DRESS_PATH;

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
      fabric.querySelector('p').textContent = 'Relaxed oversized fit with dropped shoulders, widened sleeves and smooth stretch fabric. Polyester–spandex composition varies slightly by fulfilment region.';
    }

    if (care?.querySelector('p')) {
      care.querySelector('p').textContent = 'Machine wash cold with similar colours. Do not bleach. Tumble dry low or air dry. Do not iron directly over the print.';
    }
  };

  const prepareGallery = (detail) => {
    if (!isDressPage()) return;

    detail.classList.add('r34-made-new-page');
    const gallery = detail.querySelector('.product-gallery');
    if (!gallery || gallery.dataset.r34MadeNewReady === 'true') return;

    const items = Array.from(gallery.querySelectorAll('.product-gallery__item'));
    if (items.length >= 3) {
      const [cleanFront, lifestyleFront, cleanBack, ...remaining] = items;
      gallery.append(lifestyleFront, cleanFront, cleanBack, ...remaining);

      const orderedImages = Array.from(gallery.querySelectorAll('.product-gallery__item img'));
      const altText = [
        'Radiant 34 Made New T-Shirt Dress styled on a model',
        'Front view of the Radiant 34 Made New T-Shirt Dress',
        'Back view of the Radiant 34 Made New T-Shirt Dress',
      ];
      orderedImages.forEach((image, index) => {
        if (altText[index]) image.alt = altText[index];
      });
    }

    gallery.dataset.r34MadeNewReady = 'true';
  };

  const cleanDressPage = (detail) => {
    if (!isDressPage()) return;

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
      '2 CORINTHIANS 5:17',
      'OVERSIZED FIT',
      'ALL-OVER PRINT',
    ]);

    updateAccordions(detail);
    prepareGallery(detail);
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