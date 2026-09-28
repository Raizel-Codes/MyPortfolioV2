"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

function currentTheme(): "light" | "dark" {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  // React's dev remount clears the attribute the inline script set; re-apply it. No-op in production.
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) document.documentElement.setAttribute("data-theme", saved);
    } catch {}
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Switch between light and dark theme">
      <Moon className="icon-moon" size={18} aria-hidden="true" />
      <Sun className="icon-sun" size={18} aria-hidden="true" />
    </button>
  );
}
