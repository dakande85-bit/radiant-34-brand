export const shopifyConfigured = true;
export const shopifyDomainLoaded = true;
export const shopifyTokenExists = false;

type ProxyResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost?: {
    subtotalAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
  lines?: {
    nodes: ShopifyCartLine[];
  };
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  cost?: {
    totalAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise?: {
    id: string;
    title: string;
    availableForSale?: boolean;
    selectedOptions?: Array<{ name: string; value: string }>;
    image?: { url: string; altText?: string | null } | null;
    price?: { amount: string; currencyCode: string };
    product?: {
      title: string;
      handle: string;
      featuredImage?: { url: string; altText?: string | null } | null;
    };
  };
};

const shopifyCheckoutDomain = 'xagsqp-u0.myshopify.com';
const cartIdKey = 'radiant34CartId';
const checkoutUrlKey = 'radiant34CheckoutUrl';
const cartVersionKey = 'radiant34CartVersion';
const cartVersion = '2';

export function normalizeCheckoutUrl(checkoutUrl: string) {
  try {
    const url = new URL(checkoutUrl);
    const hostedDomains = new Set(['radiant34.com', 'www.radiant34.com']);
    if (hostedDomains.has(url.hostname) && url.pathname.startsWith('/cart/')) {
      url.hostname = shopifyCheckoutDomain;
      url.protocol = 'https:';
    }
    if (url.hostname === shopifyCheckoutDomain && url.pathname.startsWith('/cart/')) {
      url.searchParams.set('_fd', '0');
      url.searchParams.set('pb', '0');
    }
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

export function clearRadiantCart() {
  localStorage.removeItem(cartIdKey);
  localStorage.removeItem(checkoutUrlKey);
}

export function ensureRadiantCartVersion() {
  if (localStorage.getItem(cartVersionKey) === cartVersion) return;
  clearRadiantCart();
  localStorage.setItem(cartVersionKey, cartVersion);
}

export function installClearRadiantCartDev() {
  if (!import.meta.env.DEV) return;
  (window as typeof window & { clearRadiantCart?: () => void }).clearRadiantCart = clearRadiantCart;
}

export function getStoredCartId() {
  return localStorage.getItem(cartIdKey);
}

function storeCart(cart: ShopifyCart) {
  const normalizedCart = {
    ...cart,
    checkoutUrl: normalizeCheckoutUrl(cart.checkoutUrl),
  };

  localStorage.setItem(cartIdKey, normalizedCart.id);
  localStorage.setItem(checkoutUrlKey, normalizedCart.checkoutUrl);
  return normalizedCart;
}

function isStaleCartError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return message.includes('cart') && (
    message.includes('does not exist')
    || message.includes('not found')
    || message.includes('invalid')
    || message.includes('expired')
  );
}

function userMessageForError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (isStaleCartError(error)) return 'Your cart expired. A new cart has been created.';
  if (lower.includes('unavailable') || lower.includes('does not exist') || lower.includes('merchandise')) {
    return 'This size is currently unavailable.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Connection problem. Please try again.';
  }
  return 'Checkout is temporarily unavailable. Please try again.';
}

function cartFields() {
  return `
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  `;
}

export function logShopifyDebug(message: string, detail?: unknown) {
  if (!import.meta.env.DEV) return;
  if (detail === undefined) {
    console.info(`[Radiant 34 Shopify] ${message}`);
    return;
  }
  console.info(`[Radiant 34 Shopify] ${message}`, detail);
}

export async function shopifyFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch('/api/shopify-storefront', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    console.error('[Radiant 34 Shopify] Network request failed', error);
    throw new Error('Connection problem. Please try again.', { cause: error });
  }

  const json = await response.json().catch(() => ({})) as ProxyResponse<T>;

  if (!response.ok) {
    console.error('[Radiant 34 Shopify] Proxy response failed', { status: response.status, json });
    throw new Error(json.errors?.[0]?.message ?? `Shopify proxy failed: ${response.status}`);
  }

  if (json.errors?.length) {
    console.error('[Radiant 34 Shopify] GraphQL errors', json.errors);
    throw new Error(json.errors.map((error) => error.message).filter(Boolean).join(' ') || 'Shopify GraphQL error.');
  }

  if (!json.data) {
    throw new Error('Shopify proxy returned no data.');
  }

  return json.data;
}

export async function createCart(variantId: string, quantity = 1, persist = true) {
  const mutation = `
    mutation CreateRadiantCart($variantId: ID!, $quantity: Int!) {
      cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $quantity }] }) {
        cart {
          ${cartFields()}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartCreate: {
      cart?: ShopifyCart;
      userErrors: Array<{ field?: string[]; message: string }>;
    };
  }>(mutation, { variantId, quantity });

  if (data.cartCreate.userErrors.length || !data.cartCreate.cart) {
    throw new Error(data.cartCreate.userErrors[0]?.message ?? 'Unable to create cart.');
  }

  const normalized = {
    ...data.cartCreate.cart,
    checkoutUrl: normalizeCheckoutUrl(data.cartCreate.cart.checkoutUrl),
  };
  return persist ? storeCart(normalized) : normalized;
}

export async function buyNowVariant(variantId: string, quantity = 1) {
  try {
    return await createCart(variantId, quantity, false);
  } catch (error) {
    console.error('[Radiant 34 Shopify] Buy Now failed', error);
    throw new Error(userMessageForError(error), { cause: error });
  }
}

export async function getCart(cartId: string) {
  const query = `
    query RadiantCart($cartId: ID!) {
      cart(id: $cartId) {
        ${cartFields()}
      }
    }
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(query, { cartId });
  if (!data.cart) {
    clearRadiantCart();
    throw new Error('Your cart expired. A new cart has been created.');
  }
  return storeCart(data.cart);
}

export async function addToExistingCart(cartId: string, variantId: string, quantity = 1) {
  const mutation = `
    mutation AddRadiantCartLine($cartId: ID!, $variantId: ID!, $quantity: Int!) {
      cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $variantId, quantity: $quantity }]) {
        cart {
          ${cartFields()}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart?: ShopifyCart;
      userErrors: Array<{ field?: string[]; message: string }>;
    };
  }>(mutation, { cartId, variantId, quantity });

  if (data.cartLinesAdd.userErrors.length || !data.cartLinesAdd.cart) {
    throw new Error(data.cartLinesAdd.userErrors[0]?.message ?? 'Unable to update cart.');
  }

  return storeCart(data.cartLinesAdd.cart);
}

export async function addVariantToCart(variantId: string, quantity = 1) {
  const cartId = getStoredCartId();

  try {
    if (!cartId) return await createCart(variantId, quantity);
    return await addToExistingCart(cartId, variantId, quantity);
  } catch (error) {
    console.error('[Radiant 34 Shopify] Add to cart failed', error);
    if (cartId && isStaleCartError(error)) {
      clearRadiantCart();
      try {
        return await createCart(variantId, quantity);
      } catch (retryError) {
        console.error('[Radiant 34 Shopify] Fresh cart retry failed', retryError);
        throw new Error(userMessageForError(retryError), { cause: retryError });
      }
    }
    throw new Error(userMessageForError(error), { cause: error });
  }
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const mutation = `
    mutation UpdateRadiantCartLine($cartId: ID!, $lineId: ID!, $quantity: Int!) {
      cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
        cart {
          ${cartFields()}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      cartLinesUpdate: {
        cart?: ShopifyCart;
        userErrors: Array<{ field?: string[]; message: string }>;
      };
    }>(mutation, { cartId, lineId, quantity });

    if (data.cartLinesUpdate.userErrors.length || !data.cartLinesUpdate.cart) {
      throw new Error(data.cartLinesUpdate.userErrors[0]?.message ?? 'Unable to update cart.');
    }

    return storeCart(data.cartLinesUpdate.cart);
  } catch (error) {
    console.error('[Radiant 34 Shopify] Cart line update failed', error);
    if (isStaleCartError(error)) clearRadiantCart();
    throw new Error(userMessageForError(error), { cause: error });
  }
}

export async function removeCartLine(cartId: string, lineId: string) {
  const mutation = `
    mutation RemoveRadiantCartLine($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ${cartFields()}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      cartLinesRemove: {
        cart?: ShopifyCart;
        userErrors: Array<{ field?: string[]; message: string }>;
      };
    }>(mutation, { cartId, lineIds: [lineId] });

    if (data.cartLinesRemove.userErrors.length || !data.cartLinesRemove.cart) {
      throw new Error(data.cartLinesRemove.userErrors[0]?.message ?? 'Unable to update cart.');
    }

    return storeCart(data.cartLinesRemove.cart);
  } catch (error) {
    console.error('[Radiant 34 Shopify] Cart line remove failed', error);
    if (isStaleCartError(error)) clearRadiantCart();
    throw new Error(userMessageForError(error), { cause: error });
  }
}
