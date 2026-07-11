const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export type RadiantProductImageSet = {
  primary: string;
  hover?: string;
  gallery: string[];
};

const productImage = (filename: string) => asset(`/images/products/${filename}`);

const psalmTee: RadiantProductImageSet = {
  primary: productImage('psalm-34-tee-primary.jpg'),
  hover: productImage('psalm-34-tee-hover.jpg'),
  gallery: [
    productImage('psalm-34-tee-primary.jpg'),
    productImage('psalm-34-tee-hover.jpg'),
    productImage('psalm-34-tee-detail.jpg'),
  ],
};

const classicTee: RadiantProductImageSet = {
  primary: productImage('classic-tee-primary.jpg'),
  hover: productImage('classic-tee-hover.jpg'),
  gallery: [productImage('classic-tee-primary.jpg'), productImage('classic-tee-hover.jpg')],
};

const tank: RadiantProductImageSet = {
  primary: productImage('everyday-tank-primary.jpg'),
  hover: productImage('everyday-tank-hover.jpg'),
  gallery: [productImage('everyday-tank-primary.jpg'), productImage('everyday-tank-hover.jpg')],
};

const hoodie: RadiantProductImageSet = {
  primary: productImage('radiant-hoodie-primary.jpg'),
  hover: productImage('radiant-hoodie-hover.jpg'),
  gallery: [
    productImage('radiant-hoodie-primary.jpg'),
    productImage('radiant-hoodie-hover.jpg'),
    productImage('radiant-hoodie-detail.jpg'),
  ],
};

const bottle: RadiantProductImageSet = {
  primary: productImage('radiant-water-bottle-primary.jpg'),
  hover: productImage('radiant-water-bottle-hover.jpg'),
  gallery: [productImage('radiant-water-bottle-primary.jpg'), productImage('radiant-water-bottle-hover.jpg')],
};

const backpack: RadiantProductImageSet = {
  primary: productImage('radiant-backpack-primary.jpg'),
  hover: productImage('radiant-backpack-hover.jpg'),
  gallery: [productImage('radiant-backpack-primary.jpg'), productImage('radiant-backpack-hover.jpg')],
};

export const radiantProductImages: Record<string, RadiantProductImageSet> = {
  'premium-unisex-crewneck-t-shirt-bella-canvas-3001': psalmTee,
  'premium-unisex-crewneck-t-shirt-bella-canvas-3001-white': psalmTee,
  'psalm-34-tee': psalmTee,
  'premium-unisex-crewneck-t-shirt-bella-canvas-3002': classicTee,
  'radiant-classic-tee': classicTee,
  'premium-unisex-tank-top': tank,
  'radiant-tank': tank,
  'unisex-hoodie': hoodie,
  'radiant-hoodie': hoodie,
  'radiant-34-stainless-steal-water-bottle': bottle,
  'radiant-water-bottle': bottle,
  'minimalist-backpack': backpack,
  'radiant-backpack': backpack,
};

export const radiantProductImageFallbacks: Record<string, RadiantProductImageSet> = {
  hoodie,
  sweatshirt: hoodie,
  tank,
  bottle,
  backpack,
  tee: psalmTee,
  't-shirt': psalmTee,
  tshirt: psalmTee,
  shirt: psalmTee,
};

export function getRadiantProductImages(product: {
  handle: string;
  title?: string;
  productType?: string;
  tags?: string[];
}) {
  const handleOverride = radiantProductImages[product.handle];
  if (handleOverride) return handleOverride;

  const signals = [product.productType, product.title, product.handle, ...(product.tags ?? [])]
    .join(' ')
    .toLowerCase();
  const fallbackKey = Object.keys(radiantProductImageFallbacks).find((key) => signals.includes(key));
  return fallbackKey ? radiantProductImageFallbacks[fallbackKey] : null;
}
