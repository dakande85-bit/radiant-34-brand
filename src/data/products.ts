export type FulfillmentType = 'gelato' | 'manual';

export type ProductStatus = 'Drop 001';

export type ShopCategory = 'Tees' | 'Hoodies' | 'Tanks' | 'Accessories';

export type ProductOptions = {
  size?: string[];
  color?: string[];
};

export type ProductVariant = {
  sku: string;
  size?: string;
  color?: string;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  category: string;
  shopCategory: ShopCategory;
  status: ProductStatus;
  description: string;
  images: string[];
  hoverImage: string;
  badges: string[];
  swatches: string[];
  material: string;
  fit: string;
  care: string;
  story: string;
  options?: ProductOptions;
  variants: ProductVariant[];
  tags: string[];
  collection: 'Drop 001';
  shopifyProductId: string | null;
  shopifyVariantIds: Record<string, string>;
  gelatoProductUid: string | null;
  gelatoProductType: string;
  fulfillmentType: FulfillmentType;
  seoTitle: string;
  seoDescription: string;
};

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const apparelSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const tankSizes = ['XS', 'S', 'M', 'L', 'XL'];

const makeVariants = (prefix: string, sizes: string[], colors: string[]): ProductVariant[] =>
  sizes.flatMap((size) =>
    colors.map((color) => ({
      sku: `${prefix}-${color.replace(/[^A-Z0-9]/gi, '').slice(0, 4).toUpperCase()}-${size}`,
      size,
      color,
    })),
  );

const productStory =
  'Psalm 34 moves from deliverance to testimony: cry out, get heard, then tell someone else to taste and see. This piece is built to carry that testimony without turning it into noise.';

const commonBadges = ['Drop 001', 'Psalm 34:5', 'Limited First Release'];

export const products: Product[] = [
  {
    id: 'those-who-look-tee-cream',
    title: 'Those Who Look Tee - Cream',
    handle: 'those-who-look-tee-cream',
    category: 'T-Shirt',
    shopCategory: 'Tees',
    status: 'Drop 001',
    description: 'The verse that started it, on the piece that started it. Clean, everyday, and quietly loud.',
    images: [asset('/images/radiant-editorial-01.png'), asset('/images/radiant-editorial-06.png')],
    hoverImage: asset('/images/radiant-editorial-06.png'),
    badges: [...commonBadges, 'Heavyweight Cotton'],
    swatches: ['#f1dfc1', '#11100d'],
    material: 'Heavyweight cotton jersey with a soft structured hand feel.',
    fit: 'Relaxed streetwear fit. Size down for a closer silhouette.',
    care: 'Machine wash cold, inside out. Hang dry or tumble low.',
    story: productStory,
    options: { size: apparelSizes, color: ['Cream'] },
    variants: makeVariants('R34-TWL-TEE', apparelSizes, ['Cream']),
    tags: ['drop-001', 'psalm-34', 'tee', 'back-print'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 't-shirt',
    fulfillmentType: 'gelato',
    seoTitle: 'Those Who Look Tee - Cream | Radiant 34',
    seoDescription: 'Cream Psalm 34:5 tee from Radiant 34 Drop 001.',
  },
  {
    id: 'those-who-look-tee-black',
    title: 'Those Who Look Tee - Black',
    handle: 'those-who-look-tee-black',
    category: 'T-Shirt',
    shopCategory: 'Tees',
    status: 'Drop 001',
    description: 'The verse that started it, on the piece that started it. Clean, everyday, and quietly loud.',
    images: [asset('/images/radiant-editorial-02.png'), asset('/images/radiant-black-tee.png')],
    hoverImage: asset('/images/radiant-editorial-02.png'),
    badges: [...commonBadges, 'Heavyweight Cotton'],
    swatches: ['#11100d'],
    material: 'Heavyweight cotton jersey with premium rib neck finish.',
    fit: 'Relaxed fit with dropped shoulder energy.',
    care: 'Wash inside out with like colours. Do not iron print.',
    story: productStory,
    options: { size: apparelSizes, color: ['Black'] },
    variants: makeVariants('R34-TWL-BLK', apparelSizes, ['Black']),
    tags: ['drop-001', 'psalm-34', 'tee', 'black'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 't-shirt',
    fulfillmentType: 'gelato',
    seoTitle: 'Those Who Look Tee - Black | Radiant 34',
    seoDescription: 'Black Psalm 34:5 tee from Radiant 34 Drop 001.',
  },
  {
    id: 'radiant-34-heavyweight-tee-cream',
    title: 'Radiant 34 Heavyweight Tee - Cream',
    handle: 'radiant-34-heavyweight-tee-cream',
    category: 'T-Shirt',
    shopCategory: 'Tees',
    status: 'Drop 001',
    description: 'No verse on this one. Just the mark — for the days you carry it without needing to say it out loud.',
    images: [asset('/images/tshirt-radiant.png'), asset('/images/radiant-editorial-05.png')],
    hoverImage: asset('/images/radiant-editorial-05.png'),
    badges: ['Drop 001', 'Heavyweight Cotton', 'Limited First Release'],
    swatches: ['#efe0c4'],
    material: 'Dense cotton jersey selected for structure and everyday comfort.',
    fit: 'Boxy classic fit. Built to sit clean over denim, cargos, and sweats.',
    care: 'Machine wash cold. Reshape while damp.',
    story: productStory,
    options: { size: apparelSizes, color: ['Cream'] },
    variants: makeVariants('R34-HVY-CRM', apparelSizes, ['Cream']),
    tags: ['drop-001', 'tee', 'heavyweight'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 't-shirt',
    fulfillmentType: 'gelato',
    seoTitle: 'Radiant 34 Heavyweight Tee - Cream | Radiant 34',
    seoDescription: 'Cream heavyweight tee from Radiant 34 Drop 001.',
  },
  {
    id: 'radiant-34-heavyweight-tee-black',
    title: 'Radiant 34 Heavyweight Tee - Black',
    handle: 'radiant-34-heavyweight-tee-black',
    category: 'T-Shirt',
    shopCategory: 'Tees',
    status: 'Drop 001',
    description: 'No verse on this one. Just the mark — for the days you carry it without needing to say it out loud.',
    images: [asset('/images/radiant-black-tee.png'), asset('/images/radiant-editorial-02.png')],
    hoverImage: asset('/images/radiant-editorial-02.png'),
    badges: ['Drop 001', 'Heavyweight Cotton', 'Limited First Release'],
    swatches: ['#11100d'],
    material: 'Substantial cotton jersey with a smooth dry-touch finish.',
    fit: 'Relaxed unisex fit with room through chest and sleeve.',
    care: 'Wash cold, inside out. Avoid bleach and high heat.',
    story: productStory,
    options: { size: apparelSizes, color: ['Black'] },
    variants: makeVariants('R34-HVY-BLK', apparelSizes, ['Black']),
    tags: ['drop-001', 'tee', 'heavyweight', 'black'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 't-shirt',
    fulfillmentType: 'gelato',
    seoTitle: 'Radiant 34 Heavyweight Tee - Black | Radiant 34',
    seoDescription: 'Black heavyweight tee from Radiant 34 Drop 001.',
  },
  {
    id: 'radiant-34-hoodie-bone',
    title: 'Radiant 34 Hoodie - Bone',
    handle: 'radiant-34-hoodie-bone',
    category: 'Hoodie',
    shopCategory: 'Hoodies',
    status: 'Drop 001',
    description: "Built for the ones who stopped hiding. Worn on the days faith is quiet, and on the days it isn't.",
    images: [asset('/images/radiant-editorial-03.png'), asset('/images/radiant-editorial-07.png')],
    hoverImage: asset('/images/radiant-editorial-07.png'),
    badges: [...commonBadges, 'Heavyweight Fleece'],
    swatches: ['#e9ddc8'],
    material: 'Heavy fleece with brushed interior and structured hood.',
    fit: 'Oversized hoodie fit. Designed for layering.',
    care: 'Machine wash cold. Tumble low. Do not iron artwork.',
    story: productStory,
    options: { size: apparelSizes, color: ['Bone'] },
    variants: makeVariants('R34-HDY-BONE', apparelSizes, ['Bone']),
    tags: ['drop-001', 'hoodie', 'bone'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 'hoodie',
    fulfillmentType: 'gelato',
    seoTitle: 'Radiant 34 Hoodie - Bone | Radiant 34',
    seoDescription: 'Bone Radiant 34 hoodie from Drop 001.',
  },
  {
    id: 'radiant-34-hoodie-black',
    title: 'Radiant 34 Hoodie - Black',
    handle: 'radiant-34-hoodie-black',
    category: 'Hoodie',
    shopCategory: 'Hoodies',
    status: 'Drop 001',
    description: "Built for the ones who stopped hiding. Worn on the days faith is quiet, and on the days it isn't.",
    images: [asset('/images/radiant-editorial-08.png'), asset('/images/radiant-cream-hoodie.png')],
    hoverImage: asset('/images/radiant-editorial-08.png'),
    badges: [...commonBadges, 'Heavyweight Fleece'],
    swatches: ['#11100d'],
    material: 'Heavy fleece with brushed interior and ribbed cuffs.',
    fit: 'Relaxed oversized fit with dropped shoulder.',
    care: 'Wash cold, inside out. Hang dry for best shape.',
    story: productStory,
    options: { size: apparelSizes, color: ['Black'] },
    variants: makeVariants('R34-HDY-BLK', apparelSizes, ['Black']),
    tags: ['drop-001', 'hoodie', 'black'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 'hoodie',
    fulfillmentType: 'gelato',
    seoTitle: 'Radiant 34 Hoodie - Black | Radiant 34',
    seoDescription: 'Black Radiant 34 hoodie from Drop 001.',
  },
  {
    id: 'psalm-34-tank-sand',
    title: 'Psalm 34 Tank - Sand',
    handle: 'psalm-34-tank-sand',
    category: 'Tank',
    shopCategory: 'Tanks',
    status: 'Drop 001',
    description: 'Sand tank for warm days, training, and a light daily reminder.',
    images: [asset('/images/radiant-editorial-04.png'), asset('/images/radiant-editorial-01.png')],
    hoverImage: asset('/images/radiant-editorial-04.png'),
    badges: ['Drop 001', 'Psalm 34:5', 'Limited First Release'],
    swatches: ['#d8c19b'],
    material: 'Soft cotton blend with breathable summer weight.',
    fit: 'Athletic casual fit. True to size.',
    care: 'Machine wash cold. Lay flat or tumble low.',
    story: productStory,
    options: { size: tankSizes, color: ['Sand'] },
    variants: makeVariants('R34-TNK-SAND', tankSizes, ['Sand']),
    tags: ['drop-001', 'tank', 'sand'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 'tank-top',
    fulfillmentType: 'gelato',
    seoTitle: 'Psalm 34 Tank - Sand | Radiant 34',
    seoDescription: 'Sand Psalm 34 tank from Radiant 34 Drop 001.',
  },
  {
    id: 'psalm-34-tank-black',
    title: 'Psalm 34 Tank - Black',
    handle: 'psalm-34-tank-black',
    category: 'Tank',
    shopCategory: 'Tanks',
    status: 'Drop 001',
    description: 'Black tank with minimal front identity and a clean athletic finish.',
    images: [asset('/images/radiant-editorial-04.png'), asset('/images/radiant-editorial-02.png')],
    hoverImage: asset('/images/radiant-editorial-02.png'),
    badges: ['Drop 001', 'Psalm 34:5', 'Limited First Release'],
    swatches: ['#11100d'],
    material: 'Soft cotton blend made for movement and summer layering.',
    fit: 'Regular athletic fit. True to size.',
    care: 'Wash cold. Do not bleach. Hang dry recommended.',
    story: productStory,
    options: { size: tankSizes, color: ['Black'] },
    variants: makeVariants('R34-TNK-BLK', tankSizes, ['Black']),
    tags: ['drop-001', 'tank', 'black'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 'tank-top',
    fulfillmentType: 'gelato',
    seoTitle: 'Psalm 34 Tank - Black | Radiant 34',
    seoDescription: 'Black Psalm 34 tank from Radiant 34 Drop 001.',
  },
  {
    id: 'radiant-34-tote-natural',
    title: 'Radiant 34 Tote - Natural',
    handle: 'radiant-34-tote-natural',
    category: 'Bag',
    shopCategory: 'Accessories',
    status: 'Drop 001',
    description: 'Natural tote with large Radiant 34 mark for books, errands, church, and daily carry.',
    images: [asset('/images/radiant-editorial-09.png'), asset('/images/radiant-tote-bag.png')],
    hoverImage: asset('/images/radiant-editorial-09.png'),
    badges: ['Drop 001', 'Psalm 34:5', 'Limited First Release'],
    swatches: ['#e8dcc4', '#11100d'],
    material: 'Durable cotton canvas with reinforced daily-carry feel.',
    fit: 'One size. Designed for books, essentials, and everyday movement.',
    care: 'Spot clean only. Air dry.',
    story: productStory,
    options: { color: ['Natural'] },
    variants: [{ sku: 'R34-TOTE-NAT-OS', color: 'Natural' }],
    tags: ['drop-001', 'bag', 'tote'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 'tote-bag',
    fulfillmentType: 'gelato',
    seoTitle: 'Radiant 34 Tote - Natural | Radiant 34',
    seoDescription: 'Natural Radiant 34 tote from Drop 001.',
  },
  {
    id: 'radiant-34-bottle-black',
    title: 'Radiant 34 Bottle - Black',
    handle: 'radiant-34-bottle-black',
    category: 'Drinkware',
    shopCategory: 'Accessories',
    status: 'Drop 001',
    description: 'Matte black bottle with gold Radiant 34 identity for daily rhythm and movement.',
    images: [asset('/images/radiant-water-bottle.png'), asset('/images/radiant-editorial-08.png')],
    hoverImage: asset('/images/radiant-editorial-08.png'),
    badges: ['Drop 001', 'Psalm 34:5', 'Limited First Release'],
    swatches: ['#11100d'],
    material: 'Durable daily bottle with matte black finish.',
    fit: 'One size. Built for desk, gym, commute, and travel.',
    care: 'Hand wash recommended. Do not microwave.',
    story: productStory,
    options: { color: ['Black'] },
    variants: [{ sku: 'R34-BTL-BLK-OS', color: 'Black' }],
    tags: ['drop-001', 'drinkware', 'bottle'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 'drinkware',
    fulfillmentType: 'gelato',
    seoTitle: 'Radiant 34 Bottle - Black | Radiant 34',
    seoDescription: 'Black Radiant 34 bottle from Drop 001.',
  },
  {
    id: 'radiant-34-cap-black',
    title: 'Radiant 34 Cap - Black',
    handle: 'radiant-34-cap-black',
    category: 'Cap',
    shopCategory: 'Accessories',
    status: 'Drop 001',
    description: 'Black cap with gold embroidery feel and a quiet everyday witness.',
    images: [asset('/images/radiant-editorial-10.png'), asset('/images/radiant-cap.png')],
    hoverImage: asset('/images/radiant-editorial-10.png'),
    badges: ['Drop 001', 'Psalm 34:5', 'Limited First Release'],
    swatches: ['#11100d', '#b98529'],
    material: 'Structured cotton twill feel with embroidered identity mark.',
    fit: 'Adjustable one size.',
    care: 'Spot clean only. Air dry.',
    story: productStory,
    options: { color: ['Black'] },
    variants: [{ sku: 'R34-CAP-BLK-OS', color: 'Black' }],
    tags: ['drop-001', 'cap', 'black'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 'hat/manual',
    fulfillmentType: 'manual',
    seoTitle: 'Radiant 34 Cap - Black | Radiant 34',
    seoDescription: 'Black Radiant 34 cap from Drop 001.',
  },
  {
    id: 'radiant-34-keychain-black-gold',
    title: 'Radiant 34 Keychain - Black/Gold',
    handle: 'radiant-34-keychain-black-gold',
    category: 'Keychain',
    shopCategory: 'Accessories',
    status: 'Drop 001',
    description: 'Black and gold keychain made as a small daily Psalm 34:5 reminder.',
    images: [asset('/images/radiant-key-chain.png'), asset('/images/radiant-editorial-09.png')],
    hoverImage: asset('/images/radiant-editorial-09.png'),
    badges: ['Drop 001', 'Psalm 34:5', 'Limited First Release'],
    swatches: ['#11100d', '#b98529'],
    material: 'Everyday accessory with black and gold Radiant 34 identity.',
    fit: 'One size.',
    care: 'Wipe clean with a soft cloth.',
    story: productStory,
    options: { color: ['Black/Gold'] },
    variants: [{ sku: 'R34-KEY-BG-OS', color: 'Black/Gold' }],
    tags: ['drop-001', 'accessory', 'keychain'],
    collection: 'Drop 001',
    shopifyProductId: null,
    shopifyVariantIds: {},
    gelatoProductUid: null,
    gelatoProductType: 'accessory/manual',
    fulfillmentType: 'manual',
    seoTitle: 'Radiant 34 Keychain - Black/Gold | Radiant 34',
    seoDescription: 'Black and gold Radiant 34 keychain from Drop 001.',
  },
];

export const getProducts = () => products;

export const getProductByHandle = (handle: string) =>
  products.find((product) => product.handle === handle);

export const getProductsByCategory = (category: string) =>
  category === 'All'
    ? products
    : products.filter((product) => product.shopCategory === category);

export const getDropProducts = (dropName: string) =>
  products.filter((product) => product.collection.toLowerCase() === dropName.toLowerCase());
