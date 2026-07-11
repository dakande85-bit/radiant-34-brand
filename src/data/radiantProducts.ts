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
    price: '€14.87',
    productType: 'T-Shirt',
    badge: 'Drop 001',
    status: 'Available',
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
    handle: 'unisex-hoodie',
    displayHandle: 'radiant-hoodie',
    price: '€30',
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
    title: 'Radiant Backpack',
    handle: 'minimalist-backpack',
    displayHandle: 'radiant-backpack',
    price: '€44',
    productType: 'Bag',
    badge: 'Everyday Carry',
    status: 'Available',
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
  {
    title: 'Radiant Duffle Bag',
    handle: 'duffle-bag',
    displayHandle: 'radiant-duffle-bag',
    price: '€70',
    productType: 'Bag',
    badge: 'Travel',
    status: 'Available',
    description: 'A spacious everyday duffle for training, travel, and weekends away.',
    images: {
      primary: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-duffle-bag-white-front-6a524d6683378.jpg?v=1783778670',
      hover: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-duffle-bag-white-front-6a524d6683378.jpg?v=1783778670',
      gallery: [
        'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/all-over-print-duffle-bag-white-front-6a524d6683378.jpg?v=1783778670',
      ],
    },
  },
  {
    title: 'Radiant Mug',
    handle: 'white-glossy-mug',
    displayHandle: 'radiant-mug',
    price: '€10',
    productType: 'Drinkware',
    badge: 'Everyday',
    status: 'Available',
    description: 'A simple everyday mug carrying the Radiant 34 message into daily life.',
    images: {
      primary: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/white-glossy-mug-white-11-oz-front-view-6a52535d7767d.jpg?v=1783780195',
      hover: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/white-glossy-mug-white-11-oz-front-view-6a52535d7767d.jpg?v=1783780195',
      gallery: [
        'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/white-glossy-mug-white-11-oz-front-view-6a52535d7767d.jpg?v=1783780195',
      ],
    },
  },
];