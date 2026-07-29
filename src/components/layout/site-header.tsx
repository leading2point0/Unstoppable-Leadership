import Link from "next/link";
import { Target } from "lucide-react";
import type { AuthenticatedUser } from "@/lib/auth-guard";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth-actions";
import { roleAtLeast } from "@/types/domain";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/program", label: "Program" },
  { href: "/actions", label: "Actions" },
  { href: "/journal", label: "Journal" },
  { href: "/habits", label: "Habits" },
  { href: "/scorecard", label: "Scorecard" },
  { href: "/sources", label: "Sources" },
];

export function SiteHeader({ user }: { user: AuthenticatedUser | null }) {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold">
          <Target className="text-accent h-5 w-5" aria-hidden="true" />
          <span>Unstoppable Action Lab</span>
        </Link>

        {user ? (
          <NavLinks items={primaryNav} className="hidden items-center gap-6 md:flex" />
        ) : (
          <NavLinks
            items={[
              { href: "/about", label: "About" },
              { href: "/sources", label: "Sources" },
            ]}
            className="hidden items-center gap-6 md:flex"
          />
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              {roleAtLeast(user.role, "admin") && (
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/admin/sources">Admin</Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/settings">{user.name.split(" ")[0]}</Link>
              </Button>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="accent">
                <Link href="/program/new">Start My Program</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
