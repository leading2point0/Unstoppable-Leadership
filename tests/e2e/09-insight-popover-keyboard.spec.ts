import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("an insight popover opens via keyboard focus and closes with Escape", async ({ page }) => {
  await signUpNewParticipant(page);
  await startProgram(page);

  await page.getByRole("link", { name: "Start" }).first().click();
  await page.waitForURL(/\/module\/power-of-motivation$/);

  const trigger = page.getByRole("button", { name: /More information:/ }).first();
  await trigger.focus();
  await expect(trigger).toBeFocused();

  await page.keyboard.press("Enter");
  const popoverText = page.getByText("Progress is a motivational input, not just an output");
  await expect(popoverText).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(popoverText).not.toBeVisible();
});
