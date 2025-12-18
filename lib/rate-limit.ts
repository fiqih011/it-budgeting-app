type RateLimitRecord = {
  count: number;
  lastRequest: number;
};

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 menit
const MAX_REQUESTS = 60; // 60 request / menit / IP

const store = new Map<string, RateLimitRecord>();

export function rateLimit(key: string) {
  const now = Date.now();
  const record = store.get(key);

  if (!record) {
    store.set(key, { count: 1, lastRequest: now });
    return { allowed: true };
  }

  // Reset window
  if (now - record.lastRequest > RATE_LIMIT_WINDOW) {
    store.set(key, { count: 1, lastRequest: now });
    return { allowed: true };
  }

  // Exceed limit
  if (record.count >= MAX_REQUESTS) {
    return { allowed: false };
  }

  record.count += 1;
  record.lastRequest = now;
  store.set(key, record);

  return { allowed: true };
}
