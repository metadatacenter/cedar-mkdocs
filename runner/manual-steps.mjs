// Capture helpers for the user-guide (manual) screenshots. These assume content
// has already been built in a folder (see manual-run.mjs) and write full-frame
// shots into docs/img/userguide/.
import { mkdir } from 'node:fs/promises';
import { USERGUIDE_IMG_DIR } from './config.mjs';
import { gotoFolder, row, openRowMenu } from './lib.mjs';

const TOGGLE_VIEW = 'button[ng-click="dc.toggleView()"]';   // list ⇄ card layout
const INFO_TOOLBAR = '#show-details button';                // opens the info panel
const INFO_CLOSE = 'button.close[ng-click="dc.toggleInfo()"]'; // present only when open

export async function ug(page, name) {
  await mkdir(USERGUIDE_IMG_DIR, { recursive: true });
  await page.waitForTimeout(400); // let paint settle
  await page.screenshot({ path: `${USERGUIDE_IMG_DIR}/${name}.png` });
  console.log(`  📸 userguide/${name}.png`);
}

// The info-panel open state persists in the session, so force it closed before
// any shot that should not show it.
async function ensureInfoClosed(page) {
  const close = page.locator(INFO_CLOSE);
  if (await close.count()) { await close.first().click().catch(() => {}); await page.waitForTimeout(400); }
}

// The clean workspace overview: the populated folder in list view.
export async function captureOverview(page, folderId) {
  await gotoFolder(page, folderId);
  await ensureInfoClosed(page);
  await page.waitForTimeout(600);
  await ug(page, 'workspace-overview');
}

// The card layout of the same folder.
export async function captureCards(page, folderId) {
  await gotoFolder(page, folderId);
  await ensureInfoClosed(page);
  await page.waitForTimeout(400);
  await page.locator(TOGGLE_VIEW).click();
  await page.waitForTimeout(700);
  await page.mouse.move(700, 700); // move off the toggle so its tooltip is gone
  await ug(page, 'workspace-cards');
  await page.locator(TOGGLE_VIEW).click(); // back to list for later steps
  await page.waitForTimeout(400);
}

// A resource's ⋮ menu, open.
export async function captureResourceMenu(page, folderId, title) {
  await gotoFolder(page, folderId);
  await ensureInfoClosed(page);
  await openRowMenu(page, title);
  await ug(page, 'resource-menu');
  await page.keyboard.press('Escape').catch(() => {});
}

// The Copy to… destination-picker dialog.
export async function captureDestinationDialog(page, folderId, title) {
  await gotoFolder(page, folderId);
  await ensureInfoClosed(page);
  await openRowMenu(page, title);
  await page.locator('a:visible:has-text("Copy to")').first().click();
  await page.waitForTimeout(900); // dialog opens
  await ug(page, 'destination-dialog');
  await page.getByRole('button', { name: /cancel/i }).click()
    .catch(() => page.keyboard.press('Escape'));
  await page.waitForTimeout(300);
}

// The information panel for a selected resource. Opens it explicitly, shoots,
// then closes it to reset the persisted state for later runs.
export async function captureInfoPanel(page, folderId, selectTitle) {
  await gotoFolder(page, folderId);
  await ensureInfoClosed(page);
  await row(page, selectTitle).click(); // single click selects (double-click opens)
  await page.waitForTimeout(400);
  await page.locator(INFO_TOOLBAR).first().click();
  await page.waitForTimeout(800);
  await ug(page, 'workspace-info-panel');
  await page.locator(INFO_CLOSE).first().click().catch(() => {}); // reset state
  await page.waitForTimeout(300);
}
