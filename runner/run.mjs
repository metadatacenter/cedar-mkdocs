// Orchestrates the tutorial run.
//   node run.mjs                full run: wipe screenshots, run all steps, tear down
//   node run.mjs --no-teardown  keep artifacts (for debugging a run)
//   HEADED=1 node run.mjs       watch it in a real browser
//
// Every run is self-contained: it creates its own "Tutorial Run <id>" folder,
// builds everything inside it, then deletes artifacts (instances before
// templates) and the folder. See TRACE.md.
import { rm, mkdir } from 'node:fs/promises';
import { IMG_DIR, FAIL_DIR, RICH, BASIC } from './config.mjs';
import { launch } from './lib.mjs';
import * as S from './steps.mjs';

const argv = new Set(process.argv.slice(2));
const noTeardown = argv.has('--no-teardown');
const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

const { browser, context, page } = await launch();
const artifacts = [];            // {name, kind} for teardown
let folder = null;
let stepName = 'init';

try {
  await rm(IMG_DIR, { recursive: true, force: true });
  await mkdir(IMG_DIR, { recursive: true });

  stepName = '1-folder';
  folder = await S.step1_folder(page, runId);
  console.log(`Folder: ${folder.name}  (${folder.folderId})`);

  stepName = '2-basic-template';
  const basic = await S.step2_basicTemplate(page, folder.folderId);
  artifacts.push({ name: BASIC.templateName, kind: 'template' });

  stepName = '3-populate-basic';
  await S.step3_populateBasic(page, folder.folderId, BASIC.templateName);
  artifacts.push({ name: `${BASIC.templateName} metadata`, kind: 'instance' });

  stepName = '4-rich-template';
  const rich = await S.step4_richTemplate(page, folder.folderId);
  artifacts.push({ name: RICH.templateName, kind: 'template' });

  stepName = '5-populate-rich';
  const richInstance = await S.step5_populateRich(page, folder.folderId, RICH.templateName);
  const richInstanceName = `${RICH.templateName} metadata`;
  artifacts.push({ name: richInstanceName, kind: 'instance' });

  stepName = '6-version';
  await S.step6_version(page, folder.folderId, RICH.templateName, RICH.publish);

  stepName = '7-openview';
  await S.step7_openview(page, context, folder.folderId, RICH.templateName, rich.templateId);

  console.log('\n✅ All steps complete. Screenshots in', IMG_DIR);
} catch (err) {
  console.error(`\n❌ Failed at step ${stepName}: ${err.message}`);
  try {
    await mkdir(FAIL_DIR, { recursive: true });
    await page.screenshot({ path: `${FAIL_DIR}/FAILED-${stepName}.png` }).catch(() => {});
    console.error(`   Saved ${FAIL_DIR}/FAILED-${stepName}.png`);
  } catch {}
  process.exitCode = 1;
} finally {
  if (folder && !noTeardown) {
    console.log('\nTearing down…');
    try {
      await S.teardown(page, { folderId: folder.folderId, folderName: folder.name, artifacts });
    } catch (e) {
      console.warn('Teardown incomplete:', e.message,
        '\n  Leftover folder:', folder?.name, '— remove it manually.');
    }
  } else if (folder) {
    console.log('\n--no-teardown: leaving folder', folder.name);
  }
  await browser.close();
}
