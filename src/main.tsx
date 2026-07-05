import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

// ─── BRAND MARK (half rising-sun, matches actual logo) ─────────────────────
function BrandMark({ size = 80 }: { size?: number }) {
  const h = size * 0.58;
  const cx = size / 2;
  const cy = h;              // centre at bottom edge
  const innerR = size * 0.08;
  const rayCount = 22;
  const arcStart = 195;      // °  left edge of fan
  const arcEnd = 345;        // °  right edge of fan
  const arcSpread = arcEnd - arcStart;

  return (
    <svg
      width={size}
      height={h}
      viewBox={`0 0 ${size} ${h}`}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {Array.from({ length: rayCount }, (_, i) => {
        const t = i / (rayCount - 1);
        const angleDeg = arcStart + t * arcSpread;
        const rad = (angleDeg * Math.PI) / 180;
        // centre ray (270°) is longest; taper toward edges
        const distFromCenter = Math.abs(angleDeg - 270) / 75;
        const maxLen = size * 0.5;
        const minLen = size * 0.27;
        const outerR = maxLen - (maxLen - minLen) * Math.pow(distFromCenter, 0.55);
        return (
          <line
            key={i}
            x1={cx + innerR * Math.cos(rad)}
            y1={cy + innerR * Math.sin(rad)}
            x2={cx + outerR * Math.cos(rad)}
            y2={cy + outerR * Math.sin(rad)}
            stroke="#B58A3B"
            strokeWidth={Math.max(0.7, size * 0.013)}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

// ─── SUNBURST (full circle — decorative accents / bullets) ─────────────────
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

// ─── PRODUCT IMAGE (real or placeholder) ─────────────────────────────────────
function ProductImage({
  src, alt, tall, label, todo,
}: {
  src?: string | null; alt?: string; tall?: boolean; label: string; todo?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? label}
        className={`product-photo${tall ? ' product-photo--tall' : ''}`}
      />
    );
  }
  return <PlaceholderImage label={label} todo={todo} tall={tall} />;
}

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────
function SunburstDivider() {
  return (
    <div className="sb-divider" aria-hidden="true">
      <span className="sb-divider__line" />
      <Sunburst size={26} />
      <span className="sb-divider__line" />
    </div>
  );
}

// ─── LOGO LOCKUP ─────────────────────────────────────────────────────────────
function Logo({ inv = false, large = false }: { inv?: boolean; large?: boolean }) {
  const markSize = large ? 120 : 32;
  return (
    <div className={`logo-lockup${large ? ' logo-lockup--large' : ''}${inv ? ' logo-lockup--inv' : ''}`}>
      <BrandMark size={markSize} />
      <div className="logo-type">
        <span className="logo-type__radiant">RADIANT</span>
        <span className="logo-type__bar">
          <span className="logo-type__rule" />
          <span className="logo-type__num">34</span>
          <span className="logo-type__rule" />
        </span>
        {large && <span className="logo-type__ref">PSALM 34:5</span>}
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" aria-label="Radiant 34 home" className="header-logo-link">
          <Logo />
        </a>

        <nav className={`main-nav${open ? ' main-nav--open' : ''}`} aria-label="Primary navigation">
          <a href="#story"      onClick={() => setOpen(false)}>Story</a>
          <a href="#purpose"    onClick={() => setOpen(false)}>Purpose</a>
          <a href="#collection" onClick={() => setOpen(false)}>Collection</a>
          <a href="#community"  onClick={() => setOpen(false)}>Community</a>
        </nav>

        <a className="header-cta" href="#collection">Shop Coming Soon</a>

        <button
          className="menu-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="menu-btn__bar" />
          <span className="menu-btn__bar" />
          <span className="menu-btn__bar" />
        </button>
      </div>
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
const HERO_PRODUCTS = [
  {
    label: 'Signature Hoodie',
    img: '/images/hoodie-city.png',
    alt: 'Man wearing Radiant 34 cream hoodie with city skyline',
  },
  {
    label: 'Radiant Tee',
    img: '/images/tshirt-radiant.png',
    alt: 'Radiant 34 cream t-shirt with sunburst logo, flat lay',
    featured: true,
  },
  {
    label: 'Structured Cap',
    img: '/images/cap-radiant.png',
    alt: 'Radiant 34 beige structured cap with embroidered logo',
  },
];

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <div className="hero-mark">
          <BrandMark size={110} />
        </div>
        <h1 className="hero-wordmark">
          <span className="hero-wordmark__main">RADIANT</span>
          <span className="hero-wordmark__bar">
            <span className="hero-wordmark__rule" />
            <span className="hero-wordmark__num">34</span>
            <span className="hero-wordmark__rule" />
          </span>
          <span className="hero-wordmark__ref">PSALM 34:5</span>
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
          <a href="#story"      className="btn btn--outline">Brand Story</a>
        </div>
      </div>

      <div className="hero-products">
        {HERO_PRODUCTS.map((p) => (
          <div className={`hero-product-card${p.featured ? ' hero-product-card--featured' : ''}`} key={p.label}>
            <img src={p.img} alt={p.alt} className="hero-product-img" />
            <p className="hero-product-card__name">{p.label}</p>
          </div>
        ))}
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
            {/* TODO: Replace with open Bible / devotional image */}
            <PlaceholderImage label="Open Bible" todo="TODO: Bible / devotional image" />
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
            <img
              src="/images/notebook-pen.png"
              alt="Radiant 34 branded notebook with Seek Him, Fear Him, Bless Him, and pen"
              className="product-photo"
            />
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
    name: 'Radiant Tee',
    desc: 'Premium cotton. Signature Radiant 34 logo. The everyday essential.',
    img: '/images/tshirt-radiant.png',
    alt: 'Radiant 34 cream t-shirt flat lay with sunburst logo and Psalm 34:5',
  },
  {
    id: 'cap',
    name: 'Structured Cap',
    desc: 'Embroidered Radiant 34 logo. Beige cotton twill. Worn for every occasion.',
    img: '/images/cap-radiant.png',
    alt: 'Radiant 34 beige structured cap with embroidered sunburst logo',
  },
  {
    id: 'hoodie',
    name: 'Signature Hoodie',
    desc: 'Premium heavyweight fleece. Oversized fit. Radiant 34 back print.',
    img: '/images/hoodie-city.png',
    alt: 'Man wearing Radiant 34 cream hoodie overlooking city skyline',
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
                <img src={item.img} alt={item.alt} className="product-photo product-photo--tall" />
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
  { id: 'notebook',    name: 'Notebook',     desc: 'Seek Him. Fear Him. Bless Him.',  img: '/images/notebook-pen.png', alt: 'Radiant 34 branded notebook with pen' },
  { id: 'bracelet',    name: 'Bracelet',     desc: 'Daily reminder on the wrist.',     img: null, alt: '' },
  { id: 'bottle',      name: 'Water Bottle', desc: 'Hydrate with purpose.',            img: null, alt: '' },
  { id: 'backpack',    name: 'Backpack',     desc: 'Built for the everyday.',          img: null, alt: '' },
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
                <ProductImage
                  src={item.img}
                  alt={item.alt}
                  label={item.name}
                  todo={`TODO: ${item.name} product photo`}
                />
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
  { id: 'gym',    label: 'The Gym',       desc: 'Built for movement.',     img: null },
  { id: 'street', label: 'The Streets',   desc: 'Standing out naturally.', img: '/images/hoodie-city.png' },
  { id: 'work',   label: 'The Workplace', desc: 'Faith at work.',          img: null },
  { id: 'daily',  label: 'Daily Carry',   desc: 'Every moment matters.',   img: '/images/notebook-pen.png' },
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
              {item.img ? (
                <img
                  src={item.img}
                  alt={item.label}
                  className="everyday-photo"
                />
              ) : (
                /* TODO: Replace with Radiant 34 lifestyle photography */
                <PlaceholderImage label={item.label} todo={`TODO: ${item.label} lifestyle photo`} />
              )}
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
            <img
              src="/images/tshirt-radiant.png"
              alt="Radiant 34 cream t-shirt — close-up detail"
              className="product-photo"
            />
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
          <PlaceholderImage label="Community" todo="TODO: Community / lifestyle group photo" />
        </div>
        <p className="bottom-line">Different stories. One truth. His goodness.</p>
      </div>
    </section>
  );
}

// ─── BRAND PANEL + FOOTER ─────────────────────────────────────────────────────
function BrandPanel() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <>
      <section className="brand-panel" id="brand-panel">
        <div className="brand-panel__badge">
          <img src="/images/brand-badge.png" alt="Radiant 34 official brand mark" className="brand-badge-img" />
        </div>
        <div className="container brand-panel__inner">
          <Logo inv large />
          <p className="brand-tagline">Faith in motion. Light in everyday life.</p>

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

// ─── APP ──────────────────────────────────────────────────────────────────────
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
