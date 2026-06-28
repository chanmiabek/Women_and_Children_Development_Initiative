const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://wcdi-api.onrender.com').trim().replace(/\/$/, '');

const ENDPOINTS = {
  login: '/auth/login',
  contact: '/contact',
  volunteer: '/volunteers',
  newsletter: '/newsletter',
  donation: '/donations',
  dashboard: '/dashboard',
  paystackVerify: '/payments/paystack/verify',
  mpesaStkPush: '/payments/mpesa/stk-push'
};

export function hasBackend() {
  return Boolean(API_BASE_URL);
}

export async function adminLogin(payload) {
  const response = await postJson(ENDPOINTS.login, payload);
  return response.data?.data;
}

export async function submitContact(payload) {
  return postJson(ENDPOINTS.contact, payload);
}

export async function submitVolunteer(payload) {
  return postJson(ENDPOINTS.volunteer, payload);
}

export async function submitNewsletter(payload) {
  return postJson(ENDPOINTS.newsletter, payload);
}

export async function submitDonation(payload) {
  return postJson(ENDPOINTS.donation, payload);
}

export async function verifyPaystackPayment(reference) {
  const response = await getJson(`${ENDPOINTS.paystackVerify}/${encodeURIComponent(reference)}`);
  return response;
}

export async function initiateMpesaPayment(payload) {
  const response = await postJson(ENDPOINTS.mpesaStkPush, payload);
  return response.data;
}

export async function fetchDashboard(token = '') {
  if (!hasBackend()) return null;
  return getJson(ENDPOINTS.dashboard, token);
}

async function getJson(endpoint, token = '') {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

async function postJson(endpoint, payload) {
  if (!hasBackend()) {
    return { ok: false, skipped: true, data: null };
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return { ok: true, skipped: false, data };
}
