// Step functions for the CEDAR tutorial runner, one per tutorial section.
// Verified end-to-end against live CEDAR (see runner/README.md). Each step
// captures screenshots of every meaningful UI state (menus, dialogs, pickers,
// autocomplete dropdowns) into ../docs/tutorials/img as 01..20, and returns the IDs
// later steps / teardown need.
import { BASE, OPENVIEW, BASIC, RICH, RUN_FOLDER_NAME } from './config.mjs';
import {
  enc, gotoFolder, shot, waitToast, row, openRowMenu, menuItem, confirmDelete,
  idFromUrl, emptyAndDeleteFolder,
} from './lib.mjs';

// VERIFIED (live DOM): palette items are FontAwesome anchors with no accessible
// name; direct types are icon anchors, others live under the "More" flyout as
// <span> items. Field-editor textboxes are named "Enter Field Name" etc.
const FIELD_ICON = { text: 'i.fa-font', numeric: 'i.fa-hashtag', date: 'i.fa-calendar', email: 'i.fa-envelope' };

// ── field designer helpers ───────────────────────────────────────────────
// Set an input atomically with fill() (avoids a per-keystroke select/type race
// that dropped leading characters), then wait out the debounce. Field inputs
// bind ng-model-options="{ debounce: 1000 }", so the model commits ~1s after the
// input event; nothing flushes it early.
async function setText(loc, value) {
  await loc.click();
  await loc.fill(value);
  await loc.page().waitForTimeout(1100);
}

// Add one field. For "More"-menu types (ORCID/ROR/…), pass opts.flyoutShot to
// screenshot the open palette flyout before the type is chosen.
export async function addField(page, { type, name, help }, opts = {}) {
  if (FIELD_ICON[type]) {
    await page.locator(`a:has(${FIELD_ICON[type]})`).click();
  } else {
    await page.locator('a.more.dropdown-toggle').click();
    await page.waitForTimeout(400); // let the flyout bind
    if (opts.flyoutShot) await shot(page, opts.flyoutShot);
    await page.locator(`span:text-is(${JSON.stringify(type)})`).first().click(); // 'ORCID', 'ROR', …
  }
  await setText(page.getByRole('textbox', { name: 'Enter Field Name' }).last(), name);
  if (help) await setText(page.getByRole('textbox', { name: 'Enter Field Help Text' }).last(), help);
}

// Constrain a text field's values to a BRANCH of a BioPortal ontology — the
// named class and all its descendants (e.g. the "disease" branch of DOID).
// VERIFIED (live DOM): gear = i.fa-cog; ontology mode = radio #search-scope-2;
// search box "Search field"; run-search = i.fa-search; ontology explore renders
// a "DOID classes" tree of [ng-click=getClassDetailsCallback] nodes; selecting a
// class exposes Term / Branch / Ontology staging buttons; Add commits.
// `shots` names the value-tab / picker / ontology / branch / done screenshots.
async function constrainToOntology(page, { query, rowText, branch }, shots = {}) {
  // The just-added field's editor is open. Tabs are divs whose DOM text is
  // "Values" (CSS-uppercased); target the stable ng-click handler.
  await page.locator("[ng-click*=\"setTab('values')\"]").filter({ visible: true }).first().click();
  await page.waitForTimeout(400);
  if (shots.valuesTab) await shot(page, shots.valuesTab);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); // opens the BioPortal picker
  await page.waitForTimeout(600);
  if (shots.picker) await shot(page, shots.picker);                      // picker: term-search mode
  // Switch to ontology mode via the gear, then check the mode radio (styled/hidden).
  await page.locator('i.fa-cog').first().click();
  await page.locator('#search-scope-2').check({ force: true });          // "Search for an ontology…"
  await page.getByRole('textbox', { name: 'Search field' }).fill(query);
  await page.locator('i.fa-search').last().click();                      // run search
  await page.getByText(rowText, { exact: false }).first().waitFor({ timeout: 12_000 }).catch(() => {});
  if (shots.ontology) await shot(page, shots.ontology);                  // DOID result visible
  // Click the ontology row to explore its class tree (the explore view renders
  // over the row — the first click selects it; ignore any retry interception).
  await page.getByText(rowText, { exact: false }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(2000);                                       // DOID class tree loads
  // Select the branch: click the class in the tree, choose "Branch", then Add.
  const node = page.locator('[ng-click*="getClassDetailsCallback"]')
    .filter({ hasText: new RegExp(`^\\s*${branch}\\s*$`, 'i') }).first();
  await node.waitFor({ timeout: 12_000 });
  await node.click();                                                    // shows the class's Term Details
  await page.waitForTimeout(1500);
  await page.locator('[ng-click*="stageBranchValueConstraint"]').first().click(); // stage the Branch
  await page.waitForTimeout(400);
  if (shots.branch) await shot(page, shots.branch);                      // tree + class details + Branch
  await page.locator("[ng-click*='addValueConstraint']").first().click({ force: true }); // commit
  await page.locator('[ng-click*="stageBranchValueConstraint"]')
    .waitFor({ state: 'detached', timeout: 8000 }).catch(() => {});      // picker closed
  await page.waitForTimeout(600);
  if (shots.done) await shot(page, shots.done);                          // VALUES row shows the Branch constraint
}

export async function saveTemplate(page) {
  await page.waitForTimeout(1100); // flush any pending debounced field/description edits
  await page.getByRole('button', { name: 'Save Template' }).click();
  await waitToast(page, /has been (created|updated)/i);
  return idFromUrl(page.url()); // /templates/edit/<iri>
}

// ── Step 1: create the run folder ─────────────────────────────────────────
export async function step1_folder(page, runId) {
  const name = RUN_FOLDER_NAME;
  // CEDAR occasionally returns a transient "Server Error while creating the
  // folder" toast; re-attempt the whole gesture, polling for the row after each
  // (a fresh folder can also lag the listing via server-side indexing).
  let created = false;
  for (let attempt = 1; attempt <= 4 && !created; attempt++) {
    await page.goto(`${BASE}/dashboard`);
    await page.getByRole('button', { name: 'New' }).click();
    if (attempt === 1) { await page.waitForTimeout(400); await shot(page, '01-new-menu'); }
    await menuItem(page, 'Folder');
    const dialog = page.getByRole('dialog').or(page.locator('.modal'));
    await dialog.getByRole('textbox').fill(name);
    if (attempt === 1) await shot(page, '02-folder-dialog');
    await dialog.getByRole('button', { name: 'Save' }).click();
    for (let poll = 1; poll <= 6; poll++) {
      await page.goto(`${BASE}/dashboard`);
      await page.getByRole('button', { name: 'New' }).waitFor();
      await page.waitForTimeout(500);
      if (await row(page, name).count()) { created = true; break; }
      await page.waitForTimeout(1500);
    }
    if (!created) console.warn(`  ⚠ folder create attempt ${attempt} did not appear — retrying`);
  }
  if (!created) throw new Error(`created folder "${name}" never appeared on the dashboard`);
  await row(page, name).dblclick();
  await page.waitForURL(/folderId=/);
  return { folderId: idFromUrl(page.url()), name };
}

// ── Step 2: basic template + fields ───────────────────────────────────────
export async function step2_basicTemplate(page, folderId) {
  await page.goto(`${BASE}/templates/create?folderId=${enc(folderId)}`);
  await page.getByRole('textbox', { name: 'Name' }).fill(BASIC.templateName);
  await page.getByRole('textbox', { name: 'Description' }).fill(BASIC.templateDescription);
  await page.waitForTimeout(500);
  await shot(page, '03-template-designer');
  await addField(page, BASIC.fields[0]);      // text: Study Name
  await shot(page, '04-name-a-field');
  await addField(page, BASIC.fields[1]);      // numeric: Number of Participants
  await shot(page, '05-two-fields');
  const templateId = await saveTemplate(page);
  return { templateId };
}

// ── Step 3: populate the basic template ───────────────────────────────────
// Reach the Metadata Editor via the row ⋮ → Populate (the deep link hits a
// transient "Whoa!" init warning). Pass menuShot to capture the open row menu.
async function openPopulate(page, folderId, templateName, menuShot) {
  await gotoFolder(page, folderId);
  // The menu-item click occasionally fires href="#" instead of navigating (the
  // Angular handler hadn't bound). Retry until the SPA nav commits.
  for (let attempt = 1; attempt <= 4; attempt++) {
    await openRowMenu(page, templateName);
    if (attempt === 1 && menuShot) await shot(page, menuShot);
    await menuItem(page, 'Populate');
    try {
      await page.waitForURL(/instances\/create/, { waitUntil: 'commit', timeout: 8000 });
      return;
    } catch {
      if (attempt === 4) throw new Error('Populate did not navigate after 4 attempts');
    }
  }
}

export async function step3_populateBasic(page, folderId, templateName) {
  await openPopulate(page, folderId, templateName, '06-populate-menu');
  await page.waitForTimeout(800);
  await shot(page, '07-empty-form');
  for (const [label, value] of Object.entries(BASIC.values)) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  await shot(page, '08-filled-form');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitToast(page, /metadata (have|has) been created/i);
  const instanceId = idFromUrl(page.url());
  // Show the folder now holding the template and its new metadata instance
  // (the instance can lag the listing briefly, so poll for its row).
  const instanceName = `${BASIC.templateName} metadata`;
  for (let i = 0; i < 6; i++) {
    await gotoFolder(page, folderId);
    await page.waitForTimeout(700);
    if (await row(page, instanceName).count()) break;
    await page.waitForTimeout(1200);
  }
  await shot(page, '09-study-metadata');
  return { instanceId };
}

// ── Step 4: rich template (ORCID, ROR, DOID) ──────────────────────────────
export async function step4_richTemplate(page, folderId) {
  await page.goto(`${BASE}/templates/create?folderId=${enc(folderId)}`);
  await page.getByRole('textbox', { name: 'Name' }).fill(RICH.templateName);
  await page.getByRole('textbox', { name: 'Description' }).fill(RICH.templateDescription);
  await addField(page, { type: 'ORCID', ...RICH.orcidField }, { flyoutShot: '10-field-palette-more' });
  await addField(page, { type: 'ROR', ...RICH.rorField });
  await addField(page, { type: 'text', ...RICH.diseaseField });
  await shot(page, '11-rich-fields');
  await constrainToOntology(page, RICH.ontology, {
    valuesTab: '12-values-tab',
    picker: '13-term-picker',
    ontology: '14-ontology-picker',
    branch: '15-select-branch',
    done: '16-constraint-added',
  });
  const templateId = await saveTemplate(page);
  return { templateId };
}

// ── Step 5: populate the rich template ────────────────────────────────────
// The ORCID/ROR/BioPortal lookups hit external authorities and can be slow or
// drop a request. Type with real keystrokes (fill() doesn't fire the keyup the
// lookup listens for), wait for the option, re-type on miss. Pass shotName to
// capture the open dropdown before selecting.
async function autocomplete(page, placeholder, { type, pick }, shotName) {
  const box = page.getByPlaceholder(placeholder);
  const option = typeof pick === 'string'
    ? page.getByText(pick, { exact: true })
    : page.getByText(pick);
  for (let attempt = 1; attempt <= 3; attempt++) {
    await box.click();
    await box.fill('');
    await box.pressSequentially(type, { delay: 40 });
    try {
      await option.first().waitFor({ timeout: 15_000 });
      break;
    } catch {
      if (attempt === 3) throw new Error(`autocomplete: no option matching ${pick} for "${type}"`);
      await page.waitForTimeout(1000);
    }
  }
  if (shotName) await shot(page, shotName); // dropdown open with results
  await option.first().click();
  await page.waitForTimeout(400); // let the selection commit into the field
}

export async function step5_populateRich(page, folderId, templateName) {
  await openPopulate(page, folderId, templateName);
  await autocomplete(page, 'researcher name or ORCID', RICH.values.orcid, '17-orcid-lookup');
  await autocomplete(page, 'institution name or ROR', RICH.values.ror);
  await autocomplete(page, 'Start typing to filter', RICH.values.disease, '18-disease-lookup');
  await shot(page, '19-rich-filled');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitToast(page, /metadata (have|has) been created/i);
  return { instanceId: idFromUrl(page.url()) };
}

// ── Step 6: publish a version ─────────────────────────────────────────────
export async function step6_version(page, folderId, templateName, { major, minor, patch }) {
  await gotoFolder(page, folderId);
  await openRowMenu(page, templateName);
  await menuItem(page, 'Publish version...');
  // VERIFIED (live): the dialog holds three custom numeric steppers for
  // major/minor/patch. They are plain <input>s (NOT role=spinbutton) — target
  // the visible inputs inside the modal, in DOM order.
  const nums = page.locator('.modal input, [role="dialog"] input').filter({ visible: true });
  await nums.nth(0).waitFor();
  await nums.nth(0).fill(String(major));
  await nums.nth(1).fill(String(minor));
  await nums.nth(2).fill(String(patch));
  await page.waitForTimeout(300);
  await shot(page, '20-publish-dialog');
  const ok = page.getByRole('button', { name: 'OK', exact: true });
  await ok.click();
  // The success toast text isn't reliable to match (it collides with the hidden
  // "Publish version…" menu item). The dialog closing signals the commit — wait
  // for the OK button to disappear, then show the row's new version badge.
  await ok.waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await gotoFolder(page, folderId);
  await page.waitForTimeout(800);
  await shot(page, '21-versioned');
}

// ── Step 7: OpenView (the template) ───────────────────────────────────────
// Make the published template public and open its OpenView page. We read the
// row's ↗ OpenView link rather than construct the URL, so it stays correct
// regardless of the published version's IRI.
export async function step7_openview(page, context, folderId, templateName, templateId) {
  await gotoFolder(page, folderId);
  await openRowMenu(page, templateName);
  await menuItem(page, 'Enable OpenView');
  await waitToast(page, /Made Open/i).catch(() => {});
  await page.waitForTimeout(1500); // let the open-for-viewing flag propagate
  // Reload; the enabled row now shows a ↗ link to its public OpenView page.
  await gotoFolder(page, folderId);
  await page.waitForTimeout(1000);
  let href = await row(page, templateName).locator('a[href*="openview"]').first()
    .getAttribute('href').catch(() => null);
  if (!href) href = `${OPENVIEW}/templates/${enc(templateId)}`; // fallback
  const ov = await context.newPage();
  await ov.goto(href, { waitUntil: 'networkidle' });
  await shot(ov, '22-openview');
  await ov.close();
}

// ── Teardown: delete everything in the run folder, then the folder ────────
// Deletes instances before templates (a published template can't be deleted
// while an instance of it exists) and verifies each delete by re-count.
export async function teardown(page, { folderId, folderName }) {
  await emptyAndDeleteFolder(page, folderId, folderName);
}
