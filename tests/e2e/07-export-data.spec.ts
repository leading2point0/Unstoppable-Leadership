import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("a participant can export their own data as JSON", async ({ page }) => {
  await signUpNewParticipant(page);
  await startProgram(page);

  await page.goto("/settings");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Download my data (JSON)" }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/unstoppable-action-lab-export-.*\.json$/);
  const streamPath = await download.path();
  expect(streamPath).toBeTruthy();
});
