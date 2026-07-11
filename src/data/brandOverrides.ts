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
    useShopifyImages: true,
  },
  'tough-case': {
    publicTitle: 'Radiant Tough Case',
    publicHandle: 'radiant-tough-case',
    description: 'A protective phone case carrying the Radiant 34 mark into everyday use.',
    badge: 'Everyday',
    useShopifyImages: true,
  },
};

export const getBrandOverrideByShopifyHandle = (handle: string) => brandOverrides[handle] ?? null;

export const getBrandOverrideByPublicHandle = (handle: string) =>
  Object.values(brandOverrides).find((override) => override.publicHandle === handle) ?? null;

export const shopifyHandleForPublicHandle = (handle: string) =>
  Object.entries(brandOverrides).find(([, override]) => override.publicHandle === handle)?.[0] ?? handle;
