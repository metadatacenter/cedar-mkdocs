// Log in to CEDAR once and save the browser state (git-ignored) for the runner to reuse.
//   node auth.mjs                                   opens a browser; sign in by hand
//   CEDAR_LOGIN=… CEDAR_PASSWORD=… node auth.mjs    signs in headlessly at the Keycloak form
// The headless form is for a local stack (CEDAR_BASE=https://cedar.metadatacenter.orgx and
// its test accounts); no credential lives in this repository. The state file is chosen per
// host by config.mjs, so a local login never replaces the production one.
import { chromium } from 'playwright';
import { BASE, STORAGE_STATE, VIEWPORT } from './config.mjs';

const login = process.env.CEDAR_LOGIN;
const password = process.env.CEDAR_PASSWORD;
const headless = !!(login && password);

const browser = await chromium.launch({ headless });
const context = await browser.newContext({ viewport: VIEWPORT, ignoreHTTPSErrors: true });
const page = await context.newPage();

await page.goto(BASE);
if (headless) {
  // The same Keycloak selectors cedar-development/ops/e2e/selectors.mjs uses: the realm's
  // login theme has changed before, so each list covers the themed and unthemed markup.
  const user = page.locator('#username, input[name="username"]').first();
  await user.waitFor({ timeout: 60_000 });
  await user.fill(login);
  await page.locator('#password, input[name="password"]').first().fill(password);
  await page.locator('#kc-login, button[type="submit"], input[type="submit"]').first().click();
} else {
  console.log('\n>>> Log in to CEDAR in the opened window.');
  console.log('>>> Waiting until the workspace (the "New" button) is visible…\n');
}

// Logged in once the dashboard "New" button appears.
await page.getByRole('button', { name: 'New' }).waitFor({ timeout: headless ? 60_000 : 300_000 });

await context.storageState({ path: STORAGE_STATE });
console.log(`Saved auth for ${BASE} to ${STORAGE_STATE}`);
await browser.close();
