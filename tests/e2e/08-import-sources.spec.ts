import { test, expect } from "@playwright/test";
import path from "node:path";

test.use({ storageState: path.join(__dirname, ".auth/owner.json") });

test("the owner can import a source library JSON file", async ({ page }) => {
  await page.goto("/admin/sources");
  await expect(page.getByRole("heading", { name: "Source & quote administration" })).toBeVisible();

  const uniqueTitle = `Imported Research Note ${Date.now()}`;
  const importPayload = JSON.stringify([
    {
      title: uniqueTitle,
      authorOrOrganization: "Example Research Group",
      sourceType: "article",
      pagesUsed: [],
    },
  ]);

  await page.getByRole("button", { name: "Import sources JSON" }).click();
  await page.locator('input[type="file"]').setInputFiles({
    name: "sources.json",
    mimeType: "application/json",
    buffer: Buffer.from(importPayload),
  });

  await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10_000 });
});
