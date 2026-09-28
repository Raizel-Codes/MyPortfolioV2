# Adrian S. Garcia — Portfolio

Personal developer portfolio for Adrian S. Garcia (Backend Engineer / Applied ML Builder), built with the Next.js App Router. Editorial layout, light/dark themes, and a handful of hand-rolled scroll/hover interactions — no animation library.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + [React 19](https://react.dev)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) for utilities, hand-written CSS in `globals.css` for the design system (tokens, components, animation)
- [lucide-react](https://lucide.dev) for icons

## Features

- **Light/dark theme** — system-preference by default, explicit toggle persisted to `localStorage`, applied pre-hydration via an inline head script (no flash of wrong theme).
- **WCAG-AA-checked contrast** in both themes, measured against the rendered page rather than assumed.
- **Scroll-driven interactions** — per-section reveal animations, a parallax hero portrait, magnetic buttons, a velocity-reactive tech ticker, and direction-aware section headings — all IntersectionObserver + `requestAnimationFrame`, no animation library.
- **View Transitions** on same-page navigation where the browser supports the API, with a plain smooth-scroll fallback elsewhere.
- **Rate-limited contact routing** (`/api/go/[channel]`) — the Gmail/Facebook links never put the actual address in the page HTML; requests are redirected server-side and capped per visitor.
- **Live GitHub contribution count**, fetched and cached server-side.
- Respects `prefers-reduced-motion` throughout.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Set these in `.env.local` for local development, and in your hosting provider's project settings for deployment (they are never read into client-side code or committed to the repo).

| Variable | Required | Purpose |
| --- | --- | --- |
| `CONTACT_EMAIL` | Yes | Address the "Email me" button opens a pre-filled Gmail draft to. |
| `FACEBOOK_URL` | Yes | Destination for the Facebook button. |
| `UPSTASH_REDIS_REST_URL` | Recommended | Shared storage for rate limiting and the like/view counters. |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | Paired with the URL above. |

Without the Upstash pair, rate limits and counters fall back to an in-memory store — fine for local dev, but it resets on every server restart and won't stay consistent across a serverless deployment's separate function instances. [Upstash](https://upstash.com) has a free tier that covers this comfortably.

## Scripts

```bash
npm run dev      # start the dev server (Turbopack)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Project structure

```
src/
  app/            # routes: page.tsx, layout.tsx, globals.css, api/*
  components/     # UI components (mostly client components for scroll/hover behavior)
  data/           # site copy and project data, kept separate from markup
  lib/            # server-side helpers (rate limiting, counters, GitHub fetch)
```

## Deploying

This is a standard Next.js app and deploys to [Vercel](https://vercel.com/new) with no extra configuration:

1. Push the repo to GitHub and import it in Vercel (or run `vercel` from the CLI).
2. Add `CONTACT_EMAIL` and `FACEBOOK_URL` — and, if you want working rate limits in production, the two Upstash variables — under **Project Settings → Environment Variables**. `.env.local` is gitignored and never reaches the deployment.
3. Deploy. The homepage is statically generated with a 1-hour revalidation; the `/api/*` routes run as serverless functions.

## License

Personal project — not licensed for reuse.
