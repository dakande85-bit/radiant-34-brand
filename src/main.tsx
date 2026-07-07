import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

type Product = {
  id: string;
  title: string;
  handle: string;
  category: 'T-Shirt' | 'Hoodie' | 'Tank Top' | 'Accessory' | 'Drinkware' | 'Bag';
  shopCategory: 'Tees' | 'Hoodies' | 'Tanks' | 'Accessories';
  price: string;
  status: 'Launching Monday';
  description: string;
  images: string[];
  options?: {
    size?: string[];
    color?: string[];
  };
  variants: { sku: string; size?: string; color?: string }[];
  tags: string[];
  collection: 'Drop 001';
  shopifyProductId: null;
  shopifyVariantIds: Record<string, never>;
  gelatoProductUid: null;
  fulfillmentType: 'gelato' | 'manual';
  seoTitle: string;
  seoDescription: string;
};

type Principle = {
  title: string;
  copy: string;
};

const apparelVariants = (prefix: string) =>
  ['Cream', 'Black'].flatMap(color =>
    ['S', 'M', 'L', 'XL', 'XXL'].map(size => ({
      sku: `${prefix}-${color.slice(0, 3).toUpperCase()}-${size}`,
      size,
      color,
    }))
  );

const PRODUCTS: Product[] = [
  {
    id: 'psalm-34-tee',
    title: 'Psalm 34 Tee',
    handle: 'psalm-34-tee',
    category: 'T-Shirt',
    shopCategory: 'Tees',
    price: '£34',
    status: 'Launching Monday',
    description: 'A clean everyday tee carrying the Radiant 34 mark and Psalm 34:5 identity.',
    images: [asset('/images/model-psalm.png')],
    options: { size: ['S', 'M', 'L', 'XL', 'XXL'], color: ['Cream', 'Black'] },
    variants: apparelVariants('R34-TEE-PS34'),
    tags: ['drop-001', 'psalm-34', 'tee', 'gelato-ready'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    fulfillmentType: 'gelato',
    seoTitle: 'Psalm 34 Tee | Radiant 34',
    seoDescription: 'A Bible-inspired Radiant 34 tee rooted in Psalm 34:5.',
  },
  {
    id: 'radiant-hoodie',
    title: 'Radiant Hoodie',
    handle: 'radiant-hoodie',
    category: 'Hoodie',
    shopCategory: 'Hoodies',
    price: '£58',
    status: 'Launching Monday',
    description: 'A soft everyday hoodie built around warmth, light, and quiet faith.',
    images: [asset('/images/model-hoodie.png')],
    options: { size: ['S', 'M', 'L', 'XL', 'XXL'], color: ['Cream', 'Black'] },
    variants: apparelVariants('R34-HDY-RAD'),
    tags: ['drop-001', 'hoodie', 'gelato-ready'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    fulfillmentType: 'gelato',
    seoTitle: 'Radiant Hoodie | Radiant 34',
    seoDescription: 'A warm Bible-inspired hoodie from Radiant 34.',
  },
  {
    id: 'classic-radiant-tee',
    title: 'Classic Tee',
    handle: 'classic-radiant-tee',
    category: 'T-Shirt',
    shopCategory: 'Tees',
    price: '£34',
    status: 'Launching Monday',
    description: 'A minimal Radiant 34 staple designed for everyday wear.',
    images: [asset('/images/model-tees.png')],
    options: { size: ['S', 'M', 'L', 'XL', 'XXL'], color: ['Cream', 'Black'] },
    variants: apparelVariants('R34-TEE-CLS'),
    tags: ['drop-001', 'classic', 'tee', 'gelato-ready'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    fulfillmentType: 'gelato',
    seoTitle: 'Classic Tee | Radiant 34',
    seoDescription: 'A minimal everyday Radiant 34 tee.',
  },
  {
    id: 'everyday-tank',
    title: 'Everyday Tank',
    handle: 'everyday-tank',
    category: 'Tank Top',
    shopCategory: 'Tanks',
    price: '£28',
    status: 'Launching Monday',
    description: 'Lightweight and made for movement, training, and summer.',
    images: [asset('/images/model-group.png')],
    options: { size: ['S', 'M', 'L', 'XL', 'XXL'], color: ['Cream', 'Black'] },
    variants: apparelVariants('R34-TNK-EVD'),
    tags: ['drop-001', 'tank', 'gelato-ready'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    fulfillmentType: 'gelato',
    seoTitle: 'Everyday Tank | Radiant 34',
    seoDescription: 'A Radiant 34 tank top for movement and summer wear.',
  },
  {
    id: 'radiant-key-chain',
    title: 'Radiant Key Chain',
    handle: 'radiant-key-chain',
    category: 'Accessory',
    shopCategory: 'Accessories',
    price: '£9',
    status: 'Launching Monday',
    description: 'A small everyday reminder of Psalm 34:5.',
    images: [],
    variants: [{ sku: 'R34-ACC-KEYCHAIN' }],
    tags: ['drop-001', 'accessory', 'manual-fulfillment'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    fulfillmentType: 'manual',
    seoTitle: 'Radiant Key Chain | Radiant 34',
    seoDescription: 'A small Radiant 34 accessory inspired by Psalm 34:5.',
  },
  {
    id: 'radiant-bracelet',
    title: 'Radiant Bracelet',
    handle: 'radiant-bracelet',
    category: 'Accessory',
    shopCategory: 'Accessories',
    price: '£12',
    status: 'Launching Monday',
    description: 'A simple faith-inspired bracelet for daily wear.',
    images: [],
    variants: [{ sku: 'R34-ACC-BRACELET' }],
    tags: ['drop-001', 'bracelet', 'manual-fulfillment'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    fulfillmentType: 'manual',
    seoTitle: 'Radiant Bracelet | Radiant 34',
    seoDescription: 'A faith-inspired Radiant 34 bracelet for daily wear.',
  },
  {
    id: 'radiant-water-bottle',
    title: 'Radiant Water Bottle',
    handle: 'radiant-water-bottle',
    category: 'Drinkware',
    shopCategory: 'Accessories',
    price: '£22',
    status: 'Launching Monday',
    description: 'Everyday drinkware carrying the Radiant 34 mark.',
    images: [],
    variants: [{ sku: 'R34-DRK-BOTTLE' }],
    tags: ['drop-001', 'water-bottle', 'gelato-ready'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    fulfillmentType: 'gelato',
    seoTitle: 'Radiant Water Bottle | Radiant 34',
    seoDescription: 'Radiant 34 everyday drinkware inspired by Psalm 34:5.',
  },
  {
    id: 'radiant-backpack',
    title: 'Radiant Backpack',
    handle: 'radiant-backpack',
    category: 'Bag',
    shopCategory: 'Accessories',
    price: '£42',
    status: 'Launching Monday',
    description: 'A clean everyday bag for work, church, training, and travel.',
    images: [],
    variants: [{ sku: 'R34-BAG-BACKPACK' }],
    tags: ['drop-001', 'backpack', 'manual-fulfillment'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    fulfillmentType: 'manual',
    seoTitle: 'Radiant Backpack | Radiant 34',
    seoDescription: 'A clean Radiant 34 everyday backpack for work, church, training, and travel.',
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

const FILTERS = ['All', 'Tees', 'Hoodies', 'Tanks', 'Accessories'] as const;
type Filter = typeof FILTERS[number];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" className="header-logo" aria-label="Radiant 34 home">
          <img src={asset('/images/logo-transparent.png')} alt="Radiant 34" className="header-logo-img" />
        </a>

        <nav className={`main-nav${open ? ' main-nav--open' : ''}`} aria-label="Primary navigation">
          <a href="#top" onClick={() => setOpen(false)}>Home</a>
          <a href="#drop" onClick={() => setOpen(false)}>Drop 001</a>
          <a href="#shop" onClick={() => setOpen(false)}>Shop</a>
          <a href="#lookbook" onClick={() => setOpen(false)}>Lookbook</a>
          <a href="#story" onClick={() => setOpen(false)}>About</a>
        </nav>

        <a href="#shop" className="header-cta">Shop Drop 001</a>

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

function ProductVisual({ product }: { product: Product }) {
  if (product.images[0]) {
    return <img src={product.images[0]} alt={product.title} loading="lazy" />;
  }

  return (
    <div className="product-placeholder">
      <img src={asset('/images/logo-transparent.png')} alt="" aria-hidden="true" />
      <span>{product.category}</span>
      <strong>{product.title}</strong>
    </div>
  );
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (product: Product) => void }) {
  return (
    <article className="product-card">
      <button className="product-card__visual" type="button" onClick={() => onSelect(product)}>
        <ProductVisual product={product} />
      </button>
      <div className="product-card__content">
        <div className="product-card__meta">
          <span>{product.category}</span>
          <strong>{product.price}</strong>
        </div>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="product-card__footer">
          <span className="status-pill">{product.status}</span>
          <button type="button" onClick={() => onSelect(product)}>View Product</button>
        </div>
      </div>
    </article>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy-block">
        <p className="eyebrow">Psalm 34:5 inspired clothing</p>
        <h1 className="hero-headline">Those who look to Him are radiant.</h1>
        <p className="hero-lead">
          Radiant 34 is a Bible-inspired clothing label making faith-led art, apparel, and everyday pieces that carry light without feeling forced.
        </p>
        <div className="hero-actions">
          <a href="#shop" className="btn btn--gold">Shop Drop 001</a>
          <a href="#story" className="btn btn--outline">Read the Story</a>
        </div>
        <div className="hero-scripture">
          <span>Psalm 34:5</span>
          <p>“Those who look to Him are radiant; their faces are never covered with shame.”</p>
        </div>
      </div>

      <div className="hero-image">
        <img src={asset('/images/model-psalm.png')} alt="Man wearing a cream Radiant 34 t-shirt at sunset beside Psalm 34 verse text" />
      </div>
    </section>
  );
}

function DropIntro() {
  return (
    <section className="drop-intro" id="drop">
      <div className="container drop-intro__inner">
        <div>
          <p className="eyebrow">Drop 001</p>
          <h2 className="section-heading">Those Who Look.</h2>
        </div>
        <p>
          The first Radiant 34 collection launches Monday with Shopify checkout and Gelato fulfilment. Products are already shown here so customers can see the range before orders open.
        </p>
      </div>
    </section>
  );
}

function ShopSection() {
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<Product>(PRODUCTS[0]);

  const visibleProducts = useMemo(() => {
    if (filter === 'All') return PRODUCTS;
    return PRODUCTS.filter(product => product.shopCategory === filter);
  }, [filter]);

  return (
    <section className="shop-section" id="shop">
      <div className="container shop-head">
        <div>
          <p className="eyebrow">Shop</p>
          <h2 className="section-heading">Products ready for Monday launch.</h2>
        </div>
        <p>
          The shop range is live to view now. Checkout will switch on Monday once the Shopify catalogue and Gelato fulfilment products are connected.
        </p>
      </div>

      <div className="container shop-filters" aria-label="Product filters">
        {FILTERS.map(item => (
          <button key={item} type="button" className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="container product-grid">
        {visibleProducts.map(product => (
          <ProductCard key={product.id} product={product} onSelect={setSelected} />
        ))}
      </div>

      <div className="container product-detail" aria-live="polite">
        <div className="product-detail__visual">
          <ProductVisual product={selected} />
        </div>
        <div className="product-detail__content">
          <p className="eyebrow">Product detail</p>
          <h3>{selected.title}</h3>
          <div className="product-detail__line">
            <span>{selected.category}</span>
            <strong>{selected.price}</strong>
          </div>
          <p>{selected.description}</p>
          {selected.options?.size && (
            <div className="option-row">
              <span>Sizes</span>
              <div>{selected.options.size.map(size => <button key={size} type="button">{size}</button>)}</div>
            </div>
          )}
          {selected.options?.color && (
            <div className="option-row">
              <span>Colours</span>
              <div>{selected.options.color.map(color => <button key={color} type="button">{color}</button>)}</div>
            </div>
          )}
          <div className="integration-note">
            <strong>Monday launch setup</strong>
            <p>
              This product is prepared for Shopify checkout and {selected.fulfillmentType === 'gelato' ? 'Gelato fulfilment' : 'manual fulfilment'}.
            </p>
          </div>
          <a href="#signup" className="btn btn--gold">Get Drop Alert</a>
        </div>
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

function LookbookSection() {
  return (
    <section className="lookbook-section" id="lookbook">
      <div className="lookbook-panel">
        <div className="lookbook-copy">
          <p className="eyebrow">Lookbook</p>
          <h2>Warm light. Clean pieces. Scripture carried naturally.</h2>
          <p>
            The visual direction is lifestyle-led: sunlight, cream, gold, black, handwritten marks, and product imagery that makes the message feel alive.
          </p>
          <a href="#shop" className="btn btn--outline-cream">Shop Drop 001</a>
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
  const [email, setEmail] = useState(() => localStorage.getItem('radiant34-email') || '');
  const [done, setDone] = useState(Boolean(localStorage.getItem('radiant34-email')));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      localStorage.setItem('radiant34-email', email.trim());
      setDone(true);
    }
  };

  return (
    <section className="launch-section" id="signup">
      <div className="launch-inner">
        <div>
          <p className="eyebrow">Drop alerts</p>
          <h2>Get the Monday launch alert.</h2>
          <p>
            Leave your email for the Drop 001 opening notice, product previews, and the first access announcement when Shopify checkout goes live.
          </p>
        </div>
        {done ? (
          <p className="email-thanks">Thank you. You will get the Drop 001 alert.</p>
        ) : (
          <form className="email-form" onSubmit={submit}>
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="Your email address"
              required
              aria-label="Email address for Radiant 34 drop updates"
            />
            <button type="submit">Get Alert</button>
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
        <DropIntro />
        <ShopSection />
        <StorySection />
        <PrinciplesSection />
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
