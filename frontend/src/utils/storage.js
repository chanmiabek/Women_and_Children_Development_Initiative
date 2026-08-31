export function readJson(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    return Array.isArray(fallback) ? (Array.isArray(value) ? value : fallback) : value;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function saveSubmission(type, data) {
  const key = `${type}_submissions`;
  const localId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  writeJson(key, [...readJson(key), { ...data, localId, timestamp: new Date().toISOString() }]);
}

export function removeSubmission(type, submission) {
  const key = `${type}_submissions`;
  writeJson(key, readJson(key).filter((item) => item.localId !== submission.localId));
}

export function normalizeSubscriberEmail(item) {
  return typeof item === 'string' ? item : item?.email;
}

export function saveSubscriber(email) {
  const subscribers = readJson('newsletter_subscribers');
  const known = subscribers.map(normalizeSubscriberEmail).filter(Boolean).map((value) => value.toLowerCase());
  if (!known.includes(email.toLowerCase())) {
    writeJson('newsletter_subscribers', [...subscribers, email]);
  }
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleString() : 'Not recorded';
}
