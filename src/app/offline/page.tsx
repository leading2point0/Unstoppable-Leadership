import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">Offline</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">You&apos;re offline</h1>
      <p className="text-slate mt-2 max-w-md">
        This page hasn&apos;t been cached yet. Pages you&apos;ve already visited will keep working;
        reconnect to continue where you left off.
      </p>
    </div>
  );
}
