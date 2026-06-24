import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config } from '../config.js';

const initialState = {
  contacts: [],
  volunteers: [],
  newsletter: [],
  subscribers: [],
  donations: [],
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

async function writeState(nextState) {
  writeQueue = writeQueue.then(async () => {
    await ensureStoreFile();
    await fs.writeFile(config.dataFile, JSON.stringify(nextState, null, 2));
  });
  return writeQueue;
}

export async function list(collection) {
  const state = await readState();
  return Array.isArray(state[collection]) ? state[collection] : [];
}

export async function insert(collection, payload) {
  const state = await readState();
  const item = {
    id: randomUUID(),
    ...payload,
    timestamp: payload.timestamp || payload.date || new Date().toISOString()
  };
  state[collection] = [...(Array.isArray(state[collection]) ? state[collection] : []), item];
  await writeState(state);
  return item;
}

export async function updateFirst(collection, predicate, changes) {
  const state = await readState();
  const items = Array.isArray(state[collection]) ? state[collection] : [];
  const index = items.findIndex(predicate);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };
  state[collection] = items;
  await writeState(state);
  return items[index];
}

export async function upsertSubscriber(email, payload = {}) {
  const state = await readState();
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
  await writeState(state);
  return state.subscribers.find((item) => item.email?.toLowerCase() === normalizedEmail);
}

export async function readDashboard() {
  const state = await readState();
  return {
    contacts: state.contacts || [],
    volunteers: state.volunteers || [],
    newsletter: state.newsletter || [],
    subscribers: state.subscribers || [],
    donations: state.donations || []
  };
}

export async function readContent() {
  const state = await readState();
  return state.content;
}

export async function writeContent(content) {
  const state = await readState();
  state.content = {
    ...content,
    updatedAt: new Date().toISOString()
  };
  await writeState(state);
  return state.content;
}
