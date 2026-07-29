import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-guard";
import { listAllQuotesForAdmin, listAllSourcesForAdmin } from "@/repositories/sources";
import { AdminSourceManager } from "@/components/sources/admin-source-manager";

export const metadata: Metadata = { title: "Source & quote administration" };

export default async function AdminSourcesPage() {
  const user = await requireRole("admin");
  const [sources, quotes] = await Promise.all([listAllSourcesForAdmin(), listAllQuotesForAdmin()]);

  return (
    <div className="container-page py-10">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
        Owner-only administration
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Source &amp; quote administration</h1>
      <p className="bg-caution-bg text-caution mt-2 max-w-2xl rounded-md p-3 text-sm">
        This screen is protected only by role-based access control within the application, not by a
        separate hardened admin surface. Treat it as a trusted-operator tool, not a public-facing
        feature.
      </p>

      <div className="mt-8">
        <AdminSourceManager sources={sources} quotes={quotes} role={user.role} />
      </div>
    </div>
  );
}
