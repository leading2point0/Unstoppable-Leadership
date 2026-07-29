import { test, expect, devices } from "@playwright/test";
import { signUpNewParticipant, startProgram } from "./helpers";

test.use({ ...devices["Pixel 7"] });

test("the mobile bottom navigation is visible and functional for a signed-in user", async ({
  page,
}) => {
  await signUpNewParticipant(page);
  await startProgram(page);

  const nav = page.getByRole("navigation", { name: "Primary" }).last();
  await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Actions" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Journal" })).toBeVisible();

  await nav.getByRole("link", { name: "Actions" }).click();
  await page.waitForURL("**/actions");
  await expect(page.getByRole("heading", { name: "Every commitment, in one place" })).toBeVisible();
});
