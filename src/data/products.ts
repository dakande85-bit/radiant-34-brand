export type ProductCategory = 'apparel' | 'accessory' | 'everyday-carry';

export type RadiantProduct = {
  id: string;
  name: string;
  handle: string;
  category: ProductCategory;
  launchPriority: 1 | 2 | 3;
  shortDescription: string;
  spiritualMeaning: string;
  designDirection: string;
  colours: string[];
  sizes?: string[];
  estimatedPriceGBP?: number;
  mockupStatus: 'needed' | 'in-progress' | 'ready';
};

export const products: RadiantProduct[] = [
  {
    id: 'signature-tee',
    name: 'Radiant 34 Signature T-shirt',
    handle: 'radiant-34-signature-tshirt',
    category: 'apparel',
    launchPriority: 1,
    shortDescription: 'A premium everyday tee built around the core Radiant 34 identity.',
    spiritualMeaning: 'A reminder that those who look to God are radiant and free from shame.',
    designDirection: 'Small chest mark with a stronger Psalm 34:5 inspired back design using sun rays and clean typography.',
    colours: ['black', 'cream', 'off-white'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    estimatedPriceGBP: 35,
    mockupStatus: 'needed',
  },
  {
    id: 'psalm-hoodie',
    name: 'Psalm 34:5 Hoodie',
    handle: 'psalm-34-5-hoodie',
    category: 'apparel',
    launchPriority: 1,
    shortDescription: 'A heavyweight hoodie carrying the brand scripture in a premium way.',
    spiritualMeaning: 'Built around the promise of radiance and freedom from shame.',
    designDirection: 'Minimal front, bold but clean back artwork, warm radiant contrast.',
    colours: ['black', 'cream', 'charcoal'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    estimatedPriceGBP: 65,
    mockupStatus: 'needed',
  },
  {
    id: 'radiant-tank',
    name: 'Radiant 34 Tank Top',
    handle: 'radiant-34-tank-top',
    category: 'apparel',
    launchPriority: 2,
    shortDescription: 'A clean summer and training piece with subtle faith identity.',
    spiritualMeaning: 'Light, discipline, and identity carried daily.',
    designDirection: 'Simple front mark, optional small Psalm 34:5 reference.',
    colours: ['black', 'cream', 'white'],
    sizes: ['S', 'M', 'L', 'XL'],
    estimatedPriceGBP: 28,
    mockupStatus: 'needed',
  },
  {
    id: 'bracelet',
    name: 'Never Covered With Shame Bracelet',
    handle: 'never-covered-with-shame-bracelet',
    category: 'accessory',
    launchPriority: 1,
    shortDescription: 'A simple wearable reminder of Psalm 34:5.',
    spiritualMeaning: 'A daily reminder of identity, confidence, and freedom from shame.',
    designDirection: 'Engraved or debossed bracelet using the phrase Never Covered With Shame.',
    colours: ['black', 'gold', 'cream'],
    estimatedPriceGBP: 15,
    mockupStatus: 'needed',
  },
  {
    id: 'key-chain',
    name: 'Psalm 34:5 Key Chain',
    handle: 'psalm-34-5-key-chain',
    category: 'accessory',
    launchPriority: 2,
    shortDescription: 'A simple add-on item with the Radiant 34 mark and scripture reference.',
    spiritualMeaning: 'Carry the message daily in a small practical object.',
    designDirection: 'Radiant 34 mark on one side, Psalm 34:5 reference on the reverse.',
    colours: ['black', 'gold', 'clear acrylic'],
    estimatedPriceGBP: 8,
    mockupStatus: 'needed',
  },
  {
    id: 'water-bottle',
    name: 'Radiant Everyday Water Bottle',
    handle: 'radiant-everyday-water-bottle',
    category: 'everyday-carry',
    launchPriority: 2,
    shortDescription: 'A premium daily bottle with clean Radiant 34 branding.',
    spiritualMeaning: 'Everyday discipline with a message of light and identity.',
    designDirection: 'Minimal vertical logo or 34 mark, not overloaded.',
    colours: ['black', 'cream', 'brushed steel'],
    estimatedPriceGBP: 25,
    mockupStatus: 'needed',
  },
  {
    id: 'backpack',
    name: 'Radiant 34 Backpack',
    handle: 'radiant-34-backpack',
    category: 'everyday-carry',
    launchPriority: 3,
    shortDescription: 'A clean lifestyle backpack with subtle premium branding.',
    spiritualMeaning: 'Carry light into everyday places.',
    designDirection: 'Minimal external branding with possible hidden inner scripture detail.',
    colours: ['black', 'charcoal', 'sand'],
    estimatedPriceGBP: 55,
    mockupStatus: 'needed',
  },
];
