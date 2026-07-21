// Orchestrates the controlled-term tutorial run.
//   node term-run.mjs                full run + teardown
//   node term-run.mjs --no-teardown  keep the folder to inspect
//   HEADED=1 node term-run.mjs       watch it
import { rm, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './lib.mjs';
import { TERM } from './term-config.mjs';
import * as T from './term-steps.mjs';

const IMG = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'tutorials', 'term-img');
const FAIL = resolve(dirname(fileURLToPath(import.meta.url)), 'failures');
const argv = new Set(process.argv.slice(2));
const noTeardown = argv.has('--no-teardown');
const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

const { browser, page } = await launch();
let folder = null;
let step = 'init';
try {
  await rm(IMG, { recursive: true, force: true });
  await mkdir(IMG, { recursive: true });

  step = 'folder';
  folder = await T.createFolder(page, runId);
  console.log(`Folder: ${folder.name}  (${folder.folderId})`);

  step = 'build-template';
  await T.buildTemplate(page, folder.folderId);

  step = 'fill-instance';
  await T.fillInstance(page, folder.folderId, TERM.templateName);

  console.log('\n✅ All steps complete. Screenshots in', IMG);
} catch (err) {
  console.error(`\n❌ Failed at ${step}: ${err.message}`);
  try {
    await mkdir(FAIL, { recursive: true });
    await page.screenshot({ path: `${FAIL}/FAILED-term-${step}.png` }).catch(() => {});
    console.error(`   Saved ${FAIL}/FAILED-term-${step}.png`);
  } catch {}
  process.exitCode = 1;
} finally {
  if (folder && !noTeardown) {
    console.log('\nTearing down…');
    try {
      await T.teardown(page, { folderId: folder.folderId, folderName: folder.name });
    } catch (e) {
      console.warn('Teardown incomplete:', e.message, '\n  Leftover folder:', folder?.name);
    }
  } else if (folder) {
    console.log('\n--no-teardown: leaving folder', folder.name);
  }
  await browser.close();
}
