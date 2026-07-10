/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import siteAssets from './data/siteAssets';
import {
  type Product,
  getDropProducts,
  getProductByHandle,
  getProducts,
  getProductsByCategory,
} from './data/products';
import { getRadiantProductImages } from './data/radiantProductImages';
import { radiantProducts, type RadiantProduct } from './data/radiantProducts';
import {
  addVariantToCart,
  checkShopifyProxy,
  logShopifyDebug,
  shopifyConfigured,
  shopifyFetch,
} from './lib/shopify';

type Page = '/' | '/drop-001' | '/shop' | '/lookbook' | '/about' | '/mission' | '/contact' | '/product';

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  createdAt?: string;
  image?: string;
  hoverImage?: string;
  price?: string;
  category: string;
  tags: string[];
  badges: string[];
  swatches: string[];
  variantId?: string;
  adminVariantId?: string;
  storefrontVariantId?: string;
  canCheckout?: boolean;
  shopifyHandle?: string;
  gallery: string[];
  status?: string;
};

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  createdAt?: string;
  productType?: string;
  tags?: string[];
  featuredImage?: { url: string; altText?: string };
  images?: { nodes: Array<{ url: string; altText?: string }> };
  variants?: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
      selectedOptions: Array<{ name: string; value: string }>;
    }>;
  };
  adminVariantId?: string;
  storefrontVariantId?: string;
  canCheckout?: boolean;
  priceRange?: { minVariantPrice?: { amount: string; currencyCode: string } };
};

const pageTitles: Record<Page, string> = {
  '/': 'Radiant 34 | Bible Inspired Clothing',
  '/drop-001': 'Drop 001 | Radiant 34',
  '/shop': 'Shop | Radiant 34',
  '/lookbook': 'Lookbook | Radiant 34',
  '/about': 'About | Radiant 34',
  '/mission': 'Mission | Radiant 34',
  '/contact': 'Contact | Radiant 34',
  '/product': 'Product | Radiant 34',
};

const navItems: { label: string; path: Page }[] = [
  { label: 'Shop', path: '/shop' },
  { label: 'Drop 001', path: '/drop-001' },
  { label: 'Lookbook', path: '/lookbook' },
  { label: 'About', path: '/about' },
  { label: 'Mission', path: '/mission' },
];

const footerItems: { label: string; path: Page }[] = [
  ...navItems,
  { label: 'Contact', path: '/contact' },
];

const filterLabels = ['All', 'Tees', 'Hoodies', 'Tanks', 'Accessories'];

const sortLabels = ['Featured', 'Newest', 'Price Low to High', 'Price High to Low'];

const ACTIVE_SHOPIFY_HANDLE = 'premium-unisex-crewneck-t-shirt-bella-canvas-3001-white';
const BUILD_MARKER = 'e996 product-card-view-fix';

const getCurrentPage = (): Page => {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path.startsWith('/products/')) return '/product';
  const validPages: Page[] = ['/', '/drop-001', '/shop', '/lookbook', '/about', '/mission', '/contact'];
  return validPages.includes(path as Page) ? (path as Page) : '/';
};

const getCurrentProductHandle = () => {
  const match = window.location.pathname.match(/^\/products\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
};

function Header({ navigate }: { navigate: (path: Page) => void }) {
  const [open, setOpen] = useState(false);

  const go = (path: Page) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="announcement-bar">DROP 001 — PSALM 34:5 INSPIRED CLOTHING</div>
      <div className="header-inner">
        <a
          className="brand-link header-logo"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            go('/');
          }}
          aria-label="Radiant 34 home"
        >
          <img src={siteAssets.logo} alt="Radiant 34" className="brand-logo" />
        </a>

        <nav className={`main-nav${open ? ' main-nav--open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              href={item.path}
              key={item.path}
              onClick={(event) => {
                event.preventDefault();
                go(item.path);
              }}
            >
              {item.label}
            </a>
          ))}
          <div className="mobile-nav-actions">
            <button type="button" onClick={() => go('/shop')}>Search</button>
            <button type="button" onClick={() => go('/contact')}>Get Drop Alert</button>
          </div>
        </nav>

        <div className="header-actions" aria-label="Shop actions">
          <button className="header-search" type="button" onClick={() => go('/shop')}>
            Search
          </button>
          <button className="header-cta" type="button" onClick={() => go('/contact')}>
            Get Drop Alert
          </button>
        </div>

        <button
          className={`menu-btn${open ? ' menu-btn--open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          type="button"
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

function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const image = product.images[0];

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={`${product.title} by Radiant 34`}
        loading={large ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="product-placeholder">
      <img src={siteAssets.logo} alt="" aria-hidden="true" />
      <span>{product.collection}</span>
      <strong>{product.title}</strong>
      <small>{product.category}</small>
    </div>
  );
}

function ProductImageStack({ product }: { product: Product }) {
  return (
    <>
      <ProductVisual product={product} />
      <img className="product-card__hover-image" src={product.hoverImage} alt="" loading="lazy" />
    </>
  );
}

function ProductCard({
  product,
  onSelect,
  selected = false,
}: {
  product: Product;
  onSelect: (product: Product) => void;
  selected?: boolean;
}) {
  return (
    <button
      className={`product-card${selected ? ' product-card--selected' : ''}`}
      type="button"
      onClick={() => onSelect(product)}
      aria-pressed={selected}
      aria-label={`View ${product.title}`}
    >
      <span className="product-card__visual">
        <ProductImageStack product={product} />
        <span className="product-card__badges">
          {product.badges.slice(0, 2).map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </span>
        <span className="product-card__overlay">View product</span>
      </span>
      <span className="product-card__body">
        <span>
          <span className="product-card__category">{product.category}</span>
          <strong className="product-card__title">{product.title}</strong>
          <span className="product-card__status">{product.badges[2] ?? product.status}</span>
        </span>
        <span className="swatches" aria-label={`${product.title} colours`}>
          {product.swatches.map((swatch) => (
            <span style={{ backgroundColor: swatch }} key={swatch} />
          ))}
        </span>
      </span>
      <span className="notify-link">{selected ? 'Selected' : 'View Product'}</span>
    </button>
  );
}

function ProductDetail({ product, shopifyProduct }: { product: Product; shopifyProduct?: ShopifyProduct | null }) {
  const [selectedSize, setSelectedSize] = useState(product.options?.size?.[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(product.options?.color?.[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [purchaseMessage, setPurchaseMessage] = useState('');

  useEffect(() => {
    setSelectedSize(product.options?.size?.[0] ?? '');
    setSelectedColor(product.options?.color?.[0] ?? '');
  }, [product]);

  const title = shopifyProduct?.title ?? product.title;
  const description = shopifyProduct?.description ?? product.description;
  const galleryImages = (shopifyProduct?.gallery?.length
    ? shopifyProduct.gallery
    : [
      shopifyProduct?.image,
      shopifyProduct?.hoverImage,
      ...product.images,
      product.hoverImage,
    ]).filter((image, index, images): image is string => Boolean(image) && images.indexOf(image) === index);

  const buyProduct = async (checkout = false) => {
    if (!shopifyProduct?.storefrontVariantId) {
      setPurchaseMessage('Preparing release.');
      return;
    }

    try {
      const cart = await addVariantToCart(shopifyProduct.storefrontVariantId, quantity);
      setPurchaseMessage(`${title} added to cart.`);
      if (checkout) window.location.href = cart.checkoutUrl;
    } catch (error) {
      setPurchaseMessage(error instanceof Error ? error.message : 'Unable to add product.');
    }
  };

  return (
    <section className="product-detail" id="product-detail" aria-label={`${product.title} details`}>
      <div className="product-gallery">
        {galleryImages.map((image, index) => (
          <div className="product-gallery__item" key={image}>
            <img src={image} alt={`${title} view ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      <div className="product-detail__copy">
        <div className="product-badge-row">
          {product.badges.map((badge) => (
            <span className="status-badge" key={badge}>{badge}</span>
          ))}
        </div>
        <p className="eyebrow">{product.collection}</p>
        <h2>{title}</h2>
        <p className="product-category">{shopifyProduct?.category ?? product.category}</p>
        {shopifyProduct?.price ? <strong className="product-price">{shopifyProduct.price}</strong> : null}
        <p className="product-description">{description}</p>
        <p className="product-description">{product.story}</p>
        {product.options?.size ? (
          <div className="selector-group">
            <span>Size</span>
            <div>
              {product.options.size.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={selectedSize === size ? 'selected' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {product.options?.color ? (
          <div className="selector-group">
            <span>Colour</span>
            <div>
              {product.options.color.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={selectedColor === color ? 'selected' : ''}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="selector-group selector-group--qty">
          <span>Quantity</span>
          <div>
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
            <strong>{quantity}</strong>
            <button type="button" onClick={() => setQuantity((value) => Math.min(9, value + 1))}>+</button>
          </div>
        </div>

        <div className="purchase-actions">
          {shopifyProduct?.storefrontVariantId ? (
            <>
              <button className="btn btn--gold" type="button" onClick={() => buyProduct(false)}>
                Add to Cart
              </button>
              <button className="btn btn--outline" type="button" onClick={() => buyProduct(true)}>
                Buy Now
              </button>
            </>
          ) : (
            <button className="btn btn--gold" type="button" disabled>
              Preparing release
            </button>
          )}
        </div>
        {purchaseMessage ? <p className="cart-message">{purchaseMessage}</p> : null}
        <div className="product-accordions">
          <details open>
            <summary>Fabric and fit</summary>
            <p>{product.material} {product.fit}</p>
          </details>
          <details>
            <summary>Care</summary>
            <p>{product.care}</p>
          </details>
          <details>
            <summary>Shipping and returns</summary>
            <p>Shipping, returns, and final pricing are handled through Shopify checkout.</p>
          </details>
          <details>
            <summary>Mission note</summary>
            <p>Every order helps Radiant 34 keep making Scripture visible through products, biblical media, and future support for gospel mission.</p>
          </details>
        </div>
        <ul className="detail-notes size-guide">
          <li>Size guide: relaxed unisex fit on tees and hoodies.</li>
          <li>Colour selected: {selectedColor || 'One colour'}.</li>
          <li>Size selected: {selectedSize || 'One size'}.</li>
        </ul>
      </div>
    </section>
  );
}

function Hero({ navigate }: { navigate: (path: Page) => void }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Psalm 34:5 inspired clothing</p>
        <h1>Those who look to Him are radiant.</h1>
        <p>
          Psalm 34 is a testimony — written by someone who knew shame and was delivered from it.
          Radiant 34 puts that testimony on, so it gets carried into rooms scripture doesn&apos;t
          usually reach.
        </p>
        <div className="hero-actions">
          <button className="btn btn--gold" type="button" onClick={() => navigate('/drop-001')}>
            Explore Drop 001
          </button>
          <button className="btn btn--outline" type="button" onClick={() => navigate('/about')}>
            Read the Story
          </button>
        </div>
        <blockquote>
          <span>Psalm 34:5</span>
          Those who look to Him are radiant; their faces are never covered with shame.
        </blockquote>
      </div>
      <div className="hero-image">
        <img src={siteAssets.heroModel} alt="Model wearing Radiant 34 Psalm 34 tee" />
      </div>
    </section>
  );
}

function FeaturedProducts({ navigate, onSelect }: { navigate: (path: Page) => void; onSelect: (product: Product) => void }) {
  const products = getDropProducts('Drop 001').slice(0, 6);

  return (
    <section className="section-band drop-band">
      <div className="section-head">
        <p className="eyebrow">Featured pieces</p>
        <h2>Drop 001 is the first testimony.</h2>
        <p>
          Three pieces. One verse. Built for the days faith is loud, and the days it&apos;s quiet.
        </p>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard product={product} onSelect={onSelect} key={product.id} />
        ))}
      </div>
      <div className="center-actions">
        <button className="btn btn--outline" type="button" onClick={() => navigate('/shop')}>
          Shop Drop 001
        </button>
      </div>
    </section>
  );
}

function DropCollection({
  selected,
  onSelect,
}: {
  selected: Product;
  onSelect: (product: Product) => void;
}) {
  const [filter, setFilter] = useState('All');
  const filteredProducts = useMemo(() => getProductsByCategory(filter), [filter]);

  return (
    <section className="section-band shop-band">
      <div className="section-head section-head--split">
        <div>
          <p className="eyebrow">The first collection</p>
        <h2>Drop 001 - Those Who Look.</h2>
        </div>
        <p>
          A wearable testimony from Psalm 34: delivered, then carried. These are the first pieces
          in the Radiant 34 world.
        </p>
      </div>
      <div className="filters" aria-label="Product filters">
        {filterLabels.map((label) => (
          <button
            key={label}
            className={filter === label ? 'selected' : ''}
            type="button"
            onClick={() => setFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            product={product}
            onSelect={onSelect}
            selected={selected.id === product.id}
            key={product.id}
          />
        ))}
      </div>
    </section>
  );
}

function LookbookSection() {
  return (
    <section className="lookbook">
      <div className="lookbook-copy">
        <p className="eyebrow">Lookbook</p>
        <h2>Warm light, clean silhouettes, scripture carried naturally.</h2>
        <p>
          Shot the way testimony actually shows up in real life — not staged, not preachy. Golden
          hour, city rooftops, people who look like they&apos;ve been somewhere and come out the other
          side.
        </p>
      </div>
      <img src={siteAssets.lookbookTees} alt="Radiant 34 tees editorial" loading="lazy" />
      <img src={siteAssets.communityModels} alt="Radiant 34 group editorial" loading="lazy" />
    </section>
  );
}

function StoryBand() {
  return (
    <section className="about-section">
      <div className="about-image">
        <img src={siteAssets.storyModels} alt="Radiant 34 hoodie editorial" loading="lazy" />
      </div>
      <div className="about-copy">
        <p className="eyebrow">Brand story</p>
        <h2>Clothing shaped by Psalm 34:5.</h2>
        <p>
          Psalm 34 starts at the bottom: a cry, an answer, deliverance, then testimony.
        </p>
        <p>
          Radiant 34 turns that same movement into premium everyday pieces people can wear, carry,
          and be seen in.
        </p>
      </div>
    </section>
  );
}

function NewsletterBand() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(() => Boolean(localStorage.getItem('radiant34LaunchEmail')));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    localStorage.setItem('radiant34LaunchEmail', trimmedEmail);
    setSubmitted(true);
  };

  return (
    <section className="launch-section">
      <div className="launch-card">
        <p className="eyebrow">Radiant Club</p>
        <h2>First access, future stories, and the next release.</h2>
        <p>
          Join the early list for Drop 001, campaign notes, and the creative journey behind
          Radiant 34.
        </p>
        {submitted ? (
          <div className="thanks-message">
            Thank you. You are on the Radiant 34 list.
          </div>
        ) : (
          <form className="email-form" onSubmit={submit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              required
            />
            <button type="submit">Join</button>
          </form>
        )}
      </div>
    </section>
  );
}

function HomePage({ navigate, onSelect }: { navigate: (path: Page) => void; onSelect: (product: Product) => void }) {
  return (
    <>
      <Hero navigate={navigate} />
      <FeaturedProducts navigate={navigate} onSelect={onSelect} />
      <StoryBand />
      <section className="scripture-band">
        <p className="eyebrow">Psalm 34:5</p>
        <h2>Cry out. Be heard. Carry the testimony.</h2>
      </section>
      <LookbookSection />
      <MissionPreview navigate={navigate} />
      <NewsletterBand />
    </>
  );
}

function DropPage({ selected, onSelect }: { selected: Product; onSelect: (product: Product) => void }) {
  return (
    <>
      <section className="page-hero page-hero--drop">
        <img src={siteAssets.dropHero} alt="" aria-hidden="true" className="page-hero__bg" />
        <p className="eyebrow">Drop 001</p>
        <h1>DROP 001 - THOSE WHO LOOK</h1>
        <p>
          Inspired by Psalm 34:5.
        </p>
      </section>
      <section className="campaign-statement">
        <p className="eyebrow">Campaign statement</p>
        <h2>Drop 001 begins with a single verse: Those who look to Him are radiant.</h2>
        <p>
          This first collection is built around deliverance, testimony, and the quiet confidence that
          comes from looking to Christ.
        </p>
      </section>
      <DropCollection selected={selected} onSelect={onSelect} />
      <LookbookSection />
      <section className="campaign-grid" aria-label="Drop 001 editorial images">
        {siteAssets.lookbook.slice(0, 6).map((image, index) => (
          <img src={image} alt={`Drop 001 campaign ${index + 1}`} loading="lazy" key={image} />
        ))}
      </section>
    </>
  );
}

function ProductPage({
  product,
  shopifyProduct,
  onSelect,
  navigate,
}: {
  product: Product;
  shopifyProduct?: ShopifyProduct | null;
  onSelect: (product: Product) => void;
  navigate: (path: Page) => void;
}) {
  const relatedProducts = getDropProducts('Drop 001')
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <section className="product-page-hero">
        <button className="back-link" type="button" onClick={() => navigate('/drop-001')}>
          Back to Drop 001
        </button>
        <ProductDetail product={product} shopifyProduct={shopifyProduct} />
      </section>
      <section className="section-band drop-band">
        <div className="section-head">
          <p className="eyebrow">More from Drop 001</p>
          <h2>Wear the testimony.</h2>
        </div>
        <div className="product-grid">
          {relatedProducts.map((item) => (
            <ProductCard product={item} onSelect={onSelect} key={item.id} />
          ))}
        </div>
      </section>
    </>
  );
}

const money = (amount: string, currencyCode: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(Number(amount));

const fallbackForShopifyProduct = (product: { handle: string; title: string }, index: number) =>
  getProductByHandle(product.handle)
  ?? getProducts().find((item) => product.title.toLowerCase().includes(item.title.split(' - ')[0].toLowerCase()))
  ?? getProducts()[index % getProducts().length];

const getLocalRadiantProductByHandle = (handle: string) =>
  radiantProducts.find((product) => product.handle === handle || product.displayHandle === handle);

const toLocalShopProduct = (product: RadiantProduct): ShopifyProduct => {
  const fallback = fallbackForShopifyProduct(product, 0);

  return {
    id: `local-${product.handle}`,
    title: product.title,
    handle: product.displayHandle ?? product.handle,
    shopifyHandle: product.handle,
    description: product.description,
    image: product.images.primary,
    hoverImage: product.images.hover,
    gallery: product.images.gallery,
    price: product.price,
    category: product.productType,
    tags: [product.badge, product.productType, product.status],
    badges: [product.badge, product.status],
    swatches: fallback.swatches,
    status: product.status,
  };
};

const localShopProducts = () => radiantProducts.map(toLocalShopProduct);

const toShopifyProduct = (product: ShopifyProductNode, index = 0): ShopifyProduct => {
  const fallback = fallbackForShopifyProduct(product, index);
  const imageOverride = getRadiantProductImages(product);
  const images = product.images?.nodes ?? [];
  const variant = product.variants?.nodes.find((node) => node.availableForSale) ?? product.variants?.nodes[0];
  const swatches = variant?.selectedOptions
    .filter((option) => option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour'))
    .map((option) => option.value) ?? [];

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    shopifyHandle: product.handle,
    description: product.description || fallback.description,
    createdAt: product.createdAt,
    image: imageOverride?.primary ?? fallback.images[0] ?? product.featuredImage?.url ?? images[0]?.url,
    hoverImage: imageOverride?.hover ?? fallback.hoverImage ?? images[1]?.url,
    gallery: imageOverride?.gallery.length
      ? imageOverride.gallery
      : [
        fallback.images[0],
        fallback.hoverImage,
        product.featuredImage?.url,
        ...images.map((image) => image.url),
      ].filter((image, galleryIndex, gallery): image is string => Boolean(image) && gallery.indexOf(image) === galleryIndex),
    price: product.priceRange?.minVariantPrice
      ? money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
      : undefined,
    category: product.productType || fallback.category,
    tags: product.tags ?? [],
    badges: fallback.badges,
    swatches: swatches.length ? swatches : fallback.swatches,
    variantId: product.storefrontVariantId ?? variant?.id,
    adminVariantId: product.adminVariantId,
    storefrontVariantId: product.storefrontVariantId ?? variant?.id,
    canCheckout: product.canCheckout ?? Boolean(product.storefrontVariantId ?? variant?.id),
    status: (product.canCheckout ?? Boolean(product.storefrontVariantId ?? variant?.id)) ? undefined : 'Preparing release',
  };
};

const mergeLocalProductsWithShopify = (localProducts: ShopifyProduct[], shopifyProducts: ShopifyProduct[]) => {
  const shopifyByHandle = new Map(shopifyProducts.map((product) => [product.handle, product]));

  return localProducts.map((localProduct) => {
    const originalHandle = radiantProducts.find((product) =>
      (product.displayHandle ?? product.handle) === localProduct.handle)?.handle;
    const shopifyProduct = shopifyByHandle.get(originalHandle ?? localProduct.handle)
      ?? shopifyByHandle.get(localProduct.handle);

    if (!shopifyProduct) return localProduct;
    const canUseCheckout = originalHandle === ACTIVE_SHOPIFY_HANDLE && Boolean(shopifyProduct.storefrontVariantId);

    return {
      ...localProduct,
      id: shopifyProduct.id,
      price: shopifyProduct.price ?? localProduct.price,
      createdAt: shopifyProduct.createdAt,
      tags: Array.from(new Set([...localProduct.tags, ...shopifyProduct.tags])),
      variantId: canUseCheckout ? shopifyProduct.storefrontVariantId : undefined,
      adminVariantId: shopifyProduct.adminVariantId,
      storefrontVariantId: canUseCheckout ? shopifyProduct.storefrontVariantId : undefined,
      canCheckout: canUseCheckout,
      shopifyHandle: originalHandle ?? localProduct.shopifyHandle ?? localProduct.handle,
      status: canUseCheckout ? undefined : localProduct.status,
    };
  });
};

async function fetchShopifyProductByHandle(handle: string) {
  const query = `
    query RadiantProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        createdAt
        productType
        tags
        featuredImage { url altText }
        images(first: 4) {
          nodes { url altText }
        }
        variants(first: 20) {
          nodes {
            id
            availableForSale
            selectedOptions { name value }
          }
        }
        priceRange {
          minVariantPrice { amount currencyCode }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ product: ShopifyProductNode | null }>(query, { handle });
  return data.product ? toShopifyProduct(data.product) : null;
}

function ShopifyProducts({
  onSelect,
}: {
  onSelect: (product: ShopifyProduct) => void;
}) {
  const [products, setProducts] = useState<ShopifyProduct[]>(localShopProducts);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [cartMessage, setCartMessage] = useState('');
  const [lastCartError, setLastCartError] = useState('');

  useEffect(() => {
    void checkShopifyProxy();
    const localProducts = localShopProducts();
    console.log('Radiant local product count:', radiantProducts.length);
    setProducts(localProducts);

    if (!shopifyConfigured) {
      console.log('Shopify product count:', 0);
      console.log('Final rendered product count:', localProducts.length);
      return;
    }

    let mounted = true;
    const query = `
      query RadiantProducts {
        products(first: 24) {
          nodes {
            id
            title
            handle
            description
            createdAt
            productType
            tags
            featuredImage { url altText }
            images(first: 4) {
              nodes { url altText }
            }
            variants(first: 20) {
              nodes {
                id
                availableForSale
                selectedOptions { name value }
              }
            }
            priceRange {
              minVariantPrice { amount currencyCode }
            }
          }
        }
      }
    `;

    shopifyFetch<{
      products: {
        nodes: Array<{
          id: string;
          title: string;
          handle: string;
          description: string;
          createdAt?: string;
          productType?: string;
          tags?: string[];
          featuredImage?: { url: string; altText?: string };
          images?: { nodes: Array<{ url: string; altText?: string }> };
          variants?: {
            nodes: Array<{
              id: string;
              availableForSale: boolean;
              selectedOptions: Array<{ name: string; value: string }>;
            }>;
          };
          priceRange?: { minVariantPrice?: { amount: string; currencyCode: string } };
        }>;
      };
    }>(query)
      .then((data) => {
        if (!mounted) return;
        const shopifyProducts = data.products.nodes.map((product, index) => toShopifyProduct(product, index));
        const finalProducts = shopifyProducts.length
          ? mergeLocalProductsWithShopify(localProducts, shopifyProducts)
          : localProducts;

        console.log('Shopify product count:', shopifyProducts.length);
        console.log('Final rendered product count:', finalProducts.length);
        logShopifyDebug('Product count returned', shopifyProducts.length);
        if (!shopifyProducts.length) {
          logShopifyDebug('No active Shopify products returned. Check product status, sales channel publishing, and product images.');
        }
        setProducts(finalProducts);
      })
      .catch((error) => {
        if (!mounted) return;
        console.log('Shopify product count:', 0);
        console.log('Final rendered product count:', localProducts.length);
        console.error('Shopify failed, using local Radiant products', error);
        logShopifyDebug('Shopify GraphQL errors', error instanceof Error ? error.message : error);
        setProducts(localProducts);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const filtered = filter === 'All'
      ? products
      : products.filter((product) => {
        const haystack = `${product.category} ${product.title} ${product.tags.join(' ')}`.toLowerCase();
        return haystack.includes(filter.toLowerCase().replace(/s$/, ''));
      });

    return [...filtered].sort((a, b) => {
      if (sort === 'A-Z') return a.title.localeCompare(b.title);
      const aPrice = Number(a.price?.replace(/[^0-9.]/g, '') || 0);
      const bPrice = Number(b.price?.replace(/[^0-9.]/g, '') || 0);
      if (sort === 'Newest') return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
      if (sort === 'Price Low to High') return aPrice - bPrice;
      if (sort === 'Price High to Low') return bPrice - aPrice;
      return 0;
    });
  }, [filter, products, sort]);

  const quickAdd = async (product: ShopifyProduct, checkout = false) => {
    if (!product.storefrontVariantId) {
      const errorText = 'Preparing release.';
      setCartMessage(errorText);
      setLastCartError(errorText);
      return;
    }

    try {
      setLastCartError('');
      const cart = await addVariantToCart(product.storefrontVariantId, 1);
      setCartMessage(`${product.title} added to cart.`);
      if (checkout) window.location.href = cart.checkoutUrl;
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Unable to add product.';
      setCartMessage(errorText);
      setLastCartError(errorText);
    }
  };

  if (loading) {
    return <p className="shop-empty">Loading Radiant 34 products.</p>;
  }

  const activeProduct = products.find((product) => product.shopifyHandle === ACTIVE_SHOPIFY_HANDLE);

  return (
    <>
      <div className="shop-controls">
        <div className="filters" aria-label="Product filters">
          {filterLabels.map((label) => (
            <button
              key={label}
              className={filter === label ? 'selected' : ''}
              type="button"
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="sort-control">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            {sortLabels.map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      {cartMessage ? <p className="cart-message">{cartMessage}</p> : null}
      {!visibleProducts.length ? <p className="shop-empty">The collection is being prepared. Check back soon.</p> : null}
      <div className="product-grid product-grid--shop">
        {visibleProducts.map((product) => (
          <article className="shopify-card" key={product.id}>
            <button
              className="shopify-card__main"
              type="button"
              onClick={() => {
                onSelect(product);
              }}
            >
              <span className="shopify-card__image">
                {product.image ? <img src={product.image} alt={product.title} /> : null}
                {product.hoverImage ? <img className="shopify-card__hover" src={product.hoverImage} alt="" loading="lazy" /> : null}
                <span className="product-card__badges">
                  {product.badges.slice(0, 2).map((badge) => <span key={badge}>{badge}</span>)}
                </span>
                <span className="product-card__overlay">View product</span>
              </span>
              <span className="shopify-card__body">
                <span className="product-card__category">{product.category || 'Radiant 34'}</span>
                <strong>{product.title}</strong>
                {product.description ? <span className="shopify-card__description">{product.description}</span> : null}
                <span className="shopify-card__meta">
                  {product.price ? <span className="shopify-card__price">{product.price}</span> : null}
                  <span className="swatches" aria-label={`${product.title} colours`}>
                    {product.swatches.map((swatch) => (
                      <span
                        style={{ backgroundColor: swatch.startsWith('#') ? swatch : swatch.toLowerCase().includes('black') ? '#11100d' : '#e9ddc8' }}
                        key={swatch}
                        title={swatch}
                      />
                    ))}
                  </span>
                </span>
                <span className="shopify-card__view">View Product</span>
              </span>
            </button>
            <div className="shopify-card__actions">
              {product.storefrontVariantId ? (
                <>
                  <button type="button" onClick={() => quickAdd(product)}>Quick Add</button>
                  <button type="button" onClick={() => quickAdd(product, true)}>Buy Now</button>
                </>
              ) : (
                <button type="button" disabled>Preparing release</button>
              )}
            </div>
          </article>
        ))}
      </div>
      <aside className="shop-diagnostic" aria-label="Temporary shop diagnostic">
        <strong>Shop Diagnostic</strong>
        <span>build commit: {BUILD_MARKER}</span>
        <span>active Shopify handle found: {activeProduct ? 'true' : 'false'}</span>
        <span>storefrontVariantId: {activeProduct?.storefrontVariantId ?? 'none'}</span>
        <span>availableForSale: {activeProduct?.storefrontVariantId ? 'true' : 'false'}</span>
        <span>last cart error: {lastCartError || 'none'}</span>
      </aside>
      <p className="build-marker">Build: {BUILD_MARKER}</p>
    </>
  );
}

function ShopPage({
  onSelect,
}: {
  onSelect: (product: ShopifyProduct) => void;
}) {
  return (
    <section className="section-band shop-band page-section shop-page">
      <div className="section-head section-head--split">
        <div>
          <p className="eyebrow">Shop Drop 001</p>
          <h1>Drop 001 — wearable testimony.</h1>
        </div>
        <p>
          A focused collection shaped by Psalm 34: cried out, heard, delivered, carried.
        </p>
      </div>
      <ShopifyProducts onSelect={onSelect} />
    </section>
  );
}

function LookbookPage() {
  const lookbookStories = [
    {
      eyebrow: 'Those who look',
      title: 'The testimony is worn before it is explained.',
      copy: 'Psalm 34 starts with a cry and becomes an invitation. These pieces are made for the same movement: delivered, seen, and carried into ordinary rooms.',
      image: siteAssets.lookbook[0],
      alt: 'Radiant 34 cream tee editorial',
    },
    {
      eyebrow: 'No shame',
      title: 'Quiet front. Strong witness.',
      copy: 'The clothes stay restrained because the message does not need to shout. A small mark, a clean silhouette, and the verse close enough to carry.',
      image: siteAssets.lookbook[5],
      alt: 'Radiant 34 Those Who Look back print editorial',
    },
    {
      eyebrow: 'Everyday witness',
      title: 'Built for rooftops, streets, church steps, and the walk home.',
      copy: 'Not staged, not preachy. Just people wearing testimony in real light, after real life, with enough beauty to make someone look twice.',
      image: siteAssets.lookbook[7],
      alt: 'Radiant 34 hoodie and accessories editorial',
    },
  ];

  return (
    <>
      <section className="lookbook-hero">
        <img src={siteAssets.lookbook[9]} alt="Radiant 34 cap editorial" />
        <div>
          <p className="eyebrow">Lookbook</p>
          <h1>Carry the light.</h1>
        </div>
      </section>
      <section className="lookbook-editorial">
        {lookbookStories.map((story) => (
          <article className="lookbook-story" key={story.title}>
            <div className="lookbook-story__copy">
              <p className="eyebrow">{story.eyebrow}</p>
              <h2>{story.title}</h2>
              <p>{story.copy}</p>
            </div>
            <div className="lookbook-story__image">
              <img src={story.image} alt={story.alt} loading="lazy" />
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero--editorial">
        <div>
          <p className="eyebrow">About Radiant 34</p>
          <h1>A psalm, worn.</h1>
          <p>
            David wrote Psalm 34 after his lowest point — hiding, humiliated, pretending to be
            someone else just to survive. Then he was delivered, and the first thing he did was tell
            people: taste and see.
          </p>
        </div>
        <img src={siteAssets.aboutHero} alt="Radiant 34 cream tee editorial" />
      </section>
      <StoryBand />
      <section className="text-band">
        <p className="eyebrow">Psalm 34:5</p>
        <h2>Those who look to Him are radiant.</h2>
        <p>
          Radiant 34 exists to keep doing that. Every piece is a small act of testimony — worn by
          people who&apos;ve been there, seen by people who haven&apos;t yet.
        </p>
      </section>
    </>
  );
}

function MissionPreview({ navigate }: { navigate: (path: Page) => void }) {
  return (
    <section className="mission-band">
      <div>
        <p className="eyebrow">Mission</p>
        <h2>Clothing that helps the testimony travel.</h2>
        <p>
          Radiant 34 is not the message. It is a way to help it move through rooms, stories,
          churches, mission fields, and the people already carrying it.
        </p>
        <button className="btn btn--outline" type="button" onClick={() => navigate('/mission')}>
          Read the Mission
        </button>
      </div>
      <img src={siteAssets.missionHero} alt="Radiant 34 hoodie and accessories editorial" loading="lazy" />
    </section>
  );
}

function MissionPage() {
  return (
    <>
      <section className="page-hero page-hero--editorial">
        <div>
          <p className="eyebrow">Mission</p>
          <h1>Clothing that funds the telling.</h1>
          <p>
            Radiant 34 isn&apos;t the message. It&apos;s a way to help it travel. A portion of every drop
            goes toward the people already doing this work — in churches, on mission fields, and in
            the studios and stories that carry it further than we can alone.
          </p>
        </div>
        <img src={siteAssets.missionHero} alt="Radiant 34 black hoodie and accessories editorial" />
      </section>
      <section className="mission-grid">
        <article>
          <span>Churches</span>
          <p>Backing the communities where people first cry out — and get heard.</p>
        </article>
        <article>
          <span>Missionaries</span>
          <p>Funding the ones carrying deliverance into hard places.</p>
        </article>
        <article>
          <span>Biblical Media</span>
          <p>Supporting storytellers turning testimony into something people can taste and see.</p>
        </article>
        <article>
          <span>Creative Work</span>
          <p>Investing in artists building things that carry the message further than words alone.</p>
        </article>
      </section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero--editorial">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Join the Radiant 34 list.</h1>
          <p>
            Get first access to Drop 001, product notes, campaign images, and future mission updates.
          </p>
        </div>
        <img src={siteAssets.contactHero} alt="Radiant 34 cap editorial" />
      </section>
      <NewsletterBand />
    </>
  );
}

function Footer({ navigate }: { navigate: (path: Page) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <img src={siteAssets.logo} alt="Radiant 34" />
        <p>Those who look to Him are radiant; their faces are never covered with shame.</p>
      </div>
      <nav aria-label="Footer navigation">
        {footerItems.map((item) => (
          <button type="button" key={item.path} onClick={() => navigate(item.path)}>
            {item.label}
          </button>
        ))}
      </nav>
      <span>Every piece carries a verse. Every purchase carries the message further.</span>
      <span>(c) 2026 Radiant 34. Bible-inspired clothing and everyday art.</span>
    </footer>
  );
}

function App() {
  const products = getProducts();
  const [page, setPage] = useState<Page>(getCurrentPage);
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    getProductByHandle(getCurrentProductHandle() ?? 'psalm-34-tee') ?? products[0],
  );
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<ShopifyProduct | null>(null);

  const navigate = (path: Page) => {
    window.history.pushState(null, '', path);
    setPage(path);
    if (path !== '/product') setSelectedShopifyProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectProduct = (product: Product) => {
    setSelectedShopifyProduct(null);
    setSelectedProduct(product);
    setPage('/product');
    window.history.pushState(null, '', `/products/${product.handle}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectShopifyProduct = (product: ShopifyProduct) => {
    setSelectedShopifyProduct(product);
    setSelectedProduct(fallbackForShopifyProduct(product, 0));
    setPage('/product');
    window.history.pushState(null, '', `/products/${product.handle}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const syncPage = () => {
      const nextPage = getCurrentPage();
      setPage(nextPage);
      if (nextPage === '/product') {
        const handle = getCurrentProductHandle() ?? '';
        const localProduct = getLocalRadiantProductByHandle(handle);
        if (localProduct) {
          const shopProduct = toLocalShopProduct(localProduct);
          setSelectedShopifyProduct(shopProduct);
          setSelectedProduct(fallbackForShopifyProduct(shopProduct, 0));
          return;
        }
        const product = getProductByHandle(handle);
        if (product) {
          setSelectedShopifyProduct(null);
          setSelectedProduct(product);
        }
      }
    };
    window.addEventListener('popstate', syncPage);
    return () => window.removeEventListener('popstate', syncPage);
  }, []);

  useEffect(() => {
    if (page !== '/product') return;
    const handle = getCurrentProductHandle();
    if (!handle) return;

    const localProduct = getLocalRadiantProductByHandle(handle);
    const shopifyLookupHandle = localProduct?.handle ?? handle;
    const currentProductStillMatches = selectedShopifyProduct
      && (selectedShopifyProduct.handle === handle || selectedShopifyProduct.shopifyHandle === shopifyLookupHandle);

    if (currentProductStillMatches && selectedShopifyProduct?.storefrontVariantId) return;

    if (localProduct && !currentProductStillMatches) {
      const shopProduct = toLocalShopProduct(localProduct);
      setSelectedShopifyProduct(shopProduct);
      setSelectedProduct(fallbackForShopifyProduct(shopProduct, 0));
    }

    if (!shopifyConfigured) return;

    let mounted = true;
    fetchShopifyProductByHandle(shopifyLookupHandle)
      .then((product) => {
        if (!mounted || !product) return;
        const displayProduct = localProduct
          ? mergeLocalProductsWithShopify([toLocalShopProduct(localProduct)], [product])[0]
          : product;
        setSelectedShopifyProduct(displayProduct);
        setSelectedProduct(fallbackForShopifyProduct(displayProduct, 0));
      })
      .catch((error) => {
        logShopifyDebug('Product handle lookup failed', error instanceof Error ? error.message : error);
      });

    return () => {
      mounted = false;
    };
  }, [page, selectedShopifyProduct]);

  useEffect(() => {
    document.title = page === '/product'
      ? `${selectedProduct.title} | Radiant 34`
      : pageTitles[page];
  }, [page, selectedProduct]);

  return (
    <>
      <Header navigate={navigate} />
      <main>
        {page === '/' ? <HomePage navigate={navigate} onSelect={selectProduct} /> : null}
        {page === '/drop-001' ? <DropPage selected={selectedProduct} onSelect={selectProduct} /> : null}
        {page === '/shop' ? <ShopPage onSelect={selectShopifyProduct} /> : null}
        {page === '/product' ? (
          <ProductPage
            product={selectedProduct}
            shopifyProduct={selectedShopifyProduct}
            onSelect={selectProduct}
            navigate={navigate}
          />
        ) : null}
        {page === '/lookbook' ? <LookbookPage /> : null}
        {page === '/about' ? <AboutPage /> : null}
        {page === '/mission' ? <MissionPage /> : null}
        {page === '/contact' ? <ContactPage /> : null}
      </main>
      <Footer navigate={navigate} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
