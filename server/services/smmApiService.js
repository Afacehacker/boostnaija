const axios = require('axios');

/**
 * Makes a POST request to a given SMM API endpoint.
 * @param {string} apiUrl  - The API base URL
 * @param {string} apiKey  - The API key
 * @param {string} action  - The action (e.g. 'services', 'add', 'status')
 * @param {object} params  - Additional payload params
 */
async function makeRequest(apiUrl, apiKey, action, params = {}) {
  const payload = new URLSearchParams();
  payload.append('key', apiKey);
  payload.append('action', action);
  Object.keys(params).forEach((key) => payload.append(key, params[key]));

  const response = await axios.post(apiUrl, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
  });

  if (response.data && response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data;
}

// ─── Provider configs ─────────────────────────────────────────────────────────

const PROVIDERS = {
  smm1: {
    name: 'smm1',
    getUrl: () => process.env.SMM_API_URL || 'https://smm.com.ng/api/v2',
    getKey: () => process.env.SMM_API_KEY,
  },
  smm2: {
    name: 'smm2',
    getUrl: () => process.env.SMM_API2_URL || 'https://reallysimplesocial.com/api/v2',
    getKey: () => process.env.SMM_API2_KEY,
  },
};

// ─── Per-provider helpers ─────────────────────────────────────────────────────

async function getServicesFrom(providerKey) {
  const p = PROVIDERS[providerKey];
  if (!p.getKey()) {
    console.warn(`[SMM] API key for ${providerKey} is not set — skipping.`);
    return [];
  }
  try {
    const data = await makeRequest(p.getUrl(), p.getKey(), 'services');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`[SMM] Failed to fetch services from ${providerKey}:`, err.message);
    return [];
  }
}

async function addOrderTo(providerKey, data) {
  const p = PROVIDERS[providerKey];
  return await makeRequest(p.getUrl(), p.getKey(), 'add', data);
}

async function getStatusFrom(providerKey, orderId) {
  const p = PROVIDERS[providerKey];
  return await makeRequest(p.getUrl(), p.getKey(), 'status', { order: orderId });
}

async function getBalanceFrom(providerKey) {
  const p = PROVIDERS[providerKey];
  return await makeRequest(p.getUrl(), p.getKey(), 'balance');
}

// ─── Multi-provider aggregation ───────────────────────────────────────────────

/**
 * Fetches services from BOTH providers concurrently and returns a merged list.
 * Each item has: { name, category, rate, min, max, provider, providerServiceId }
 * Where `rate` is the cheapest available rate across providers for that service.
 *
 * Matching is done by normalised service name so that identical services from
 * both panels are de-duplicated and the cheapest provider is selected.
 */
async function getServicesFromBoth() {
  const [list1, list2] = await Promise.all([
    getServicesFrom('smm1'),
    getServicesFrom('smm2'),
  ]);

  // Normalise helper
  const norm = (str) => str.toLowerCase().replace(/\s+/g, ' ').trim();

  // Build a map keyed by normalised name → best entry
  const map = new Map();

  const process = (list, providerKey) => {
    for (const s of list) {
      if (!s.service || !s.name) continue;
      const key = norm(s.name);
      const rate = parseFloat(s.rate) || Infinity;
      const existing = map.get(key);

      if (!existing || rate < existing.rate) {
        map.set(key, {
          name: s.name,
          category: s.category || 'General',
          rate,
          min: parseInt(s.min) || 0,
          max: parseInt(s.max) || 0,
          provider: providerKey,
          providerServiceId: s.service.toString(),
        });
      }
    }
  };

  process(list1, 'smm1');
  process(list2, 'smm2');

  return Array.from(map.values());
}

// ─── Legacy single-provider helpers (kept for backward compat) ────────────────

const smmApiService = {
  /** @deprecated Use getServicesFromBoth() for dual-provider logic */
  async getServices() {
    return await getServicesFrom('smm1');
  },

  async getBalance() {
    return await getBalanceFrom('smm1');
  },

  /** Routes the order to the correct provider based on stored provider tag */
  async addOrder(data, providerKey = 'smm1') {
    return await addOrderTo(providerKey, data);
  },

  async getStatus(orderId, providerKey = 'smm1') {
    return await getStatusFrom(providerKey, orderId);
  },

  // ── Multi-provider public API ──
  getServicesFromBoth,
  addOrderTo,
  getStatusFrom,
  getBalanceFrom,
  PROVIDERS,
};

module.exports = smmApiService;
