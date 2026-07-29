import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("a participant can work through and complete Module 1", async ({ page }) => {
  await signUpNewParticipant(page);
  const programUrl = await startProgram(page);

  await page.getByRole("link", { name: "Start" }).first().click();
  await page.waitForURL(/\/module\/power-of-motivation$/);

  // Learn
  await page.getByRole("button", { name: "I've reviewed the material" }).click();
  await expect(page.getByText("Marked as reviewed")).toBeVisible();
  await page.getByRole("button", { name: "Continue to Assess" }).click();

  // Assess — accept the default scores and save
  await page.getByRole("tab", { name: "Assess" }).click();
  await page.getByRole("button", { name: "Save self-assessment" }).click();
  await expect(page.getByText("Current score")).toBeVisible();
  await page.getByRole("button", { name: "Continue to Apply" }).click();

  // Apply — move every one of the five steps out of "Not started"
  await page.getByRole("tab", { name: "Apply" }).click();
  const summaries = page.locator("details summary");
  const count = await summaries.count();
  expect(count).toBe(5);
  for (let i = 0; i < count; i++) {
    await summaries.nth(i).click();
    const combobox = page.getByRole("combobox").nth(i);
    await combobox.click();
    await page.getByRole("option", { name: "Planned" }).click();
  }
  await expect(page.getByRole("button", { name: "Continue to Schedule" })).toBeVisible();
  await page.getByRole("button", { name: "Continue to Schedule" }).click();

  // Schedule — give the first action a due date
  await page.getByRole("tab", { name: "Schedule" }).click();
  await page.locator('input[type="date"]').first().fill("2026-08-10");
  await page.locator('input[type="date"]').first().blur();
  await expect(page.getByRole("button", { name: "Continue to Track" })).toBeEnabled({
    timeout: 10_000,
  });
  await page.getByRole("button", { name: "Continue to Track" }).click();

  // Track — log one lead-measure entry
  await page.getByRole("tab", { name: "Track" }).click();
  await page.locator("#lead-measure-value").fill("2");
  await page.getByRole("button", { name: "Log entry" }).click();
  await expect(page.getByRole("button", { name: "Continue to Reflect" })).toBeVisible({
    timeout: 10_000,
  });
  await page.getByRole("button", { name: "Continue to Reflect" }).click();

  // Reflect — save with default (empty) answers
  await page.getByRole("tab", { name: "Reflect" }).click();
  await page.getByRole("button", { name: "Save reflection" }).click();
  await expect(page.getByRole("button", { name: "Continue to Complete" })).toBeVisible({
    timeout: 10_000,
  });
  await page.getByRole("button", { name: "Continue to Complete" }).click();

  // Complete — check every affirmation and finish the module
  await page.getByRole("tab", { name: "Complete" }).click();
  const checkboxes = page.getByRole("checkbox");
  const checkboxCount = await checkboxes.count();
  for (let i = 0; i < checkboxCount; i++) {
    await checkboxes.nth(i).click();
    await expect(checkboxes.nth(i)).toBeChecked();
  }
  const completeButton = page.getByRole("button", { name: "Complete this week" });
  await expect(completeButton).toBeEnabled({ timeout: 10_000 });
  await completeButton.scrollIntoViewIfNeeded();
  await completeButton.click();

  await page.waitForURL(programUrl, { timeout: 15_000 });
  await expect(page.getByText(/\d+% complete/)).toBeVisible();
  await expect(page.getByText("Completed").first()).toBeVisible();
});
