import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("a participant can add a standalone action with a next physical action", async ({ page }) => {
  await signUpNewParticipant(page);
  await startProgram(page);

  await page.goto("/actions");
  await page.getByPlaceholder("Title").fill("Block strategic planning time");
  await page
    .getByPlaceholder("Next physical action (be specific)")
    .fill("Put a 90-minute block on the calendar for Thursday 8am.");
  await page.getByRole("button", { name: "Add" }).click();

  await page.getByRole("tab", { name: "All / by module" }).click();
  await expect(page.getByText("Block strategic planning time")).toBeVisible();
  await expect(
    page.getByText("Put a 90-minute block on the calendar for Thursday 8am."),
  ).toBeVisible();
});
