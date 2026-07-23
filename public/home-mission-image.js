(() => {
  const MISSION_MODEL = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-homepage-light-skin-woman-cream-hoodie.png?v=1784765020';
  const TARGET_HEADINGS = [
    'Clothing that helps the testimony travel.',
    'Clothing that funds the telling.',
  ];

  const replaceMissionImage = () => {
    if (window.location.pathname !== '/') return;

    const headings = Array.from(document.querySelectorAll('main h1, main h2, main h3'));
    const heading = headings.find((node) => TARGET_HEADINGS.includes(node.textContent?.trim() ?? ''));
    if (!heading) return;

    const section = heading.closest('section') ?? heading.parentElement?.parentElement;
    const image = section?.querySelector('img');
    if (!image) return;

    if (image.src !== MISSION_MODEL) image.src = MISSION_MODEL;
    image.alt = 'Light-skinned woman wearing the cream Radiant 34 hoodie';
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
    image.style.objectFit = 'cover';
    image.style.objectPosition = 'center 30%';
  };

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      replaceMissionImage();
    });
  };

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('popstate', queue);
  document.addEventListener('DOMContentLoaded', queue);
  queue();
})();