const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function badRequest(message, details = {}) {
  const error = new Error(message);
  error.status = 400;
  error.details = details;
  return error;
}

export function requireFields(payload, fields) {
  const missing = fields.filter((field) => !String(payload[field] || '').trim());
  if (missing.length) {
    throw badRequest('Missing required fields.', { missing });
  }
}

export function requireEmail(email) {
  if (!emailPattern.test(String(email || '').trim())) {
    throw badRequest('Please provide a valid email address.', { field: 'email' });
  }
}

export function cleanText(value, maxLength = 2000) {
  return String(value || '').trim().slice(0, maxLength);
}

export function normalizeContact(payload) {
  requireFields(payload, ['name', 'email', 'message']);
  requireEmail(payload.email);
  return {
    name: cleanText(payload.name, 160),
    email: cleanText(payload.email, 254).toLowerCase(),
    subject: cleanText(payload.subject, 200),
    message: cleanText(payload.message, 5000),
    source: cleanText(payload.source || 'website', 80)
  };
}

export function normalizeVolunteer(payload) {
  requireFields(payload, ['fullName', 'email', 'phone']);
  requireEmail(payload.email);
  return {
    fullName: cleanText(payload.fullName, 160),
    email: cleanText(payload.email, 254).toLowerCase(),
    phone: cleanText(payload.phone, 80),
    age: cleanText(payload.age, 20),
    occupation: cleanText(payload.occupation, 160),
    availability: cleanText(payload.availability, 100),
    skills: Array.isArray(payload.skills) ? payload.skills.map((skill) => cleanText(skill, 80)).filter(Boolean) : [],
    motivation: cleanText(payload.motivation, 3000),
    experience: cleanText(payload.experience, 3000),
    source: cleanText(payload.source || 'website', 80)
  };
}

export function normalizeNewsletter(payload) {
  requireFields(payload, ['email']);
  requireEmail(payload.email);
  return {
    email: cleanText(payload.email, 254).toLowerCase(),
    source: cleanText(payload.source || 'website', 80),
    subscribedAt: cleanText(payload.subscribedAt || new Date().toISOString(), 80)
  };
}

