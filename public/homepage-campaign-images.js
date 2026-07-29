(() => {
  const IMAGES = {
    hero: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-hero.webp?v=1785331751',
    male: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-male.webp?v=1785331768',
    female: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-female.webp?v=1785331783',
    dress: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-dress.webp?v=1785331796',
  };

  const setImage = (image, src, alt) => {
    if (!image) return;
    if (image.src !== src) image.src = src;
    image.alt = alt;
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
  };

  const apply = () => {
    if (window.location.pathname !== '/') return;

    setImage(
      document.querySelector('main .hero .hero-image img'),
      IMAGES.hero,
      'Male model wearing the cream Radiant 34 Psalm 34:5 T-shirt at golden hour',
    );

    const editorialImages = document.querySelectorAll('main .lookbook > img');
    setImage(
      editorialImages[0],
      IMAGES.male,
      'Male model wearing the cream Radiant 34 T-shirt',
    );
    setImage(
      editorialImages[1],
      IMAGES.female,
      'Female model wearing the black Radiant 34 T-shirt',
    );

    setImage(
      document.querySelector('main .about-section .about-image img'),
      IMAGES.dress,
      'Female model wearing the Radiant 34 My Refuge and My Fortress T-shirt dress',
    );
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

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener('DOMContentLoaded', queue);
  window.addEventListener('popstate', queue);
  queue();
})();
