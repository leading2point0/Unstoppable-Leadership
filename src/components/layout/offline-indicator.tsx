"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a browser-only API; server render can't know connectivity.
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online !== false) return null;

  return (
    <div
      role="status"
      className="bg-caution-bg text-caution flex items-center justify-center gap-2 px-4 py-2 text-sm print:hidden"
    >
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      You&apos;re offline. Previously visited pages still work; changes will need a connection to
      save.
    </div>
  );
}
