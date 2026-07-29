import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("a participant can record evidence of a completed implementation step", async ({ page }) => {
  await signUpNewParticipant(page);
  await startProgram(page);

  await page.getByRole("link", { name: "Start" }).first().click();
  await page.waitForURL(/\/module\/power-of-motivation$/);

  await page.getByRole("tab", { name: "Apply" }).click();
  await page.locator("details summary").first().click();
  await page.getByRole("button", { name: "+ Record evidence" }).click();
  await page
    .getByLabel("What did you actually do?")
    .fill("Read chapter 1 of my chosen skill's primary resource.");
  await page.getByRole("button", { name: "Save evidence" }).click();

  await expect(page.getByText("Completed").first()).toBeVisible({ timeout: 10_000 });
});
