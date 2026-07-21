// One-off: delete every leftover "Tutorial Run <timestamp>" folder (and its
// contents) accumulated from --no-teardown / failed runs.
//   node cleanup.mjs
import { BASE, RUN_FOLDER_PREFIX } from './config.mjs';
import { launch, gotoFolder, row, idFromUrl, emptyAndDeleteFolder } from './lib.mjs';

// stderr is synchronous in Node — use it so progress shows live, not buffered.
const log = m => process.stderr.write(m + '\n');
const { browser, page } = await launch();

async function tutorialFolderNames() {
  await page.goto(`${BASE}/dashboard`);
  await page.getByRole('button', { name: 'New' }).waitFor();
  await page.waitForTimeout(800);
  const titles = await page.locator('div.resource-instance')
    .getByText(new RegExp(`^${RUN_FOLDER_PREFIX} `)).allInnerTexts();
  return [...new Set(titles.map(t => t.trim()).filter(Boolean))];
}

let round = 0;
while (true) {
  const names = await tutorialFolderNames();
  if (!names.length) break;
  const name = names[0];
  log(`\n[${++round}] ${name}  (${names.length} left)`);
  // Resolve the folderId by opening it.
  await row(page, name).dblclick();
  await page.waitForURL(/folderId=/);
  const folderId = idFromUrl(page.url());
  try {
    await emptyAndDeleteFolder(page, folderId, name, log);
  } catch (e) {
    log(`  ⚠ ${name}: ${e.message} — stopping`);
    break;
  }
}

log('\nDone.');
await browser.close();
