import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("a new user can sign up and start a ten-week program", async ({ page }) => {
  await signUpNewParticipant(page);
  const programUrl = await startProgram(page);

  expect(programUrl).toMatch(/\/program\/[0-9a-f-]+$/);
  await expect(
    page.getByRole("heading", { name: "Unstoppable Action Lab: Ten-Week Program" }),
  ).toBeVisible();
  await expect(page.getByText("0% complete")).toBeVisible();
  await expect(page.getByText("Week 1", { exact: true })).toBeVisible();
});
