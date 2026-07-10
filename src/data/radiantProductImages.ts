const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export type RadiantProductImageSet = {
  primary: string;
  hover?: string;
  gallery: string[];
};

const productImage = (filename: string) => asset(`/images/products/${filename}`);

export const radiantProductImages: Record<string, RadiantProductImageSet> = {
  'premium-unisex-crewneck-t-shirt-bella-canvas-3001-white': {
    primary: productImage('psalm-34-tee-primary.jpg'),
    hover: productImage('psalm-34-tee-hover.jpg'),
    gallery: [
      productImage('psalm-34-tee-primary.jpg'),
      productImage('psalm-34-tee-hover.jpg'),
      productImage('psalm-34-tee-detail.jpg'),
    ],
  },
  'psalm-34-tee': {
    primary: productImage('psalm-34-tee-primary.jpg'),
    hover: productImage('psalm-34-tee-hover.jpg'),
    gallery: [
      productImage('psalm-34-tee-primary.jpg'),
      productImage('psalm-34-tee-hover.jpg'),
      productImage('psalm-34-tee-detail.jpg'),
    ],
  },
  'those-who-look-tee-cream': {
    primary: productImage('psalm-34-tee-primary.jpg'),
    hover: productImage('psalm-34-tee-hover.jpg'),
    gallery: [
      productImage('psalm-34-tee-primary.jpg'),
      productImage('psalm-34-tee-hover.jpg'),
      productImage('psalm-34-tee-detail.jpg'),
    ],
  },
  'radiant-34-heavyweight-tee-cream': {
    primary: productImage('psalm-34-tee-primary.jpg'),
    hover: productImage('classic-tee-hover.jpg'),
    gallery: [
      productImage('psalm-34-tee-primary.jpg'),
      productImage('classic-tee-hover.jpg'),
      productImage('psalm-34-tee-detail.jpg'),
    ],
  },
  'classic-tee': {
    primary: productImage('classic-tee-primary.jpg'),
    hover: productImage('classic-tee-hover.jpg'),
    gallery: [
      productImage('classic-tee-primary.jpg'),
      productImage('classic-tee-hover.jpg'),
    ],
  },
  'those-who-look-tee-black': {
    primary: productImage('classic-tee-primary.jpg'),
    hover: productImage('classic-tee-hover.jpg'),
    gallery: [
      productImage('classic-tee-primary.jpg'),
      productImage('classic-tee-hover.jpg'),
    ],
  },
  'radiant-34-heavyweight-tee-black': {
    primary: productImage('classic-tee-primary.jpg'),
    hover: productImage('classic-tee-hover.jpg'),
    gallery: [
      productImage('classic-tee-primary.jpg'),
      productImage('classic-tee-hover.jpg'),
    ],
  },
  'radiant-hoodie': {
    primary: productImage('radiant-hoodie-primary.jpg'),
    hover: productImage('radiant-hoodie-hover.jpg'),
    gallery: [
      productImage('radiant-hoodie-primary.jpg'),
      productImage('radiant-hoodie-hover.jpg'),
      productImage('radiant-hoodie-detail.jpg'),
    ],
  },
  'radiant-34-hoodie-bone': {
    primary: productImage('radiant-hoodie-primary.jpg'),
    hover: productImage('radiant-hoodie-hover.jpg'),
    gallery: [
      productImage('radiant-hoodie-primary.jpg'),
      productImage('radiant-hoodie-hover.jpg'),
      productImage('radiant-hoodie-detail.jpg'),
    ],
  },
  'radiant-34-hoodie-black': {
    primary: productImage('radiant-hoodie-hover.jpg'),
    hover: productImage('radiant-hoodie-detail.jpg'),
    gallery: [
      productImage('radiant-hoodie-hover.jpg'),
      productImage('radiant-hoodie-detail.jpg'),
      productImage('radiant-hoodie-primary.jpg'),
    ],
  },
  'everyday-tank': {
    primary: productImage('everyday-tank-primary.jpg'),
    hover: productImage('everyday-tank-hover.jpg'),
    gallery: [
      productImage('everyday-tank-primary.jpg'),
      productImage('everyday-tank-hover.jpg'),
    ],
  },
  'psalm-34-tank-sand': {
    primary: productImage('everyday-tank-primary.jpg'),
    hover: productImage('everyday-tank-hover.jpg'),
    gallery: [
      productImage('everyday-tank-primary.jpg'),
      productImage('everyday-tank-hover.jpg'),
    ],
  },
  'psalm-34-tank-black': {
    primary: productImage('everyday-tank-primary.jpg'),
    hover: productImage('classic-tee-hover.jpg'),
    gallery: [
      productImage('everyday-tank-primary.jpg'),
      productImage('classic-tee-hover.jpg'),
    ],
  },
  'radiant-water-bottle': {
    primary: productImage('radiant-water-bottle-primary.jpg'),
    hover: productImage('radiant-water-bottle-hover.jpg'),
    gallery: [
      productImage('radiant-water-bottle-primary.jpg'),
      productImage('radiant-water-bottle-hover.jpg'),
    ],
  },
  'radiant-34-bottle-black': {
    primary: productImage('radiant-water-bottle-primary.jpg'),
    hover: productImage('radiant-water-bottle-hover.jpg'),
    gallery: [
      productImage('radiant-water-bottle-primary.jpg'),
      productImage('radiant-water-bottle-hover.jpg'),
    ],
  },
  'radiant-backpack': {
    primary: productImage('radiant-backpack-primary.jpg'),
    hover: productImage('radiant-backpack-hover.jpg'),
    gallery: [
      productImage('radiant-backpack-primary.jpg'),
      productImage('radiant-backpack-hover.jpg'),
    ],
  },
};

export const radiantProductImageFallbacks: Record<string, RadiantProductImageSet> = {
  hoodie: radiantProductImages['radiant-hoodie'],
  sweatshirt: radiantProductImages['radiant-hoodie'],
  tank: radiantProductImages['everyday-tank'],
  bottle: radiantProductImages['radiant-water-bottle'],
  drinkware: radiantProductImages['radiant-water-bottle'],
  backpack: radiantProductImages['radiant-backpack'],
  bag: radiantProductImages['radiant-backpack'],
  tote: radiantProductImages['radiant-backpack'],
  tee: radiantProductImages['psalm-34-tee'],
  't-shirt': radiantProductImages['psalm-34-tee'],
  tshirt: radiantProductImages['psalm-34-tee'],
  shirt: radiantProductImages['psalm-34-tee'],
};

export function getRadiantProductImages(product: {
  handle: string;
  title?: string;
  productType?: string;
  tags?: string[];
}) {
  const handleOverride = radiantProductImages[product.handle];
  if (handleOverride) return handleOverride;

  const signals = [
    product.productType,
    product.title,
    product.handle,
    ...(product.tags ?? []),
  ].join(' ').toLowerCase();

  const fallbackKey = Object.keys(radiantProductImageFallbacks)
    .find((key) => signals.includes(key));

  return fallbackKey ? radiantProductImageFallbacks[fallbackKey] : null;
}
