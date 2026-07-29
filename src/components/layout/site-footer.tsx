import Link from "next/link";
import { ALL_IP_NOTICES } from "@/content/disclaimers";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted pb-20 pt-10 md:pb-10">
      <div className="container-page space-y-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <p className="font-serif text-base font-semibold">Unstoppable Action Lab</p>
            <p className="mt-1 text-sm text-slate">An Independent Personal Development Study and Action Program</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/sources" className="hover:text-foreground">Sources &amp; Attribution</Link>
            <Link href="/settings" className="hover:text-foreground">Privacy &amp; Data</Link>
          </nav>
        </div>
        <div className="space-y-2 border-t border-border pt-6 text-xs leading-relaxed text-slate-muted">
          {ALL_IP_NOTICES.map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
        </div>
        <p className="text-xs text-slate-muted">
          © {new Date().getFullYear()} Unstoppable Action Lab. Original software, exercises, and commentary.
        </p>
      </div>
    </footer>
  );
}
