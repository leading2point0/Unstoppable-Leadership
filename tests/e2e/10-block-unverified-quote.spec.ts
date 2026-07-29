import { test, expect } from "@playwright/test";
import path from "node:path";

test.use({ storageState: path.join(__dirname, ".auth/owner.json") });

test("an unverified quote never appears on the public Sources page", async ({ page, context }) => {
  const uniqueText = `This is an unverified test quotation ${Date.now()}.`;

  await page.goto("/admin/sources");
  await page.getByPlaceholder("Quote text").fill(uniqueText);
  await page.getByPlaceholder("Author", { exact: true }).fill("Test Author");
  await page.getByPlaceholder("Work title").fill("Test Work");
  await page
    .getByPlaceholder("Original commentary connecting this quote to an exercise or lesson")
    .fill("This connects to the courage exercise in module three.");
  await page.getByPlaceholder("Educational purpose").fill("Illustrates the concept for learners.");
  await page.getByRole("button", { name: "Add quotation (unverified)" }).click();

  // Quotes list newest first, so the one just created is always the first match.
  await expect(page.getByText(uniqueText)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("Unverified — hidden").first()).toBeVisible();
  await expect(
    page
      .getByText(
        "Citation incomplete. Verify this quotation against a lawful copy before publication.",
      )
      .first(),
  ).toBeVisible();

  // The public Sources page, viewed with no session at all, must not show it.
  const anonymousPage = await context
    .browser()!
    .newContext()
    .then((c) => c.newPage());
  await anonymousPage.goto("/sources");
  await expect(anonymousPage.getByText(uniqueText)).toHaveCount(0);
  await anonymousPage.close();
});
