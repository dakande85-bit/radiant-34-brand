import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { products } from './data/products';
import './styles.css';

const featuredProducts = [...products].sort((a, b) => a.launchPriority - b.launchPriority);

function Header() {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="Radiant 34 home">
        <span className="sun-mark" />
        <span className="wordmark">RADIANT</span>
        <strong>34</strong>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#story">Story</a>
        <a href="#capsule">Capsule</a>
        <a href="#vision">Vision</a>
      </nav>
    </header>
  );
}

function HeroProduct() {
  return (
    <div className="editorial-stack" aria-label="Radiant 34 launch capsule preview">
      <div className="garment-card hoodie-card">
        <div className="garment-neck" />
        <div className="garment-body">
          <span>RADIANT</span>
          <strong>34</strong>
          <p>PSALM 34:5</p>
        </div>
      </div>
      <div className="garment-card tee-card">
        <div className="garment-neck" />
        <div className="garment-body minimal">
          <span>LOOK TO HIM</span>
          <strong>R34</strong>
        </div>
      </div>
      <div className="drop-card">
        <span>DROP 001</span>
        <p>Heavyweight essentials, clean accessories, scripture-led design.</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={15} /> Psalm 34:5 clothing label</p>
        <h1>Radiant pieces for everyday faith.</h1>
        <p className="hero-lede">
          A premium Bible-inspired clothing label built on light, identity and freedom from shame.
          Designed for daily wear, not disposable merch.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#capsule">View capsule <ArrowUpRight size={17} /></a>
          <a className="button secondary" href="#story">Brand story</a>
        </div>
      </div>
      <HeroProduct />
      <div className="scripture-strip">
        <span>Those who look to Him are radiant</span>
        <span>Psalm 34:5</span>
        <span>Never covered with shame</span>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story section" id="story">
      <p className="section-kicker">The foundation</p>
      <div className="story-grid">
        <h2>Faith-led design without the cheap merch look.</h2>
        <div className="story-copy">
          <p>
            Radiant 34 starts from Psalm 34:5 and turns the message into clothing people can wear
            naturally: clean shapes, warm tones, scripture details and strong everyday pieces.
          </p>
          <p>
            The brand should feel premium first, then reveal the message with depth. Not every item
            needs the main logo. Some pieces carry text, small marks, hidden details or simple light graphics.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProductGrid() {
  return (
    <section className="section capsule" id="capsule">
      <div className="section-heading">
        <p className="section-kicker">Drop 001</p>
        <h2>Launch capsule</h2>
        <p>Seven focused products to make the brand feel real before expanding the range.</p>
      </div>
      <div className="product-grid">
        {featuredProducts.map((product, index) => (
          <article className="product-card" key={product.id}>
            <div className="product-image-shell">
              <span className="product-index">0{index + 1}</span>
              <div className={`product-shape product-${product.category}`}>
                <span>{product.name.includes('Hoodie') ? 'HOODIE' : product.name.includes('T-shirt') ? 'TEE' : product.name.includes('Tank') ? 'TANK' : product.name.includes('Bottle') ? 'BOTTLE' : product.name.includes('Backpack') ? 'BAG' : product.name.includes('Bracelet') ? 'BAND' : 'KEY'}</span>
              </div>
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

function Vision() {
  return (
    <section className="section vision" id="vision">
      <div className="vision-panel">
        <p className="section-kicker">Brand vision</p>
        <h2>Start with a capsule. Build a movement around the message.</h2>
        <p>
          Radiant 34 can grow from apparel into accessories, church collaborations, creator drops,
          devotional products and mission-led collections — but the first job is making the brand look serious.
        </p>
        <div className="vision-points">
          <span><strong>01</strong> Premium product identity</span>
          <span><strong>02</strong> Bible-inspired art direction</span>
          <span><strong>03</strong> Shopify-ready launch path</span>
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
