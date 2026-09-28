import { NextResponse } from "next/server";
import { get, incr } from "@/lib/store";
import { rateLimit } from "@/lib/rateLimit";

const KEYS = ["metrics:likes", "metrics:views"];

async function counts() {
  const [likes, views] = await get(KEYS);
  return { likes: Math.max(0, likes), views };
}

export async function GET() {
  try {
    return NextResponse.json(await counts(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Counts unavailable." }, { status: 503 });
  }
}

// body: { action: "view" | "like" | "unlike" }
export async function POST(request: Request) {
  let action: unknown;
  try {
    ({ action } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    if (action === "view") {
      // one view per visitor per 30 minutes
      if (await rateLimit(request, "view", 1, 30 * 60)) await incr(KEYS[1]);
    } else if (action === "like" || action === "unlike") {
      if (!(await rateLimit(request, "like", 6, 60 * 60))) {
        return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
      }
      await incr(KEYS[0], action === "like" ? 1 : -1);
    } else {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
    return NextResponse.json(await counts());
  } catch {
    return NextResponse.json({ error: "Counts unavailable." }, { status: 503 });
  }
}
