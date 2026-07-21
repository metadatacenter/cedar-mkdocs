# runner/ — Playwright step-driver

Walks the CEDAR Workbench through the tutorial arc and writes screenshots
straight into the docs tree: `../docs/tutorials/img/` (the CEDAR Tutorial) and
`../docs/tutorials/term-img/` (the CEDAR Controlled Term Tutorial). Built from
[`TRACE.md`](TRACE.md).

> **Status: verified end-to-end (2026-07-16).** A full `node run.mjs` runs all
> seven steps against live CEDAR, writes `01`–`08` screenshots, and tears down
> cleanly (instances before templates, then the folder). Re-runs are
> self-contained and idempotent.

## Setup

```bash
cd runner
npm install
npx playwright install chromium
node auth.mjs            # opens a browser; log in to CEDAR; saves storageState.json
```

## Run

```bash
node run.mjs             # wipe screenshots, run all steps, tear down
node run.mjs --no-teardown   # keep the run folder/artifacts to inspect
HEADED=1 node run.mjs        # watch it happen
```

The CEDAR Controlled Term Tutorial has its own driver with the same flags:

```bash
node term-run.mjs        # builds the Tissue Sample template, writes ../docs/tutorials/term-img/
```

Each run creates its own `Tutorial Run <timestamp>` folder, builds everything
inside it, then deletes artifacts (**instances before templates**) and the
folder. On failure it saves `failures/FAILED-<step>.png` and leaves the folder
for inspection (teardown still attempts in `finally`).

## Files

| file | role |
|------|------|
| `config.mjs` | URLs, viewport, and all tutorial content (names, values, ontology) |
| `auth.mjs`   | one-time login → `storageState.json` |
| `lib.mjs`    | browser launch, screenshot, toast wait, row/menu helpers |
| `steps.mjs`  | one function per tutorial section + teardown |
| `run.mjs`    | orchestrator, CLI flags, failure capture |

## Verified selectors & gotchas (live, 2026-07-16)

- ✅ Field-type palette — unnamed FontAwesome anchors: `a:has(i.fa-font)` (text),
  `a:has(i.fa-hashtag)` (numeric), `a.more.dropdown-toggle` (More); More-flyout
  items are `<span>`s ("ORCID", "ROR", …).
- ✅ Field-editor textboxes named "Enter Field Name" / "Enter Field Help Text";
  inputs bind `ng-model-options="{ debounce: 1000 }"`, so fill then wait ~1.1s.
- ✅ **BioPortal picker**: VALUES tab via `[ng-click*="setTab('values')"]` →
  **Add** → gear `i.fa-cog` → ontology radio `#search-scope-2` → "Search field"
  → `i.fa-search` → click the ontology row → add-all `[ng-click*='addValueConstraint']`.
- ✅ **Autocomplete fields** (ORCID/ROR/DOID): address by placeholder; type with
  `pressSequentially` (fill() doesn't fire the lookup) and retry on slow
  external authorities — see `autocomplete()` in `steps.mjs`.
- ✅ **Publish dialog**: three custom numeric steppers are plain `<input>`s (NOT
  `spinbutton`); fill visible inputs in order, click **OK**, wait for the dialog
  to close (the success toast text collides with the menu item).
- ✅ **OpenView**: enable on BOTH the template *and* the instance, else the
  public page 401s ("metadata is open… but the corresponding template is not").
- ✅ **Deletion order**: instances before templates — a published template can't
  be deleted while an instance of it exists. Deletes are laggy; `deleteRowByName`
  verifies by reload-and-recount with retries.

Screenshots land in `../docs/tutorials/img/` and `../docs/tutorials/term-img/`,
which MkDocs serves directly. There is no separate publish step: the runner
writes into the docs tree in place, so `mkdocs serve` from the repo root shows
the regenerated images immediately.

`cleanup.mjs` (`node cleanup.mjs`) deletes any leftover `Tutorial Run …` folders
from interrupted `--no-teardown` runs.
