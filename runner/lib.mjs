// Shared helpers for the runner. Selector choices marked `CONFIRM` need one
// verification pass against the live DOM (see TRACE.md).
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import {
  BASE, STORAGE_STATE, IMG_DIR, VIEWPORT, DEVICE_SCALE_FACTOR, HEADED,
} from './config.mjs';

const NO_ANIM = `*,*::before,*::after{transition:none!important;animation:none!important;
  caret-color:transparent!important;scroll-behavior:auto!important}`;

export async function launch() {
  if (!existsSync(STORAGE_STATE)) {
    throw new Error(`No ${STORAGE_STATE}. Run \`node auth.mjs\` and log in first.`);
  }
  const browser = await chromium.launch({ headless: !HEADED });
  const context = await browser.newContext({
    storageState: STORAGE_STATE,
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    colorScheme: 'light',
  });
  await context.addInitScript(css => {
    const s = document.createElement('style'); s.textContent = css;
    document.documentElement.appendChild(s);
  }, NO_ANIM);
  const page = await context.newPage();
  return { browser, context, page };
}

export const enc = iri => encodeURIComponent(iri);

export async function gotoFolder(page, folderId) {
  await page.goto(`${BASE}/dashboard?folderId=${enc(folderId)}`);
  await page.getByRole('button', { name: 'New' }).waitFor();
}

// Screenshot the full viewport to docs/tutorials/img/<name>.png.
// When SKIP_TUTORIAL_SHOTS=1 (set by the manual/user-guide runner, which reuses
// the tutorial build steps only to set up content), this no-ops so a manual run
// never overwrites the tutorial screenshot set — it keeps the same paint-settle
// pacing so the build steps behave identically.
export async function shot(page, name) {
  if (process.env.SKIP_TUTORIAL_SHOTS === '1') { await page.waitForTimeout(300); return; }
  await mkdir(IMG_DIR, { recursive: true });
  await page.waitForTimeout(300); // let paint settle
  await page.screenshot({ path: `${IMG_DIR}/${name}.png` });
  console.log(`  📸 ${name}.png`);
}

// The green success toast, e.g. /has been created/, /was published/, /Made Open/.
export async function waitToast(page, re) {
  await page.getByText(re).first().waitFor({ timeout: 20_000 });
}

// A dashboard row by its visible title. VERIFIED: rows are div.resource-instance.
// Match on an element with the EXACT title text so "Clinical Study" doesn't also
// match "Clinical Study metadata".
export function row(page, title) {
  return page.locator('div.resource-instance', {
    has: page.getByText(title, { exact: true }),
  }).first();
}

// Open a row's ⋮ menu. VERIFIED: the trigger is button.more-button (icon
// i.fa-ellipsis-v) inside the row.
export async function openRowMenu(page, title) {
  const r = row(page, title);
  await r.scrollIntoViewIfNeeded();
  await r.locator('button.more-button').click();
  // Let the Angular dropdown bind its click handlers before an item is clicked;
  // clicking too early fires the anchor's href="#" instead of the action.
  await page.waitForTimeout(800);
}

// Menu items are anchors. The "New" menu's have no href (no link role); the
// row-⋮ menu's do. Match by exact text on a *visible* anchor (only the open
// menu is visible), which works for both.
export async function menuItem(page, label) {
  await page.locator(`a:text-is(${JSON.stringify(label)}):visible`).first().click();
}

export async function confirmDelete(page) {
  await page.getByRole('button', { name: 'Yes, delete it!' }).click();
}

// Delete one dashboard row by name and confirm it's gone. The Angular dropdown
// intermittently fires the anchor's href="#" instead of the delete action, so
// retry the whole menu→Delete→confirm gesture until the row detaches.
export async function deleteRowByName(page, name, reloadHref, attempts = 6) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    // Always (re)load the list the row lives in — the caller may be inside a
    // now-empty folder, or a prior attempt may have left a stale view.
    await page.goto(reloadHref);
    await page.getByRole('button', { name: 'New' }).waitFor();
    await page.waitForTimeout(400);
    if (!(await row(page, name).count())) return; // already gone (prior attempt lagged)
    await openRowMenu(page, name);
    await menuItem(page, 'Delete');
    await confirmDelete(page).catch(() => {});
    await page.waitForTimeout(3000); // CEDAR's delete propagation is laggy
    // Verify by reloading and re-counting rather than waiting for the specific
    // element to detach (the list re-renders, which races a detach check).
    await page.goto(reloadHref);
    await page.getByRole('button', { name: 'New' }).waitFor();
    await page.waitForTimeout(400);
    if (!(await row(page, name).count())) return;
  }
  throw new Error(`row "${name}" would not delete after ${attempts} attempts`);
}

// Empty a folder (delete every child) then delete the folder itself. Robust to
// the flaky success toast: verifies each delete by re-counting rows and bails a
// folder rather than retrying an undeletable row forever.
export async function emptyAndDeleteFolder(page, folderId, folderName, log = console.log) {
  const folderHref = `${BASE}/dashboard?folderId=${enc(folderId)}`;
  const readRows = async () => {
    await gotoFolder(page, folderId);
    await page.waitForTimeout(800);
    return page.$$eval('div.resource-instance', els => els.map(e => ({
      title: (e.innerText || '').split('\n')[0].trim(),
      isTemplate: /\btemplate\b/.test(e.className),
    })));
  };
  for (let guard = 0; guard < 20; guard++) {
    let rows = await readRows();
    if (!rows.length) { rows = await readRows(); if (!rows.length) break; } // confirm empty (listing flickers)
    // Delete instances (and any non-template) before templates: a published
    // template can't be deleted while an instance of it still exists.
    const next = rows.find(r => !r.isTemplate) ?? rows[0];
    await deleteRowByName(page, next.title, folderHref);
    log(`  🗑  ${next.title}`);
  }
  await deleteRowByName(page, folderName, `${BASE}/dashboard`);
  log(`  🗑  folder ${folderName}`);
}

// Parse the artifact/folder IRI out of a CEDAR editor/dashboard URL.
export function idFromUrl(url) {
  const m = url.match(/(templates\/edit\/|instances\/(?:create|edit)\/|folderId=)(.+?)(?:\?|$)/);
  return m ? decodeURIComponent(m[2]) : null;
}
