(() => {
  const IMAGE_URL = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-white-hoodie-hover_b7f76499-7092-4ce3-812d-d6f986730c9d.png?v=1784709841';
  const DESCRIPTION = 'Scripture hoodies and outerwear for men.';

  const apply = () => {
    if (window.location.pathname !== '/shop') return;

    const card = document.querySelector('.r34-shop-category-card[data-r34-category-key="mens-outerwear"]');
    const image = card?.querySelector('img');
    const description = card?.querySelector('.r34-shop-category-card__copy > span');

    if (image) {
      if (image.getAttribute('src') !== IMAGE_URL) {
        image.setAttribute('src', IMAGE_URL);
        image.removeAttribute('srcset');
      }
      image.alt = 'Radiant 34 white Scripture hoodie for men';
      image.style.objectPosition = 'center 35%';
    }

    if (description && description.textContent !== DESCRIPTION) {
      description.textContent = DESCRIPTION;
    }

    const resultsHeading = document.querySelector('.r34-shop-results-heading');
    const resultsTitle = resultsHeading?.querySelector('h2')?.textContent?.trim();
    const resultsDescription = resultsHeading?.querySelector('p:last-child');
    if ((resultsTitle === 'Men’s Outerwear' || resultsTitle === "Men's Outerwear") && resultsDescription) {
      resultsDescription.textContent = DESCRIPTION;
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
