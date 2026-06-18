"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// The active theme lives on <html class="dark"> (set pre-paint by the no-FOUC
// script in layout.tsx). We read it via useSyncExternalStore so the value is
// always correct on the client and never triggers a hydration mismatch.

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const el = document.documentElement;
    const next: Theme = el.classList.contains("dark") ? "light" : "dark";
    el.classList.toggle("dark", next === "dark");
    el.style.colorScheme = next;
    try {
      localStorage.setItem("zedas-theme", next);
    } catch {}
    emit();
  }, []);

  return { theme, toggle };
}
