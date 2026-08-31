import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config } from '../config.js';

const initialState = {
  contacts: [],
  volunteers: [],
  newsletter: [],
  subscribers: [],
  content: null
};

let writeQueue = Promise.resolve();

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(config.dataFile), { recursive: true });
  try {
    await fs.access(config.dataFile);
  } catch {
    await fs.writeFile(config.dataFile, JSON.stringify(initialState, null, 2));
  }
}

async function readState() {
  await ensureStoreFile();
  const raw = await fs.readFile(config.dataFile, 'utf8');
  const parsed = raw ? JSON.parse(raw) : {};
  return { ...initialState, ...parsed };
}

async function updateState(mutator) {
  let result;
  writeQueue = writeQueue.catch(() => undefined).then(async () => {
    const state = await readState();
    result = await mutator(state);
    await fs.writeFile(config.dataFile, JSON.stringify(state, null, 2));
  });
  await writeQueue;
  return result;
}

export async function list(collection) {
  const state = await readState();
  return Array.isArray(state[collection]) ? state[collection] : [];
}

export async function insert(collection, payload) {
  return updateState((state) => {
    const item = {
      id: randomUUID(),
      ...payload,
      timestamp: payload.timestamp || payload.date || new Date().toISOString()
    };
    state[collection] = [...(Array.isArray(state[collection]) ? state[collection] : []), item];
    return item;
  });
}

export async function updateFirst(collection, predicate, changes) {
  return updateState((state) => {
    const items = Array.isArray(state[collection]) ? state[collection] : [];
    const index = items.findIndex(predicate);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...changes,
      updatedAt: new Date().toISOString()
    };
    state[collection] = items;
    return items[index];
  });
}

export async function upsertSubscriber(email, payload = {}) {
  return updateState((state) => {
    const normalizedEmail = email.toLowerCase();
    const current = Array.isArray(state.subscribers) ? state.subscribers : [];
    const existing = current.find((item) => item.email?.toLowerCase() === normalizedEmail);

    if (existing) {
      Object.assign(existing, payload, { email, updatedAt: new Date().toISOString() });
    } else {
      current.push({
        id: randomUUID(),
        email,
        ...payload,
        subscribedAt: payload.subscribedAt || new Date().toISOString()
      });
    }

    state.subscribers = current;
    return state.subscribers.find((item) => item.email?.toLowerCase() === normalizedEmail);
  });
}

export async function readDashboard() {
  const state = await readState();
  return {
    contacts: state.contacts || [],
    volunteers: state.volunteers || [],
    newsletter: state.newsletter || [],
    subscribers: state.subscribers || [],
  };
}

export async function readContent() {
  const state = await readState();
  return state.content;
}

export async function writeContent(content) {
  return updateState((state) => {
    state.content = {
      ...(state.content || {}),
      ...content,
      updatedAt: new Date().toISOString()
    };
    return state.content;
  });
}
