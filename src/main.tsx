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
import {
  brandOverrides,
  getBrandOverrideByPublicHandle,
  getBrandOverrideByShopifyHandle,
  shopifyHandleForPublicHandle,
  type BrandOverride,
} from './data/brandOverrides';
import {
  addVariantToCart,
  buyNowVariant,
  checkShopifyProxy,
  clearRadiantCart,
  ensureRadiantCartVersion,
  getCart,
  getStoredCartId,
  installClearRadiantCartDev,
  logShopifyDebug,
  removeCartLine,
  shopifyConfigured,
  shopifyFetch,
  type ShopifyCart,
  type ShopifyCartLine,
  updateCartLine,
} from './lib/shopify';

type Page = '/' | '/drop-001' | '/shop' | '/lookbook' | '/about' | '/mission' | '/contact' | '/product' | '/admin/reviews';

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
  variants?: ShopifyVariant[];
  reviewSummary?: ReviewSummary;
  drop001?: boolean;
};

type ReviewSummary = {
  averageRating: number;
  reviewCount: number;
};

type ProductReview = {
  id: string;
  product_handle: string;
  rating: number;
  title?: string;
  body: string;
  customer_name: string;
  verified_purchase?: boolean;
  created_at?: string;
};

type ShopifyVariant = {
  id: string;
  title?: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
};

const isStorefrontVariantId = (id: string | undefined): id is string =>
  typeof id === 'string' && /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(id);

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
    nodes: ShopifyVariant[];
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
  '/admin/reviews': 'Review Admin | Radiant 34',
};

const navItems: { label: string; path: Page }[] = [
  { label: 'Shop', path: '/shop' },
  { label: 'Drop 001', path: '/drop-001' },
  { label: 'Lookbook', path: '/lookbook' },
  { label: 'Our Story', path: '/about' },
  { label: 'Mission', path: '/mission' },
];

const footerItems: { label: string; path: Page }[] = [
  ...navItems,
  { label: 'Contact', path: '/contact' },
];

const filterLabels = ['All', 'Tees', 'Hoodies', 'Tanks', 'Bags', 'Drinkware', 'Accessories'];

const sortLabels = ['Featured', 'Newest', 'Price Low to High', 'Price High to Low'];

const getCurrentPage = (): Page => {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path.startsWith('/products/')) return '/product';
  const validPages: Page[] = ['/', '/drop-001', '/shop', '/lookbook', '/about', '/mission', '/contact', '/admin/reviews'];
  return validPages.includes(path as Page) ? (path as Page) : '/';
};

const getCurrentProductHandle = () => {
  const match = window.location.pathname.match(/^\/products\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
};

function Header({
  navigate,
  cartCount,
  onCartOpen,
}: {
  navigate: (path: Page) => void;
  cartCount: number;
  onCartOpen: () => void;
}) {
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
            <button type="button" onClick={onCartOpen}>Cart ({cartCount})</button>
            <button type="button" onClick={() => go('/contact')}>Get Drop Alert</button>
          </div>
        </nav>

        <div className="header-actions" aria-label="Shop actions">
          <button className="header-search" type="button" onClick={() => go('/shop')}>
            Search
          </button>
          <button className="header-search header-cart" type="button" onClick={onCartOpen} aria-label={`Open cart with ${cartCount} items`}>
            Cart <span>{cartCount}</span>
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

function ProductDetail({
  product,
  shopifyProduct,
  onCartChanged,
}: {
  product: Product;
  shopifyProduct?: ShopifyProduct | null;
  onCartChanged: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState(product.options?.size?.[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(product.options?.color?.[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const primaryOptionName = getPrimaryVariantOptionName(shopifyProduct);
    const primaryOptionValues = getVariantOptionValues(shopifyProduct, primaryOptionName ?? '');
    setSelectedSize(primaryOptionValues[0] ?? product.options?.size?.[0] ?? '');
    setSelectedColor(product.options?.color?.[0] ?? '');
  }, [product, shopifyProduct]);

  const title = shopifyProduct?.title ?? product.title;
  const description = shopifyProduct?.description ?? product.description;
  const primaryOptionName = getPrimaryVariantOptionName(shopifyProduct);
  const primaryOptionValues = getVariantOptionValues(shopifyProduct, primaryOptionName ?? '');
  const colorOptionName = getVariantOptionNames(shopifyProduct)
    .find((name) => ['color', 'colour'].includes(name.toLowerCase()));
  const selectedVariant = findVariantForSelectedOptions(shopifyProduct, {
    ...(primaryOptionName && selectedSize ? { [primaryOptionName]: selectedSize } : {}),
    ...(colorOptionName && selectedColor ? { [colorOptionName]: selectedColor } : {}),
  });
  const canCheckoutSelectedVariant = Boolean(selectedVariant?.id && shopifyProduct?.storefrontVariantId);
  const selectedSizeUnavailable = Boolean(shopifyProduct?.storefrontVariantId) && !canCheckoutSelectedVariant;
  const galleryImages = (shopifyProduct?.gallery?.length
    ? shopifyProduct.gallery
    : [
      shopifyProduct?.image,
      shopifyProduct?.hoverImage,
      ...product.images,
      product.hoverImage,
    ]).filter((image, index, images): image is string => Boolean(image) && images.indexOf(image) === index);

  const buyProduct = async (checkout = false) => {
    if (isAdding) return;

    if (!selectedVariant?.id) {
      setPurchaseMessage('This product is temporarily unavailable.');
      return;
    }

    try {
      setIsAdding(true);
      const cart = checkout
        ? await buyNowVariant(selectedVariant.id, quantity)
        : await addVariantToCart(selectedVariant.id, quantity);
      setPurchaseMessage(`${title} added to cart.`);
      if (!checkout) onCartChanged();
      if (checkout) window.location.href = cart.checkoutUrl;
    } catch (error) {
      setPurchaseMessage(error instanceof Error ? error.message : 'Unable to add product.');
    } finally {
      setIsAdding(false);
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
        {primaryOptionName && primaryOptionValues.length > 1 ? (
          <div className="selector-group">
            <span>{primaryOptionName}</span>
            <div>
              {primaryOptionValues.map((size) => (
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
              <button className="btn btn--gold" type="button" disabled={!canCheckoutSelectedVariant || isAdding} onClick={() => buyProduct(false)}>
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="btn btn--outline" type="button" disabled={!canCheckoutSelectedVariant || isAdding} onClick={() => buyProduct(true)}>
                {isAdding ? 'Opening...' : 'Buy Now'}
              </button>
            </>
          ) : (
            <button className="btn btn--gold" type="button" disabled>
              This product is temporarily unavailable.
            </button>
          )}
        </div>
        {selectedSizeUnavailable ? <p className="cart-message">This size is currently unavailable.</p> : null}
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
          <li>{primaryOptionName ?? 'Option'} selected: {selectedSize || 'One size'}.</li>
        </ul>
        {shopifyProduct ? <ProductReviews product={shopifyProduct} /> : null}
      </div>
    </section>
  );
}

function ProductReviews({ product }: { product: ShopifyProduct }) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | undefined>(product.reviewSummary);
  const [unavailable, setUnavailable] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', rating: '5', title: '', body: '', order: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setUnavailable(false);
    setMessage('');

    Promise.all([
      fetch(`/api/reviews?product_handle=${encodeURIComponent(product.shopifyHandle ?? product.handle)}`),
      fetchReviewSummaries(),
    ])
      .then(async ([reviewsResponse, summaries]) => {
        if (!reviewsResponse.ok) throw new Error('Reviews are temporarily unavailable');
        const reviewBody = await reviewsResponse.json();
        if (reviewBody.unavailable) throw new Error('Reviews are temporarily unavailable');
        if (!mounted) return;
        setReviews(reviewBody.reviews ?? []);
        setSummary(summaries[product.shopifyHandle ?? product.handle]);
      })
      .catch(() => {
        if (!mounted) return;
        setUnavailable(true);
      });

    return () => {
      mounted = false;
    };
  }, [product.handle, product.shopifyHandle]);

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setUnavailable(false);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_handle: product.shopifyHandle ?? product.handle,
          shopify_product_id: product.id,
          customer_name: form.name,
          customer_email: form.email,
          rating: Number(form.rating),
          title: form.title,
          body: form.body,
          order_reference: form.order,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.unavailable) throw new Error(body.error ?? 'Reviews are temporarily unavailable');
      setMessage('Thank you. Your review will appear after approval.');
      setForm({ name: '', email: '', rating: '5', title: '', body: '', order: '' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Reviews are temporarily unavailable');
      setUnavailable(true);
    }
  };

  const breakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
  }));

  return (
    <section className="reviews-panel" aria-label={`${product.title} reviews`}>
      <div className="reviews-panel__head">
        <div>
          <p className="eyebrow">Customer reviews</p>
          <h3>Reviews</h3>
        </div>
        <ReviewSummaryLine summary={summary} />
      </div>
      {unavailable ? <p className="cart-message">Reviews are temporarily unavailable</p> : null}
      {summary?.reviewCount ? (
        <div className="review-breakdown">
          {breakdown.map((row) => (
            <span key={row.rating}>{row.rating} star: {row.count}</span>
          ))}
        </div>
      ) : null}
      <div className="review-list">
        {reviews.map((review) => (
          <article key={review.id} className="review-item">
            <strong>{reviewStars(review.rating)} {review.title}</strong>
            <p>{review.body}</p>
            <span>{review.customer_name}{review.verified_purchase ? ' - Verified purchase' : ''}</span>
          </article>
        ))}
      </div>
      <form className="review-form" onSubmit={submitReview}>
        <h4>Write a review</h4>
        <div className="review-form__grid">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" required />
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" required />
          <select value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} aria-label="Rating">
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
          </select>
          <input value={form.order} onChange={(event) => setForm({ ...form, order: event.target.value })} placeholder="Order reference (optional)" />
        </div>
        <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Review title" />
        <textarea value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="Your review" minLength={10} required />
        <button className="btn btn--gold" type="submit">Submit review</button>
        {message ? <p className="cart-message">{message}</p> : null}
      </form>
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
  navigate,
}: {
  navigate: (path: Page) => void;
}) {
  const dropItems = Object.values(brandOverrides).filter((override) => override.drop001);

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
      <div className="drop-strip">
        {dropItems.map((item) => (
          <article className="drop-strip__item" key={item.publicHandle}>
            {item.primaryImage ? <img src={item.primaryImage} alt={item.publicTitle} /> : null}
            <span>{item.badge ?? 'Drop 001'}</span>
            <strong>{item.publicTitle}</strong>
            <p>{item.description}</p>
            <button type="button" onClick={() => {
              window.history.pushState(null, '', `/products/${item.publicHandle}`);
              navigate('/product');
            }}>
              View Product
            </button>
          </article>
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

function DropPage({ navigate }: { navigate: (path: Page) => void }) {
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
      <DropCollection navigate={navigate} />
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
  onCartChanged,
}: {
  product: Product;
  shopifyProduct?: ShopifyProduct | null;
  onSelect: (product: Product) => void;
  navigate: (path: Page) => void;
  onCartChanged: () => void;
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
        <ProductDetail product={product} shopifyProduct={shopifyProduct} onCartChanged={onCartChanged} />
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

const selectedOptionValue = (variant: ShopifyVariant | undefined, optionName: string) =>
  variant?.selectedOptions.find((option) => option.name.toLowerCase() === optionName.toLowerCase())?.value;

const getVariantOptionValues = (product: ShopifyProduct | null | undefined, optionName: string) =>
  Array.from(new Set(
    product?.variants
      ?.filter((variant) => variant.availableForSale)
      .map((variant) => selectedOptionValue(variant, optionName))
      .filter((value): value is string => Boolean(value)) ?? [],
  ));

const getVariantOptionNames = (product: ShopifyProduct | null | undefined) =>
  Array.from(new Set(
    product?.variants
      ?.flatMap((variant) => variant.selectedOptions.map((option) => option.name))
      .filter(Boolean) ?? [],
  ));

const getPrimaryVariantOptionName = (product: ShopifyProduct | null | undefined) => {
  const optionNames = getVariantOptionNames(product);
  return optionNames.find((name) => name.toLowerCase() === 'size') ?? optionNames[0] ?? null;
};

const findVariantForSelectedOptions = (
  product: ShopifyProduct | null | undefined,
  selectedOptions: Record<string, string>,
) => {
  const variants = product?.variants
    ?.filter((variant) => variant.availableForSale && isStorefrontVariantId(variant.id)) ?? [];
  if (!variants.length) return null;
  const selections = Object.entries(selectedOptions).filter(([, value]) => Boolean(value));
  if (!selections.length) return variants[0];

  return variants.find((variant) =>
    selections.every(([name, value]) =>
      selectedOptionValue(variant, name)?.trim().toLowerCase() === value.trim().toLowerCase())) ?? null;
};

const reviewStars = (rating: number) => {
  const rounded = Math.round(rating);
  return '★★★★★'.slice(0, rounded) + '☆☆☆☆☆'.slice(0, Math.max(0, 5 - rounded));
};

function ReviewSummaryLine({ summary }: { summary?: ReviewSummary }) {
  if (!summary?.reviewCount) return <span className="review-summary review-summary--empty">No reviews yet</span>;
  return (
    <span className="review-summary">
      <span aria-hidden="true">{reviewStars(summary.averageRating)}</span> {summary.averageRating.toFixed(1)} ({summary.reviewCount})
    </span>
  );
}

async function fetchReviewSummaries() {
  const response = await fetch('/api/reviews/summary');
  if (!response.ok) throw new Error('Reviews are temporarily unavailable');
  const data = await response.json();
  return (data.summaries ?? {}) as Record<string, ReviewSummary>;
}

const fallbackForShopifyProduct = (product: { handle: string; title: string }, index: number) =>
  getProductByHandle(product.handle)
  ?? getProducts().find((item) => product.title.toLowerCase().includes(item.title.split(' - ')[0].toLowerCase()))
  ?? getProducts()[index % getProducts().length];

const getLocalRadiantProductByHandle = (handle: string) =>
  getBrandOverrideByPublicHandle(handle);

const uniqueImages = (images: Array<string | undefined>) =>
  images.filter((image, index, gallery): image is string => Boolean(image) && gallery.indexOf(image) === index).slice(0, 8);

const categoryForProduct = (product: ShopifyProductNode, fallbackCategory: string) => {
  const signals = `${product.productType ?? ''} ${product.title} ${product.handle}`.toLowerCase();
  if (signals.includes('hoodie') || signals.includes('sweatshirt')) return 'Hoodie';
  if (signals.includes('tank')) return 'Tank';
  if (signals.includes('tee') || signals.includes('t-shirt') || signals.includes('shirt')) return 'T-Shirt';
  if (signals.includes('mug') || signals.includes('bottle') || signals.includes('drink')) return 'Drinkware';
  if (signals.includes('bag') || signals.includes('backpack') || signals.includes('duffle') || signals.includes('tote')) return 'Bag';
  if (signals.includes('case')) return 'Accessories';
  return product.productType || fallbackCategory || 'Radiant 34';
};

const applyBrandOverride = (
  product: ShopifyProduct,
  override: BrandOverride | null,
  shopifyImages: Array<string | undefined>,
) => {
  if (!override) return product;

  const brandedGallery = override.useShopifyImages
    ? uniqueImages(shopifyImages)
    : uniqueImages([
      override.primaryImage,
      override.hoverImage,
      ...(override.gallery ?? []),
      ...shopifyImages,
    ]);

  return {
    ...product,
    title: override.publicTitle,
    handle: override.publicHandle,
    description: override.description ?? product.description,
    badges: [override.badge ?? product.badges[0] ?? 'Radiant 34'],
    image: override.useShopifyImages ? product.image : override.primaryImage ?? product.image,
    hoverImage: override.useShopifyImages ? product.hoverImage : override.hoverImage ?? product.hoverImage,
    gallery: brandedGallery.length ? brandedGallery : product.gallery,
    drop001: override.drop001 ?? product.drop001,
  };
};

const toShopifyProduct = (product: ShopifyProductNode, index = 0): ShopifyProduct => {
  const fallback = fallbackForShopifyProduct(product, index);
  const override = getBrandOverrideByShopifyHandle(product.handle);
  const images = product.images?.nodes ?? [];
  const variants = product.variants?.nodes ?? [];
  const displayVariant = variants.find((node) => node.availableForSale) ?? variants[0];
  const swatches = displayVariant?.selectedOptions
    .filter((option) => option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour'))
    .map((option) => option.value) ?? [];
  const checkoutEnabled = Boolean(product.canCheckout && isStorefrontVariantId(product.storefrontVariantId));

  const shopifyGallery = uniqueImages([
    product.featuredImage?.url,
    ...images.map((image) => image.url),
  ]);
  const baseProduct = {
    id: product.id,
    title: product.title,
    handle: product.handle,
    shopifyHandle: product.handle,
    description: product.description || fallback.description || '',
    createdAt: product.createdAt,
    image: product.featuredImage?.url ?? images[0]?.url,
    hoverImage: images[1]?.url,
    gallery: shopifyGallery,
    price: product.priceRange?.minVariantPrice
      ? money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
      : undefined,
    category: categoryForProduct(product, fallback.category),
    tags: product.tags ?? [],
    badges: ['Radiant 34'],
    swatches: swatches.length ? swatches : fallback.swatches,
    variantId: checkoutEnabled ? product.storefrontVariantId : undefined,
    adminVariantId: product.adminVariantId,
    storefrontVariantId: checkoutEnabled ? product.storefrontVariantId : undefined,
    canCheckout: checkoutEnabled,
    status: checkoutEnabled ? undefined : 'Unavailable',
    variants,
    drop001: Boolean(override?.drop001),
  };
  return applyBrandOverride(baseProduct, override, shopifyGallery);
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
            title
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
  onCartChanged,
}: {
  onSelect: (product: ShopifyProduct) => void;
  onCartChanged: () => void;
}) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopError, setShopError] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [search, setSearch] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [addingHandle, setAddingHandle] = useState<string | null>(null);

  useEffect(() => {
    void checkShopifyProxy();
    console.log('Radiant override count:', Object.keys(brandOverrides).length);
    setProducts([]);
    setShopError('');
    setLoading(true);

    if (!shopifyConfigured) {
      console.log('Shopify product count:', 0);
      console.log('Final rendered product count:', 0);
      setShopError("We're having trouble loading the shop. Please refresh and try again.");
      setLoading(false);
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
              title
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
              title?: string;
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
        const finalProducts = data.products.nodes.map((product, index) => toShopifyProduct(product, index));

        console.log('Shopify product count:', finalProducts.length);
        console.log('Final rendered product count:', finalProducts.length);
        logShopifyDebug('Product count returned', finalProducts.length);
        if (!finalProducts.length) {
          logShopifyDebug('No active Shopify products returned. Check product status, sales channel publishing, and product images.');
        }
        setProducts(finalProducts);
        if (!finalProducts.length) {
          setShopError("We're having trouble loading the shop. Please refresh and try again.");
        }
        fetchReviewSummaries()
          .then((summaries) => {
            if (!mounted) return;
            setProducts((items) => items.map((item) => ({
              ...item,
              reviewSummary: summaries[item.shopifyHandle ?? item.handle],
            })));
          })
          .catch(() => {
            logShopifyDebug('Reviews are temporarily unavailable');
          });
      })
      .catch((error) => {
        if (!mounted) return;
        console.log('Shopify product count:', 0);
        console.log('Final rendered product count:', 0);
        console.error('Shopify failed', error);
        logShopifyDebug('Shopify GraphQL errors', error instanceof Error ? error.message : error);
        setProducts([]);
        setShopError("We're having trouble loading the shop. Please refresh and try again.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const searched = search.trim().toLowerCase();
    const filtered = filter === 'All'
      ? products
      : products.filter((product) => {
        const haystack = `${product.category} ${product.title} ${product.tags.join(' ')}`.toLowerCase();
        return haystack.includes(filter.toLowerCase().replace(/s$/, ''));
      });

    const searchedProducts = searched
      ? filtered.filter((product) =>
        `${product.title} ${product.description} ${product.category} ${product.tags.join(' ')}`.toLowerCase().includes(searched))
      : filtered;

    return [...searchedProducts].sort((a, b) => {
      if (sort === 'A-Z') return a.title.localeCompare(b.title);
      const aPrice = Number(a.price?.replace(/[^0-9.]/g, '') || 0);
      const bPrice = Number(b.price?.replace(/[^0-9.]/g, '') || 0);
      if (sort === 'Newest') return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
      if (sort === 'Price Low to High') return aPrice - bPrice;
      if (sort === 'Price High to Low') return bPrice - aPrice;
      return 0;
    });
  }, [filter, products, search, sort]);

  const quickAdd = async (product: ShopifyProduct, checkout = false) => {
    if (addingHandle) return;

    if ((product.variants?.length ?? 0) > 1) {
      onSelect(product);
      return;
    }

    if (!product.storefrontVariantId) {
      const errorText = 'This product is temporarily unavailable.';
      setCartMessage(errorText);
      return;
    }

    try {
      setAddingHandle(product.handle);
      const cart = checkout
        ? await buyNowVariant(product.storefrontVariantId, 1)
        : await addVariantToCart(product.storefrontVariantId, 1);
      setCartMessage(`${product.title} added to cart.`);
      if (!checkout) onCartChanged();
      if (checkout) window.location.href = cart.checkoutUrl;
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Unable to add product.';
      setCartMessage(errorText);
    } finally {
      setAddingHandle(null);
    }
  };

  if (loading) {
    return <p className="shop-empty">Loading Radiant 34 products.</p>;
  }

  if (shopError) {
    return <p className="shop-empty">{shopError}</p>;
  }

  return (
    <>
      <div className="shop-controls">
        <label className="shop-search">
          <span>Search</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
        </label>
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
      {!visibleProducts.length ? <p className="shop-empty">No products match this filter.</p> : null}
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
                <ReviewSummaryLine summary={product.reviewSummary} />
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
                  <button type="button" disabled={addingHandle === product.handle} onClick={() => quickAdd(product)}>
                    {addingHandle === product.handle ? 'Adding...' : (product.variants?.length ?? 0) > 1 ? 'Choose Options' : 'Quick Add'}
                  </button>
                  <button type="button" disabled={addingHandle === product.handle} onClick={() => quickAdd(product, true)}>
                    {addingHandle === product.handle ? 'Opening...' : (product.variants?.length ?? 0) > 1 ? 'Select to Buy' : 'Buy Now'}
                  </button>
                </>
              ) : (
                <button type="button" disabled>This product is temporarily unavailable.</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function ShopPage({
  onSelect,
  onCartChanged,
}: {
  onSelect: (product: ShopifyProduct) => void;
  onCartChanged: () => void;
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
      <ShopifyProducts onSelect={onSelect} onCartChanged={onCartChanged} />
    </section>
  );
}

function cartLineTitle(line: ShopifyCartLine) {
  const handle = line.merchandise?.product?.handle;
  const override = handle ? getBrandOverrideByShopifyHandle(handle) : null;
  if (override) return override.publicTitle;
  return line.merchandise?.product?.title ?? 'Radiant 34 item';
}

function cartLineImage(line: ShopifyCartLine) {
  const handle = line.merchandise?.product?.handle;
  const override = handle ? getBrandOverrideByShopifyHandle(handle) : null;
  const radiantImage = handle && !override?.useShopifyImages
    ? getRadiantProductImages({ handle, title: cartLineTitle(line) })?.primary
    : undefined;
  return radiantImage
    ?? line.merchandise?.image?.url
    ?? line.merchandise?.product?.featuredImage?.url
    ?? siteAssets.heroModel;
}

function cartLineSize(line: ShopifyCartLine) {
  return line.merchandise?.selectedOptions?.find((option) => option.name.toLowerCase() === 'size')?.value;
}

function CartDrawer({
  open,
  onClose,
  onCartChanged,
}: {
  open: boolean;
  onClose: () => void;
  onCartChanged: () => void;
}) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [updatingLine, setUpdatingLine] = useState<string | null>(null);

  const loadCart = async () => {
    const cartId = getStoredCartId();
    if (!cartId) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setCart(await getCart(cartId));
    } catch (error) {
      setCart(null);
      setMessage(error instanceof Error ? error.message : 'Your cart expired. A new cart has been created.');
      onCartChanged();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) void loadCart();
  }, [open]);

  const replaceCart = (nextCart: ShopifyCart) => {
    setCart(nextCart);
    onCartChanged();
  };

  const updateLine = async (line: ShopifyCartLine, quantity: number) => {
    if (!cart?.id || updatingLine) return;

    try {
      setUpdatingLine(line.id);
      setMessage('');
      const nextCart = quantity <= 0
        ? await removeCartLine(cart.id, line.id)
        : await updateCartLine(cart.id, line.id, quantity);
      replaceCart(nextCart);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Checkout is temporarily unavailable. Please try again.');
      await loadCart();
    } finally {
      setUpdatingLine(null);
    }
  };

  const lines = cart?.lines?.nodes ?? [];
  const subtotal = cart?.cost?.subtotalAmount
    ? money(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)
    : undefined;

  return (
    <div className={`cart-shell${open ? ' cart-shell--open' : ''}`} aria-hidden={!open}>
      <button className="cart-backdrop" type="button" aria-label="Dismiss cart" onClick={onClose} />
      <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="cart-drawer__head">
          <div>
            <p className="eyebrow">Radiant 34</p>
            <h2>Your cart</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close cart">Close</button>
        </div>

        {loading ? <p className="shop-empty">Loading cart.</p> : null}
        {message ? <p className="cart-message">{message}</p> : null}
        {!loading && !lines.length ? <p className="shop-empty">Your cart is empty.</p> : null}

        <div className="cart-lines">
          {lines.map((line) => (
            <article className="cart-line" key={line.id}>
              <img src={cartLineImage(line)} alt={cartLineTitle(line)} />
              <div>
                <strong>{cartLineTitle(line)}</strong>
                {cartLineSize(line) ? <span>Size {cartLineSize(line)}</span> : null}
                {line.cost?.totalAmount ? (
                  <span>{money(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}</span>
                ) : null}
                <div className="cart-line__controls">
                  <button type="button" disabled={updatingLine === line.id} onClick={() => updateLine(line, line.quantity - 1)}>-</button>
                  <strong>{line.quantity}</strong>
                  <button type="button" disabled={updatingLine === line.id} onClick={() => updateLine(line, line.quantity + 1)}>+</button>
                  <button type="button" disabled={updatingLine === line.id} onClick={() => updateLine(line, 0)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="cart-drawer__foot">
          <div>
            <span>Subtotal</span>
            <strong>{subtotal ?? '$0.00'}</strong>
          </div>
          <button
            className="btn btn--gold"
            type="button"
            disabled={!cart?.checkoutUrl || !lines.length}
            onClick={() => {
              if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
            }}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
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
          <p className="eyebrow">OUR STORY</p>
          <h1>A psalm, worn.</h1>
          <p>Radiant 34 began with one verse:</p>
          <p>"Those who look to Him are radiant; their faces are never covered with shame." - Psalm 34:5</p>
        </div>
        <img src={siteAssets.aboutHero} alt="Radiant 34 cream tee editorial" />
      </section>
      <section className="text-band">
        <p className="eyebrow">OUR STORY</p>
        <h2>A psalm, worn.</h2>
        <p>
          Psalm 34 is not a polished story written from a comfortable place. It is a testimony shaped by fear,
          pressure, deliverance and praise. Someone cried out, God answered, and the experience became a message
          for others: taste and see that the Lord is good.
        </p>
        <p>Radiant 34 carries that movement into everyday life.</p>
        <p>
          We create clothing, objects and visual stories rooted in Scripture - not as decoration, but as testimony.
          The aim is not to make faith louder for the sake of attention. It is to make biblical truth present in
          the rooms, streets, workplaces, gyms, churches and conversations where people actually live.
        </p>
        <p>
          Every piece begins with the Word. Every collection points beyond itself. Every purchase helps carry the
          message further.
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
          <p className="eyebrow">OUR MISSION</p>
          <h1>Clothing that carries the testimony.</h1>
          <p>
            Radiant 34 exists to create premium, Scripture-rooted products that help people wear their faith
            naturally, share biblical truth courageously and support the work of telling others about Jesus Christ.
          </p>
        </div>
        <img src={siteAssets.missionHero} alt="Radiant 34 black hoodie and accessories editorial" />
      </section>
      <section className="mission-grid">
        <article>
          <span>1. WEAR THE WORD</span>
          <p>Create thoughtful everyday pieces inspired by Scripture, designed to be worn and used beyond Sunday.</p>
        </article>
        <article>
          <span>2. SHARE THE GOSPEL</span>
          <p>Use clothing, art, media and conversation to bring biblical truth into places traditional Christian communication may not reach.</p>
        </article>
        <article>
          <span>3. STRENGTHEN THE CHURCH</span>
          <p>Build a brand that can support Christian missions, churches, charities, teachers of truth and people serving communities in practical ways.</p>
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

function AdminReviewsPage() {
  const [adminKey, setAdminKey] = useState('');
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [message, setMessage] = useState('');

  const loadReviews = async () => {
    setMessage('');
    try {
      const response = await fetch('/api/reviews/admin?status=pending', {
        headers: { 'X-Admin-Review-Key': adminKey },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? 'Unable to load reviews');
      setReviews(body.reviews ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load reviews');
    }
  };

  const moderate = async (id: string, action: 'approve' | 'reject') => {
    setMessage('');
    try {
      const response = await fetch('/api/reviews/admin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Review-Key': adminKey,
        },
        body: JSON.stringify({ id, action }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? 'Unable to update review');
      setReviews((items) => items.filter((review) => review.id !== id));
      setMessage(`Review ${action === 'approve' ? 'approved' : 'rejected'}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update review');
    }
  };

  return (
    <section className="section-band page-section admin-reviews">
      <div className="section-head section-head--split">
        <div>
          <p className="eyebrow">Review Admin</p>
          <h1>Moderate customer reviews.</h1>
        </div>
        <p>Reviews remain pending until approved. The admin key is checked only by the server.</p>
      </div>
      <div className="admin-key-row">
        <input type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="Admin review key" />
        <button className="btn btn--gold" type="button" onClick={loadReviews}>Load pending</button>
      </div>
      {message ? <p className="cart-message">{message}</p> : null}
      <div className="review-list">
        {reviews.map((review) => (
          <article className="review-item" key={review.id}>
            <strong>{review.product_handle} - {reviewStars(review.rating)} {review.title}</strong>
            <p>{review.body}</p>
            <span>{review.customer_name}</span>
            <div className="shopify-card__actions">
              <button type="button" onClick={() => review.id && moderate(review.id, 'approve')}>Approve</button>
              <button type="button" onClick={() => review.id && moderate(review.id, 'reject')}>Reject</button>
            </div>
          </article>
        ))}
      </div>
    </section>
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
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    const cartId = getStoredCartId();
    if (!cartId) {
      setCartCount(0);
      return;
    }

    try {
      const cart = await getCart(cartId);
      setCartCount(cart.totalQuantity ?? 0);
    } catch {
      clearRadiantCart();
      setCartCount(0);
    }
  };

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
    ensureRadiantCartVersion();
    installClearRadiantCartDev();
    void refreshCartCount();
  }, []);

  useEffect(() => {
    const syncPage = () => {
      const nextPage = getCurrentPage();
      setPage(nextPage);
      if (nextPage === '/product') {
        const handle = getCurrentProductHandle() ?? '';
        const localOverride = getLocalRadiantProductByHandle(handle);
        if (localOverride) {
          const shopifyHandle = shopifyHandleForPublicHandle(handle);
          setSelectedShopifyProduct(null);
          setSelectedProduct(fallbackForShopifyProduct({ handle: shopifyHandle, title: localOverride.publicTitle }, 0));
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

    const localOverride = getLocalRadiantProductByHandle(handle);
    const shopifyLookupHandle = shopifyHandleForPublicHandle(handle);
    const currentProductStillMatches = selectedShopifyProduct
      && (selectedShopifyProduct.handle === handle || selectedShopifyProduct.shopifyHandle === shopifyLookupHandle);

    if (currentProductStillMatches && selectedShopifyProduct?.storefrontVariantId) return;

    if (localOverride && !currentProductStillMatches) {
      setSelectedShopifyProduct(null);
      setSelectedProduct(fallbackForShopifyProduct({ handle: shopifyLookupHandle, title: localOverride.publicTitle }, 0));
    }

    if (!shopifyConfigured) return;

    let mounted = true;
    fetchShopifyProductByHandle(shopifyLookupHandle)
      .then((product) => {
        if (!mounted || !product) return;
        setSelectedShopifyProduct(product);
        setSelectedProduct(fallbackForShopifyProduct(product, 0));
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
      <Header navigate={navigate} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main>
        {page === '/' ? <HomePage navigate={navigate} onSelect={selectProduct} /> : null}
        {page === '/drop-001' ? <DropPage navigate={navigate} /> : null}
        {page === '/shop' ? <ShopPage onSelect={selectShopifyProduct} onCartChanged={refreshCartCount} /> : null}
        {page === '/product' ? (
          <ProductPage
            product={selectedProduct}
            shopifyProduct={selectedShopifyProduct}
            onSelect={selectProduct}
            navigate={navigate}
            onCartChanged={refreshCartCount}
          />
        ) : null}
        {page === '/lookbook' ? <LookbookPage /> : null}
        {page === '/about' ? <AboutPage /> : null}
        {page === '/mission' ? <MissionPage /> : null}
        {page === '/contact' ? <ContactPage /> : null}
        {page === '/admin/reviews' ? <AdminReviewsPage /> : null}
      </main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCartChanged={refreshCartCount} />
      <Footer navigate={navigate} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);



