// Tiny key/value counter store.
// Uses Upstash Redis (REST) when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set,
// otherwise an in-memory Map (fine for dev; resets on restart and is per server instance).

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);

type Entry = { value: number; expiresAt: number | null };
const memory = new Map<string, Entry>();

async function redis(commands: (string | number)[][]): Promise<{ result: unknown }[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  return res.json();
}

function readMemory(key: string): Entry | undefined {
  const entry = memory.get(key);
  if (entry && entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
    memory.delete(key);
    return undefined;
  }
  return entry;
}

/** Adds `by` to a counter. With `ttlSeconds`, the window starts on first increment. */
export async function incr(key: string, by = 1, ttlSeconds?: number): Promise<number> {
  if (useRedis) {
    const commands: (string | number)[][] = [["INCRBY", key, by]];
    if (ttlSeconds) commands.push(["EXPIRE", key, ttlSeconds, "NX"]);
    const [first] = await redis(commands);
    return Number(first.result);
  }

  const entry = readMemory(key);
  const value = (entry?.value ?? 0) + by;
  const expiresAt = entry?.expiresAt ?? (ttlSeconds ? Date.now() + ttlSeconds * 1000 : null);
  memory.set(key, { value, expiresAt });
  return value;
}

export async function get(keys: string[]): Promise<number[]> {
  if (useRedis) {
    const [first] = await redis([["MGET", ...keys]]);
    return (first.result as (string | null)[]).map((v) => Number(v ?? 0));
  }
  return keys.map((k) => readMemory(k)?.value ?? 0);
}
