(() => {
  const SHOPIFY_PROXY_PATH = '/api/shopify-storefront';
  const nativeFetch = window.fetch.bind(window);
  const catalogueByTitle = new Map();
  let currentProduct = null;
  let queued = false;

  const normalize = (value) => String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  const uniqueImages = (product) => {
    if (!product) return [];
    const urls = [
      product.featuredImage?.url,
      ...(product.images?.nodes || []).map((image) => image?.url),
    ].filter(Boolean);
    return urls.filter((url, index) => urls.indexOf(url) === index);
  };

  const isShopifyRequest = (input) => {
    const url = typeof input === 'string' ? input : input?.url;
    return typeof url === 'string' && url.includes(SHOPIFY_PROXY_PATH);
  };

  const withNoCacheHeaders = (headers) => {
    const next = new Headers(headers || {});
    next.set('Cache-Control', 'no-cache, no-store, max-age=0');
    next.set('Pragma', 'no-cache');
    return next;
  };

  const rewriteBody = (body) => {
    if (typeof body !== 'string') return body;

    try {
      const payload = JSON.parse(body);
      if (typeof payload.query !== 'string') return body;

      let query = payload.query;

      // The shop must load the complete active catalogue, not only the first 24 items.
      if (query.includes('query RadiantProducts')) {
        query = query.replace(/products\(first:\s*24\)/g, 'products(first: 250)');
      }

      // Product pages should receive the complete current Shopify gallery and variants.
      if (query.includes('query RadiantProductByHandle')) {
        query = query
          .replace(/images\(first:\s*4\)/g, 'images(first: 30)')
          .replace(/variants\(first:\s*20\)/g, 'variants(first: 100)');
      }

      return JSON.stringify({ ...payload, query });
    } catch {
      return body;
    }
  };

  const captureShopifyData = (payload) => {
    const data = payload?.data;
    if (!data) return;

    if (Array.isArray(data.products?.nodes)) {
      catalogueByTitle.clear();
      data.products.nodes.forEach((product) => {
        const key = normalize(product?.title);
        if (key) catalogueByTitle.set(key, product);
      });
    }

    if (data.product) currentProduct = data.product;
    queueSync();
  };

  window.fetch = async (input, init = {}) => {
    if (!isShopifyRequest(input)) return nativeFetch(input, init);

    const nextInit = {
      ...init,
      cache: 'no-store',
      headers: withNoCacheHeaders(init.headers),
      body: rewriteBody(init.body),
    };

    const response = await nativeFetch(input, nextInit);
    if (response.ok) {
      response.clone().json().then(captureShopifyData).catch(() => {});
    }
    return response;
  };

  const syncShopCards = () => {
    document.querySelectorAll('.shopify-card').forEach((card) => {
      const title = card.querySelector('.shopify-card__body strong')?.textContent;
      const product = catalogueByTitle.get(normalize(title));
      const images = uniqueImages(product);
      if (!images.length) return;

      const primary = card.querySelector('.shopify-card__image img:first-child');
      if (primary && primary.getAttribute('src') !== images[0]) {
        primary.setAttribute('src', images[0]);
        primary.removeAttribute('srcset');
      }
    });
  };

  const syncProductGallery = () => {
    if (!window.location.pathname.startsWith('/products/')) return;

    const gallery = document.querySelector('.product-gallery');
    const images = uniqueImages(currentProduct);
    if (!gallery || !images.length) return;

    const signature = images.join('|');
    if (gallery.dataset.r34ShopifySignature === signature) return;

    gallery.innerHTML = images.map((url, index) => (
      `<div class="product-gallery__item"><img src="${url}" alt="${String(currentProduct?.title || 'Radiant 34 product').replace(/"/g, '&quot;')} view ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}"></div>`
    )).join('');
    gallery.dataset.r34ShopifySignature = signature;
    gallery.dataset.r34LiveSource = 'shopify';
  };

  const sync = () => {
    syncShopCards();
    syncProductGallery();
  };

  const queueSync = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    });
  };

  new MutationObserver(queueSync).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('popstate', () => {
    currentProduct = null;
    queueSync();
  });
  document.addEventListener('DOMContentLoaded', queueSync);
  queueSync();
})();
