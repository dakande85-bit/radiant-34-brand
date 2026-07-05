import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

// ─── SUNBURST ─────────────────────────────────────────────────────────────────
function Sunburst({ size = 80 }: { size?: number }) {
  const rays = 16;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = size * 0.15;
  const outerLong = size * 0.47;
  const outerShort = size * 0.36;
  const coreR = size * 0.09;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {Array.from({ length: rays }, (_, i) => {
        const angleDeg = (i * 360) / rays - 90;
        const rad = (angleDeg * Math.PI) / 180;
        const outerR = i % 2 === 0 ? outerLong : outerShort;
        return (
          <line
            key={i}
            x1={cx + innerR * Math.cos(rad)}
            y1={cy + innerR * Math.sin(rad)}
            x2={cx + outerR * Math.cos(rad)}
            y2={cy + outerR * Math.sin(rad)}
            stroke="#B58A3B"
            strokeWidth={Math.max(1, size * 0.018)}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={coreR} fill="#B58A3B" />
    </svg>
  );
}

// ─── PLACEHOLDER IMAGE ────────────────────────────────────────────────────────
function PlaceholderImage({ label, todo, tall }: { label: string; todo?: string; tall?: boolean }) {
  return (
    <div className={`ph-img${tall ? ' ph-img--tall' : ''}`} role="img" aria-label={label}>
      <Sunburst size={28} />
      <span className="ph-img__label">{label}</span>
      {todo && <small className="ph-img__todo">{todo}</small>}
    </div>
  );
}

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
function SunburstDivider() {
  return (
    <div className="sb-divider" aria-hidden="true">
      <span className="sb-divider__line" />
      <Sunburst size={26} />
      <span className="sb-divider__line" />
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" className="logo" aria-label="Radiant 34 home">
          <Sunburst size={28} />
          <span className="logo-text">
            RADIANT <strong>34</strong>
          </span>
        </a>

        <nav className={`main-nav${open ? ' main-nav--open' : ''}`} aria-label="Primary navigation">
          <a href="#story" onClick={() => setOpen(false)}>Story</a>
          <a href="#purpose" onClick={() => setOpen(false)}>Purpose</a>
          <a href="#collection" onClick={() => setOpen(false)}>Collection</a>
          <a href="#community" onClick={() => setOpen(false)}>Community</a>
        </nav>

        <a className="header-cta" href="#collection">Shop Coming Soon</a>

        <button
          className="menu-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className={`menu-btn__bar${open ? ' menu-btn__bar--open' : ''}`} />
          <span className={`menu-btn__bar${open ? ' menu-btn__bar--open' : ''}`} />
          <span className={`menu-btn__bar${open ? ' menu-btn__bar--open' : ''}`} />
        </button>
      </div>
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <div className="hero-sunburst">
          <Sunburst size={104} />
        </div>
        <p className="eyebrow">Psalm 34:5 · Bible-Inspired Clothing</p>
        <h1 className="hero-wordmark">
          <span className="hero-wordmark__main">RADIANT</span>
          <span className="hero-wordmark__num">34</span>
        </h1>
        <blockquote className="hero-scripture">
          "Those who look to Him are radiant; their faces are never covered with shame."
        </blockquote>
        <h2 className="hero-headline">
          Faith in motion.<br />Light in everyday life.
        </h2>
        <p className="hero-sub">Bible-inspired art and designs for everyday wear.</p>
        <div className="hero-actions">
          <a href="#collection" className="btn btn--dark">View Collection</a>
          <a href="#story" className="btn btn--outline">Brand Story</a>
        </div>
      </div>

      <div className="hero-products">
        {/* TODO: Replace placeholders with Radiant 34 product photos */}
        <div className="hero-product-card">
          <PlaceholderImage label="Hoodie" todo="TODO: Radiant 34 Hoodie photo" tall />
          <p className="hero-product-card__name">Signature Hoodie</p>
        </div>
        <div className="hero-product-card hero-product-card--featured">
          <PlaceholderImage label="T-Shirt" todo="TODO: Radiant 34 T-Shirt photo" tall />
          <p className="hero-product-card__name">Core Tee</p>
        </div>
        <div className="hero-product-card">
          <PlaceholderImage label="Cap" todo="TODO: Radiant 34 Cap photo" tall />
          <p className="hero-product-card__name">Structured Cap</p>
        </div>
      </div>
    </section>
  );
}

// ─── INSPIRATION ──────────────────────────────────────────────────────────────
function Inspiration() {
  return (
    <section className="section section--cream" id="story">
      <div className="container">
        <SunburstDivider />
        <p className="section-label">The Inspiration</p>
        <h2 className="section-title">Psalm 34.</h2>
        <blockquote className="large-quote">
          "Those who look to Him are radiant;<br />their faces are never covered with shame."
          <cite>— Psalm 34:5</cite>
        </blockquote>

        <div className="two-col two-col--img-first">
          <div className="two-col__img">
            {/* TODO: Replace with open Bible / scripture image */}
            <PlaceholderImage label="Open Bible" todo="TODO: Bible / scripture image" />
          </div>
          <div className="two-col__copy">
            <p>Radiant 34 was born from one verse. A promise that identity, confidence, and freedom from shame flow from looking to God.</p>
            <p>This is not just a clothing label. It is a declaration. Every piece carries the weight of that truth.</p>
            <p className="bottom-line bottom-line--left">
              It starts with His Word. Psalm 34 is our foundation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── VISION ───────────────────────────────────────────────────────────────────
function Vision() {
  return (
    <section className="section section--white" id="vision">
      <div className="container">
        <div className="two-col two-col--copy-first">
          <div className="two-col__copy">
            <p className="section-label">The Vision</p>
            <h2 className="section-title">More than clothes.</h2>
            <p>To create Bible-inspired art and designs that carry truth into everyday life.</p>
            <p>Every detail is intentional. Every product is a conversation starter. Every design points back to the verse.</p>
            <p className="bottom-line bottom-line--left">
              More than clothes — a visual reminder of His goodness.
            </p>
          </div>
          <div className="two-col__img">
            {/* TODO: Replace with brand sketch / notebook / vision image */}
            <PlaceholderImage label="Brand Vision" todo="TODO: Brand inspiration / sketch image" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PURPOSE ──────────────────────────────────────────────────────────────────
const PURPOSE_ITEMS = [
  { title: 'Glorify God',    text: 'Every design points to His glory.' },
  { title: 'Inspire Faith',  text: 'Wearable reminders of His truth.' },
  { title: 'Impact Lives',   text: 'Clothing that opens conversations.' },
  { title: 'Live Different', text: 'Standing out by looking to Him.' },
];

function Purpose() {
  return (
    <section className="section section--cream" id="purpose">
      <div className="container text-center">
        <SunburstDivider />
        <p className="section-label">The Purpose</p>
        <h2 className="section-title">Why we exist.</h2>

        <div className="purpose-grid">
          {PURPOSE_ITEMS.map((item) => (
            <div className="purpose-card" key={item.title}>
              <Sunburst size={34} />
              <h3 className="purpose-card__title">{item.title}</h3>
              <p className="purpose-card__text">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="purpose-banner">
          {/* TODO: Replace with Radiant 34 lifestyle / purpose image */}
          <PlaceholderImage label="Lifestyle · Everyday Faith" todo="TODO: Brand lifestyle image" />
        </div>
        <p className="bottom-line">Wearing your faith. Sharing His light.</p>
      </div>
    </section>
  );
}

// ─── COLLECTION ───────────────────────────────────────────────────────────────
const COLLECTION_ITEMS = [
  {
    id: 'tshirt',
    name: 'T-Shirt',
    desc: 'Minimal faith design. Premium cotton. Everyday wear.',
  },
  {
    id: 'tanktop',
    name: 'Tank Top',
    desc: 'Lightweight. Breathable. Made for movement and the everyday.',
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    desc: 'Heavyweight fleece. Oversized silhouette. Scripture detail.',
  },
];

function Collection() {
  return (
    <section className="section section--white" id="collection">
      <div className="container">
        <SunburstDivider />
        <p className="section-label">The Collection</p>
        <h2 className="section-title">Drop 001.</h2>

        <div className="collection-grid">
          {COLLECTION_ITEMS.map((item) => (
            <article className="product-card" key={item.id}>
              <div className="product-card__img">
                {/* TODO: Replace with Radiant 34 product photo */}
                <PlaceholderImage label={item.name} todo={`TODO: ${item.name} product photo`} tall />
              </div>
              <div className="product-card__info">
                <Sunburst size={16} />
                <h3 className="product-card__name">{item.name}</h3>
                <p className="product-card__desc">{item.desc}</p>
                <span className="tag-soon">Coming Soon</span>
              </div>
            </article>
          ))}
        </div>

        <p className="bottom-line">Minimal designs. Timeless style. Made for everyday.</p>
      </div>
    </section>
  );
}

// ─── ESSENTIALS ───────────────────────────────────────────────────────────────
const ESSENTIALS_ITEMS = [
  { id: 'keychain',    name: 'Key Chain',    desc: 'Carry the verse.' },
  { id: 'bracelet',   name: 'Bracelet',     desc: 'Daily reminder on the wrist.' },
  { id: 'bottle',     name: 'Water Bottle', desc: 'Hydrate with purpose.' },
  { id: 'backpack',   name: 'Backpack',     desc: 'Built for the everyday.' },
];

function Essentials() {
  return (
    <section className="section section--beige" id="essentials">
      <div className="container">
        <p className="section-label">The Essentials</p>
        <h2 className="section-title">Everyday carry.</h2>

        <div className="essentials-grid">
          {ESSENTIALS_ITEMS.map((item) => (
            <article className="essential-card" key={item.id}>
              <div className="essential-card__img">
                {/* TODO: Replace with Radiant 34 essential photo */}
                <PlaceholderImage label={item.name} todo={`TODO: ${item.name} photo`} />
              </div>
              <div className="essential-card__info">
                <h3 className="essential-card__name">{item.name}</h3>
                <p className="essential-card__desc">{item.desc}</p>
                <span className="tag-soon">Coming Soon</span>
              </div>
            </article>
          ))}
        </div>

        <p className="bottom-line">Every piece a reminder. Every detail with purpose.</p>
      </div>
    </section>
  );
}

// ─── EVERYDAY FAITH ───────────────────────────────────────────────────────────
const LIFESTYLE_ITEMS = [
  { id: 'gym',    label: 'The Gym',       desc: 'Built for movement.' },
  { id: 'street', label: 'The Streets',   desc: 'Standing out naturally.' },
  { id: 'work',   label: 'The Workplace', desc: 'Faith at work.' },
  { id: 'daily',  label: 'Daily Carry',   desc: 'Every moment matters.' },
];

function EverydayFaith() {
  return (
    <section className="section section--cream" id="everyday">
      <div className="container text-center">
        <SunburstDivider />
        <p className="section-label">Everyday Faith</p>
        <h2 className="section-title">Wherever you are.</h2>

        <div className="everyday-grid">
          {LIFESTYLE_ITEMS.map((item) => (
            <div className="everyday-card" key={item.id}>
              {/* TODO: Replace with Radiant 34 lifestyle photography */}
              <PlaceholderImage label={item.label} todo={`TODO: ${item.label} lifestyle photo`} />
              <div className="everyday-card__caption">
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="bottom-line">
          For the gym, the streets, the workplace, or wherever you are.
        </p>
      </div>
    </section>
  );
}

// ─── DETAILS ──────────────────────────────────────────────────────────────────
const DETAIL_ITEMS = [
  'Premium quality',
  'Minimal and intentional',
  'Scripture inspired',
  'Built to last',
  'Made to encourage',
];

function Details() {
  return (
    <section className="section section--white" id="details">
      <div className="container">
        <div className="details-layout">
          <div className="details-copy">
            <p className="section-label">The Details</p>
            <h2 className="section-title">Quality with purpose.</h2>
            <ul className="details-list">
              {DETAIL_ITEMS.map((item) => (
                <li key={item} className="details-list__item">
                  <Sunburst size={14} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="bottom-line bottom-line--left">Quality with purpose. Every detail matters.</p>
          </div>
          <div className="details-img">
            {/* TODO: Replace with Radiant 34 product detail / close-up */}
            <PlaceholderImage label="Product Detail" todo="TODO: Close-up product detail photo" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COMMUNITY ────────────────────────────────────────────────────────────────
function Community() {
  return (
    <section className="section section--cream" id="community">
      <div className="container text-center">
        <SunburstDivider />
        <p className="section-label">The Community</p>
        <h2 className="section-title">A movement of believers.</h2>
        <p className="community-copy">
          A movement of believers living out Psalm 34 together.
        </p>
        <div className="community-img">
          {/* TODO: Replace with Radiant 34 community / group lifestyle photo */}
          <PlaceholderImage label="Community" todo="TODO: Community / lifestyle photo" />
        </div>
        <p className="bottom-line">Different stories. One truth. His goodness.</p>
      </div>
    </section>
  );
}

// ─── BRAND PANEL + FOOTER ────────────────────────────────────────────────────
function BrandPanel() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setDone(true);
    }
  };

  return (
    <>
      <section className="brand-panel" id="brand-panel">
        <div className="container brand-panel__inner">
          <Sunburst size={72} />
          <a href="#top" className="logo logo--inv">
            <span className="logo-text">RADIANT <strong>34</strong></span>
          </a>
          <p className="brand-tagline">Faith in motion. Light in everyday life.</p>
          <p className="brand-verse">"Those who look to Him are radiant." — Psalm 34:5</p>

          <div className="email-block">
            <p className="email-block__label">Be the first to know when Drop 001 launches.</p>
            {done ? (
              <p className="email-block__thanks">Thank you. We'll be in touch.</p>
            ) : (
              <form className="email-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  aria-label="Email address for launch notification"
                />
                <button type="submit">Notify Me</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">RADIANT 34</span>
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#story">Story</a>
            <a href="#purpose">Purpose</a>
            <a href="#collection">Collection</a>
            <a href="#community">Community</a>
          </nav>
          <p className="footer-copy">© 2025 Radiant 34. Bible-inspired clothing.</p>
        </div>
      </footer>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Inspiration />
        <Vision />
        <Purpose />
        <Collection />
        <Essentials />
        <EverydayFaith />
        <Details />
        <Community />
      </main>
      <BrandPanel />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
