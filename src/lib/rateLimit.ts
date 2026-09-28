import { incr } from "@/lib/store";

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Fixed-window limiter: allows `limit` hits per `windowSeconds` for a given bucket + IP.
 * Returns whether this hit is allowed.
 */
export async function rateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const hits = await incr(`rl:${bucket}:${clientIp(request)}`, 1, windowSeconds);
    return hits <= limit;
  } catch {
    // If the store is down, fail closed for contact channels rather than open the floodgates.
    return false;
  }
}
