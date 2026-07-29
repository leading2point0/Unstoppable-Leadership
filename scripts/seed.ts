/**
 * Seeds baseline content: the module registry and the single verified
 * bibliographic record for the source book. Never seeds quotations —
 * quotes must be entered and verified manually by the site owner (see
 * docs/content-governance.md).
 */
import { eq } from "drizzle-orm";
import { db, rawSql } from "@/db";
import { modules, sourceRecords } from "@/db/schema";
import { PROGRAM_MODULES } from "@/content/modules";

async function seedModules() {
  for (const module of PROGRAM_MODULES) {
    await db
      .insert(modules)
      .values({
        slug: module.slug,
        weekNumber: module.week,
        title: module.title,
        contentVersion: module.contentVersion,
      })
      .onConflictDoUpdate({
        target: modules.slug,
        set: { weekNumber: module.week, title: module.title, contentVersion: module.contentVersion },
      });
  }
  console.log(`Seeded ${PROGRAM_MODULES.length} module registry entries.`);
}

async function seedSourceBibliography() {
  const isbn = "9781722527549";
  const [existing] = await db.select().from(sourceRecords).where(eq(sourceRecords.isbn, isbn)).limit(1);
  if (existing) {
    console.log("Book bibliographic record already seeded.");
    return;
  }

  await db.insert(sourceRecords).values({
    title: "Unstoppable: Motivation Secrets You Need to Develop Courage, Confidence and a Positive Mental Attitude",
    authorOrOrganization: "Brian Tracy",
    publisher: "G&D Media / Gildan Media",
    publicationDate: "2023-01-01",
    sourceType: "book",
    isbn,
    edition: "First edition (verify against your specific print, ebook, or audiobook edition before citing page numbers)",
    notes:
      "Bibliographic details verified by the site owner. Length: 196 pages. This record exists for attribution purposes; " +
      "the application does not reproduce chapter text. Any direct quotation must be added and verified separately " +
      "through the source/quote administration screen before it can be displayed.",
    verified: true,
    isPublic: true,
    isOutdated: false,
  });
  console.log("Seeded verified book bibliographic record.");
}

async function main() {
  await seedModules();
  await seedSourceBibliography();
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await rawSql.end({ timeout: 5 });
  });
