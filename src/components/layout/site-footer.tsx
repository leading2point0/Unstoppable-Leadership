import Link from "next/link";
import { ALL_IP_NOTICES } from "@/content/disclaimers";

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface-muted border-t pt-10 pb-20 md:pb-10">
      <div className="container-page space-y-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <p className="font-serif text-base font-semibold">Unstoppable Action Lab</p>
            <p className="text-slate mt-1 text-sm">
              An Independent Personal Development Study and Action Program
            </p>
          </div>
          <nav aria-label="Footer" className="text-slate flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/sources" className="hover:text-foreground">
              Sources &amp; Attribution
            </Link>
            <Link href="/settings" className="hover:text-foreground">
              Privacy &amp; Data
            </Link>
          </nav>
        </div>
        <div className="border-border text-slate-muted space-y-2 border-t pt-6 text-xs leading-relaxed">
          {ALL_IP_NOTICES.map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
        </div>
        <p className="text-slate-muted text-xs">
          © {new Date().getFullYear()} Unstoppable Action Lab. Original software, exercises, and
          commentary.
        </p>
      </div>
    </footer>
  );
}
