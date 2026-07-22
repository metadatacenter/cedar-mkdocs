// Capture helpers for the user-guide (manual) screenshots. These assume content
// has already been built in a folder (see manual-run.mjs) and write full-frame
// shots into docs/img/userguide/.
import { mkdir } from 'node:fs/promises';
import { USERGUIDE_IMG_DIR, BASE, BASIC } from './config.mjs';
import { gotoFolder, row, openRowMenu, menuItem, enc, waitToast } from './lib.mjs';
import { addField, saveTemplate } from './steps.mjs';

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

// Build the basic Study template in the Template Designer, capturing the
// building-basic-templates figures along the way. Returns the template id.
export async function captureBuildTemplate(page, folderId) {
  await page.goto(`${BASE}/templates/create?folderId=${enc(folderId)}`);
  await page.getByRole('textbox', { name: 'Name' }).fill(BASIC.templateName);
  await page.getByRole('textbox', { name: 'Description' }).fill(BASIC.templateDescription);
  await page.waitForTimeout(500);
  await ug(page, 'template-designer');       // named template, no fields yet
  await addField(page, BASIC.fields[0]);      // text: Study Name
  await ug(page, 'template-one-field');
  await addField(page, BASIC.fields[1]);      // numeric: Number of Participants
  await ug(page, 'template-two-fields');
  return saveTemplate(page);
}

// Populate the template, capturing the empty and filled metadata form. Leaves a
// saved instance behind (the caller tears it down).
export async function captureFillForm(page, folderId, templateName) {
  let navigated = false;
  for (let attempt = 1; attempt <= 4 && !navigated; attempt++) {
    await gotoFolder(page, folderId);
    await openRowMenu(page, templateName);
    await menuItem(page, 'Populate');
    try {
      await page.waitForURL(/instances\/create/, { waitUntil: 'commit', timeout: 8000 });
      navigated = true;
    } catch {
      if (attempt === 4) throw new Error('Populate did not navigate after 4 attempts');
    }
  }
  await page.waitForTimeout(800);
  await ug(page, 'metadata-empty-form');
  for (const [label, value] of Object.entries(BASIC.values)) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  await ug(page, 'metadata-filled-form');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitToast(page, /metadata (have|has) been created/i);
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
