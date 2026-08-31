const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5000' : 'https://wcdi-api.onrender.com')).trim().replace(/\/$/, '');

const ENDPOINTS = {
  login: '/auth/login',
  contact: '/contact',
  volunteer: '/volunteers',
  newsletter: '/newsletter',
  dashboard: '/dashboard',
  content: '/content',
  uploadImage: '/uploads/image',
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

export async function fetchDashboard(token = '') {
  if (!hasBackend()) return null;
  return getJson(ENDPOINTS.dashboard, token);
}

export async function fetchContent() {
  if (!hasBackend()) return null;
  const response = await getJson(ENDPOINTS.content);
  return response.data || null;
}

export async function saveContent(content, token = '') {
  if (!hasBackend()) return content;
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.content}`, {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(content)
  });
  const data = await readResponseBody(response);
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data.data;
}

export async function uploadImage(file, token = '') {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.uploadImage}`, {
    method: 'POST',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    body: formData
  });
  const data = await readResponseBody(response);
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'Image upload failed.');
    error.status = response.status;
    throw error;
  }
  return data.data;
}

async function getJson(endpoint, token = '') {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  const data = await readResponseBody(response);
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

async function postJson(endpoint, payload) {
  if (!hasBackend()) {
    return { ok: false, skipped: true, data: null };
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error(`Cannot connect to the backend at ${API_BASE_URL}. Start the backend or check VITE_API_BASE_URL.`);
  }

  const data = await readResponseBody(response);

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return { ok: true, skipped: false, data };
}

async function readResponseBody(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  if (!text) return null;

  return {
    message: text.startsWith('<!DOCTYPE') || text.startsWith('<html')
      ? 'The server returned an HTML error page instead of JSON. Please check the backend deployment logs.'
      : text
  };
}
