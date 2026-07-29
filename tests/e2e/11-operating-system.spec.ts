import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("a participant can fill in and save their personal operating system", async ({ page }) => {
  await signUpNewParticipant(page);
  const programUrl = await startProgram(page);

  await page.goto(`${programUrl}/operating-system`);
  await expect(
    page.getByRole("heading", { name: "My Unstoppable Operating System" }),
  ).toBeVisible();

  await page
    .locator("textarea")
    .first()
    .fill("I am becoming someone who takes the next action before I feel ready.");
  await page.getByRole("button", { name: "Save", exact: true }).click();

  await page.reload();
  await expect(
    page.getByText("I am becoming someone who takes the next action before I feel ready."),
  ).toBeVisible();
});
