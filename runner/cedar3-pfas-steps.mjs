// PFAS value sets: each method list, their union, and chemical identifier lookup.
import { newTemplate, saveTemplate, populate } from './cedar3-steps.mjs';
import { addControlledField, search, collapseSettings } from './cedar3-term-steps.mjs';

const button = (scope, name) => scope.getByRole('button', { name, exact: true });
const methods = {
  '533': { count: 25, url: 'https://cdxapps.epa.gov/oms-substance-registry-services/substance-list-details/477' },
  '537.1': { count: 18, url: 'https://cdxapps.epa.gov/oms-substance-registry-services/substance-list-details/475' },
};

export const PFAS = {
  name: 'PFAS Test',
  description: 'Three optional chemical fields restricted to EPA Method 533, EPA Method 537.1, and both method lists together. Each selected value set links to its EPA list; selected chemicals link to CompTox.',
  fields: [
    { name: 'PFAS Method 533', methods: ['533'], count: 25,
      help: 'Choose a PFAS chemical from EPA Method 533 (25 chemicals). Search by name, synonym, CAS number or DTXSID.' },
    { name: 'PFAS Method 537.1', key: 'PFAS Method 537-1', methods: ['537.1'], count: 18,
      help: 'Choose a PFAS chemical from EPA Method 537.1 (18 chemicals). Search by name, synonym, CAS number or DTXSID.' },
    { name: 'PFAS Drinking Water', methods: ['533', '537.1'], count: 29,
      help: 'Choose a PFAS chemical from either EPA Method 533 or EPA Method 537.1 (two selected value sets; 29 distinct chemicals). Search by name, synonym, CAS number or DTXSID.' },
  ],
};

export async function buildPfas(page, capture) {
  await newTemplate(page, PFAS.name, PFAS.description);
  for (const [fieldIndex, field] of PFAS.fields.entries()) {
    const dialog = await addControlledField(page, field, capture);
    await search(page, 'PFAS', 'Value sets');
    await dialog.getByRole('option', { name: /^PFAS — EPA Method 533EPA-PFAS.*25 values$/ }).waitFor();
    await dialog.getByRole('option', { name: /^PFAS — EPA Method 537\.1EPA-PFAS.*18 values$/ }).waitFor();
    await dialog.getByRole('option', { name: /^PFAS — Drinking water, combined methods.*29 values$/ }).waitFor();
    if (fieldIndex === 0) await capture('20-pfas-value-sets');
    for (const [index, method] of field.methods.entries()) {
      const label = `PFAS — EPA Method ${method}`;
      const result = dialog.getByRole('option').filter({ hasText: `${label}EPA-PFAS` });
      await result.click();
      await dialog.getByRole('heading', { name: 'Selected value set', exact: true }).waitFor();
      await dialog.getByRole('definition').filter({ hasText: methods[method].url }).waitFor();
      if (fieldIndex === 0) await capture('21-pfas-set-selected');
      await button(dialog, 'Select').click();
      await button(dialog, `Remove constraint ${index + 1}`).waitFor();
    }
    if (fieldIndex === 2) await capture('22-pfas-combined-sets');
    await button(dialog, 'Done').click();
    await dialog.waitFor({ state: 'hidden' });
    // The field specification must retain each method's own EPA landing page.
    const fieldCard = page.getByRole('group', { name: field.name, exact: true });
    if (field.key) {
      await fieldCard.getByRole('tab', { name: 'Configuration', exact: true }).click();
      // A period is valid in the display label, but not in the JSON property key.
      await fieldCard.getByRole('textbox', { name: 'Key', exact: true }).fill(field.key);
      await fieldCard.getByRole('textbox', { name: 'Key', exact: true }).press('Tab');
    }
    for (const method of field.methods) {
      const link = fieldCard.getByRole('link', { name: `PFAS — EPA Method ${method} (EPA-PFAS)`, exact: true }).first();
      if (await link.getAttribute('href') !== methods[method].url) {
        throw new Error(`Incorrect EPA source link for ${field.name}, Method ${method}.`);
      }
    }
    await collapseSettings(page);
  }
  await page.getByRole('textbox', { name: 'Template name', exact: true }).scrollIntoViewIfNeeded();
  await saveTemplate(page);
  await capture('23-pfas-template');
  await button(page, 'Workspace').click();
  await button(page, `Actions for ${PFAS.name}`).waitFor();
}

async function suggestionsReady(page) {
  await page.waitForTimeout(400);
  await page.getByRole('option', { name: 'Searching…', exact: true }).waitFor({ state: 'hidden' });
  await page.getByRole('option').first().waitFor();
}

export async function fillPfas(page, capture) {
  await populate(page, PFAS.name, capture);
  const input = name => page.getByRole('combobox', { name, exact: true });
  const memberships = [];
  for (const field of PFAS.fields) {
    await input(field.name).click();
    await suggestionsReady(page);
    const labels = (await page.getByRole('option').allTextContents()).map(text => text.trim());
    if (labels.length !== field.count || new Set(labels).size !== field.count) {
      throw new Error(`${field.name}: expected ${field.count} distinct chemicals; received ${labels.length}.`);
    }
    memberships.push(labels);
    await input(field.name).press('Escape');
  }
  const union = [...new Set([...memberships[0], ...memberships[1]])].sort();
  if (JSON.stringify(union) !== JSON.stringify(memberships[2].sort())) {
    throw new Error('The combined field must offer exactly the union of the two method lists.');
  }
  // All four supported query forms must resolve to the same PFOA chemical.
  for (const query of ['Perfluorooctanoic acid', 'PFOA', '335-67-1', 'DTXSID8031865']) {
    await input(PFAS.fields[0].name).fill(query);
    await suggestionsReady(page);
    await page.getByRole('option', { name: 'Perfluorooctanoic acid', exact: true }).waitFor();
  }
  await capture('24-pfas-search');
  await page.getByRole('option', { name: 'Perfluorooctanoic acid', exact: true }).click();
  for (const [field, query, label] of [
    [PFAS.fields[1].name, 'PFOS', 'Perfluorooctanesulfonic acid'],
    [PFAS.fields[2].name, 'PFHxA', 'Perfluorohexanoic acid'],
  ]) {
    await input(field).fill(query);
    await suggestionsReady(page);
    await page.getByRole('option', { name: label, exact: true }).click();
  }
  await page.getByRole('link', { name: 'Open the comptox.epa.gov page', exact: true }).nth(2).waitFor();
  const links = await page.getByRole('link', { name: 'Open the comptox.epa.gov page', exact: true })
    .evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  const expected = ['DTXSID8031865', 'DTXSID3031864', 'DTXSID3031862']
    .map(id => `https://comptox.epa.gov/dashboard/chemical/details/${id}`);
  if (JSON.stringify(links) !== JSON.stringify(expected)) {
    throw new Error(`Incorrect CompTox links: ${JSON.stringify(links)}.`);
  }
  await button(page, 'Save').click();
  await page.getByText('Saved', { exact: true }).first().waitFor();
  await capture('25-pfas-filled');
  await button(page, 'Back to Workspace').click();
  await button(page, `Actions for ${PFAS.name} metadata`).waitFor();
}
