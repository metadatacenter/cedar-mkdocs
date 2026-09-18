// Capture helpers for the user guide's Artifact Versioning page. One arc runs through all of
// them: a Principal Investigator element goes from draft to release to a second draft, a Study
// template reuses that draft, and an edit to the draft is carried into the template. Each step
// leaves the workspace in the state the next one expects, so they run in order.
//
// Screenshots land in docs/img/userguide/ as versioning-*.png.
import { BASE, VERSIONING } from './config.mjs';
import {
  enc, gotoFolder, row, openRowMenu, menuItem, waitToast, idFromUrl,
  setCategoriesFilter, deleteRowByName,
} from './lib.mjs';
// lib's idFromUrl does not know the /elements/edit/ route and would return the folder from the
// query string instead, so editor URLs are parsed here.
const idFromEditorUrl = url =>
  decodeURIComponent(url.match(/\/(?:templates|elements|fields)\/edit\/(.+?)(?:\?|$)/)?.[1] ?? '');
import { addField } from './steps.mjs';
import { ug } from './manual-steps.mjs';

const INFO_TOOLBAR = '#show-details button';                   // opens the information panel
const INFO_CLOSE = 'button.close[ng-click="dc.toggleInfo()"]'; // present only when it is open
const FINDER_OPEN = '[ng-click*="showFinderModal"]';           // the import window opener
const VERSION_SECTION = `a[ng-click="dc.toggleFilters('version')"]`;
const LATEST_TOGGLE = '[ng-click="dc.toggleFilterLatest()"]';

// The designer autofocuses and selects the Name input, which would photograph as a block of
// highlighted text. Drop focus and the selection before every designer shot.
async function deselect(page) {
  await page.evaluate(() => {
    document.activeElement?.blur?.();
    window.getSelection?.()?.removeAllRanges?.();
  }).catch(() => {});
  await page.waitForTimeout(300);
}

async function ensureInfoClosed(page) {
  const close = page.locator(INFO_CLOSE);
  if (await close.count()) { await close.first().click().catch(() => {}); await page.waitForTimeout(400); }
}

// A workspace listing ready to be photographed: no information panel, no category tree.
async function listing(page, folderId) {
  await gotoFolder(page, folderId);
  await setCategoriesFilter(page, false);
  await ensureInfoClosed(page);
  await page.waitForTimeout(700);
}

// Drive the publish / create-version dialog. Both are the same modal with three numeric
// steppers; publishing fills them, creating a draft accepts the number CEDAR suggests.
// VERIFIED (live): the steppers are plain <input>s, not role=spinbutton.
async function versionDialog(page, shotName, release) {
  const nums = page.locator('.modal input, [role="dialog"] input').filter({ visible: true });
  await nums.nth(0).waitFor();
  if (release) {
    await nums.nth(0).fill(String(release.major));
    await nums.nth(1).fill(String(release.minor));
    await nums.nth(2).fill(String(release.patch));
  }
  await page.waitForTimeout(400);
  if (shotName) await ug(page, shotName);
  const ok = page.getByRole('button', { name: 'OK', exact: true });
  await ok.click();
  // The success toast collides with the hidden menu item of the same wording, so the dialog
  // closing is the commit signal.
  await ok.waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(2500);
}

// ── the run folder ────────────────────────────────────────────────────────
export async function step1_folder(page) {
  const name = VERSIONING.folderName;
  await page.goto(`${BASE}/dashboard`);
  await page.getByRole('button', { name: 'New' }).waitFor();
  await page.waitForTimeout(600);
  if (await row(page, name).count()) {
    // An interrupted run left the folder behind. The name is fixed, so start from a clean one
    // rather than building a second series inside the leftovers.
    console.log(`  ↺ removing a leftover ${name}`);
    await row(page, name).dblclick();
    await page.waitForURL(/folderId=/);
    await teardown(page, { folderId: idFromUrl(page.url()), folderName: name });
  }
  await page.goto(`${BASE}/dashboard`);
  await page.getByRole('button', { name: 'New' }).click();
  await page.waitForTimeout(400);
  await menuItem(page, 'Folder');
  const dialog = page.getByRole('dialog').or(page.locator('.modal'));
  await dialog.getByRole('textbox').first().fill(name);
  await dialog.getByRole('button', { name: 'Save' }).click();
  for (let poll = 1; poll <= 8; poll++) {
    await page.goto(`${BASE}/dashboard`);
    await page.getByRole('button', { name: 'New' }).waitFor();
    await page.waitForTimeout(600);
    if (await row(page, name).count()) break;
    if (poll === 8) throw new Error(`created folder "${name}" never appeared on the dashboard`);
    await page.waitForTimeout(1500);
  }
  await row(page, name).dblclick();
  await page.waitForURL(/folderId=/);
  return { folderId: idFromUrl(page.url()), name };
}

// ── the element, as a first draft ─────────────────────────────────────────
export async function step2_element(page, folderId) {
  const { element } = VERSIONING;
  await page.goto(`${BASE}/elements/create?folderId=${enc(folderId)}`);
  await page.getByRole('textbox', { name: 'Name', exact: true }).waitFor();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill(element.name);
  await page.getByRole('textbox', { name: 'Description' }).fill(element.description);
  await page.waitForTimeout(600);
  for (const field of element.fields) await addField(page, field);
  await page.waitForTimeout(1100); // flush the debounced field inputs
  await page.getByRole('button', { name: 'Save Element' }).click();
  await waitToast(page, /has been (created|updated)/i);
  const elementId = idFromEditorUrl(page.url());
  // Reopen, so the figure shows a stored draft rather than a form with a success toast on it.
  await page.goto(`${BASE}/elements/edit/${elementId}?folderId=${enc(folderId)}`);
  await page.waitForTimeout(3000);
  await deselect(page);
  await ug(page, 'versioning-element-draft');
  return { elementId };
}

// ── what a draft offers ───────────────────────────────────────────────────
export async function step3_draftMenu(page, folderId) {
  await listing(page, folderId);
  await openRowMenu(page, VERSIONING.element.name);
  await page.mouse.move(700, 900);  // off the ⋮, so its tooltip is not in the shot
  await ug(page, 'versioning-draft-menu');
  await page.keyboard.press('Escape').catch(() => {});
}

// ── publishing the first release ──────────────────────────────────────────
export async function step4_publish(page, folderId) {
  await listing(page, folderId);
  await openRowMenu(page, VERSIONING.element.name);
  await menuItem(page, 'Publish version...');
  await versionDialog(page, 'versioning-publish-dialog', VERSIONING.firstRelease);
}

// ── what a published version offers, and how it opens ─────────────────────
export async function step5_published(page, folderId, elementId) {
  await listing(page, folderId);
  await openRowMenu(page, VERSIONING.element.name);
  await page.mouse.move(700, 900);
  await ug(page, 'versioning-published-menu');
  await page.keyboard.press('Escape').catch(() => {});

  await page.goto(`${BASE}/elements/edit/${elementId}?folderId=${enc(folderId)}`);
  await page.waitForTimeout(3000);
  await deselect(page);
  await ug(page, 'versioning-published-locked');
}

// ── the next draft ────────────────────────────────────────────────────────
// Returns the new draft's identifier, read from the editor the row opens: the two versions
// share a title, so the run addresses the draft by identifier from here on.
export async function step6_createVersion(page, folderId, draftVersion) {
  await listing(page, folderId);
  await openRowMenu(page, VERSIONING.element.name);
  await menuItem(page, 'Create version...');
  await versionDialog(page, 'versioning-create-version-dialog');
  await listing(page, folderId);
  await ug(page, 'versioning-series-listing');

  const draftRow = page.locator('div.resource-instance')
    .filter({ has: page.getByText(VERSIONING.element.name, { exact: true }) })
    .filter({ hasText: draftVersion }).first();
  await draftRow.waitFor({ timeout: 15_000 });
  await draftRow.dblclick();
  await page.waitForURL(/elements\/edit\//, { timeout: 30_000 });
  await page.waitForTimeout(2000);
  return { draftId: idFromEditorUrl(page.url()) };
}

// ── a template that reuses the draft ──────────────────────────────────────
// The import window lists every version of the element under the same title, so the step picks
// the one whose details pane reports the wanted version rather than trusting the row order.
export async function step7_template(page, folderId, draftVersion) {
  const { template, element } = VERSIONING;
  await page.goto(`${BASE}/templates/create?folderId=${enc(folderId)}`);
  await page.getByRole('textbox', { name: 'Name', exact: true }).waitFor();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill(template.name);
  await page.getByRole('textbox', { name: 'Description' }).fill(template.description);
  await addField(page, template.field);
  await page.waitForTimeout(1100);

  await page.locator(FINDER_OPEN).first().click({ timeout: 15_000 });
  await page.waitForTimeout(2500);
  const rows = page.locator('.modal div.resource-instance');
  const details = page.locator('.modal .resource-details, .modal table').last();
  let picked = false;
  for (let i = 0; i < await rows.count(); i++) {
    await rows.nth(i).click();
    await page.waitForTimeout(1200);
    if ((await details.innerText()).includes(draftVersion)) {
      await ug(page, 'versioning-import-window');
      await rows.nth(i).locator('button.badge-button').click();
      picked = true;
      break;
    }
  }
  if (!picked) throw new Error(`the import window offered no ${element.name} at ${draftVersion}`);
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Select', exact: true }).click();
  await page.waitForTimeout(3000);
  await deselect(page);
  await ug(page, 'versioning-template-with-element');

  await page.waitForTimeout(1100);
  await page.getByRole('button', { name: 'Save Template' }).click();
  await Promise.race([
    page.getByText(/has been (created|updated)/i).first().waitFor({ timeout: 60_000 }).catch(() => {}),
    page.waitForURL(/templates\/edit\//, { timeout: 60_000 }).catch(() => {}),
  ]);
  await page.waitForTimeout(1500);
  return { templateId: idFromEditorUrl(page.url()) };
}

// ── editing the draft, and carrying the edit into the template ────────────
export async function step8_propagate(page, folderId, draftId, templateId) {
  await page.goto(`${BASE}/elements/edit/${draftId}?folderId=${enc(folderId)}`);
  await page.waitForTimeout(3500);
  await addField(page, VERSIONING.element.addedField);
  await page.waitForTimeout(1100);
  await page.getByRole('button', { name: 'Save Element' }).click();

  // VERIFIED (live DOM): the window is an AngularJS directive, <cedar-artifact-selector>, whose
  // rows are .tree-artifact and whose ticks are plain checkboxes. It replaced a compiled Angular
  // web component whose rows were <mat-tree-node> and whose ticks carried Material's mdc- classes.
  const selector = page.locator('cedar-artifact-selector');
  await selector.getByText(VERSIONING.template.name, { exact: false }).first()
    .waitFor({ timeout: 30_000 });
  await page.waitForTimeout(1200);
  await ug(page, 'versioning-update-bubbling');

  // Name the row rather than taking the first tick: a published artifact's tick is disabled, so
  // clicking blindly can select nothing and leave the propagation below with no target.
  await selector.locator('.tree-artifact').filter({ hasText: VERSIONING.template.name })
    .locator('input[type="checkbox"]').first().click({ force: true });
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Update', exact: true }).click();
  await waitToast(page, /updates successfully/i).catch(() => {});
  await page.waitForTimeout(3000);

  await page.goto(`${BASE}/templates/edit/${templateId}?folderId=${enc(folderId)}`);
  await page.waitForTimeout(4000);
  await deselect(page);
  await ug(page, 'versioning-template-updated');
}

// ── one instance, so the element has metadata depending on it ─────────────
export async function step9_instance(page, folderId) {
  const { template } = VERSIONING;
  for (let attempt = 1; attempt <= 4; attempt++) {
    await gotoFolder(page, folderId);
    await openRowMenu(page, template.name);
    await menuItem(page, 'Populate');
    try {
      await page.waitForURL(/instances\/create/, { waitUntil: 'commit', timeout: 8000 });
      break;
    } catch {
      if (attempt === 4) throw new Error('Populate did not navigate after 4 attempts');
    }
  }
  await page.waitForTimeout(2500);
  for (const [label, value] of Object.entries(template.values)) {
    await page.getByLabel(label, { exact: true }).fill(value).catch(() => {});
  }
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitToast(page, /metadata (have|has) been created/i);
  await page.waitForTimeout(2000);
}

// ── the warning an element in use raises when it is opened ────────────────
export async function step10_inUse(page, folderId, draftId) {
  await page.goto(`${BASE}/elements/edit/${draftId}?folderId=${enc(folderId)}`);
  await page.getByRole('button', { name: 'Continue editing' }).waitFor({ timeout: 40_000 });
  await page.waitForTimeout(800);
  await ug(page, 'versioning-element-in-use');
  await page.getByRole('button', { name: 'Cancel' }).click().catch(() => {});
  await page.waitForTimeout(2000);
}

// ── the second release ────────────────────────────────────────────────────
export async function step11_secondRelease(page, folderId) {
  await listing(page, folderId);
  await openRowMenu(page, VERSIONING.element.name);
  await menuItem(page, 'Publish version...');
  await versionDialog(page, null, VERSIONING.secondRelease);
}

// ── the version history of the finished series ────────────────────────────
export async function step12_history(page, folderId) {
  await listing(page, folderId);
  await row(page, VERSIONING.element.name).click();
  await page.waitForTimeout(500);
  await page.locator(INFO_TOOLBAR).first().click();
  await page.waitForTimeout(1200);
  await page.locator(`[ng-click="dc.setTab('resource-version');"]`).first().click();
  await page.waitForTimeout(1200);
  await ug(page, 'versioning-version-history');
  await ensureInfoClosed(page);
}

// ── the Latest filter, on and off ─────────────────────────────────────────
// The setting is a saved user preference rather than a per-session default, so the step reads
// the state it arrives in, drives both figures from a known position, and puts it back.
export async function step13_latestFilter(page, folderId) {
  await listing(page, folderId);
  const section = page.locator(VERSION_SECTION).first();
  if (await section.locator('i.fa-caret-left').count()) {
    await section.click();
    await section.evaluate(el => el.blur()).catch(() => {}); // no focus ring in the shot
    await page.waitForTimeout(600);
  }
  const latest = page.locator(LATEST_TOGGLE).first();
  const isOn = async () => (await latest.getAttribute('class') ?? '').includes('active');
  const entryState = await isOn();

  if (!await isOn()) { await latest.click(); await page.waitForTimeout(2000); }
  await ug(page, 'versioning-latest-on');
  await latest.click();
  await page.waitForTimeout(2000);
  await ug(page, 'versioning-latest-off');

  if (await isOn() !== entryState) { await latest.click(); await page.waitForTimeout(1500); }
  if (await section.locator('i.fa-caret-down').count()) {
    await section.click();
    await page.waitForTimeout(400);
  }
  await setCategoriesFilter(page, true);
}

// ── teardown ──────────────────────────────────────────────────────────────
// Ordered by what depends on what: an instance without its template is meaningless, and a
// template can hold a copy of an element. Rows carry their kind as a class, so a partial run
// tears down as cleanly as a complete one. The two element versions share a title, and
// deleteRowByName keeps going until no row answers to that name, so one call clears both.
const KIND_ORDER = ['metadata', 'template', 'element', 'field'];

export async function teardown(page, { folderId, folderName }) {
  const folderHref = `${BASE}/dashboard?folderId=${enc(folderId)}`;
  for (let guard = 0; guard < 20; guard++) {
    await gotoFolder(page, folderId);
    await page.waitForTimeout(800);
    const rows = await page.$$eval('div.resource-instance', els => els.map(el => ({
      title: (el.innerText || '').split('\n')[0].trim(),
      kind: ['metadata', 'template', 'element', 'field'].find(k => el.classList.contains(k)),
    })));
    if (!rows.length) break;
    const next = KIND_ORDER.map(kind => rows.find(r => r.kind === kind)).find(Boolean) ?? rows[0];
    await deleteRowByName(page, next.title, folderHref);
    console.log(`  🗑  ${next.title}`);
  }
  await deleteRowByName(page, folderName, `${BASE}/dashboard`);
  console.log(`  🗑  folder ${folderName}`);
}
