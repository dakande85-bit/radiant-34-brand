(() => {
  const replaceExactText = (from, to) => {
    document.querySelectorAll('a, button, h1, h2, p, span').forEach((node) => {
      if (node.childElementCount === 0 && node.textContent?.trim() === from) node.textContent = to;
    });
  };

  const applyLaunchCopy = () => {
    replaceExactText('About', 'Our Story');

    if (window.location.pathname === '/about') {
      const h1 = document.querySelector('main h1');
      if (h1) h1.textContent = 'Our Story';
      const blocks = document.querySelectorAll('main p');
      const copy = [
        'Radiant 34 began with one verse: “Those who look to Him are radiant; their faces are never covered with shame.” — Psalm 34:5.',
        'Psalm 34 is a testimony written from the other side of fear, shame and deliverance. Radiant 34 turns that testimony into clothing and everyday pieces designed to carry Scripture naturally into real life.',
        'Every collection begins with the Bible. Every design is created to point beyond the product and back to Jesus Christ — with confidence, clarity and no compromise.',
      ];
      blocks.forEach((node, index) => { if (copy[index]) node.textContent = copy[index]; });
    }

    if (window.location.pathname === '/mission') {
      const h1 = document.querySelector('main h1');
      if (h1) h1.textContent = 'Clothing that carries the message further.';
      const blocks = document.querySelectorAll('main p');
      const copy = [
        'Radiant 34 exists to create clothing, media and resources that help people know Christ, stand for biblical truth and carry His light into everyday spaces.',
        'We wear the Word, share the Gospel and strengthen the Church. Every product is part of a wider mission: make Scripture visible, support faithful Christian work and help fund the telling of the true Gospel.',
        'This is not faith used as decoration. It is testimony made visible — designed to start conversations, encourage believers and point people back to Jesus Christ.',
      ];
      blocks.forEach((node, index) => { if (copy[index]) node.textContent = copy[index]; });
    }
  };

  const observer = new MutationObserver(applyLaunchCopy);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', () => setTimeout(applyLaunchCopy, 0));
  document.addEventListener('click', () => setTimeout(applyLaunchCopy, 0));
  applyLaunchCopy();
})();
