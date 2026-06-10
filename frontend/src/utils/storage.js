export function readJson(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function saveSubmission(type, data) {
  const key = `${type}_submissions`;
  writeJson(key, [...readJson(key), { ...data, timestamp: new Date().toISOString() }]);
}

export function normalizeSubscriberEmail(item) {
  return typeof item === 'string' ? item : item?.email;
}

export function saveSubscriber(email) {
  const subscribers = readJson('newsletter_subscribers');
  const known = subscribers.map(normalizeSubscriberEmail).filter(Boolean);
  if (!known.includes(email)) {
    writeJson('newsletter_subscribers', [...subscribers, email]);
  }
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleString() : 'Not recorded';
}
