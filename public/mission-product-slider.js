(() => {
  const products = [
    {
      title: 'Jesus in Every Language Wristlet',
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-slider-jesus-every-language-wristlet.png?v=1785386879',
      alt: 'Radiant 34 Jesus in every language wristlet bag',
    },
    {
      title: 'Follow God Not Man Cap',
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-slider-follow-god-not-man-cap.png?v=1785386901',
      alt: 'Radiant 34 Follow God Not Man navy cap',
    },
    {
      title: 'Kind Words Are Like Honey Mug',
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-slider-kind-words-honey-mug.png?v=1785386921',
      alt: 'Radiant 34 Kind Words Are Like Honey mug',
    },
    {
      title: 'Faith Over Fear T-Shirt',
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-slider-faith-over-fear-tshirt.png?v=1785386941',
      alt: 'Radiant 34 Faith Over Fear purple T-shirt',
    },
    {
      title: 'Jesus Is King Cap',
      image: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-slider-jesus-is-king-cap.png?v=1785386965',
      alt: 'Radiant 34 Jesus Is King grey and red cap',
    },
  ];

  const buildSlider = (missionBand) => {
    if (!missionBand || missionBand.querySelector('.mission-product-slider')) return;

    const currentImage = missionBand.querySelector(':scope > img');
    if (!currentImage) return;

    const slider = document.createElement('section');
    slider.className = 'mission-product-slider';
    slider.setAttribute('aria-label', 'Featured Radiant 34 products');

    slider.innerHTML = `
      <div class="mission-product-slider__viewport" aria-live="polite">
        <div class="mission-product-slider__track">
          ${products.map((product, index) => `
            <a class="mission-product-slider__slide${index === 0 ? ' is-active' : ''}" href="/shop" aria-hidden="${index === 0 ? 'false' : 'true'}">
              <img src="${product.image}" alt="${product.alt}" loading="${index === 0 ? 'eager' : 'lazy'}">
              <span class="mission-product-slider__caption">
                <small>Featured product</small>
                <strong>${product.title}</strong>
                <em>Shop now</em>
              </span>
            </a>
          `).join('')}
        </div>
        <button class="mission-product-slider__arrow mission-product-slider__arrow--prev" type="button" aria-label="Previous product">‹</button>
        <button class="mission-product-slider__arrow mission-product-slider__arrow--next" type="button" aria-label="Next product">›</button>
      </div>
      <div class="mission-product-slider__dots" aria-label="Choose product">
        ${products.map((product, index) => `<button type="button" aria-label="Show ${product.title}" aria-current="${index === 0 ? 'true' : 'false'}"></button>`).join('')}
      </div>
    `;

    currentImage.replaceWith(slider);

    const slides = Array.from(slider.querySelectorAll('.mission-product-slider__slide'));
    const dots = Array.from(slider.querySelectorAll('.mission-product-slider__dots button'));
    const prev = slider.querySelector('.mission-product-slider__arrow--prev');
    const next = slider.querySelector('.mission-product-slider__arrow--next');
    let activeIndex = 0;
    let timer = null;
    let touchStartX = 0;

    const show = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.tabIndex = active ? 0 : -1;
      });
      dots.forEach((dot, dotIndex) => {
        dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
      });
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => show(activeIndex + 1), 4500);
    };

    prev?.addEventListener('click', () => {
      show(activeIndex - 1);
      start();
    });
    next?.addEventListener('click', () => {
      show(activeIndex + 1);
      start();
    });
    dots.forEach((dot, index) => dot.addEventListener('click', () => {
      show(index);
      start();
    }));

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    slider.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
      stop();
    }, { passive: true });
    slider.addEventListener('touchend', (event) => {
      const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
      const difference = touchEndX - touchStartX;
      if (Math.abs(difference) > 45) show(activeIndex + (difference < 0 ? 1 : -1));
      start();
    }, { passive: true });

    show(0);
    start();
  };

  const initialise = () => {
    if ((window.location.pathname.replace(/\/$/, '') || '/') !== '/') return;
    buildSlider(document.querySelector('main .mission-band'));
  };

  const schedule = () => {
    [0, 100, 300, 700, 1400].forEach((delay) => window.setTimeout(initialise, delay));
  };

  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('popstate', schedule);
  schedule();
})();