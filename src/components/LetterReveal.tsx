"use client";

import { useState, type ReactNode } from "react";
import { Eye, ArrowLeft, Sparkle } from "lucide-react";

const REDACTION_WIDTHS = [100, 72, 88, 55];

// Covers `children` with a redacted-profile card until opened. The real content
// stays in the DOM the whole time (never display:none) so assistive tech and
// crawlers reach it directly — only sighted pointer/keyboard users see the cover.
export function LetterReveal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  return (
    <div className={`letter${open ? " is-open" : ""}`}>
      <div className="letter-cover" aria-hidden={open}>
        <div className="letter-orb letter-orb-a" aria-hidden="true" />
        <div className="letter-orb letter-orb-b" aria-hidden="true" />

        <span className="letter-stamp">
          <Sparkle size={11} aria-hidden="true" className="letter-stamp-icon" />
          Profile
        </span>

        <div className="letter-face">
          <div className="letter-redactions" aria-hidden="true">
            {REDACTION_WIDTHS.map((w, i) => (
              <span
                className="letter-bar"
                style={{ width: `${w}%`, ["--i" as string]: i }}
                key={i}
              />
            ))}
          </div>

          <p className="letter-line">Details about me — tap to see.</p>

          <button
            type="button"
            className={`letter-seal${pulsing ? " is-pulsing" : ""}`}
            onClick={() => {
              setOpen(true);
              setPulsing(true);
            }}
            onAnimationEnd={() => setPulsing(false)}
            aria-label="See details about me"
            tabIndex={open ? -1 : undefined}
          >
            <span className="letter-seal-ring" aria-hidden="true" />
            <Eye size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="letter-content">
        <div className="letter-paper">
          {open && (
            <button type="button" className="letter-close" onClick={() => setOpen(false)}>
              <ArrowLeft size={14} aria-hidden="true" />
              Back to the profile card
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}