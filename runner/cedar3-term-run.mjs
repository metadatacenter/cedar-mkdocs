// Capture the controlled-term tutorial using real UI actions and live terminology.
import { chromium } from 'playwright';
import { mkdir, copyFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { parseArgs } from 'node:util';
import * as steps from './cedar3-term-steps.mjs';
import { buildPfas, fillPfas } from './cedar3-pfas-steps.mjs';

const { values } = parseArgs({ options: {
  workspace: { type: 'string', default: 'https://workspace.metadatacenter.orgx' },
  folder: { type: 'string', default: 'CEDAR 3 Controlled Term Tutorial' },
  headed: { type: 'boolean', default: false },
  section: { type: 'string', default: 'all' },
} });
if (!['all', 'ontology', 'pfas'].includes(values.section)) {
  throw new Error('--section must be all, ontology, or pfas.');
}
const base = new URL(values.workspace);
if (base.protocol !== 'https:') throw new Error('--workspace must use HTTPS.');
const root = dirname(fileURLToPath(import.meta.url));
const storageState = resolve(root, `storageState.${base.hostname}.json`);
await access(storageState).catch(() => {
  throw new Error(`No saved login for ${base.origin}. Run auth.mjs with CEDAR_BASE=${base.origin} first.`);
});
const runId = new Date().toISOString().replace(/[:.]/g, '-');
const staging = resolve(root, 'failures', `cedar3-term-${runId}`);
const output = resolve(root, '../docs/tutorials/cedar3-term-img');
await mkdir(staging, { recursive: true });
const browser = await chromium.launch({ headless: !values.headed });
const context = await browser.newContext({
  storageState,
  // The five-field overview and complete metadata form fit at this height.
  viewport: { width: 1296, height: 1040 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
});
const page = await context.newPage();
page.setDefaultTimeout(30_000);
const images = [];
const capture = async name => {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(staging, `${name}.jpg`), type: 'jpeg',
    quality: 95, animations: 'disabled', caret: 'hide' });
  images.push(`${name}.jpg`);
  console.log(`Captured ${name}`);
};
let section = 'folder';
try {
  await page.goto(base.origin);
  await steps.createFolder(page, values.folder);
  console.log(`Tutorial folder: ${page.url()}`);
  const ontologySteps = [
    ['template', steps.startTemplate], ['ontology', steps.wholeOntology],
    ['branch', steps.organBranch], ['classes', steps.assayClasses],
    ['save', steps.save], ['instance', steps.fillInstance],
  ];
  const pfasSteps = [['PFAS template', buildPfas], ['PFAS instance', fillPfas]];
  const selectedSteps = values.section === 'ontology' ? ontologySteps
    : values.section === 'pfas' ? pfasSteps : [...ontologySteps, ...pfasSteps];
  for (const [name, step] of selectedSteps) {
    section = name;
    await step(page, capture);
  }
  const expected = values.section === 'all' ? 25 : values.section === 'ontology' ? 19 : 6;
  if (images.length !== expected || new Set(images).size !== expected) {
    throw new Error(`Expected ${expected} distinct screenshots, captured ${images.length}.`);
  }
  await mkdir(output, { recursive: true });
  for (const name of images) await copyFile(resolve(staging, name), resolve(output, name));
  console.log(`All ${expected} screenshots saved to ${output}. Templates and instances retained in ${values.folder}.`);
} catch (error) {
  await page.screenshot({ path: resolve(staging, 'FAILED.jpg') }).catch(() => {});
  console.error(`Failed in ${section}; partial captures retained at ${staging}.`);
  throw error;
} finally {
  await browser.close();
}
