import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-guard";
import { exportUserData } from "@/repositories/user-export";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await exportUserData(user.id);
  await logAuditEvent({ actorId: user.id, action: "export.user_data" });

  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="unstoppable-action-lab-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
