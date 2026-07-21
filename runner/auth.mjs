// One-time login: opens a real browser, waits for you to sign in to CEDAR,
// then saves storageState.json (git-ignored) for the runner to reuse.
//   node auth.mjs
import { chromium } from 'playwright';
import { BASE, STORAGE_STATE, VIEWPORT } from './config.mjs';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

await page.goto(BASE);
console.log('\n>>> Log in to CEDAR in the opened window.');
console.log('>>> Waiting until the workspace (the "New" button) is visible…\n');

// Wait until logged in — the dashboard "New" button only appears when authed.
await page.getByRole('button', { name: 'New' }).waitFor({ timeout: 300_000 });

await context.storageState({ path: STORAGE_STATE });
console.log(`Saved auth to ${STORAGE_STATE}`);
await browser.close();
