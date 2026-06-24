import { config } from '../config.js';

function mpesaBaseUrl() {
  return config.mpesa.environment === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('');
}

function requireMpesa() {
  const missing = [
    ['MPESA_CONSUMER_KEY', config.mpesa.consumerKey],
    ['MPESA_CONSUMER_SECRET', config.mpesa.consumerSecret],
    ['MPESA_SHORTCODE', config.mpesa.shortcode],
    ['MPESA_PASSKEY', config.mpesa.passkey]
  ].filter(([, value]) => !value).map(([key]) => key);

  if (missing.length) {
    const error = new Error('M-Pesa credentials are not fully configured.');
    error.status = 503;
    error.details = { missing };
    throw error;
  }
}

async function getAccessToken() {
  requireMpesa();
  const credentials = Buffer.from(`${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`).toString('base64');
  const response = await fetch(`${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` }
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    const error = new Error(data.errorMessage || data.error_description || 'Unable to get M-Pesa access token.');
    error.status = response.status || 502;
    error.details = data;
    throw error;
  }
  return data.access_token;
}

export function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export async function initiateMpesaStkPush(payload) {
  const accessToken = await getAccessToken();
  const requestTimestamp = timestamp();
  const password = Buffer.from(`${config.mpesa.shortcode}${config.mpesa.passkey}${requestTimestamp}`).toString('base64');
  const phone = normalizePhone(payload.phone);
  const callbackUrl = config.mpesa.callbackUrl || `${config.publicBaseUrl}/payments/mpesa/callback`;

  const body = {
    BusinessShortCode: config.mpesa.shortcode,
    Password: password,
    Timestamp: requestTimestamp,
    TransactionType: config.mpesa.transactionType,
    Amount: Math.round(Number(payload.amount)),
    PartyA: phone,
    PartyB: config.mpesa.shortcode,
    PhoneNumber: phone,
    CallBackURL: callbackUrl,
    AccountReference: payload.reference || config.mpesa.accountReference,
    TransactionDesc: payload.description || config.mpesa.transactionDescription
  };

  const response = await fetch(`${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok || data.errorCode) {
    const error = new Error(data.errorMessage || data.ResponseDescription || 'M-Pesa STK Push failed.');
    error.status = response.status || 502;
    error.details = data;
    throw error;
  }
  return data;
}
