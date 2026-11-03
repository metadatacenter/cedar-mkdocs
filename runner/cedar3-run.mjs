// Capture the Angular tutorial against a real authenticated CEDAR deployment.
// Run auth.mjs with CEDAR_BASE set to the Workspace origin first. Never seeds or
// mocks the APIs, alters application code, or removes existing account content.
import { chromium } from 'playwright';
import { mkdir, copyFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { parseArgs } from 'node:util';
import * as steps from './cedar3-steps.mjs';

const { values } = parseArgs({ options: {
  workspace: { type: 'string', default: 'https://workspace.metadatacenter.orgx' },
  folder: { type: 'string', default: 'CEDAR 3 Tutorial' },
  headed: { type: 'boolean', default: false },
} });
const base = new URL(values.workspace);
if (base.protocol !== 'https:') throw new Error('--workspace must use HTTPS.');
const root = dirname(fileURLToPath(import.meta.url));
const storageState = resolve(root, `storageState.${base.hostname}.json`);
await access(storageState).catch(() => {
  throw new Error(`No saved login for ${base.origin}. Run auth.mjs with CEDAR_BASE=${base.origin} first.`);
});
const runId = new Date().toISOString().replace(/[:.]/g, '-');
const staging = resolve(root, 'failures', `cedar3-${runId}`);
const output = resolve(root, '../docs/tutorials/cedar3-img');
await mkdir(staging, { recursive: true });
const browser = await chromium.launch({ headless: !values.headed });
const context = await browser.newContext({
  storageState,
  viewport: { width: 1296, height: 824 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
});
const page = await context.newPage();
page.setDefaultTimeout(30_000);
const images = [];
const capture = async (name, target = page) => {
  await target.evaluate(() => document.fonts.ready);
  await target.screenshot({ path: resolve(staging, `${name}.jpg`), type: 'jpeg',
    quality: 95, animations: 'disabled', caret: 'hide' });
  images.push(`${name}.jpg`);
  console.log(`Captured ${name}`);
};
let section = 'folder';
try {
  await page.goto(base.origin);
  await steps.createFolder(page, capture, values.folder);
  console.log(`Tutorial folder: ${page.url()}`);
  section = 'Study template';
  await steps.basicTemplate(page, capture);
  section = 'Study metadata';
  await steps.basicInstance(page, capture);
  section = 'Clinical Study template';
  await steps.richTemplate(page, capture);
  section = 'Clinical Study metadata';
  await steps.richInstance(page, capture);
  section = 'publication';
  await steps.publishTemplate(page, capture);
  section = 'OpenView';
  await steps.openView(page, context, capture);
  if (new Set(images).size !== 22) throw new Error(`Expected 22 distinct screenshots, captured ${images.length}.`);
  // A failed run leaves the last complete documentation set intact.
  await mkdir(output, { recursive: true });
  for (const name of images) await copyFile(resolve(staging, name), resolve(output, name));
  console.log(`All 22 screenshots saved to ${output}. Tutorial artifacts retained in ${values.folder}.`);
} catch (error) {
  await page.screenshot({ path: resolve(staging, 'FAILED.jpg') }).catch(() => {});
  console.error(`Failed in ${section}; partial captures retained at ${staging}.`);
  throw error;
} finally {
  await browser.close();
}
