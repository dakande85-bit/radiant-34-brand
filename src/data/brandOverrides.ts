const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const productImage = (filename: string) => asset(`/images/products/${filename}`);

export type BrandOverride = {
  publicTitle: string;
  publicHandle: string;
  description?: string;
  badge?: string;
  primaryImage?: string;
  hoverImage?: string;
  gallery?: string[];
  useShopifyImages?: boolean;
  drop001?: boolean;
};

export const brandOverrides: Record<string, BrandOverride> = {
  'premium-unisex-crewneck-t-shirt-bella-canvas-3001': {
    publicTitle: 'Psalm 34 Tee',
    publicHandle: 'psalm-34-tee',
    description: 'The verse that started it, on the piece that started it. Clean, everyday, and quietly loud.',
    badge: 'Drop 001',
    primaryImage: productImage('psalm-34-tee-primary.jpg'),
    hoverImage: productImage('psalm-34-tee-hover.jpg'),
    gallery: [
      productImage('psalm-34-tee-primary.jpg'),
      productImage('psalm-34-tee-hover.jpg'),
      productImage('psalm-34-tee-detail.jpg'),
    ],
    drop001: true,
  },
  'premium-unisex-crewneck-t-shirt-bella-canvas-3002': {
    publicTitle: 'Radiant Classic Tee',
    publicHandle: 'radiant-classic-tee',
    description: 'A clean everyday tee carrying the Radiant 34 mark with quiet confidence.',
    badge: 'Drop 001',
    drop001: true,
  },
  'premium-unisex-tank-top': {
    publicTitle: 'Radiant Tank',
    publicHandle: 'radiant-tank',
    description: 'A lightweight tank for movement, warm days, and Scripture carried naturally.',
    badge: 'Drop 001',
    drop001: true,
  },
  'premium-unisex-tank-top-1': {
    publicTitle: 'Radiant Core Tank',
    publicHandle: 'radiant-core-tank',
    description: 'A simple core tank made for everyday rhythm and warm-weather layering.',
    badge: 'Drop 001',
    drop001: true,
  },
  'unisex-ringer-t-shirt': {
    publicTitle: 'Radiant Ringer Tee',
    publicHandle: 'radiant-ringer-tee',
    description: 'A vintage-inspired ringer tee with clean Radiant 34 identity.',
    badge: 'Drop 001',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-ringer-tee-hover.png?v=1784709515',
    useShopifyImages: true,
    drop001: true,
  },
  'womens-cropped-sweatshirt-bella-canvas-7503': {
    publicTitle: 'Radiant Cropped Sweatshirt',
    publicHandle: 'radiant-cropped-sweatshirt',
    description: 'A soft cropped sweatshirt shaped for easy layering and everyday testimony.',
    badge: 'Drop 001',
    drop001: true,
  },
  'unisex-hoodie': {
    publicTitle: 'Radiant Hoodie',
    publicHandle: 'radiant-hoodie',
    description: "Built for the ones who stopped hiding. Worn on the days faith is quiet, and on the days it isn't.",
    badge: 'Drop 001',
    primaryImage: productImage('radiant-hoodie-primary.jpg'),
    hoverImage: productImage('radiant-hoodie-hover.jpg'),
    gallery: [
      productImage('radiant-hoodie-primary.jpg'),
      productImage('radiant-hoodie-hover.jpg'),
      productImage('radiant-hoodie-detail.jpg'),
    ],
    drop001: true,
  },
  'classic-unisex-pullover-hoodie-gildan®-18500-white': {
    publicTitle: 'Radiant 34 White Hoodie',
    publicHandle: 'radiant-white-hoodie',
    description: 'A clean everyday hoodie inspired by Psalm 34:5.',
    badge: 'Drop 001',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-white-hoodie-hover.png?v=1784709618',
    useShopifyImages: true,
    drop001: true,
  },
  'classic-tote-bag': {
    publicTitle: 'Radiant Tote Bag',
    publicHandle: 'radiant-tote-bag',
    description: 'A durable everyday tote for books, errands, church, and daily carry.',
    badge: 'Everyday Carry',
  },
  'radiant-34-stainless-steal-water-bottle': {
    publicTitle: 'Radiant Water Bottle',
    publicHandle: 'radiant-water-bottle',
    description: 'A stainless steel daily bottle carrying the Radiant 34 mark for work, training, and travel.',
    badge: 'Everyday',
    useShopifyImages: true,
  },
  'minimalist-backpack': {
    publicTitle: 'Radiant Backpack',
    publicHandle: 'radiant-backpack',
    description: 'A clean everyday bag for work, church, training, and travel.',
    badge: 'Everyday Carry',
    primaryImage: productImage('radiant-backpack-primary.jpg'),
    hoverImage: productImage('radiant-backpack-hover.jpg'),
    gallery: [
      productImage('radiant-backpack-primary.jpg'),
      productImage('radiant-backpack-hover.jpg'),
    ],
  },
  'duffle-bag': {
    publicTitle: 'Radiant Duffle Bag',
    publicHandle: 'radiant-duffle-bag',
    description: 'A spacious everyday duffle for training, travel, and weekends away.',
    badge: 'Travel',
    useShopifyImages: true,
  },
  'white-glossy-mug': {
    publicTitle: 'Radiant Mug',
    publicHandle: 'radiant-mug',
    description: 'A simple everyday mug carrying the Radiant 34 message into daily life.',
    badge: 'Everyday',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-mug-hover.png?v=1784709737',
    useShopifyImages: true,
  },
  'tough-case': {
    publicTitle: 'Radiant Tough Case',
    publicHandle: 'radiant-tough-case',
    description: 'A protective phone case carrying the Radiant 34 mark into everyday use.',
    badge: 'Everyday',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-phone-case-hover.png?v=1784709547',
    useShopifyImages: true,
  },
  'radiant-34-keychain-charm-double-sided-number-keyring-gift': {
    publicTitle: 'Radiant 34 Keyring',
    publicHandle: 'radiant-keyring',
    description: 'A small everyday reminder of Psalm 34:5.',
    badge: 'Accessories',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-keyring-hover.png?v=1784709580',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug': {
    publicTitle: 'Radiant 34 God Restores My Soul Mug',
    publicHandle: 'god-restores-my-soul-mug',
    description: 'A daily reminder that restoration begins in God. Inspired by Psalm 23:3.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-1': {
    publicTitle: 'Radiant 34 His Peace Calmed a Storm Mug',
    publicHandle: 'his-peace-calmed-a-storm-mug',
    description: 'A reminder that the peace of Jesus is greater than the storm around you.',
    badge: 'Drinkware',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-his-peace-calmed-a-storm-correct-hover.png?v=1784713790',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-2': {
    publicTitle: 'Radiant 34 Be Still Mug',
    publicHandle: 'be-still-mug',
    description: 'Be still and remember who God is. Inspired by Psalm 46:10.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-3': {
    publicTitle: 'Radiant 34 Renew Your Mind Mug',
    publicHandle: 'renew-your-mind-mug',
    description: 'A bold reminder to be transformed by the renewing of your mind. Inspired by Romans 12:2.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-4': {
    publicTitle: 'Radiant 34 Breathe Mug',
    publicHandle: 'breathe-mug',
    description: 'Let everything that has breath praise the Lord. Inspired by Psalm 150:6.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-5': {
    publicTitle: 'Radiant 34 With Jesus All Things Are Possible Mug',
    publicHandle: 'with-jesus-all-things-are-possible-mug',
    description: 'A confident daily statement of faith: with Jesus, all things are possible.',
    badge: 'Drinkware',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/with-jesus-all-things-are-possible-mug-hover.png?v=1784709659',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-6': {
    publicTitle: 'Radiant 34 La Fe Mueve Montañas Mug',
    publicHandle: 'la-fe-mueve-montanas-mug',
    description: 'La fe mueve montañas. Inspired by Mateo 17:20.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-7': {
    publicTitle: 'Radiant 34 Jesus — The Way, Truth and Life Mug',
    publicHandle: 'jesus-way-truth-life-mug',
    description: 'A clear declaration from John 14:6: Jesus is the way, the truth and the life.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-8': {
    publicTitle: 'Radiant 34 Jesus Is My Refuge Mug',
    publicHandle: 'jesus-is-my-refuge-mug',
    description: 'A steady reminder that Jesus is a place of refuge, strength and peace.',
    badge: 'Drinkware',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/jesus-is-my-refuge-mug-hover.png?v=1784709684',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-9': {
    publicTitle: 'Radiant 34 Loved First Mug',
    publicHandle: 'loved-first-mug',
    description: 'We love because He first loved us. Inspired by 1 John 4:19.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'tough-case-3': {
    publicTitle: 'Radiant 34 Scripture Tough Phone Case',
    publicHandle: 'radiant-scripture-tough-case',
    description: 'Protection with purpose: a durable phone case carrying a bold faith-centred design.',
    badge: 'Accessories',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant-scripture-tough-case-hover.png?v=1784709712',
    useShopifyImages: true,
  },
};

export const getBrandOverrideByShopifyHandle = (handle: string) => brandOverrides[handle] ?? null;

export const getBrandOverrideByPublicHandle = (handle: string) =>
  Object.values(brandOverrides).find((override) => override.publicHandle === handle) ?? null;

export const shopifyHandleForPublicHandle = (handle: string) =>
  Object.entries(brandOverrides).find(([, override]) => override.publicHandle === handle)?.[0] ?? handle;
