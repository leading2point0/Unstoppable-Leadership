import { chromium, type FullConfig } from "@playwright/test";
import path from "node:path";

/**
 * Signs in as the bootstrap owner account once and saves storage state for
 * tests that need owner-level access (source/quote administration). Most
 * tests instead sign up a fresh participant inline so each test file can
 * run independently against its own account.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL as string;
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
  const browser = await chromium.launch(executablePath ? { executablePath } : undefined);
  const page = await browser.newPage();

  await page.goto(`${baseURL}/sign-in`);
  await page.getByLabel("Email").fill(process.env.BOOTSTRAP_OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.BOOTSTRAP_OWNER_PASSWORD ?? "OwnerPass123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(`${baseURL}/dashboard`, { timeout: 15_000 });

  await page.context().storageState({ path: path.join(__dirname, ".auth/owner.json") });
  await browser.close();
}
