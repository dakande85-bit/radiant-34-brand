const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export type RadiantProduct = {
  title: string;
  handle: string;
  displayHandle: string;
  price: string;
  productType: string;
  badge: string;
  status: string;
  description: string;
  useShopifyImages?: boolean;
  images: {
    primary: string;
    hover: string;
    gallery: string[];
  };
};

const productImage = (filename: string) => asset(`/images/products/${filename}`);

export const radiantProducts: RadiantProduct[] = [
  {
    title: 'Psalm 34 Tee',
    handle: 'premium-unisex-crewneck-t-shirt-bella-canvas-3001',
    displayHandle: 'psalm-34-tee',
    price: 'EUR 20.82',
    productType: 'T-Shirt',
    badge: 'Drop 001',
    status: 'Available',
    description: 'The verse that started it, on the piece that started it. Clean, everyday, and quietly bold.',
    images: {
      primary: productImage('psalm-34-tee-primary.jpg'),
      hover: productImage('psalm-34-tee-hover.jpg'),
      gallery: [
        productImage('psalm-34-tee-primary.jpg'),
        productImage('psalm-34-tee-hover.jpg'),
        productImage('psalm-34-tee-detail.jpg'),
      ],
    },
  },
  {
    title: 'Radiant Classic Tee',
    handle: 'premium-unisex-crewneck-t-shirt-bella-canvas-3002',
    displayHandle: 'radiant-classic-tee',
    price: 'EUR 20.82',
    productType: 'T-Shirt',
    badge: 'Drop 001',
    status: 'Available',
    description: 'Clean design and quiet conviction in a soft everyday crewneck.',
    images: {
      primary: productImage('classic-tee-primary.jpg'),
      hover: productImage('classic-tee-hover.jpg'),
      gallery: [
        productImage('classic-tee-primary.jpg'),
        productImage('classic-tee-hover.jpg'),
      ],
    },
  },
  {
    title: 'Radiant Tank',
    handle: 'premium-unisex-tank-top',
    displayHandle: 'radiant-tank',
    price: 'EUR 24.98',
    productType: 'Tank',
    badge: 'Drop 001',
    status: 'Available',
    description: 'Lightweight, clean and built for movement, warmer days and everyday life.',
    images: {
      primary: productImage('everyday-tank-primary.jpg'),
      hover: productImage('everyday-tank-hover.jpg'),
      gallery: [
        productImage('everyday-tank-primary.jpg'),
        productImage('everyday-tank-hover.jpg'),
      ],
    },
  },
  {
    title: 'Radiant Hoodie',
    handle: 'unisex-hoodie',
    displayHandle: 'radiant-hoodie',
    price: 'EUR 30',
    productType: 'Hoodie',
    badge: 'Drop 001',
    status: 'Available',
    description: "Built for the ones who stopped hiding. Worn on the days faith is quiet, and on the days it isn't.",
    images: {
      primary: productImage('radiant-hoodie-primary.jpg'),
      hover: productImage('radiant-hoodie-hover.jpg'),
      gallery: [
        productImage('radiant-hoodie-primary.jpg'),
        productImage('radiant-hoodie-hover.jpg'),
        productImage('radiant-hoodie-detail.jpg'),
      ],
    },
  },
  {
    title: 'Radiant Tote Bag',
    handle: 'classic-tote-bag',
    displayHandle: 'radiant-tote-bag',
    price: 'EUR 26.68',
    productType: 'Bag',
    badge: 'Everyday Carry',
    status: 'Available',
    description: 'A clean everyday carryall for work, church, study, errands and daily movement.',
    useShopifyImages: true,
    images: { primary: '', hover: '', gallery: [] },
  },
  {
    title: 'Radiant Water Bottle',
    handle: 'radiant-34-stainless-steal-water-bottle',
    displayHandle: 'radiant-water-bottle',
    price: 'EUR 20',
    productType: 'Drinkware',
    badge: 'Everyday',
    status: 'Available',
    description: 'A stainless steel everyday bottle designed for work, training, church and travel.',
    images: {
      primary: productImage('radiant-water-bottle-primary.jpg'),
      hover: productImage('radiant-water-bottle-hover.jpg'),
      gallery: [
        productImage('radiant-water-bottle-primary.jpg'),
        productImage('radiant-water-bottle-hover.jpg'),
      ],
    },
  },
  {
    title: 'Radiant Backpack',
    handle: 'minimalist-backpack',
    displayHandle: 'radiant-backpack',
    price: 'EUR 44',
    productType: 'Bag',
    badge: 'Everyday Carry',
    status: 'Available',
    description: 'A clean everyday bag for work, church, training and travel.',
    images: {
      primary: productImage('radiant-backpack-primary.jpg'),
      hover: productImage('radiant-backpack-hover.jpg'),
      gallery: [
        productImage('radiant-backpack-primary.jpg'),
        productImage('radiant-backpack-hover.jpg'),
      ],
    },
  },
  {
    title: 'Radiant Duffle Bag',
    handle: 'duffle-bag',
    displayHandle: 'radiant-duffle-bag',
    price: 'EUR 70',
    productType: 'Bag',
    badge: 'Travel',
    status: 'Available',
    description: 'A spacious everyday duffle for training, travel and weekends away.',
    useShopifyImages: true,
    images: { primary: '', hover: '', gallery: [] },
  },
  {
    title: 'Radiant Mug',
    handle: 'white-glossy-mug',
    displayHandle: 'radiant-mug',
    price: 'EUR 10',
    productType: 'Drinkware',
    badge: 'Everyday',
    status: 'Available',
    description: 'A simple everyday mug carrying the Radiant 34 message into daily life.',
    useShopifyImages: true,
    images: { primary: '', hover: '', gallery: [] },
  },
];
