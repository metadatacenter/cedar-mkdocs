// Generates the Artifact Versioning figures of the user guide into docs/img/userguide/.
//   node manual-run-versioning.mjs                 build the arc, capture, tear down
//   node manual-run-versioning.mjs --no-teardown   keep the folder to inspect
//   HEADED=1 node manual-run-versioning.mjs        watch it in a real browser
//
// The page needs a version series rather than a single artifact, so the run builds one: an
// element published, drafted again, reused by a template, edited, propagated, populated and
// published a second time. SKIP_TUTORIAL_SHOTS keeps the reused tutorial helpers from writing
// into docs/tutorials/img. The run never wipes docs/img/userguide (other kept images live there).
process.env.SKIP_TUTORIAL_SHOTS = '1';

import { mkdir } from 'node:fs/promises';
import { FAIL_DIR, VERSIONING } from './config.mjs';
import { launch } from './lib.mjs';
import * as V from './versioning-steps.mjs';

const noTeardown = process.argv.includes('--no-teardown');
const { browser, page } = await launch();
let folder = null;
let stepName = 'init';

try {
  stepName = 'folder';
  folder = await V.step1_folder(page);
  console.log(`Folder: ${folder.name}  (${folder.folderId})`);

  stepName = 'element';
  const { elementId } = await V.step2_element(page, folder.folderId);

  stepName = 'draft-menu';
  await V.step3_draftMenu(page, folder.folderId);

  stepName = 'publish';
  await V.step4_publish(page, folder.folderId);

  stepName = 'published';
  await V.step5_published(page, folder.folderId, elementId);

  // The draft created from the first release carries the suggested next patch number.
  const { major, minor, patch } = VERSIONING.firstRelease;
  const draftVersion = `${major}.${minor}.${patch + 1}`;

  stepName = 'create-version';
  const { draftId } = await V.step6_createVersion(page, folder.folderId, draftVersion);

  stepName = 'template';
  const { templateId } = await V.step7_template(page, folder.folderId, draftVersion);

  stepName = 'propagate';
  await V.step8_propagate(page, folder.folderId, draftId, templateId);

  stepName = 'instance';
  await V.step9_instance(page, folder.folderId);

  stepName = 'in-use';
  await V.step10_inUse(page, folder.folderId, draftId);

  stepName = 'second-release';
  await V.step11_secondRelease(page, folder.folderId);

  stepName = 'history';
  await V.step12_history(page, folder.folderId);

  stepName = 'latest-filter';
  await V.step13_latestFilter(page, folder.folderId);

  console.log('\n✅ versioning screenshots in docs/img/userguide');
} catch (err) {
  console.error(`\n❌ Failed at ${stepName}: ${err.message}`);
  try {
    await mkdir(FAIL_DIR, { recursive: true });
    await page.screenshot({ path: `${FAIL_DIR}/FAILED-versioning-${stepName}.png` }).catch(() => {});
    console.error(`   Saved ${FAIL_DIR}/FAILED-versioning-${stepName}.png`);
  } catch {}
  process.exitCode = 1;
} finally {
  if (folder && !noTeardown) {
    console.log('\nTearing down…');
    try {
      await V.teardown(page, { folderId: folder.folderId, folderName: folder.name });
    } catch (e) {
      console.warn('Teardown incomplete:', e.message, '\n  Leftover folder:', folder?.name);
    }
  }
  await browser.close();
}
