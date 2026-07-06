// Radiant 34 — Drop 001 product catalogue
// POD via Gelato, synced to Shopify. Prices in EUR.

export interface ProductVariant {
  size: string;
  color: string;
  priceEur: number;
}

export interface Product {
  title: string;
  handle: string;
  type: 'Hoodie' | 'T-Shirt' | 'Tank Top';
  description: string;
  image: string;
  imageAlt: string;
  status: 'coming_soon' | 'available';
  podProvider: 'Gelato';
  variants: ProductVariant[];
}

const products: Product[] = [
  {
    title: 'Signature Hoodie',
    handle: 'signature-hoodie',
    type: 'Hoodie',
    description:
      'A soft everyday hoodie with a small Radiant 34 chest mark. Built for comfort, purpose, and daily wear.',
    image: '/images/model-hoodie.png',
    imageAlt: 'Woman wearing Radiant 34 cream hoodie leaning against stone wall',
    status: 'coming_soon',
    podProvider: 'Gelato',
    variants: [
      ...((['S', 'M', 'L', 'XL', 'XXL'] as const).flatMap(size =>
        (['Cream', 'Black'] as const).map(color => ({ size, color, priceEur: 54.99 }))
      )),
    ],
  },
  {
    title: 'Classic Tee',
    handle: 'classic-tee',
    type: 'T-Shirt',
    description:
      'A clean heavyweight T-shirt carrying the Radiant 34 mark with restraint. Simple, wearable, and rooted in Psalm 34:5.',
    image: '/images/model-tees.png',
    imageAlt: 'Two models wearing Radiant 34 tees at golden hour with city skyline',
    status: 'coming_soon',
    podProvider: 'Gelato',
    variants: [
      ...((['S', 'M', 'L', 'XL', 'XXL'] as const).flatMap(size =>
        (['Black', 'Cream'] as const).map(color => ({ size, color, priceEur: 34.99 }))
      )),
    ],
  },
  {
    title: 'Everyday Tank',
    handle: 'everyday-tank',
    type: 'Tank Top',
    description:
      'A lightweight everyday tank designed for movement, training, summer, and layering.',
    image: '/images/model-group.png',
    imageAlt: 'Group wearing Radiant 34 pieces including the cream tank top',
    status: 'coming_soon',
    podProvider: 'Gelato',
    variants: [
      ...((['S', 'M', 'L', 'XL', 'XXL'] as const).flatMap(size =>
        (['Cream', 'Black'] as const).map(color => ({ size, color, priceEur: 29.99 }))
      )),
    ],
  },
];

export default products;
