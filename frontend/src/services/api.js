const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const ENDPOINTS = {
  contact: '/contact',
  volunteer: '/volunteers',
  newsletter: '/newsletter',
  donation: '/donations',
  dashboard: '/dashboard'
};

export function hasBackend() {
  return Boolean(API_BASE_URL);
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

export async function fetchDashboard() {
  if (!hasBackend()) return null;
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.dashboard}`, {
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`Dashboard request failed with status ${response.status}`);
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
