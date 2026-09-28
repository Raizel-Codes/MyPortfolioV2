import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

// Contact links go through here so the address never sits in the page HTML for scrapers,
// and so a single visitor can't open the channel over and over.
const LIMIT = 5; // opens
const WINDOW_SECONDS = 10 * 60;

function destination(channel: string): string | null {
  if (channel === "email") {
    const to = process.env.CONTACT_EMAIL;
    if (!to) return null;
    const params = new URLSearchParams({ view: "cm", fs: "1", to, su: "Project inquiry from your portfolio" });
    return `https://mail.google.com/mail/?${params.toString()}`;
  }
  if (channel === "facebook") {
    return process.env.FACEBOOK_URL || null;
  }
  return null;
}

export async function GET(request: Request, ctx: RouteContext<"/api/go/[channel]">) {
  const { channel } = await ctx.params;
  const back = (status: string) => NextResponse.redirect(new URL(`/?contact=${status}#contact`, request.url), 303);

  const target = destination(channel);
  if (!target) return back("unavailable");

  const allowed = await rateLimit(request, `go:${channel}`, LIMIT, WINDOW_SECONDS);
  if (!allowed) return back("limited");

  return NextResponse.redirect(target, 302);
}
