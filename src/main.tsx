import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowUpRight } from 'lucide-react';
import { products } from './data/products';
import './styles.css';

const capsuleProducts = [...products].sort((a, b) => a.launchPriority - b.launchPriority);

function Header() {
  return (
    <header className="rf-header">
      <a href="#top" className="rf-logo" aria-label="Radiant 34 home">
        <span className="rf-logo__sun" />
        <span>RADIANT</span>
        <strong>34</strong>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#capsule">Drop 001</a>
        <a href="#story">Story</a>
        <a href="#vision">Vision</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="rf-hero" id="top" aria-label="Radiant 34 homepage hero">
      <div className="rf-hero__media" aria-hidden="true">
        <div className="rf-campaign">
          <div className="rf-campaign__sun" />
          <div className="rf-campaign__figure">
            <div className="rf-campaign__tee">
              <span>RADIANT</span>
              <strong>34</strong>
              <small>PSALM 34:5</small>
            </div>
          </div>
          <div className="rf-campaign__tag">DROP 001 / FAITH WEAR</div>
        </div>
      </div>
      <div className="rf-hero__scrim" aria-hidden="true" />
      <div className="rf-hero__content">
        <p className="rf-eyebrow">PSALM 34:5 / CLOTHING LABEL</p>
        <h1>
          <span>LOOK TO HIM.</span>
          <span>BE RADIANT.</span>
          <span>NEVER ASHAMED.</span>
        </h1>
        <p>
          Bible-inspired clothing and everyday objects built with the discipline of a real fashion label:
          clean graphics, warm light, premium blanks, and a message people can actually wear.
        </p>
        <div className="rf-actions">
          <a href="#capsule" className="rf-btn rf-btn--primary">Explore Drop 001</a>
          <a href="#story" className="rf-btn rf-btn--ghost">Brand Story</a>
        </div>
      </div>
      <div className="rf-hero__ticker" aria-hidden="true">
        <span>THOSE WHO LOOK TO HIM ARE RADIANT</span>
        <span>PSALM 34:5</span>
        <span>NEVER COVERED WITH SHAME</span>
      </div>
    </section>
  );
}

function Capsule() {
  return (
    <section className="rf-section rf-capsule" id="capsule">
      <div className="rf-section__header">
        <p className="rf-eyebrow">DROP 001</p>
        <h2>Launch capsule</h2>
        <p>Start tight: hero apparel, wearable accessories, and everyday carry. No random clutter.</p>
      </div>
      <div className="rf-product-wall">
        {capsuleProducts.map((product, index) => (
          <article className="rf-product" key={product.id}>
            <div className="rf-product__visual">
              <span className="rf-product__num">{String(index + 1).padStart(2, '0')}</span>
              <div className="rf-product__object">
                <span>{product.name.includes('Hoodie') ? 'HOOD' : product.name.includes('T-shirt') ? 'TEE' : product.name.includes('Tank') ? 'TANK' : product.name.includes('Bottle') ? 'BOTTLE' : product.name.includes('Backpack') ? 'PACK' : product.name.includes('Bracelet') ? 'BAND' : 'KEY'}</span>
              </div>
            </div>
            <div className="rf-product__copy">
              <p>{product.category.replace('-', ' ')}</p>
              <h3>{product.name}</h3>
              <span>{product.spiritualMeaning}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="rf-story" id="story">
      <div className="rf-story__panel">
        <p className="rf-eyebrow">THE FOUNDATION</p>
        <h2>Those who look to Him are radiant.</h2>
      </div>
      <div className="rf-story__copy">
        <p>
          Radiant 34 is not a basic merch idea. It is a faith-led design system built from Psalm 34:5:
          light, identity, confidence, and freedom from shame.
        </p>
        <p>
          The product language should feel like a serious clothing label first. The scripture sits inside the
          design with restraint: chest marks, back graphics, woven labels, metal details, packaging, and campaign art.
        </p>
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section className="rf-section rf-vision" id="vision">
      <div className="rf-vision__inner">
        <p className="rf-eyebrow">INVESTMENT-READY DIRECTION</p>
        <h2>Product. Story. Community. Mission.</h2>
        <p>
          The first site should sell the world of Radiant 34 before selling products: a capsule, a message,
          a visual identity, and a route into Shopify.
        </p>
        <div className="rf-vision__grid">
          <span><strong>01</strong> Premium Christian streetwear</span>
          <span><strong>02</strong> Capsule-first product strategy</span>
          <span><strong>03</strong> Shopify-ready commerce path</span>
        </div>
        <a href="#top" className="rf-inline-link">Back to top <ArrowUpRight size={16} /></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="rf-footer">
      <span>RADIANT 34</span>
      <p>Look to Him. Be radiant.</p>
    </footer>
  );
}

function App() {
  return (
    <div className="rf-site">
      <Header />
      <main>
        <Hero />
        <Capsule />
        <Story />
        <Vision />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
