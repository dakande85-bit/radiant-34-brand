import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowUpRight, CircleDot, Sparkles, SunMedium } from 'lucide-react';
import { products } from './data/products';
import './styles.css';

const featuredProducts = products.sort((a, b) => a.launchPriority - b.launchPriority);

function Header() {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="Radiant 34 home">
        <span className="brand-sun" />
        <span>RADIANT</span>
        <strong>34</strong>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#story">Story</a>
        <a href="#capsule">Capsule</a>
        <a href="#investor">Vision</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="halo halo-one" />
      <div className="halo halo-two" />
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={16} /> Psalm 34:5 / Launch Capsule</p>
        <h1>Faith-made apparel with light in the fabric.</h1>
        <p className="hero-lede">
          Radiant 34 is a Bible-inspired clothing label for everyday wear — premium, minimal,
          warm, and built around the promise: those who look to Him are radiant.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#capsule">Shop the capsule <ArrowUpRight size={18} /></a>
          <a className="button secondary" href="#story">Read the story</a>
        </div>
      </div>
      <div className="hero-card" aria-label="Radiant 34 visual identity card">
        <div className="card-topline">
          <span>DROP 001</span>
          <span>PSALM 34:5</span>
        </div>
        <div className="radiant-orb">
          <div className="orb-core">34</div>
        </div>
        <div className="hero-product-note">
          <span>RADIANT</span>
          <p>Those who look to Him are radiant; their faces are never covered with shame.</p>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story section" id="story">
      <div>
        <p className="eyebrow"><SunMedium size={16} /> The foundation</p>
        <h2>Not church merch. A premium label with a living message.</h2>
      </div>
      <div className="story-panel">
        <p>
          Radiant 34 starts from Psalm 34:5: “Those who look to Him are radiant; their faces are
          never covered with shame.” The brand turns that promise into wearable design — pieces
          that carry identity, hope, and quiet conviction without shouting.
        </p>
        <p>
          The design language is warm black, cream, gold light, clean type, and restrained symbols.
          Some products use the logo. Others use scripture, light marks, or subtle hidden details.
        </p>
      </div>
    </section>
  );
}

function ProductGrid() {
  return (
    <section className="section capsule" id="capsule">
      <div className="section-heading">
        <p className="eyebrow"><CircleDot size={16} /> Drop 001</p>
        <h2>Launch capsule</h2>
        <p>Seven focused products. No random clutter. Every piece has a reason to exist.</p>
      </div>
      <div className="product-grid">
        {featuredProducts.map((product, index) => (
          <article className="product-card" key={product.id}>
            <div className="product-visual">
              <span className="product-number">0{index + 1}</span>
              <span className="product-glow" />
              <strong>{product.name.split(' ').slice(-1)[0]}</strong>
            </div>
            <div className="product-copy">
              <p>{product.category.replace('-', ' ')}</p>
              <h3>{product.name}</h3>
              <span>{product.shortDescription}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InvestorSection() {
  return (
    <section className="section investor" id="investor">
      <div className="investor-card">
        <p className="eyebrow">Brand vision</p>
        <h2>Built for product, story, community, and scale.</h2>
        <p>
          Radiant 34 can begin as a focused apparel capsule, then grow into accessories, church
          collaborations, creator campaigns, devotional products, events, and mission-led drops.
        </p>
        <div className="metrics">
          <span><strong>7</strong> launch products</span>
          <span><strong>1</strong> core scripture</span>
          <span><strong>∞</strong> capsule potential</span>
        </div>
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
        <Story />
        <ProductGrid />
        <InvestorSection />
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
