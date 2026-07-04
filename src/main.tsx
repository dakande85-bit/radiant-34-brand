import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { products } from './data/products';
import './styles.css';

const images = {
  hero: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=90',
  campaignA: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=88',
  campaignB: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=88',
  productA: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=88',
  productB: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=88',
  productC: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=88',
  productD: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=88',
  story: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=88',
};

const productImages = [images.productA, images.productB, images.productC, images.productD, images.campaignA, images.campaignB, images.hero];
const capsuleProducts = [...products].sort((a, b) => a.launchPriority - b.launchPriority);

function Header() {
  return (
    <header className="site-header">
      <a href="#top" className="brand-lockup" aria-label="Radiant 34 home">
        <span className="brand-symbol">✹</span>
        <span>RADIANT</span>
        <strong>34</strong>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#shop">Shop</a>
        <a href="#campaign">Campaign</a>
        <a href="#story">Story</a>
      </nav>
      <a className="header-cta" href="#shop">Drop 001</a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero-image" src={images.hero} alt="Editorial streetwear campaign model" />
      <div className="hero-scrim" />
      <div className="hero-content">
        <p className="eyebrow">Psalm 34:5 / Bible-inspired clothing</p>
        <h1>
          <span>LOOK TO HIM.</span>
          <span>BE RADIANT.</span>
        </h1>
        <p className="hero-copy">
          Premium Christian streetwear and everyday accessories carrying the message: those who look to Him are radiant; their faces are never covered with shame.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#shop">Shop Drop 001 <ArrowUpRight size={16} /></a>
          <a className="btn btn-ghost" href="#campaign">View Campaign</a>
        </div>
      </div>
      <div className="hero-product-card">
        <span>DROP 001</span>
        <strong>Radiant essentials for daily faith.</strong>
        <p>T-shirts, hoodies, accessories, bottles, bags and scripture-led design.</p>
      </div>
    </section>
  );
}

function Campaign() {
  return (
    <section className="campaign" id="campaign">
      <div className="campaign-copy">
        <p className="eyebrow">Campaign direction</p>
        <h2>Faith clothing that does not look like church merch.</h2>
        <p>
          Radiant 34 should feel editorial, warm, and premium: real people, real product, clean typography, and scripture details used with restraint.
        </p>
      </div>
      <div className="campaign-grid">
        <figure className="campaign-shot tall">
          <img src={images.campaignA} alt="Editorial fashion portrait" />
          <figcaption>Warm neutral styling</figcaption>
        </figure>
        <figure className="campaign-shot">
          <img src={images.campaignB} alt="Premium fashion editorial" />
          <figcaption>Everyday faith wear</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Shop() {
  return (
    <section className="shop" id="shop">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Drop 001</p>
          <h2>Launch capsule</h2>
        </div>
        <p>Seven focused products to make the brand feel real, sellable, and ready for Shopify.</p>
      </div>
      <div className="product-grid">
        {capsuleProducts.map((product, index) => (
          <article className="product-card" key={product.id}>
            <div className="product-media">
              <img src={productImages[index % productImages.length]} alt={product.name} />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="product-info">
              <p>{product.category.replace('-', ' ')}</p>
              <h3>{product.name}</h3>
              <small>{product.shortDescription}</small>
              <button type="button"><ShoppingBag size={15} /> Coming soon</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story" id="story">
      <div className="story-image">
        <img src={images.story} alt="Lifestyle editorial portrait" />
      </div>
      <div className="story-copy">
        <p className="eyebrow">The verse</p>
        <h2>Those who look to Him are radiant.</h2>
        <p>
          Radiant 34 is built from Psalm 34:5. The brand language is light, identity, confidence, and freedom from shame — expressed through clothing, accessories, packaging, and campaign art.
        </p>
        <p>
          The logo should not be forced onto every piece. Some products use scripture. Some use small marks. Some carry hidden details. The result should feel wearable first, then meaningful.
        </p>
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section className="vision">
      <p className="eyebrow">Ready-to-build direction</p>
      <h2>Launch the world before scaling the store.</h2>
      <div className="vision-grid">
        <article><strong>01</strong><span>Professional brand homepage</span></article>
        <article><strong>02</strong><span>Shopify-ready product structure</span></article>
        <article><strong>03</strong><span>Real photography direction</span></article>
        <article><strong>04</strong><span>Investor-ready story and product plan</span></article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <span>RADIANT 34</span>
      <p>Look to Him. Be radiant.</p>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Campaign />
        <Shop />
        <Story />
        <Vision />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
