import { getAuthenticatedUser } from "@/lib/auth-guard";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileNav } from "@/components/layout/mobile-nav";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <div className="print:hidden">
        <SiteHeader user={user} />
      </div>
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <div className="print:hidden">
        <SiteFooter />
      </div>
      {user && (
        <div className="print:hidden">
          <MobileNav />
        </div>
      )}
    </div>
  );
}
