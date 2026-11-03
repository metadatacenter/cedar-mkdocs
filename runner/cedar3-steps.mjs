// Angular Workspace / CED / CEE tutorial. All data is entered through the UI.
// The driver supplies capture(), so these steps also work with a connected browser.
import { BASIC, RICH } from './config.mjs';

const button = (page, name) => page.getByRole('button', { name, exact: true });
const textbox = (page, name) => page.getByRole('textbox', { name, exact: true });

export async function createFolder(page, capture, folderName) {
  await button(page, 'New').waitFor({ state: 'visible' });
  if (await button(page, `Actions for ${folderName}`).count()) {
    throw new Error(`The folder ${JSON.stringify(folderName)} already exists. Choose another --folder.`);
  }
  await button(page, 'New').click();
  await capture('01-new-menu');
  await button(page, 'Folder').click();
  await textbox(page, 'Name').fill(folderName);
  await capture('02-folder-dialog');
  await button(page, 'Save').click();
  await page.getByText(folderName, { exact: true }).waitFor({ state: 'visible' });
  await page.getByText(folderName, { exact: true }).dblclick();
  await page.getByRole('link', { name: folderName, exact: true }).waitFor({ state: 'visible' });
}

export async function newTemplate(page, name, description) {
  await button(page, 'New').click();
  await page.getByRole('link', { name: 'Template', exact: true }).click();
  await textbox(page, 'Template name').fill(name);
  if (description) await textbox(page, 'Description').fill(description);
}

export async function addField(page, { type, name, help }, capture, shotName) {
  const index = await textbox(page, 'Enter field name').count();
  await button(page, 'Add field').click();
  await button(page, type).click();
  // Wait for the newly added card, rather than racing Angular and renaming the
  // previous card while it is still the last textbox in the DOM.
  await textbox(page, 'Enter field name').nth(index).fill(name);
  if (help || shotName) {
    await button(page, 'Expand field settings').last().click();
    if (help) await textbox(page, 'Display description').fill(help);
    if (shotName) await capture(shotName);
    await button(page, 'Collapse field settings').click();
    await button(page, 'Collapse field settings').waitFor({ state: 'hidden' });
  }
}

export async function saveTemplate(page) {
  await button(page, 'Save').click();
  await page.getByText('Saved', { exact: true }).first().waitFor({ state: 'visible' });
}

export async function basicTemplate(page, capture) {
  await newTemplate(page, BASIC.templateName);
  await capture('03-template-designer');
  await addField(page, { ...BASIC.fields[0], type: 'Text' }, capture, '04-name-a-field');
  await addField(page, { ...BASIC.fields[1], type: 'Number' }, capture);
  await saveTemplate(page);
  await capture('05-two-fields');
  await button(page, 'Workspace').click();
}

export async function populate(page, name, capture, shotName) {
  await button(page, `Actions for ${name}`).click();
  await button(page, 'Populate').waitFor({ state: 'visible' });
  if (shotName) await capture(shotName);
  await button(page, 'Populate').click();
}

export async function basicInstance(page, capture) {
  await populate(page, BASIC.templateName, capture, '06-populate-menu');
  await textbox(page, 'Study Name').waitFor({ state: 'visible' });
  await capture('07-empty-form');
  await textbox(page, 'Study Name').fill(BASIC.values['Study Name']);
  await page.getByRole('spinbutton', { name: 'Number of Participants', exact: true })
    .fill(BASIC.values['Number of Participants']);
  await capture('08-filled-form');
  await button(page, 'Save').click();
  await page.getByText('Saved', { exact: true }).first().waitFor({ state: 'visible' });
  await button(page, 'Back to Workspace').click();
  await button(page, 'Actions for Study metadata').waitFor({ state: 'visible' });
  await capture('09-study-metadata');
}

export async function richTemplate(page, capture) {
  await newTemplate(page, RICH.templateName, RICH.templateDescription);
  await button(page, 'Add field').click();
  await button(page, 'ORCID').waitFor({ state: 'visible' });
  await capture('10-field-palette-more');
  await button(page, 'Close field picker').click();
  await button(page, 'Close field picker').waitFor({ state: 'hidden' });
  await addField(page, { type: 'ORCID', ...RICH.orcidField }, capture);
  await addField(page, { type: 'ROR', ...RICH.rorField }, capture);
  await addField(page, { type: 'Controlled Terms', ...RICH.diseaseField }, capture);
  await capture('11-rich-fields');
  await page.getByRole('group', { name: 'Disease', exact: true })
    .getByRole('button', { name: 'Expand field settings', exact: true }).click();
  await page.getByRole('tab', { name: 'Constraints', exact: true }).click();
  await button(page, 'Edit controlled-term constraints').waitFor({ state: 'visible' });
  await capture('12-values-tab');
  await button(page, 'Edit controlled-term constraints').click();
  const picker = page.getByRole('dialog', { name: 'Controlled-term constraints', exact: true });
  await picker.getByRole('button', { name: /^disease in /i }).waitFor({ state: 'visible' });
  await capture('13-term-picker');
  await picker.getByRole('searchbox', { name: 'Find terms', exact: true }).fill(RICH.ontology.query);
  await picker.getByRole('tab', { name: /^Ontologies / }).click();
  await picker.getByRole('option', { name: /Human Disease OntologyDOID/ }).waitFor({ state: 'visible' });
  await button(picker, 'Ontologies').click();
  await picker.getByRole('checkbox', { name: 'DOID Human Disease Ontology', exact: true }).check();
  await capture('14-ontology-picker');
  await button(picker, 'Apply').click();
  await picker.getByRole('searchbox', { name: 'Find terms', exact: true }).fill('disease');
  await picker.getByRole('tab', { name: /^Branches / }).click();
  await button(picker, 'disease 1 ontology').click();
  await picker.getByRole('option', { name: /^DOID · Human Disease Ontology/ }).click();
  await picker.getByRole('list', { name: 'Hierarchy', exact: true }).waitFor({ state: 'visible' });
  await button(picker, 'Select').waitFor({ state: 'visible' });
  await capture('15-select-branch');
  await button(picker, 'Select').click();
  await picker.getByRole('region', { name: 'Field constraints' }).getByText('disease', { exact: true })
    .waitFor({ state: 'visible' });
  await button(picker, 'Done').click();
  await picker.waitFor({ state: 'hidden' });
  await capture('16-constraint-added');
  await saveTemplate(page);
  await button(page, 'Workspace').click();
}

export async function richInstance(page, capture) {
  await populate(page, RICH.templateName, capture);
  await textbox(page, 'Principal Investigator').pressSequentially(RICH.values.orcid.type, { delay: 40 });
  const researcher = page.getByRole('option', { name: RICH.values.orcid.pick });
  await researcher.waitFor({ state: 'visible' });
  await capture('17-orcid-lookup');
  await researcher.click();
  await textbox(page, 'Institution').pressSequentially(RICH.values.ror.type, { delay: 40 });
  await page.getByRole('option', { name: RICH.values.ror.pick }).click();
  await page.getByRole('combobox', { name: 'Disease', exact: true })
    .pressSequentially(RICH.values.disease.type, { delay: 60 });
  await page.getByRole('option', { name: 'asthma', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('option', { name: 'Searching…', exact: true }).waitFor({ state: 'hidden' });
  await capture('18-disease-lookup');
  await page.getByRole('option', { name: 'asthma', exact: true }).click();
  await button(page, 'Save').click();
  await page.getByText('Saved', { exact: true }).first().waitFor({ state: 'visible' });
  await capture('19-rich-filled');
  await button(page, 'Back to Workspace').click();
}

export async function publishTemplate(page, capture) {
  await button(page, `Actions for ${RICH.templateName}`).click();
  await button(page, 'Publish').click();
  const dialog = page.getByRole('dialog', { name: 'Publish', exact: true });
  await textbox(dialog, 'Major').fill(String(RICH.publish.major));
  await textbox(dialog, 'Minor').fill(String(RICH.publish.minor));
  await textbox(dialog, 'Patch').fill(String(RICH.publish.patch));
  await capture('20-publish-dialog');
  await button(dialog, 'Ok').click();
  await dialog.waitFor({ state: 'hidden' });
  const row = page.getByRole('row').filter({ has: button(page, `Actions for ${RICH.templateName}`) });
  await row.getByText('1.0.0', { exact: false }).waitFor({ state: 'visible' });
  await capture('21-versioned');
}

export async function openView(page, context, capture) {
  await button(page, `Actions for ${RICH.templateName}`).click();
  await button(page, 'Enable Openview').click();
  const dialog = page.getByRole('dialog', { name: 'Enable Openview', exact: true });
  await button(dialog, 'Ok').click();
  await dialog.waitFor({ state: 'hidden' });
  const row = page.getByRole('row').filter({ has: button(page, `Actions for ${RICH.templateName}`) });
  const url = await row.getByRole('link', { name: 'Open in OpenView', exact: true }).getAttribute('href');
  if (!url) throw new Error('The published template has no OpenView link.');
  // A fresh context proves the page works without a CEDAR account.
  const publicContext = await context.browser().newContext({
    viewport: page.viewportSize(), deviceScaleFactor: 2, colorScheme: 'light',
  });
  try {
    const publicPage = await publicContext.newPage();
    await publicPage.goto(url);
    await publicPage.getByRole('heading', { name: RICH.templateName, exact: true }).waitFor({ state: 'visible' });
    await publicPage.getByRole('link', { name: 'disease of the DOID (DOID)', exact: true }).waitFor({ state: 'visible' });
    await capture('22-openview', publicPage);
  } finally {
    await publicContext.close();
  }
}

export { BASIC, RICH };
