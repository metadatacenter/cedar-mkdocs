// Captures the two CEE previews used by the CEDAR MCPs Tutorial.
//
// The caller creates the sessions through cedar-cee-mcp's show_template and show_instance tools
// and keeps that process running while this script visits their loopback URLs.
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const [templateUrl, instanceUrl] = process.argv.slice(2);
if (!templateUrl || !instanceUrl) {
  console.error('Usage: node mcp-capture.mjs <show-template-url> <show-instance-url>');
  process.exit(2);
}

for (const url of [templateUrl, instanceUrl]) {
  const parsed = new URL(url);
  if (!['127.0.0.1', 'localhost', '::1'].includes(parsed.hostname) || !parsed.pathname.startsWith('/s/')) {
    throw new Error(`Expected a cedar-cee-mcp loopback session URL, got ${url}`);
  }
}

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, '..', 'docs', 'img', 'tutorials');
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: !process.env.HEADED });
const context = await browser.newContext({
  viewport: { width: 1000, height: 878 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
});

async function capture(url, filename) {
  const page = await context.newPage();
  const browserProblems = [];
  page.on('console', message => {
    if (message.type() === 'error') browserProblems.push(message.text());
  });
  page.on('pageerror', error => browserProblems.push(error.message));

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
      const status = document.querySelector('#status');
      return customElements.get('cedar-embeddable-editor')
        && status
        && !status.textContent.includes('Loading the CEDAR Embeddable Editor');
    }, null, { timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.scrollingElement?.scrollTo(0, 0);
    });

    const status = await page.locator('#status').innerText();
    const statusIsError = await page.locator('#status').evaluate(node => node.classList.contains('error'));
    if (statusIsError || status.includes('CEE reported') || browserProblems.length) {
      throw new Error(`CEE preview reported a problem: ${[status, ...browserProblems].join(' | ')}`);
    }

    const output = resolve(outputDir, filename);
    await page.screenshot({ path: output });
    console.log(`Wrote ${output}`);
  } finally {
    await page.close();
  }
}

try {
  await capture(templateUrl, 'mcps-tutorial-template.png');
  await capture(instanceUrl, 'mcps-tutorial-instance.png');
} finally {
  await browser.close();
}
