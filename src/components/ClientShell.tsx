"use client";

import { useState, useCallback } from "react";
import { Preloader } from "@/components/Preloader";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  const handleComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <Preloader onComplete={handleComplete} />}
      <div
        className={`app-shell${loaded ? " is-loaded" : ""}`}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 500ms ease-out",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </>
  );
}
