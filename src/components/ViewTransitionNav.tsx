"use client";

import { useEffect } from "react";
import { jumpToSection } from "@/lib/scrollJump";

// Delegated click handler for every same-page `#section` link (Navbar, MobileQuickNav,
// ExplorationGuide's bubble/panel, Footer, etc.) — one listener instead of touching each
// link component individually. Only intercepts the click (and upgrades it to a View
// Transitions crossfade) when the browser actually supports the API; otherwise it does
// nothing and the link falls through to the existing native hash-jump + `scroll-behavior:
// smooth` (globals.css), so unsupported browsers see zero change in behavior.
export function ViewTransitionNav() {
  useEffect(() => {
    if (!("startViewTransition" in document)) return;

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      jumpToSection(id);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
