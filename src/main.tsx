import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

type Product = {
  name: string;
  category: string;
  line: string;
  img: string;
  alt: string;
  pos?: string;
};

type Principle = {
  title: string;
  copy: string;
};

const PRODUCTS: Product[] = [
  {
    name: 'Psalm 34 Tee',
    category: 'Signature Tee',
    line: 'Clean everyday tee carrying the Radiant 34 mark and Psalm 34:5 identity.',
    img: asset('/images/model-psalm.png'),
    alt: 'Man wearing Radiant 34 cream tee beside Psalm 34:5 wall text',
    pos: 'center top',
  },
  {
    name: 'Radiant Hoodie',
    category: 'Everyday Hoodie',
    line: 'Soft cream hoodie made for daily wear, quiet faith, and warm light.',
    img: asset('/images/model-hoodie.png'),
    alt: 'Woman wearing Radiant 34 cream hoodie in golden light',
    pos: 'center top',
  },
  {
    name: 'Classic Tee Set',
    category: 'Core Apparel',
    line: 'Black and cream staples with restrained artwork, built for real life.',
    img: asset('/images/model-tees.png'),
    alt: 'Models wearing Radiant 34 black and cream tees',
    pos: 'left top',
  },
  {
    name: 'Everyday Tank',
    category: 'Movement Piece',
    line: 'Lightweight, easy, and made for summer, training, and movement.',
    img: asset('/images/model-group.png'),
    alt: 'Group wearing Radiant 34 tank, tee, and hoodie',
    pos: 'left center',
  },
];

const PRINCIPLES: Principle[] = [
  {
    title: 'Scripture first',
    copy: 'The brand begins with Psalm 34:5: those who look to Him are radiant, and their faces are not covered with shame.',
  },
  {
    title: 'Wearable, not cheesy',
    copy: 'The designs carry faith through art, typography, light, and restraint — not loud slogans on every product.',
  },
  {
    title: 'Built for everyday use',
    copy: 'T-shirts, hoodies, tanks, bottles, bracelets, key chains, and bags that feel natural in daily life.',
  },
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" className="header-logo" aria-label="Radiant 34 home">
          <img src={asset('/images/logo-transparent.png')} alt="Radiant 34" className="header-logo-img" />
        </a>

        <nav className={`main-nav${open ? ' main-nav--open' : ''}`} aria-label="Primary navigation">
          <a href="#story" onClick={() => setOpen(false)}>Story</a>
          <a href="#collection" onClick={() => setOpen(false)}>Collection</a>
          <a href="#lookbook" onClick={() => setOpen(false)}>Lookbook</a>
          <a href="#vision" onClick={() => setOpen(false)}>Vision</a>
        </nav>

        <a href="#signup" className="header-cta">Join Drop 001</a>

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

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy-block">
        <p className="eyebrow">Psalm 34:5 inspired clothing</p>
        <h1 className="hero-headline">
          Those who look to Him are radiant.
        </h1>
        <p className="hero-lead">
          Radiant 34 is a Bible-inspired clothing label making faith-led art, apparel, and everyday pieces that carry light without feeling forced.
        </p>
        <div className="hero-actions">
          <a href="#collection" className="btn btn--gold">View Drop 001</a>
          <a href="#story" className="btn btn--outline">Read the Story</a>
        </div>
        <div className="hero-scripture">
          <span>Psalm 34:5</span>
          <p>“Those who look to Him are radiant; their faces are never covered with shame.”</p>
        </div>
      </div>

      <div className="hero-image">
        <img
          src={asset('/images/model-psalm.png')}
          alt="Man wearing a cream Radiant 34 t-shirt at sunset beside Psalm 34 verse text"
        />
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="story-section" id="story">
      <div className="story-inner">
        <div className="story-image">
          <img src={asset('/images/model-hoodie.png')} alt="Radiant 34 cream hoodie in golden light" loading="lazy" />
        </div>
        <div className="story-copy">
          <p className="eyebrow">The meaning</p>
          <h2 className="section-heading">A clothing label built around light, identity, and no shame.</h2>
          <blockquote className="story-quote">
            “Those who look to Him are radiant; their faces are never covered with shame.” <span>Psalm 34:5</span>
          </blockquote>
          <p>
            Radiant 34 is for people who want Bible-inspired pieces that still feel clean, wearable, and modern. The clothes are not just merch. They are reminders: look up, step out, and live with the light God gives.
          </p>
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  return (
    <section className="principles-section" id="vision">
      <div className="container principles-head">
        <p className="eyebrow">Brand foundation</p>
        <h2 className="section-heading">Faith-led design for everyday life.</h2>
      </div>
      <div className="container principles-grid">
        {PRINCIPLES.map((item, index) => (
          <article className="principle-card" key={item.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CollectionSection() {
  return (
    <section className="collection-section" id="collection">
      <div className="container collection-head">
        <p className="eyebrow">Drop 001</p>
        <h2 className="section-heading">The first collection.</h2>
        <p>
          A focused launch range: tees, tanks, hoodies, key chains, bracelets, bottles, and backpacks — built around Radiant 34 identity and Psalm 34:5.
        </p>
      </div>
      <div className="container collection-grid">
        {PRODUCTS.map(product => (
          <article className="collection-card" key={product.name}>
            <div className="collection-card__img">
              <img src={product.img} alt={product.alt} loading="lazy" style={{ objectPosition: product.pos || 'center top' }} />
            </div>
            <div className="collection-card__info">
              <span>{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.line}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LookbookSection() {
  return (
    <section className="lookbook-section" id="lookbook">
      <div className="lookbook-panel">
        <div className="lookbook-copy">
          <p className="eyebrow">Visual direction</p>
          <h2>Warm light. Clean pieces. Scripture carried naturally.</h2>
          <p>
            The brand should feel like a real lifestyle label: sunlight, cream, gold, black, handwritten marks, and product imagery that makes the message feel alive.
          </p>
          <a href="#signup" className="btn btn--outline-cream">Join the Launch List</a>
        </div>
        <div className="lookbook-image lookbook-image--one">
          <img src={asset('/images/model-tees.png')} alt="Radiant 34 tees editorial image" loading="lazy" />
        </div>
        <div className="lookbook-image lookbook-image--two">
          <img src={asset('/images/model-group.png')} alt="Radiant 34 group apparel editorial image" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function LaunchSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <section className="launch-section" id="signup">
      <div className="launch-inner">
        <div>
          <p className="eyebrow">Launch soon</p>
          <h2>Drop 001 is being prepared.</h2>
          <p>
            Join the early list for first access, product previews, and the story behind the first Radiant 34 pieces.
          </p>
        </div>
        {done ? (
          <p className="email-thanks">Thank you. You are on the list.</p>
        ) : (
          <form className="email-form" onSubmit={submit}>
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="Your email address"
              required
              aria-label="Email address for Radiant 34 launch updates"
            />
            <button type="submit">Notify Me</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <img src={asset('/images/logo-transparent.png')} alt="Radiant 34" />
        <p>“Those who look to Him are radiant; their faces are never covered with shame.”</p>
        <span>© 2026 Radiant 34. Bible-inspired clothing and everyday art.</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StorySection />
        <PrinciplesSection />
        <CollectionSection />
        <LookbookSection />
        <LaunchSection />
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
