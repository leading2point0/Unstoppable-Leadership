"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";
import {
  createQuote,
  createSource,
  deleteQuote,
  deleteSource,
  markSourceOutdated,
  setSourcePublic,
  unverifyQuote,
  updateSource,
  verifyQuote,
  verifySource,
} from "@/repositories/sources";
import {
  quoteRecordSchema,
  sourceRecordSchema,
  type QuoteRecordInput,
  type SourceRecordInput,
} from "@/schemas/source";
import { logAuditEvent } from "@/lib/audit";

function revalidateSources() {
  revalidatePath("/admin/sources");
  revalidatePath("/sources");
}

export async function createSourceAction(input: SourceRecordInput) {
  const user = await requireRole("admin");
  const parsed = sourceRecordSchema.parse(input);
  const source = await createSource(user.id, parsed);
  await logAuditEvent({
    actorId: user.id,
    action: "source.created",
    targetType: "source",
    targetId: source.id,
  });
  revalidateSources();
  return source;
}

export async function updateSourceAction(id: string, input: Partial<SourceRecordInput>) {
  const user = await requireRole("admin");
  const source = await updateSource(id, input);
  await logAuditEvent({
    actorId: user.id,
    action: "source.updated",
    targetType: "source",
    targetId: id,
  });
  revalidateSources();
  return source;
}

export async function verifySourceAction(id: string) {
  const user = await requireRole("admin");
  const source = await verifySource(id);
  await logAuditEvent({
    actorId: user.id,
    action: "source.verified",
    targetType: "source",
    targetId: id,
  });
  revalidateSources();
  return source;
}

export async function markSourceOutdatedAction(id: string, outdated: boolean) {
  const user = await requireRole("admin");
  const source = await markSourceOutdated(id, outdated);
  await logAuditEvent({
    actorId: user.id,
    action: "source.outdated_toggled",
    targetType: "source",
    targetId: id,
    details: { outdated },
  });
  revalidateSources();
  return source;
}

export async function setSourcePublicAction(id: string, isPublic: boolean) {
  const user = await requireRole("admin");
  const source = await setSourcePublic(id, isPublic);
  await logAuditEvent({
    actorId: user.id,
    action: "source.visibility_toggled",
    targetType: "source",
    targetId: id,
    details: { isPublic },
  });
  revalidateSources();
  return source;
}

export async function deleteSourceAction(id: string) {
  const user = await requireRole("admin");
  await deleteSource(id);
  await logAuditEvent({
    actorId: user.id,
    action: "source.deleted",
    targetType: "source",
    targetId: id,
  });
  revalidateSources();
}

export async function createQuoteAction(input: QuoteRecordInput) {
  const user = await requireRole("admin");
  const parsed = quoteRecordSchema.parse(input);
  const quote = await createQuote(parsed);
  await logAuditEvent({
    actorId: user.id,
    action: "quote.created",
    targetType: "quote",
    targetId: quote.id,
  });
  revalidateSources();
  return quote;
}

/** Only the owner may verify a quotation for public display. */
export async function verifyQuoteAction(id: string) {
  const user = await requireRole("owner");
  const quote = await verifyQuote(id, user.id);
  await logAuditEvent({
    actorId: user.id,
    action: "quote.verified",
    targetType: "quote",
    targetId: id,
  });
  revalidateSources();
  return quote;
}

export async function unverifyQuoteAction(id: string) {
  const user = await requireRole("owner");
  const quote = await unverifyQuote(id);
  await logAuditEvent({
    actorId: user.id,
    action: "quote.unverified",
    targetType: "quote",
    targetId: id,
  });
  revalidateSources();
  return quote;
}

export async function deleteQuoteAction(id: string) {
  const user = await requireRole("admin");
  await deleteQuote(id);
  await logAuditEvent({
    actorId: user.id,
    action: "quote.deleted",
    targetType: "quote",
    targetId: id,
  });
  revalidateSources();
}

/** Bulk import is owner-only: it can reintroduce previously-removed public sources. */
export async function importSourcesAction(sources: SourceRecordInput[]) {
  const user = await requireRole("owner");
  let imported = 0;
  for (const raw of sources) {
    const parsed = sourceRecordSchema.safeParse(raw);
    if (!parsed.success) continue;
    await createSource(user.id, parsed.data);
    imported += 1;
  }
  await logAuditEvent({
    actorId: user.id,
    action: "source.imported",
    details: { count: imported },
  });
  revalidateSources();
  return { imported, skipped: sources.length - imported };
}
