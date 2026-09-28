"use client";

import { useEffect, useState } from "react";

export function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const current = words[wordIndex];
      if (deleting) {
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      } else {
        charIndex++;
        if (charIndex === words[wordIndex].length) {
          deleting = true;
          setText(words[wordIndex]);
          timer = setTimeout(tick, 1500);
          return;
        }
      }
      setText((deleting ? current : words[wordIndex]).slice(0, charIndex));
      timer = setTimeout(tick, deleting ? 35 : 65);
    }

    // hold the first role before the first delete
    timer = setTimeout(tick, 1500);
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true">
        {text}
        <span className="hero-cursor">|</span>
      </span>
    </>
  );
}
