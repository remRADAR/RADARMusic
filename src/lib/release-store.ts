import { useEffect, useState } from "react";
import { release as defaultRelease, type Release } from "@/data/release";

const KEY = "radar.release.v1";

export function loadRelease(): Release {
  if (typeof window === "undefined") return defaultRelease;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultRelease;
    return { ...defaultRelease, ...(JSON.parse(raw) as Partial<Release>) };
  } catch {
    return defaultRelease;
  }
}

export function saveRelease(next: Release) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("radar:release-updated"));
}

export function resetRelease() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("radar:release-updated"));
}

/** SSR-safe: renders default data on the server, hydrates saved edits after mount. */
export function useRelease(): Release {
  const [current, setCurrent] = useState<Release>(defaultRelease);

  useEffect(() => {
    const sync = () => setCurrent(loadRelease());
    sync();
    window.addEventListener("radar:release-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("radar:release-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return current;
}
