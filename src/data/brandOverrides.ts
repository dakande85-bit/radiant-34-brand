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
  'unisex-hoodie': {
    publicTitle: 'Radiant 34 Signature Hoodie',
    publicHandle: 'radiant-signature-hoodie',
    description: 'A premium cream hoodie inspired by Psalm 34:5 and designed to carry the Radiant 34 message with quiet confidence.',
    badge: 'Drop 001',
    primaryImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-signature-hoodie-cream-primary_128d2f24-8bd2-4f6b-bdcc-bd432ee36ee6.png?v=1784758611',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-signature-hoodie-cream-model-hover_8fe38a13-35e6-44f8-8554-039940f4e9a8.png?v=1784758612',
    gallery: [
      'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-signature-hoodie-cream-primary_128d2f24-8bd2-4f6b-bdcc-bd432ee36ee6.png?v=1784758611',
      'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-signature-hoodie-cream-model-hover_8fe38a13-35e6-44f8-8554-039940f4e9a8.png?v=1784758612',
    ],
    useShopifyImages: true,
    drop001: true,
  },
  'classic-unisex-pullover-hoodie-gildan®-18500-white': {
    publicTitle: 'Radiant 34 White Hoodie',
    publicHandle: 'radiant-white-hoodie',
    description: 'A clean everyday hoodie inspired by Psalm 34:5.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'unisex-ringer-t-shirt': {
    publicTitle: 'Radiant 34 Ringer T-Shirt',
    publicHandle: 'radiant-ringer-t-shirt',
    description: 'A vintage-inspired T-shirt centred on the message of Psalm 34:5.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'vintage-cotton-dad-hat-beechfield-b655': {
    publicTitle: 'Radiant 34 Vintage Dad Hat',
    publicHandle: 'radiant-vintage-dad-hat',
    description: 'A relaxed everyday cap carrying the Radiant 34 identity with a worn-in finish.',
    badge: 'Accessories',
    useShopifyImages: true,
  },
  'minimalist-backpack': {
    publicTitle: 'Radiant 34 Backpack',
    publicHandle: 'radiant-backpack',
    description: 'A clean everyday backpack for work, study, church, training and travel.',
    badge: 'Everyday Carry',
    useShopifyImages: true,
  },
  'duffle-bag': {
    publicTitle: 'Radiant 34 Duffle Bag',
    publicHandle: 'radiant-duffle-bag',
    description: 'A spacious everyday bag for training, travel and weekends away.',
    badge: 'Travel',
    useShopifyImages: true,
  },
  'white-glossy-mug': {
    publicTitle: 'Radiant 34 Mug',
    publicHandle: 'radiant-mug',
    description: 'A simple daily reminder of Psalm 34:5 for coffee, tea or quiet moments.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'tough-case': {
    publicTitle: 'Radiant 34 Phone Case',
    publicHandle: 'radiant-phone-case',
    description: 'Protection with purpose, carrying the Radiant 34 message into everyday life.',
    badge: 'Accessories',
    useShopifyImages: true,
  },
  'radiant-34-keychain-charm-double-sided-number-keyring-gift': {
    publicTitle: 'Radiant 34 Keyring',
    publicHandle: 'radiant-keyring',
    description: 'A small everyday reminder of Psalm 34:5 for keys, bags and lanyards.',
    badge: 'Accessories',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug': {
    publicTitle: 'Radiant 34 Kind Words Are Like Honey Mug',
    publicHandle: 'kind-words-like-honey-mug',
    description: 'Kind words are like honey—sweet to the soul and healing to the bones. Inspired by Proverbs 16:24.',
    badge: 'Drinkware',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-kind-words-honey-mug-hover.png?v=1784749909',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-1': {
    publicTitle: 'Radiant 34 His Peace Calmed a Storm Mug',
    publicHandle: 'his-peace-calmed-a-storm-mug',
    description: 'A reminder that the peace of Jesus is greater than every storm.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-3': {
    publicTitle: 'Radiant 34 Chosen Mug',
    publicHandle: 'chosen-mug',
    description: 'You are chosen, set apart and called with purpose. Inspired by 1 Peter 2:9.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-4': {
    publicTitle: 'Radiant 34 Logo Mug',
    publicHandle: 'radiant-logo-mug',
    description: 'A clean everyday mug carrying the Radiant 34 mark and the message behind Psalm 34:5.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-5': {
    publicTitle: 'Radiant 34 Be Still Mug',
    publicHandle: 'be-still-mug',
    description: 'Be still and know that He is God. Inspired by Psalm 46:10.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-6': {
    publicTitle: 'Radiant 34 My Soul Loves Jesus Mug',
    publicHandle: 'my-soul-loves-jesus-mug',
    description: 'A simple statement of devotion: my soul loves Jesus.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-7': {
    publicTitle: 'Radiant 34 Jesus Is King Mug',
    publicHandle: 'jesus-is-king-mug',
    description: 'A bold declaration of faith: Jesus is King.',
    badge: 'Drinkware',
    useShopifyImages: true,
  },
  'white-11oz-ceramic-mug-8': {
    publicTitle: 'Radiant 34 Jesus Is My Refuge Mug',
    publicHandle: 'jesus-is-my-refuge-mug',
    description: 'A steady reminder that Jesus is a place of refuge, strength and peace.',
    badge: 'Drinkware',
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
    useShopifyImages: true,
  },
};

export const getBrandOverrideByShopifyHandle = (handle: string) => brandOverrides[handle] ?? null;

export const getBrandOverrideByPublicHandle = (handle: string) =>
  Object.values(brandOverrides).find((override) => override.publicHandle === handle) ?? null;

export const shopifyHandleForPublicHandle = (handle: string) =>
  Object.entries(brandOverrides).find(([, override]) => override.publicHandle === handle)?.[0] ?? handle;