"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, Link2 } from "lucide-react";

type Counts = { likes: number; views: number };

const LIKED_KEY = "portfolio-liked";
const VIEWED_KEY = "portfolio-viewed";

function readFlag(storage: "local" | "session", key: string) {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(storage: "local" | "session", key: string, on: boolean) {
  try {
    const s = storage === "local" ? localStorage : sessionStorage;
    if (on) s.setItem(key, "1");
    else s.removeItem(key);
  } catch {}
}

async function send(action: "view" | "like" | "unlike"): Promise<Counts | null> {
  const res = await fetch("/api/metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return res.ok ? res.json() : null;
}

export function HeroMetrics() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const alreadyViewed = readFlag("session", VIEWED_KEY);
    const request = alreadyViewed ? fetch("/api/metrics").then((r) => (r.ok ? r.json() : null)) : send("view");
    request
      .then((c: Counts | null) => {
        setLiked(readFlag("local", LIKED_KEY));
        if (c) setCounts(c);
        writeFlag("session", VIEWED_KEY, true);
      })
      .catch(() => {});
  }, []);

  async function toggleLike() {
    if (busy) return;
    const next = !liked;
    setBusy(true);
    setLiked(next);
    setCounts((c) => (c ? { ...c, likes: Math.max(0, c.likes + (next ? 1 : -1)) } : c));
    try {
      const c = await send(next ? "like" : "unlike");
      if (c) {
        setCounts(c);
        writeFlag("local", LIKED_KEY, next);
      } else {
        // rejected (e.g. rate limited): roll back
        setLiked(!next);
        setCounts((prev) => (prev ? { ...prev, likes: Math.max(0, prev.likes + (next ? -1 : 1)) } : prev));
      }
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const fmt = (n?: number) => (n === undefined ? "—" : n.toLocaleString());

  return (
    <div className="hero-metrics">
      <button
        type="button"
        className={`metric-btn${liked ? " is-on" : ""}`}
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label={liked ? "Remove your like" : "Like this portfolio"}
        title="Recommend"
      >
        <Heart size={17} aria-hidden="true" />
        <span className="metric-num">{fmt(counts?.likes)}</span>
      </button>

      <span className="metric-divider" aria-hidden="true" />

      <span className="metric-btn metric-static" title="Total views">
        <Eye size={17} aria-hidden="true" />
        <span className="metric-num">{fmt(counts?.views)}</span>
        <span className="sr-only">views</span>
      </span>

      <span className="metric-divider" aria-hidden="true" />

      <button type="button" className={`metric-btn${copied ? " is-on" : ""}`} onClick={share} title="Copy link">
        <Link2 size={17} aria-hidden="true" />
        <span aria-live="polite">{copied ? "Copied" : "Share"}</span>
      </button>
    </div>
  );
}
