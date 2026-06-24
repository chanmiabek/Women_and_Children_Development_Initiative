import { config } from '../config.js';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

function requirePaystack() {
  if (!config.paystack.secretKey) {
    const error = new Error('Paystack secret key is not configured.');
    error.status = 503;
    throw error;
  }
}

async function paystackFetch(path, options = {}) {
  requirePaystack();
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.paystack.secretKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok || data.status === false) {
    const error = new Error(data.message || 'Paystack request failed.');
    error.status = response.status || 502;
    error.details = data;
    throw error;
  }
  return data;
}

export async function initializePaystackPayment(payload) {
  return paystackFetch('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      amount: Math.round(Number(payload.amount) * 100),
      currency: payload.currency || 'KES',
      reference: payload.reference,
      callback_url: config.paystack.callbackUrl || undefined,
      metadata: {
        donorName: payload.donorName,
        program: payload.program,
        recurring: payload.recurring,
        source: 'wcdi-website'
      }
    })
  });
}

export async function verifyPaystackPayment(reference) {
  return paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET'
  });
}
