// Second-pass building-page captures: controlled-term Values tab + BioPortal
// picker, the import/finder window, and the Element / stand-alone Field creation
// forms. Isolated from manual-run.mjs so it iterates fast. Never touches the
// tutorial image set (SKIP_TUTORIAL_SHOTS) and tears down what it makes.
process.env.SKIP_TUTORIAL_SHOTS = '1';

import { FAIL_DIR, BASE } from './config.mjs';
import { launch, enc } from './lib.mjs';
import * as S from './steps.mjs';
import * as M from './manual-steps.mjs';
import { mkdir } from 'node:fs/promises';

const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const { browser, page } = await launch();
page.on('dialog', d => d.accept().catch(() => {})); // auto-dismiss browser leave prompts
const artifacts = [];
let folder = null;
let stepName = 'init';

async function tryStep(name, fn) {
  stepName = name;
  try { await fn(); console.log(`  ✓ ${name}`); }
  catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
    try { await mkdir(FAIL_DIR, { recursive: true }); await page.screenshot({ path: `${FAIL_DIR}/FAILED-building-${name}.png` }).catch(() => {}); } catch {}
  }
}

try {
  stepName = 'build-folder';
  folder = await S.step1_folder(page, runId);
  console.log(`Folder: ${folder.name}  (${folder.folderId})`);

  await tryStep('import-window', () => M.captureImportWindow(page, folder.folderId));

  console.log('\n✅ building second-pass screenshots in docs/img/userguide');
} catch (err) {
  console.error(`\n❌ Failed at ${stepName}: ${err.message}`);
  try {
    await mkdir(FAIL_DIR, { recursive: true });
    await page.screenshot({ path: `${FAIL_DIR}/FAILED-building-${stepName}.png` }).catch(() => {});
    console.error(`   Saved ${FAIL_DIR}/FAILED-building-${stepName}.png`);
  } catch {}
  process.exitCode = 1;
} finally {
  if (folder) {
    console.log('\nTearing down…');
    try {
      await S.teardown(page, { folderId: folder.folderId, folderName: folder.name, artifacts });
    } catch (e) {
      console.warn('Teardown incomplete:', e.message, '\n  Leftover folder:', folder?.name);
    }
  }
  await browser.close();
}