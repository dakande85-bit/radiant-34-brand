(() => {
  const CATEGORY_UPDATES = {
    'womens-outerwear': {
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-unisex-bomber-jacket-white-front-6a61746d245cf.jpg',
      alt: 'Radiant 34 women’s all-over print bomber jacket',
      description: 'Bomber jackets, hoodies and outerwear selected for women.',
      objectPosition: 'center',
    },
    'mens-outerwear': {
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-white-hoodie-hover_b7f76499-7092-4ce3-812d-d6f986730c9d.png?v=1784709841',
      alt: 'Radiant 34 white Scripture hoodie for men',
      description: 'Scripture hoodies and outerwear for men.',
      objectPosition: 'center 35%',
    },
  };

  const applyCategoryUpdate = (key, update) => {
    const card = document.querySelector(`.r34-shop-category-card[data-r34-category-key="${key}"]`);
    const image = card?.querySelector('img');
    const description = card?.querySelector('.r34-shop-category-card__copy > span');

    if (image) {
      if (image.getAttribute('src') !== update.image) {
        image.setAttribute('src', update.image);
        image.removeAttribute('srcset');
      }
      image.alt = update.alt;
      image.style.objectPosition = update.objectPosition;
    }

    if (description && description.textContent !== update.description) {
      description.textContent = update.description;
    }
  };

  const apply = () => {
    if (window.location.pathname !== '/shop') return;

    Object.entries(CATEGORY_UPDATES).forEach(([key, update]) => applyCategoryUpdate(key, update));

    const resultsHeading = document.querySelector('.r34-shop-results-heading');
    const resultsTitle = resultsHeading?.querySelector('h2')?.textContent?.trim();
    const resultsDescription = resultsHeading?.querySelector('p:last-child');

    if ((resultsTitle === 'Men’s Outerwear' || resultsTitle === "Men's Outerwear") && resultsDescription) {
      resultsDescription.textContent = CATEGORY_UPDATES['mens-outerwear'].description;
    }

    if ((resultsTitle === 'Women’s Outerwear' || resultsTitle === "Women's Outerwear") && resultsDescription) {
      resultsDescription.textContent = CATEGORY_UPDATES['womens-outerwear'].description;
    }
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
