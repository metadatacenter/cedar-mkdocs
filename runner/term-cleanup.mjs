// Delete leftover "Term Tutorial Run <timestamp>" folders (and contents).
//   node term-cleanup.mjs
import { BASE, RUN_FOLDER_PREFIX } from './term-config.mjs';
import { launch, row, idFromUrl, emptyAndDeleteFolder } from './lib.mjs';
const log = m => process.stderr.write(m + '\n');
const { browser, page } = await launch();
async function names() {
  await page.goto(`${BASE}/dashboard`);
  await page.getByRole('button', { name: 'New' }).waitFor();
  await page.waitForTimeout(800);
  const t = await page.locator('div.resource-instance')
    .getByText(new RegExp(`^${RUN_FOLDER_PREFIX} `)).allInnerTexts();
  return [...new Set(t.map(x => x.trim()).filter(Boolean))];
}
let round = 0;
while (true) {
  const ns = await names();
  if (!ns.length) break;
  const name = ns[0];
  log(`\n[${++round}] ${name}  (${ns.length} left)`);
  await row(page, name).dblclick();
  await page.waitForURL(/folderId=/);
  const folderId = idFromUrl(page.url());
  try { await emptyAndDeleteFolder(page, folderId, name, log); }
  catch (e) { log(`  ⚠ ${name}: ${e.message} — stopping`); break; }
}
log('\nDone.');
await browser.close();
