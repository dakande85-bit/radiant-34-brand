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
  'classic-unisex-pullover-hoodie-gildan®-18500': {
    publicTitle: 'Radiant 34 Essential Pullover Hoodie',
    publicHandle: 'radiant-essential-pullover-hoodie',
    description: 'A substantial everyday hoodie featuring Radiant 34 artwork in navy and black.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'classic-unisex-pullover-hoodie-gildan®-18500-white': {
    publicTitle: 'Radiant 34 White Hoodie',
    publicHandle: 'radiant-white-hoodie',
    description: 'A clean everyday white hoodie inspired by Psalm 34:5.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'heavyweight-unisex-crewneck-t-shirt-gildan®-5001': {
    publicTitle: 'Radiant 34 Heavyweight Scripture T-Shirt 01',
    publicHandle: 'radiant-heavyweight-scripture-tshirt-01',
    description: 'A heavyweight unisex T-shirt featuring an original Radiant 34 Scripture graphic.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'heavyweight-unisex-crewneck-t-shirt-gildan®-5002': {
    publicTitle: 'Radiant 34 Heavyweight Scripture T-Shirt 02',
    publicHandle: 'radiant-heavyweight-scripture-tshirt-02',
    description: 'A heavyweight unisex T-shirt created for everyday faith and dependable wear.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'heavyweight-unisex-crewneck-t-shirt-gildan®-5000': {
    publicTitle: 'Radiant 34 Heavyweight Scripture T-Shirt 03',
    publicHandle: 'radiant-heavyweight-scripture-tshirt-03',
    description: 'A heavyweight unisex T-shirt with an original Radiant 34 Scripture graphic and a classic fit.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'heavyweight-unisex-crewneck-t-shirt-gildan®-5003': {
    publicTitle: 'Radiant 34 Heavyweight Scripture T-Shirt 04',
    publicHandle: 'radiant-heavyweight-scripture-tshirt-04',
    description: 'A heavyweight unisex T-shirt made to bring faith into everyday life.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'heavyweight-unisex-crewneck-t-shirt-gildan®-5000-white': {
    publicTitle: 'Radiant 34 Heavyweight Scripture T-Shirt 05',
    publicHandle: 'radiant-heavyweight-scripture-tshirt-05',
    description: 'A heavyweight white unisex T-shirt with a clean Radiant 34 Scripture graphic.',
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
  'premium-unisex-tank-top': {
    publicTitle: 'Radiant 34 Scripture Tank Top 01',
    publicHandle: 'radiant-scripture-tank-top-01',
    description: 'A lightweight unisex tank top featuring Radiant 34 Scripture artwork.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  'premium-unisex-tank-top-1': {
    publicTitle: 'Radiant 34 Scripture Tank Top 02',
    publicHandle: 'radiant-scripture-tank-top-02',
    description: 'A lightweight unisex tank top designed for warm weather and easy everyday styling.',
    badge: 'Drop 001',
    useShopifyImages: true,
    drop001: true,
  },
  't-shirt-dress': {
    publicTitle: 'Radiant 34 Fearfully & Wonderfully Created T-Shirt Dress',
    publicHandle: 'fearfully-wonderfully-created-tshirt-dress',
    description: 'A relaxed oversized T-shirt dress inspired by Psalm 139:14 and designed for confident everyday wear.',
    badge: 'Women',
    useShopifyImages: true,
  },
  'snapback-hat': {
    publicTitle: 'Radiant 34 Follow God Not Man Snapback',
    publicHandle: 'follow-god-not-man-snapback',
    description: 'A structured dark navy snapback embroidered with Follow God, Not Man, inspired by Galatians 1:10.',
    badge: 'Headwear',
    primaryImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/classic-snapback-dark-navy-front-6a617b2f5d17f.jpg?v=1784773446',
    hoverImage: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-follow-god-not-man-snapback-model.png?v=1784775143',
    gallery: [
      'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/classic-snapback-dark-navy-front-6a617b2f5d17f.jpg?v=1784773446',
      'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-follow-god-not-man-snapback-model.png?v=1784775143',
    ],
    useShopifyImages: true,
  },
  'premium-tote-bag-black': {
    publicTitle: 'Radiant 34 Premium Black Tote Bag',
    publicHandle: 'radiant-premium-black-tote-bag',
    description: 'A premium black tote bag designed for work, study, church, shopping and daily essentials.',
    badge: 'Accessories',
    useShopifyImages: true,
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
    badge: 'Bags',
    useShopifyImages: true,
  },
  'duffle-bag': {
    publicTitle: 'Radiant 34 Duffle Bag',
    publicHandle: 'radiant-duffle-bag',
    description: 'A spacious everyday bag for training, travel and weekends away.',
    badge: 'Bags',
    useShopifyImages: true,
  },
  'white-glossy-mug': {
    publicTitle: 'Radiant 34 Mug',
    publicHandle: 'radiant-mug',
    description: 'A simple daily reminder of Psalm 34:5 for coffee, tea or quiet moments.',
    badge: 'Drinkware',
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
  'white-11oz-ceramic-mug-4': {
    publicTitle: 'Radiant 34 Logo Mug',
    publicHandle: 'radiant-logo-mug',
    description: 'A clean everyday mug carrying the Radiant 34 mark and the message behind Psalm 34:5.',
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
  'tough-case': {
    publicTitle: 'Radiant 34 Phone Case',
    publicHandle: 'radiant-phone-case',
    description: 'Protection with purpose, carrying the Radiant 34 message into everyday life.',
    badge: 'Accessories',
    useShopifyImages: true,
  },
  'tough-case-1': {
    publicTitle: 'Radiant 34 Tough Phone Case 01',
    publicHandle: 'radiant-tough-phone-case-01',
    description: 'A durable dual-layer phone case featuring Radiant 34 artwork.',
    badge: 'Accessories',
    useShopifyImages: true,
  },
  'tough-case-2': {
    publicTitle: 'Radiant 34 Tough Phone Case 02',
    publicHandle: 'radiant-tough-phone-case-02',
    description: 'A durable dual-layer phone case featuring a second Radiant 34 design.',
    badge: 'Accessories',
    useShopifyImages: true,
  },
  'tough-case-3': {
    publicTitle: 'Radiant 34 Scripture Tough Phone Case',
    publicHandle: 'radiant-scripture-tough-case',
    description: 'Protection with purpose: a durable phone case carrying a bold faith-centred design.',
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
  'white-11oz-ceramic-mug-3': {
    publicTitle: 'Radiant 34 Chosen Mug',
    publicHandle: 'chosen-mug',
    description: 'You are chosen, set apart and called with purpose. Inspired by 1 Peter 2:9.',
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
};

export const getBrandOverrideByShopifyHandle = (handle: string) => brandOverrides[handle] ?? null;

export const getBrandOverrideByPublicHandle = (handle: string) =>
  Object.values(brandOverrides).find((override) => override.publicHandle === handle) ?? null;

export const shopifyHandleForPublicHandle = (handle: string) =>
  Object.entries(brandOverrides).find(([, override]) => override.publicHandle === handle)?.[0] ?? handle;
