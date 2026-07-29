"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** Pure, deterministic short hash — avoids calling Math.random() during render. */
function hashReference(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36).toUpperCase();
}

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const reference = error.digest ?? hashReference(`${error.name}:${error.message}`);

  useEffect(() => {
     
    console.error(`[ERR-${reference}]`, error);
  }, [error, reference]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-critical">Something went wrong</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">We hit an unexpected error</h1>
      <p className="mt-2 max-w-md text-slate">
        Nothing was lost. Try again, and if it keeps happening, share this reference with support.
      </p>
      <p className="mt-2 font-mono text-sm text-slate-muted">Reference: ERR-{reference}</p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
