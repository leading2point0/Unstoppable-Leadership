import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("scheduling an implementation step offers a calendar download", async ({ page }) => {
  await signUpNewParticipant(page);
  await startProgram(page);

  await page.getByRole("link", { name: "Start" }).first().click();
  await page.waitForURL(/\/module\/power-of-motivation$/);

  await page.getByRole("tab", { name: "Schedule" }).click();
  const dateInput = page.locator('input[type="date"]').first();
  await dateInput.fill("2026-08-10");
  await dateInput.blur();

  const downloadButton = page.getByRole("button", { name: "Download calendar file" }).first();
  await expect(downloadButton).toBeEnabled({ timeout: 10_000 });

  const [download] = await Promise.all([page.waitForEvent("download"), downloadButton.click()]);
  expect(download.suggestedFilename()).toMatch(/\.ics$/);
});
