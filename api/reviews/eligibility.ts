/// <reference types="node" />

import { getAuthenticatedCustomer } from '../auth/_supabaseAuth.js';
import { verifyPaidProductPurchase } from './_purchase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const customer = await getAuthenticatedCustomer(req);
  if (!customer) return res.status(401).json({ error: 'Please sign in to continue.' });

  const productHandle = String(req.query?.product_handle ?? '').trim();
  if (!productHandle) return res.status(400).json({ error: 'product_handle is required.' });

  try {
    const purchase = await verifyPaidProductPurchase(customer.email, productHandle);
    return res.status(200).json({
      eligible: purchase.verified,
      customer: { name: customer.name, email: customer.email },
    });
  } catch (error) {
    return res.status(503).json({
      error: error instanceof Error ? error.message : 'Purchase verification is temporarily unavailable.',
    });
  }
}
