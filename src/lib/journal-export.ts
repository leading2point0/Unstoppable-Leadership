import type { JournalEntry } from "@/repositories/journal";

export function journalEntriesToMarkdown(entries: JournalEntry[]): string {
  const lines: string[] = ["# Journal export", ""];
  for (const entry of entries) {
    lines.push(`## ${entry.entryDate}${entry.moduleSlug ? ` — ${entry.moduleSlug}` : ""}`);
    if (entry.mode === "ruthless-review") lines.push("_Ruthless Review_");
    if (entry.wins) lines.push(`**Wins:** ${entry.wins}`);
    if (entry.resistance) lines.push(`**Resistance:** ${entry.resistance}`);
    if (entry.lessons) lines.push(`**Lessons:** ${entry.lessons}`);
    if (entry.decisions) lines.push(`**Decisions:** ${entry.decisions}`);
    if (entry.followUpAction) lines.push(`**Follow-up action:** ${entry.followUpAction}`);
    if (entry.body) lines.push("", entry.body);
    if (entry.tags.length > 0) lines.push("", `Tags: ${entry.tags.join(", ")}`);
    lines.push("", "---", "");
  }
  return lines.join("\n");
}

export function journalEntriesToHtml(entries: JournalEntry[]): string {
  const body = entries
    .map(
      (entry) => `
      <article style="margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid #ddd;">
        <h2>${entry.entryDate}${entry.moduleSlug ? ` — ${escapeHtml(entry.moduleSlug)}` : ""}</h2>
        ${entry.mode === "ruthless-review" ? "<p><em>Ruthless Review</em></p>" : ""}
        ${entry.wins ? `<p><strong>Wins:</strong> ${escapeHtml(entry.wins)}</p>` : ""}
        ${entry.resistance ? `<p><strong>Resistance:</strong> ${escapeHtml(entry.resistance)}</p>` : ""}
        ${entry.lessons ? `<p><strong>Lessons:</strong> ${escapeHtml(entry.lessons)}</p>` : ""}
        ${entry.decisions ? `<p><strong>Decisions:</strong> ${escapeHtml(entry.decisions)}</p>` : ""}
        ${entry.followUpAction ? `<p><strong>Follow-up action:</strong> ${escapeHtml(entry.followUpAction)}</p>` : ""}
        ${entry.body ? `<p>${escapeHtml(entry.body).replace(/\n/g, "<br/>")}</p>` : ""}
      </article>`,
    )
    .join("\n");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Journal export</title>
  <style>body{font-family:Georgia,serif;max-width:42rem;margin:2rem auto;color:#1a1f2b;}</style>
  </head><body><h1>Journal export</h1>${body}</body></html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
