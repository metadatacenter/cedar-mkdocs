// Controlled-term tutorial: drive the live Workspace, Designer, and Metadata Editor.
import { TERM } from './term-config.mjs';
import { createFolder as makeFolder, newTemplate, addField, saveTemplate, populate } from './cedar3-steps.mjs';

const button = (scope, name) => scope.getByRole('button', { name, exact: true });
const picker = page => page.getByRole('dialog', { name: 'Controlled-term constraints', exact: true });

export async function createFolder(page, folderName) {
  await makeFolder(page, async () => {}, folderName);
}

export async function startTemplate(page, capture) {
  await newTemplate(page, TERM.templateName, TERM.templateDescription);
  await capture('01-template-designer');
  for (const field of TERM.plainFields) await addField(page, { ...field, type: 'Text' }, capture);
  await capture('02-plain-fields');
}

export async function addControlledField(page, field, capture) {
  await addField(page, { ...field, type: 'Controlled Terms' }, capture);
  await page.getByRole('group', { name: field.name, exact: true })
    .getByRole('button', { name: 'Expand field settings', exact: true }).click();
  await page.getByRole('tab', { name: 'Constraints', exact: true }).click();
  await button(page, 'Edit controlled-term constraints').click();
  await picker(page).getByRole('searchbox', { name: 'Find terms', exact: true }).waitFor();
  return picker(page);
}

async function settleSearch(page) {
  // The picker keeps its last answer visible during its 250 ms input debounce.
  await page.waitForTimeout(350);
  await picker(page).locator('.working').waitFor({ state: 'hidden' });
}

export async function search(page, query, tab) {
  await picker(page).getByRole('searchbox', { name: 'Find terms', exact: true }).fill(query);
  await settleSearch(page);
  await picker(page).getByRole('tab', { name: new RegExp(`^${tab}(?: |$)`) }).click();
}

async function applySelection(page, rowName) {
  await button(picker(page), 'Select').click();
  await picker(page).getByRole('region', { name: 'Field constraints' })
    .getByRole('row', { name: rowName }).waitFor();
  await button(picker(page), 'Done').click();
  await picker(page).waitFor({ state: 'hidden' });
}

export async function collapseSettings(page) {
  await button(page, 'Collapse field settings').click();
  await button(page, 'Collapse field settings').waitFor({ state: 'hidden' });
}

export async function wholeOntology(page, capture) {
  const dialog = await addControlledField(page, TERM.cellType.field, capture);
  await settleSearch(page);
  await dialog.getByRole('button', { name: /^Cell Type in / }).waitFor();
  await capture('03-picker-modes');
  await search(page, TERM.cellType.query, 'Ontologies');
  const result = dialog.getByRole('option', { name: /^Cell OntologyCL/ });
  await result.waitFor();
  await capture('04-ontology-search');
  await result.click();
  await dialog.getByRole('heading', { name: 'Selected ontology', exact: true }).waitFor();
  await button(dialog, 'Select').waitFor();
  await capture('05-ontology-selected');
  await applySelection(page, /^Ontology Cell Ontology /);
  await capture('06-cell-type-constrained');
  await collapseSettings(page);
}

async function filterOntology(page, acronym, capture, shotName) {
  const dialog = picker(page);
  await button(dialog, 'Ontologies').click();
  await dialog.getByRole('checkbox', { name: new RegExp(`^${acronym} `) }).check();
  if (shotName) await capture(shotName);
  await button(dialog, 'Apply').click();
  await settleSearch(page);
}

export async function organBranch(page, capture) {
  const dialog = await addControlledField(page, TERM.organ.field, capture);
  await search(page, 'organ', 'Terms');
  await dialog.getByRole('button', { name: /^Organ in / }).click();
  await dialog.getByRole('option', { name: /^ACGT-MO / }).waitFor();
  await capture('07-organ-unscoped');
  // Find the ontology by name before narrowing. A broad query's ontology
  // facets may omit Uberon even when one of its terms is among the results.
  await search(page, 'Uber Anatomy Ontology', 'Ontologies');
  await dialog.getByRole('option', { name: /Uber Anatomy OntologyUBERON/ }).waitFor();
  await filterOntology(page, 'UBERON', capture, '08-organ-scope');
  await search(page, 'organ', 'Branches');
  await button(dialog, 'organ 1 ontology').waitFor();
  await capture('09-organ-scoped');
  await button(dialog, 'organ 1 ontology').click();
  await dialog.getByRole('option', { name: /^UBERON · Uber Anatomy Ontology/ }).click();
  await dialog.getByRole('list', { name: 'Hierarchy', exact: true }).waitFor();
  await dialog.getByText('UBERON_0000062', { exact: true }).waitFor();
  await capture('10-organ-branch');
  await applySelection(page, /^UBERON /);
  await capture('11-organ-constrained');
  await collapseSettings(page);
}

export async function addAssayTerm(page, term, index, capture) {
  const dialog = picker(page);
  await search(page, term.query, 'Terms');
  await filterOntology(page, 'OBI');
  await button(dialog, `${term.query} in 1 ontology`).click();
  await dialog.getByRole('option', { name: /^OBI · Ontology for Biomedical Investigations/ }).click();
  await dialog.getByRole('heading', { name: 'Selected term', exact: true }).waitFor();
  await button(dialog, 'Select').waitFor();
  if (index === 0) await capture('12-assay-search');
  await button(dialog, 'Select').click();
  await button(dialog, `Remove constraint ${index + 1}`).waitFor();
  await button(dialog, 'Done').click();
  await dialog.waitFor({ state: 'hidden' });
  if (index === 0) await capture('13-assay-one');
}

export async function assayClasses(page, capture) {
  await addControlledField(page, TERM.assay.field, capture);
  for (const [index, term] of TERM.assay.terms.entries()) {
    if (index > 0) await button(page, 'Edit controlled-term constraints').click();
    await addAssayTerm(page, term, index, capture);
  }
  await capture('14-assay-classes');
  await collapseSettings(page);
}

export async function save(page, capture) {
  await page.getByRole('textbox', { name: 'Template name', exact: true }).scrollIntoViewIfNeeded();
  await capture('15-all-fields');
  await saveTemplate(page);
  await button(page, 'Workspace').click();
  await button(page, `Actions for ${TERM.templateName}`).waitFor();
  await capture('16-saved');
}

export async function fillInstance(page, capture) {
  await populate(page, TERM.templateName, capture);
  await page.getByRole('textbox', { name: 'Sample ID', exact: true }).waitFor();
  await capture('17-instance-empty');
  await page.getByRole('textbox', { name: 'Sample ID', exact: true }).fill(TERM.instance.sampleId);
  await page.getByRole('textbox', { name: 'Lab ID', exact: true }).fill(TERM.instance.labId);
  for (const [field, query, value] of [['Cell Type', 'hepat', 'hepatocyte'], ['Organ', 'liver', 'liver']]) {
    await page.getByRole('combobox', { name: field, exact: true }).fill(query);
    const option = page.getByRole('option', { name: value, exact: true });
    await option.waitFor();
    await page.getByRole('option', { name: 'Searching…', exact: true }).waitFor({ state: 'hidden' });
    await option.click();
  }
  await page.getByRole('combobox', { name: 'Assay Type', exact: true }).click();
  await page.getByRole('option', { name: 'histopathology assay', exact: true }).waitFor();
  const options = (await page.getByRole('option').allTextContents()).map(text => text.trim()).sort();
  const expected = TERM.assay.terms.map(term => term.query).sort();
  if (JSON.stringify(options) !== JSON.stringify(expected)) {
    throw new Error(`Expected exactly the three chosen assays; received ${JSON.stringify(options)}.`);
  }
  await capture('18-instance-autocomplete');
  await page.getByRole('option', { name: 'histopathology assay', exact: true }).click();
  await button(page, 'Save').click();
  await page.getByText('Saved', { exact: true }).first().waitFor();
  await capture('19-instance-filled');
  await button(page, 'Back to Workspace').click();
  await button(page, `Actions for ${TERM.templateName} metadata`).waitFor();
}

export { TERM };
