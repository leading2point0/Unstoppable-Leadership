import { getAuthenticatedUser } from "@/lib/auth-guard";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { OfflineIndicator } from "@/components/layout/offline-indicator";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <div className="print:hidden">
        <SiteHeader user={user} />
        <OfflineIndicator />
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
