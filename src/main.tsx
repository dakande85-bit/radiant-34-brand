import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

// ─── LIGHTBULB SVG ACCENT ─────────────────────────────────────────────────────
function BulbAccent({ size = 20, light = false }: { size?: number; light?: boolean }) {
  const cx = size / 2;
  const cy = size * 0.42;
  const r = size * 0.2;
  const gold = '#B58A3B';
  const ink = light ? 'rgba(245,241,234,0.7)' : '#111111';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        return (
          <line
            key={i}
            x1={cx + r * 1.35 * Math.cos(angle)}
            y1={cy + r * 1.35 * Math.sin(angle)}
            x2={cx + r * 1.85 * Math.cos(angle)}
            y2={cy + r * 1.85 * Math.sin(angle)}
            stroke={i % 2 === 0 ? gold : ink}
            strokeWidth={Math.max(0.5, size * 0.048)}
            strokeLinecap="round"
          />
        );
      })}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={ink}
        strokeWidth={Math.max(0.7, size * 0.048)}
      />
      <path
        d={`M ${cx - r * 0.45} ${cy + r * 0.92} Q ${cx} ${cy + r * 1.45} ${cx + r * 0.45} ${cy + r * 0.92}`}
        fill="none"
        stroke={ink}
        strokeWidth={Math.max(0.5, size * 0.038)}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" className="header-logo" aria-label="Radiant 34 home">
          <img src="/images/logo.jpg" alt="Radiant 34" className="header-logo-img" />
        </a>

        <nav
          className={`main-nav${open ? ' main-nav--open' : ''}`}
          aria-label="Primary navigation"
        >
          <a href="#story"      onClick={() => setOpen(false)}>Story</a>
          <a href="#journal"    onClick={() => setOpen(false)}>Journal</a>
          <a href="#collection" onClick={() => setOpen(false)}>Collection</a>
          <a href="#about"      onClick={() => setOpen(false)}>About</a>
        </nav>

        <a href="#collection" className="header-cta">Discover Drop 001</a>

        <button
          className={`menu-btn${open ? ' menu-btn--open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
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
        <h1 className="hero-headline">
          Faith in motion.<br />
          Light in<br />
          everyday life.
        </h1>
        <span className="hero-rule" aria-hidden="true" />
        <p className="hero-copy">
          Radiant 34 is a Bible-inspired clothing label rooted in Psalm 34:5.
        </p>
        <p className="hero-copy">
          We create pieces that remind you of God's goodness — every day.
        </p>
        <a href="#collection" className="btn btn--gold">Discover Drop 001</a>
      </div>

      <div className="hero-image">
        {/* Replace with lifestyle model photo: woman in cream hoodie, warm light */}
        <img
          src="/images/hero-hoodie.png"
          alt="Radiant 34 cream hoodie with small chest logo"
        />
      </div>
    </section>
  );
}

// ─── STORY SECTION ────────────────────────────────────────────────────────────
function StorySection() {
  return (
    <section className="story-section" id="story">
      <div className="story-inner">
        <div className="story-copy">
          <span className="eyebrow">Our Story</span>
          <h2 className="section-heading">
            Rooted in Scripture.<br />
            Designed for real life.
          </h2>
          <blockquote className="story-quote">
            Psalm 34:5 says, "Those who look to Him are radiant; their faces are never covered with shame."
          </blockquote>
          <p className="story-body">
            That truth inspires everything we do. Radiant 34 is more than clothing — it's a daily reminder to live with light, walk in purpose, and shine His goodness in a world that needs it.
          </p>
          <p className="story-handwritten">Look up. Step out. Radiate.</p>
        </div>

        <div className="story-image">
          {/* Replace with lifestyle: woman in black tee + man in cream hoodie */}
          <img
            src="/images/tshirt-black.png"
            alt="Radiant 34 black T-shirt with small chest logo on warm background"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

// ─── PURPOSE SECTION ──────────────────────────────────────────────────────────
function PurposeSection() {
  return (
    <section className="purpose-section" id="purpose">
      <div className="purpose-inner">
        <div className="purpose-image">
          {/* Replace with lifestyle: models wearing pieces naturally */}
          <img
            src="/images/hero-hoodie.png"
            alt="Radiant 34 Signature Hoodie detail"
            loading="lazy"
          />
        </div>
        <div className="purpose-copy">
          <span className="eyebrow">Clothing That Carries More</span>
          <h2 className="section-heading">
            Simple by design.<br />
            Made to inspire.
          </h2>
          <p className="purpose-body">
            Every piece is created to feel easy to wear and meaningful to carry. Minimal graphics. Soft tones. A reminder of truth without shouting.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── COLLECTION TEASER ────────────────────────────────────────────────────────
const COLLECTION_ITEMS = [
  {
    name: 'Signature Hoodie',
    line: 'Warm. Comfortable. Carries more than warmth.',
    img: '/images/hero-hoodie.png',
    alt: 'Radiant 34 cream hoodie with small chest logo',
  },
  {
    name: 'Classic Tee',
    line: 'Clean and minimal. Wearable truth.',
    img: '/images/tshirt-black.png',
    alt: 'Radiant 34 black T-shirt with small chest logo',
  },
  {
    name: 'Everyday Tank',
    line: 'Light and free. Made for every season.',
    img: null,
    alt: '',
  },
];

function CollectionTeaser() {
  return (
    <section className="collection-section" id="collection">
      <div className="container">
        <span className="eyebrow">Drop 001</span>
        <h2 className="section-heading">The Collection</h2>
        <div className="collection-grid">
          {COLLECTION_ITEMS.map(item => (
            <article key={item.name} className="collection-card">
              <div className="collection-card__img">
                {item.img ? (
                  <img src={item.img} alt={item.alt} loading="lazy" />
                ) : (
                  <div className="collection-card__placeholder">
                    <BulbAccent size={32} />
                    <span className="collection-card__placeholder-name">{item.name}</span>
                  </div>
                )}
              </div>
              <div className="collection-card__info">
                <h3 className="collection-card__name">{item.name}</h3>
                <p className="collection-card__line">{item.line}</p>
                <span className="tag-soon">Coming Soon</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL PANEL ──────────────────────────────────────────────────────────────
function FinalPanel() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <section className="final-panel">
      <div className="final-panel__inner">
        <h2 className="final-panel__heading">
          "Those who look to Him are radiant."
        </h2>
        <p className="final-panel__copy">
          A clothing label built to remind a generation who they are, where their light comes from, and why they were made to shine.
        </p>
        <a href="#story" className="btn btn--outline-cream">Join the Journey</a>

        <div className="final-panel__email">
          <p className="final-panel__email-label">
            Be the first to know when Drop 001 launches.
          </p>
          {done ? (
            <p className="final-panel__email-thanks">Thank you. We'll be in touch.</p>
          ) : (
            <form className="email-form" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                aria-label="Email for Drop 001 notification"
              />
              <button type="submit">Notify Me</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="footer-inner container">
        <div className="footer-top">
          <div className="footer-brand">
            <BulbAccent size={22} light />
            <span className="footer-brand-name">RADIANT 34</span>
          </div>
          <p className="footer-scripture">
            "Those who look to Him are radiant; their faces are never covered with shame."
            <span className="footer-ref"> — Psalm 34:5</span>
          </p>
        </div>
        <div className="footer-bottom">
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#story">Story</a>
            <a href="#journal">Journal</a>
            <a href="#collection">Collection</a>
            <a href="#about">About</a>
          </nav>
          <p className="footer-copy">© 2026 Radiant 34. Bible-inspired clothing.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StorySection />
        <PurposeSection />
        <CollectionTeaser />
        <FinalPanel />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
