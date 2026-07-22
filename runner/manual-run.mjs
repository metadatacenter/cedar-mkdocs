// Generates the user-guide (manual) screenshots into docs/img/userguide/.
//   node manual-run.mjs              build content, capture, tear down
//   HEADED=1 node manual-run.mjs     watch it in a real browser
//
// Reuses the tutorial's content build (a "Study Folder" with the basic Study
// template and one instance) to give the workspace representative content, then
// captures the workspace and resource-management screenshots the manual needs
// and deletes what it made. SKIP_TUTORIAL_SHOTS makes the reused build steps
// skip their own screenshots, so a manual run never touches docs/tutorials/img.
// It never wipes docs/img/userguide (other kept images live there).
process.env.SKIP_TUTORIAL_SHOTS = '1';

import { FAIL_DIR, BASIC } from './config.mjs';
import { launch } from './lib.mjs';
import * as S from './steps.mjs';
import * as M from './manual-steps.mjs';
import { mkdir } from 'node:fs/promises';

const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const { browser, page } = await launch();
const artifacts = [];
let folder = null;
let stepName = 'init';

try {
  stepName = 'build-folder';
  folder = await S.step1_folder(page, runId);
  console.log(`Folder: ${folder.name}  (${folder.folderId})`);

  stepName = 'build-template';         // captures the Template Designer figures
  await M.captureBuildTemplate(page, folder.folderId);
  artifacts.push({ name: BASIC.templateName, kind: 'template' });

  stepName = 'fill-form';              // captures the empty/filled metadata form
  await M.captureFillForm(page, folder.folderId, BASIC.templateName);
  artifacts.push({ name: `${BASIC.templateName} metadata`, kind: 'instance' });

  stepName = 'capture-overview';
  await M.captureOverview(page, folder.folderId);

  stepName = 'capture-cards';
  await M.captureCards(page, folder.folderId);

  stepName = 'capture-resource-menu';
  await M.captureResourceMenu(page, folder.folderId, BASIC.templateName);

  stepName = 'capture-destination-dialog';
  await M.captureDestinationDialog(page, folder.folderId, BASIC.templateName);

  // Info panel last: opening it leaves the panel open, which would clutter the
  // menu/dialog shots above.
  stepName = 'capture-info-panel';
  await M.captureInfoPanel(page, folder.folderId, BASIC.templateName);

  console.log('\n✅ user-guide screenshots in docs/img/userguide');
} catch (err) {
  console.error(`\n❌ Failed at ${stepName}: ${err.message}`);
  try {
    await mkdir(FAIL_DIR, { recursive: true });
    await page.screenshot({ path: `${FAIL_DIR}/FAILED-manual-${stepName}.png` }).catch(() => {});
    console.error(`   Saved ${FAIL_DIR}/FAILED-manual-${stepName}.png`);
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
