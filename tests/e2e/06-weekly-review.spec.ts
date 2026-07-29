import { test, expect } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test("a participant can complete a weekly review and see the live summary update", async ({
  page,
}) => {
  await signUpNewParticipant(page);
  const programUrl = await startProgram(page);

  await page.goto(`${programUrl}/weekly-review`);
  await expect(page.getByRole("heading", { name: /Weekly review/ })).toBeVisible();

  await page
    .getByLabel("What did I learn?")
    .fill("Small daily practice compounds faster than I expected.");
  await page
    .getByLabel("What is next week's most important action?")
    .fill("Schedule the Tuesday learning block.");
  await page.getByRole("button", { name: "Save weekly review" }).click();

  await expect(page.getByText("Schedule the Tuesday learning block.")).toBeVisible({
    timeout: 10_000,
  });
});
