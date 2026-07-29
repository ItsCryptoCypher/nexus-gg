"use client";

import { useEffect } from "react";

const INTERVAL_MS = 45_000;

async function ping() {
  try {
    await fetch("/api/presence/heartbeat", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
    });
  } catch {
    // Ignore network blips; next interval retries.
  }
}

/** Keeps profiles.nexus_last_seen_at fresh while the app tab is open. */
export function PresenceHeartbeat() {
  useEffect(() => {
    void ping();
    const id = window.setInterval(() => void ping(), INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") void ping();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
