"use client";

import { useEffect } from "react";

const ACTIVE_CACHE_NAMES = new Set(["amritvella-shell-v2"]);

export function PwaRegister() {
  useEffect(() => {
    if ("caches" in window) {
      caches
        .keys()
        .then((names) =>
          Promise.all(
            names
              .filter((name) => name.startsWith("amritvella-") && !ACTIVE_CACHE_NAMES.has(name))
              .map((name) => caches.delete(name))
          )
        )
        .catch(() => undefined);
    }

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((registration) => registration.update().catch(() => undefined))
        .catch(() => undefined);
    }
  }, []);

  return null;
}
