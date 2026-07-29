import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">404</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">This page doesn&apos;t exist</h1>
      <p className="text-slate mt-2 max-w-md">
        The page you&apos;re looking for may have moved, or the link may be out of date.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard">Go to your dashboard</Link>
      </Button>
    </div>
  );
}
