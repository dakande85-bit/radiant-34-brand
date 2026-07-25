/// <reference types="node" />

import { getShopifyAccessToken, getShopifyApiVersion, getShopifyDomain } from '../_shopifyAuth.js';

export type PurchaseVerification = {
  verified: boolean;
  orderReference?: string;
};

const paidStatuses = new Set(['PAID', 'PARTIALLY_REFUNDED']);

const normalise = (value: unknown) => String(value ?? '').trim().toLowerCase();

export async function verifyPaidProductPurchase(
  customerEmail: string,
  productHandle: string,
): Promise<PurchaseVerification> {
  const email = normalise(customerEmail);
  const handle = normalise(productHandle);
  if (!email || !handle) return { verified: false };

  const { accessToken } = await getShopifyAccessToken();
  const domain = getShopifyDomain();
  const version = getShopifyApiVersion();
  const response = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({
      query: `
        query VerifiedReviewOrders($query: String!) {
          orders(first: 30, query: $query, sortKey: CREATED_AT, reverse: true) {
            nodes {
              id
              name
              email
              cancelledAt
              displayFinancialStatus
              lineItems(first: 100) {
                nodes {
                  title
                  product { handle }
                }
              }
            }
          }
        }
      `,
      variables: { query: `email:${email}` },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors?.length) {
    console.error('[Radiant 34 Reviews] Shopify order verification failed', {
      status: response.status,
      errors: payload.errors,
    });
    throw new Error('Purchase verification is temporarily unavailable.');
  }

  const orders = payload.data?.orders?.nodes ?? [];
  const matchingOrder = orders.find((order: any) => {
    if (order.cancelledAt) return false;
    if (!paidStatuses.has(String(order.displayFinancialStatus ?? '').toUpperCase())) return false;
    if (normalise(order.email) !== email) return false;
    return (order.lineItems?.nodes ?? []).some((line: any) => normalise(line.product?.handle) === handle);
  });

  return matchingOrder
    ? { verified: true, orderReference: String(matchingOrder.name ?? '') || undefined }
    : { verified: false };
}
