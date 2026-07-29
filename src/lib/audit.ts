import { db } from "@/db";
import { auditEvents } from "@/db/schema";

interface LogAuditEventInput {
  actorId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
}

/**
 * Records an administrative or security-relevant event. Never pass
 * passwords, tokens, or full journal text in `details`.
 */
export async function logAuditEvent(input: LogAuditEventInput): Promise<void> {
  try {
    await db.insert(auditEvents).values({
      actorId: input.actorId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      details: input.details,
      ipAddress: input.ipAddress ?? null,
    });
  } catch (error) {
    // Audit logging must never break the primary request flow.
     
    console.error("[audit] failed to record event", input.action, error);
  }
}
