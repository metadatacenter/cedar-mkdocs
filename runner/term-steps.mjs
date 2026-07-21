// Steps for the controlled-term tutorial. Builds one "Tissue Sample" template
// whose fields are constrained three ways in the BioPortal picker: whole ontology,
// branch, and assembled classes. Captures the intermediate picker states (mode
// choice, searching, narrowing to an ontology, staging) so the tutorial can show
// that finding the right term takes real digging. Reuses tutorial 1's field
// authoring (addField/saveTemplate) and lib.mjs.
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, RUN_FOLDER_PREFIX, TERM } from './term-config.mjs';
import {
  enc, gotoFolder, row, openRowMenu, menuItem, idFromUrl, emptyAndDeleteFolder,
  waitToast,
} from './lib.mjs';
import { addField, saveTemplate } from './steps.mjs';

const IMG = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'tutorials', 'term-img');
export async function shot(page, name) {
  await mkdir(IMG, { recursive: true });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${IMG}/${name}.png` });
  console.log(`  📸 ${name}.png`);
}

// ── BioPortal picker helpers ──────────────────────────────────────────────
// Open the just-added field's Values tab and the picker.
async function openPicker(page) {
  await page.locator("[ng-click*=\"setTab('values')\"]").filter({ visible: true }).first().click();
  await page.waitForTimeout(400);
  await reopenPicker(page);
}
async function reopenPicker(page) {
  await page.locator("[ng-click*=\"showModal('values'\"]").filter({ visible: true }).first().click();
  await page.waitForTimeout(800);
}
async function revealAdvanced(page) {
  await page.locator('i.fa-cog').first().click();
  await page.waitForTimeout(400);
}
async function typeSearch(page, query) {
  await page.getByRole('textbox', { name: 'Search field' }).fill(query);
  await page.locator('i.fa-search').last().click();
}
// Add an ontology filter via the "Add ontologies" tag input; the tag triggers a
// re-search on the current query.
async function narrowToOntology(page, scope) {
  const ont = page.getByRole('textbox', { name: 'Add ontologies' });
  await ont.click();
  await ont.pressSequentially(scope.type, { delay: 60 });
  await page.waitForTimeout(2000);
}
async function pickSuggestion(page, match) {
  await page.locator('.suggestion-item, ti-autocomplete li').filter({ hasText: match }).first().click();
  await page.waitForTimeout(600);
}
// Click a stage button (Ontology/Branch/Term) then the picker's Add.
async function stageAndAdd(page, stageNg) {
  await page.locator(`[ng-click*="${stageNg}"]`).first().click();
  await page.waitForTimeout(300);
  const add = page.locator("[ng-click*='addValueConstraint']").first();
  await add.click({ force: true });
  await add.waitFor({ state: 'detached', timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(700);
}

// 1) Whole ontology: pick ontology mode, search the ontology, select it, stage
// Ontology, Add.
async function constrainWholeOntology(page, { query, rowText }, shots = {}) {
  await revealAdvanced(page);
  if (shots.modes) await shot(page, shots.modes);                      // the 3-way "I want to…" choice
  await page.locator('#search-scope-2').check({ force: true });        // search for an ontology
  await typeSearch(page, query);
  await page.getByText(rowText, { exact: false }).first().waitFor({ timeout: 12_000 });
  if (shots.search) await shot(page, shots.search);                    // the ontology, found
  await page.getByText(rowText, { exact: false }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1800);
  if (shots.selected) await shot(page, shots.selected);                // explore view + Term/Branch/Ontology
  await stageAndAdd(page, 'stageOntologyValueConstraint');
  if (shots.done) await shot(page, shots.done);                        // Values row: Ontology
}

// 2) Branch: show the unscoped term search (many ontologies match), then narrow
// to the ontology, select the class, stage Branch, Add.
async function constrainBranch(page, { scope, query, pick }, shots = {}) {
  await revealAdvanced(page);
  await page.locator('#search-scope-1').check({ force: true });        // term mode
  await typeSearch(page, query);
  await page.waitForTimeout(3000);
  if (shots.unscoped) await shot(page, shots.unscoped);                // many results across ontologies
  await narrowToOntology(page, scope);
  if (shots.scope) await shot(page, shots.scope);                      // the ontology suggestion
  await pickSuggestion(page, scope.match);
  await typeSearch(page, query);
  await page.waitForTimeout(3000);
  if (shots.scoped) await shot(page, shots.scoped);                    // results narrowed to the ontology
  const r = page.locator('[ng-click*="selectResult"]').filter({ hasText: pick }).first();
  await r.waitFor({ timeout: 12_000 });
  await r.click();
  await page.waitForTimeout(1500);
  if (shots.branch) await shot(page, shots.branch);                    // class selected, Branch chosen
  await stageAndAdd(page, 'stageBranchValueConstraint');
  if (shots.done) await shot(page, shots.done);                        // Values row: Branch
}

// 3) Assembled classes: for each term, narrow to the ontology, search, select,
// stage Term, Add; reopen the picker for each additional class.
async function constrainClasses(page, { scope, terms }, shots = {}) {
  for (let i = 0; i < terms.length; i++) {
    if (i > 0) await reopenPicker(page);
    await revealAdvanced(page);
    await page.locator('#search-scope-1').check({ force: true });
    await narrowToOntology(page, scope);
    await pickSuggestion(page, scope.match);
    await typeSearch(page, terms[i].query);
    await page.waitForTimeout(3000);
    const r = page.locator('[ng-click*="selectResult"]').filter({ hasText: terms[i].pick }).first();
    await r.waitFor({ timeout: 12_000 });
    await r.click();
    await page.waitForTimeout(1200);
    if (i === 0 && shots.search) await shot(page, shots.search);       // first assay, found
    await stageAndAdd(page, 'stageOntologyClassValueConstraint');
    if (i === 0 && shots.one) await shot(page, shots.one);             // Values row: one class so far
  }
  if (shots.done) await shot(page, shots.done);                        // Values: all three classes
}

// ── Folder ────────────────────────────────────────────────────────────────
export async function createFolder(page, runId) {
  const name = `${RUN_FOLDER_PREFIX} ${runId}`;
  let created = false;
  for (let attempt = 1; attempt <= 4 && !created; attempt++) {
    await page.goto(`${BASE}/dashboard`);
    await page.getByRole('button', { name: 'New' }).click();
    await menuItem(page, 'Folder');
    const dialog = page.getByRole('dialog').or(page.locator('.modal'));
    await dialog.getByRole('textbox').fill(name);
    await dialog.getByRole('button', { name: 'Save' }).click();
    for (let poll = 1; poll <= 6; poll++) {
      await page.goto(`${BASE}/dashboard`);
      await page.getByRole('button', { name: 'New' }).waitFor();
      await page.waitForTimeout(500);
      if (await row(page, name).count()) { created = true; break; }
      await page.waitForTimeout(1500);
    }
  }
  if (!created) throw new Error(`folder "${name}" never appeared`);
  await row(page, name).dblclick();
  await page.waitForURL(/folderId=/);
  return { folderId: idFromUrl(page.url()), name };
}

// ── Build the whole template, constraining each field as we add it ─────────
export async function buildTemplate(page, folderId) {
  await page.goto(`${BASE}/templates/create?folderId=${enc(folderId)}`);
  await page.getByRole('textbox', { name: 'Name' }).fill(TERM.templateName);
  await page.getByRole('textbox', { name: 'Description' }).fill(TERM.templateDescription);
  await shot(page, '01-template-designer');

  for (const f of TERM.plainFields) await addField(page, f);
  await shot(page, '02-plain-fields');

  // 1) Cell Type — whole Cell Ontology
  await addField(page, { type: 'text', ...TERM.cellType.field });
  await openPicker(page);
  await constrainWholeOntology(page, TERM.cellType, {
    modes: '03-picker-modes', search: '04-ontology-search',
    selected: '05-ontology-selected', done: '06-cell-type-constrained',
  });

  // 2) Organ — organ branch of Uberon
  await addField(page, { type: 'text', ...TERM.organ.field });
  await openPicker(page);
  await constrainBranch(page, TERM.organ, {
    unscoped: '07-organ-unscoped', scope: '08-organ-scope', scoped: '09-organ-scoped',
    branch: '10-organ-branch', done: '11-organ-constrained',
  });

  // 3) Assay Type — assembled OBI classes
  await addField(page, { type: 'text', ...TERM.assay.field });
  await openPicker(page);
  await constrainClasses(page, TERM.assay, {
    search: '12-assay-search', one: '13-assay-one', done: '14-assay-classes',
  });

  await shot(page, '15-all-fields');
  const templateId = await saveTemplate(page);
  await gotoFolder(page, folderId);
  await page.waitForTimeout(800);
  await shot(page, '16-saved');
  return { templateId };
}

// ── Fill one instance of the saved template ───────────────────────────────
// Reach the Metadata Editor via the row ⋮ → Populate (the deep link hits a
// transient init warning). Retry until the SPA nav commits.
async function openPopulate(page, folderId, templateName) {
  await gotoFolder(page, folderId);
  for (let attempt = 1; attempt <= 4; attempt++) {
    await openRowMenu(page, templateName);
    await menuItem(page, 'Populate');
    try {
      await page.waitForURL(/instances\/create/, { waitUntil: 'commit', timeout: 8000 });
      return;
    } catch {
      if (attempt === 4) throw new Error('Populate did not navigate after 4 attempts');
    }
  }
}

// Fill one controlled field's Material autocomplete: type the query, wait for the
// option to load (value lookups are server-side and can lag), optionally shoot the
// open dropdown, then select. `pick` is matched exactly, then loosely as a fallback.
async function fillControlled(page, { idx, query, pick }, shotName) {
  const box = page.locator('input[placeholder="Start typing to filter"]').nth(idx);
  await box.click();
  await box.fill('');
  await box.pressSequentially(query, { delay: 80 });
  const exact = page.getByRole('option', { name: pick, exact: true });
  let opt = exact;
  try {
    await exact.first().waitFor({ timeout: 15_000 });
  } catch {
    opt = page.locator('mat-option:visible').filter({ hasText: pick });
    await opt.first().waitFor({ timeout: 8000 });
  }
  if (shotName) await shot(page, shotName); // dropdown open with the allowed values
  await opt.first().click();
  await page.waitForTimeout(500);
}

export async function fillInstance(page, folderId, templateName) {
  await openPopulate(page, folderId, templateName);
  await page.waitForTimeout(1800);
  await shot(page, '17-instance-empty');                     // the blank form to fill

  const v = TERM.instance;
  await page.getByLabel('Sample ID', { exact: true }).fill(v.sampleId);
  await page.getByLabel('Lab ID', { exact: true }).fill(v.labId);
  // Two controlled fields filled from their ontologies.
  await fillControlled(page, v.cellType);                    // Cell Type → hepatocyte
  await fillControlled(page, v.organ);                       // Organ → liver
  // Third controlled field: capture the autocomplete open, then select a value.
  await fillControlled(page, v.assay, '18-instance-autocomplete'); // Assay Type dropdown
  await shot(page, '19-instance-filled');                    // finished instance

  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitToast(page, /metadata (have|has) been created/i);
  return { instanceId: idFromUrl(page.url()) };
}

export async function teardown(page, { folderId, folderName }) {
  await emptyAndDeleteFolder(page, folderId, folderName);
}
