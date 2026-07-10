const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export type RadiantProduct = {
  title: string;
  handle: string;
  displayHandle?: string;
  price: string;
  productType: string;
  badge: string;
  status: string;
  description: string;
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
    handle: 'premium-unisex-crewneck-t-shirt-bella-canvas-3001-white',
    displayHandle: 'psalm-34-tee',
    price: '€34',
    productType: 'T-Shirt',
    badge: 'Drop 001',
    status: 'Preparing release',
    description: 'The verse that started it, on the piece that started it. Clean, everyday, and quietly loud.',
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
    title: 'Radiant Hoodie',
    handle: 'radiant-hoodie',
    price: '€58',
    productType: 'Hoodie',
    badge: 'Drop 001',
    status: 'Preparing release',
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
    title: 'Classic Tee',
    handle: 'classic-tee',
    price: '€34',
    productType: 'T-Shirt',
    badge: 'Drop 001',
    status: 'Preparing release',
    description: 'No verse on this one. Just the mark for the days you carry it without needing to say it out loud.',
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
    title: 'Everyday Tank',
    handle: 'everyday-tank',
    price: '€28',
    productType: 'Tank Top',
    badge: 'Drop 001',
    status: 'Preparing release',
    description: 'Lightweight and made for movement, training, and summer.',
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
    title: 'Radiant Water Bottle',
    handle: 'radiant-water-bottle',
    price: '€22',
    productType: 'Drinkware',
    badge: 'Drop 001',
    status: 'Preparing release',
    description: 'Everyday drinkware carrying the Radiant 34 mark.',
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
    handle: 'radiant-backpack',
    price: '€42',
    productType: 'Bag',
    badge: 'Drop 001',
    status: 'Preparing release',
    description: 'A clean everyday bag for work, church, training, and travel.',
    images: {
      primary: productImage('radiant-backpack-primary.jpg'),
      hover: productImage('radiant-backpack-hover.jpg'),
      gallery: [
        productImage('radiant-backpack-primary.jpg'),
        productImage('radiant-backpack-hover.jpg'),
      ],
    },
  },
];
