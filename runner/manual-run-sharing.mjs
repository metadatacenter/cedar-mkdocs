// Generates the user guide's Sharing Resources screenshots into docs/img/userguide/.
//   node manual-run-sharing.mjs              build content, capture, tear down
//   HEADED=1 node manual-run-sharing.mjs     watch it in a real browser
//
// Builds the tutorial's run folder with its basic Study template, one instance and a
// sub-folder; creates a group with one collaborator; grants that collaborator, the group
// and Everyone access to the sub-folder; captures the Groups page and the Permissions
// dialog along the way; then deletes the folder tree and the group. It needs a second
// account on the same CEDAR host (config SHARING.collaborator), so it is meant for a local
// stack: CEDAR_BASE=https://cedar.metadatacenter.orgx. SKIP_TUTORIAL_SHOTS keeps the
// reused build steps from touching docs/tutorials/img.
process.env.SKIP_TUTORIAL_SHOTS = '1';

import { FAIL_DIR, BASIC } from './config.mjs';
import { launch } from './lib.mjs';
import * as S from './steps.mjs';
import * as G from './sharing-steps.mjs';
import { mkdir } from 'node:fs/promises';

const SUBFOLDER = 'Sequencing Data';

const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const { browser, page } = await launch();
page.on('dialog', d => d.accept().catch(() => {}));
let folder = null;
let stepName = 'init';

try {
  stepName = 'build-folder';
  folder = await S.step1_folder(page, runId);
  console.log(`Folder: ${folder.name}  (${folder.folderId})`);

  stepName = 'build-content';
  await S.step2_basicTemplate(page, folder.folderId);
  await S.step3_populateBasic(page, folder.folderId, BASIC.templateName);
  await G.createSubfolder(page, folder.folderId, SUBFOLDER);

  stepName = 'capture-groups';
  await G.captureGroups(page, folder.folderId);

  stepName = 'capture-group-confirmations';
  await G.captureGroupConfirmations(page);

  stepName = 'capture-folder-permissions';
  await G.captureFolderPermissions(page, folder.folderId, SUBFOLDER);

  stepName = 'capture-template-permissions';
  await G.captureTemplatePermissions(page, folder.folderId, BASIC.templateName);

  console.log('\n✅ sharing screenshots in docs/img/userguide');
} catch (err) {
  console.error(`\n❌ Failed at ${stepName}: ${err.message}`);
  try {
    await mkdir(FAIL_DIR, { recursive: true });
    await page.screenshot({ path: `${FAIL_DIR}/FAILED-sharing-${stepName}.png` }).catch(() => {});
    console.error(`   Saved ${FAIL_DIR}/FAILED-sharing-${stepName}.png`);
  } catch {}
  process.exitCode = 1;
} finally {
  console.log('\nTearing down…');
  // The folder tree first: deleting it removes the grants that name the group.
  if (folder) {
    try {
      await S.teardown(page, { folderId: folder.folderId, folderName: folder.name });
    } catch (e) {
      console.warn('Teardown incomplete:', e.message, '\n  Leftover folder:', folder?.name);
    }
  }
  try {
    if (await G.deleteGroup(page)) console.log('  🗑  group');
  } catch (e) {
    console.warn('Group teardown incomplete:', e.message);
  }
  await browser.close();
}
