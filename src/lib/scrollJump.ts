type DocumentWithViewTransitions = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

// "Go to this section," used by the intercepted nav-link clicks (ViewTransitionNav.tsx).
// Runs the jump inside the View Transitions API when the browser supports it and motion
// isn't reduced (crossfades instead of hard-cutting); otherwise falls back to the site's
// normal `scroll-behavior: smooth` (globals.css) with a plain scrollIntoView.
export function jumpToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  history.pushState(null, "", `#${id}`);

  const doc = document as DocumentWithViewTransitions;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (doc.startViewTransition && !reduced) {
    doc.startViewTransition(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
