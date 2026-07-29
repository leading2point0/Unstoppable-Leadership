import type { Page } from "@playwright/test";

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

/** Signs up a brand-new participant account through the real UI form and lands on /dashboard. */
export async function signUpNewParticipant(page: Page, name = "Test Participant"): Promise<string> {
  const email = uniqueEmail("participant");
  await page.goto("/sign-up");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("Test-Password-123!");
  await page.getByLabel("Confirm password").fill("Test-Password-123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/sign-in**", { timeout: 15_000 });

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Test-Password-123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15_000 });

  return email;
}

/** Starts a new ten-week program from /program/new and lands on the program overview page. */
export async function startProgram(page: Page, displayName = "Test Participant"): Promise<string> {
  await page.goto("/program/new");
  await page.getByLabel("Preferred name").fill(displayName);
  await page.getByRole("button", { name: "Start My Program" }).click();
  // Must exclude "/program/new" itself — that path trivially matches a
  // naive /program/[^/]+$/ pattern too, since "new" contains no slash.
  await page.waitForURL(/\/program\/[0-9a-f-]{36}$/, { timeout: 15_000 });
  return page.url();
}
