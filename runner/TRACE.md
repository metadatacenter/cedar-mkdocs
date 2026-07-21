# CEDAR UI Trace — mapped flow for the runner

Captured by driving the live CEDAR Workbench (v2.8.3, cedar.metadatacenter.org)
through the full tutorial arc once, by hand. This is the spec the Playwright
runner is built from. Every step lists its entry URL, the actions, and the
gotchas found. Selectors marked *(confirm)* still need one verification pass
against the live DOM when writing the runner.

## Global

- **Base:** `https://cedar.metadatacenter.org`
- **Auth:** log in once in a browser the runner opens; save Playwright
  `storageState.json` (git-ignored) and reuse. No credentials in the repo.
- **Folder URL pattern:** `/dashboard?folderId=<url-encoded folder IRI>`
  where a folder IRI looks like `https://repo.metadatacenter.org/folders/<uuid>`.
- **Deep links let the runner skip menu navigation** (see each step).
- **"Step done" signal:** a green toast bottom-right, e.g. "The template
  *X* has been created", "was published", "Made Open", "The … has been deleted".
- **Viewport for screenshots:** fixed `1600×1000`, `deviceScaleFactor: 2`,
  `colorScheme: 'light'`; disable CSS animations before each shot.

### Artifact row ⋮ menu (template)
Populate · Open · Share… · Copy to… · Move to… · Rename… · Copy folder Id ·
Copy parent folder Id · Download JSON/YAML/Compact YAML · **Publish version…** ·
**Create version…** (grayed until published) · **Delete** · Create DOI using DataCite…

### Instance row ⋮ menu
Same, **plus "Enable OpenView"**, and **without** Publish/Create version.

### Field-type palette (template designer, right rail)
Direct icons: **A** text · calendar date · envelope email · **#** numeric ·
**⋯ (More)** · magnifier search.
**More** menu: Link · Rich Text · Paragraph · Image · Multiple Choice · YouTube ·
Checkbox · **ORCID** · Pick from a list · **ROR** · Phone · PFAS · Attribute Value ·
RRID · Page Break · Pubmed · Section Break.

---

## Step 1 — Create a folder
- From dashboard: **New +** → **Folder** → dialog "New folder" with one text
  input + **SAVE**.
- **Gotcha:** the dialog input ignores synthetic keystrokes in the in-app
  browser; use `fill()` (Playwright `fill` works). Verify the folder appears
  (list may need a reload).
- Result: double-click the folder row to enter it; note its `folderId` from the URL.

## Step 2 — Create a study template + add fields
- Deep link: `/templates/create?folderId=<encoded folder IRI>`.
- Header inputs: **Name**, Identifier, **Version** (default `0.0.1`), **Description**.
- Add a field: click a palette icon (e.g. **A** text, **#** numeric). A field
  card appears; its editor shows **Enter Field Name**, **Enter Preferred Label**,
  **Enter Field Help Text**, and tabs OPTIONS · VALUES · REQUIRED · MULTIPLE ·
  SUGGESTIONS · HIDDEN.
- **Gotcha:** field-name/help inputs did **not** accept programmatic fill in the
  in-app browser — real keystrokes + a click-away (blur) committed them. In
  Playwright use `fill()` then `blur()`, and assert the collapsed field label
  updated before moving on.
- Save with **SAVE TEMPLATE**; back-arrow (top-left) returns to the folder.

## Step 3 — Populate the basic template
- Row **⋮ → Populate** → `/instances/create/<encoded template IRI>?folderId=…`.
- Fill fields, **SAVE** → instance URL becomes `/instances/edit/<encoded instance IRI>`.

## Step 4 — Rich template: controlled terms + external authorities
- Same create flow. Add **ORCID** and **ROR** fields via the **More (⋯)** menu.
- **Controlled-term field (Disease → DOID):**
  1. Add a text field, name it, open its **VALUES** tab → **ADD** (opens the
     BioPortal picker; it pre-searches the field name in *term* mode).
  2. Click the **gear** icon → Advanced Search Options → select radio
     **"Search for an ontology in BioPortal … and explore it"**.
  3. Type the ontology name (e.g. `Human Disease Ontology`) → run search (magnifier).
  4. **Click the ontology result row to select it** (it highlights). ← easy to miss
  5. Scroll down → **ADD** ("add all the terms from the selected ontology").
     A row appears in VALUES: `Name | Type=Ontology | Source | Identifier=DOID | No.Values`.
  - **Gotcha 1:** clicking ADD *before* the ontology row is selected adds nothing.
  - **Gotcha 2:** reopening the picker reverts to *term* mode with stale text →
    "No results"; re-select ontology mode.
  - **Gotcha 3:** the picker's own ADD commits and closes it — don't dismiss with
    the ✕ (that discards).
- **SAVE TEMPLATE.**

## Step 5 — Populate the rich template
- Row **⋮ → Populate**. Smart inputs (all verified live):
  - **ORCID** field placeholder "Start typing researcher name or ORCID" →
    autocomplete rows "Name – orcid.org/… – affiliation".
  - **ROR** field "Start typing institution name or ROR" → "Name – ror.org/<id>".
  - **DOID** field "Start typing to filter" → dropdown of DOID terms
    (e.g. "asthma" → asthma / status asthmaticus / intrinsic asthma / allergic asthma).
- **SAVE.**

## Step 6 — Version the template
- Folder row **⋮ → Publish version…** → dialog with three spinners
  (major.minor.patch), default `0.0.1`. Set to e.g. `1.0.0` → **OK**.
- Toast "was published"; the row shows a globe icon + version badge "1.0.0".
- **Create version…** is grayed until published, then enabled (makes a new draft).

## Step 7 — OpenView
- Instance row **⋮ → Enable OpenView** → toast "Made Open"; row gains a blue
  external-link **↗** icon.
- Click **↗** → opens `https://openview.metadatacenter.org/template-instances/<url-encoded instance IRI>`
  in a new tab — the public web rendering (the tutorial finale screenshot).
- Note: the in-app browser blocks the openview domain; the Playwright runner
  (normal context) navigates and screenshots it fine.

---

## Teardown (self-contained cleanup)
- **Order matters: delete instances *before* templates.** A template won't
  delete while any instance uses it → warning "The template was not deleted.
  The template is used by N instance(s)."
- Each delete: row **⋮ → Delete** → "Are you sure?" → **"Yes, delete it!"**.
- Then delete the (now-empty) run folder from its parent, same pattern
  ("remove the selected folder?"). Folder must be empty first.
- **Versioned/published artifacts *can* be deleted** (contrary to the manual).
- **REST API delete is not an option** here: the cedar-artifact-rest MCP
  authenticates as a *different* CEDAR user → HTTP 401 "no write access".
  Teardown must go through the UI (or an API session authed as the owner).

## In-app-browser quirks (do NOT apply to the Playwright runner)
These bit the manual mapping run; the runner sidesteps them by controlling its
own viewport and clicking by selector:
- Screenshots are scaled relative to the real viewport (e.g. 1454 viewport →
  1524 capture), so blind coordinate clicks miss. Drive by element refs.
- The row **⋮** column clips off the right edge unless the window is wide
  (~1700px). Widen, or click via ref.
- Refs go stale after any re-render; re-query before clicking.
- Clicking a template row's body triggers **Populate** — target the ⋮ precisely.

## IRIs from the mapping run (already torn down — for reference only)
- folder `…/folders/748fc99c-1abb-4701-a912-03d3e6208479`
- Study template `…/templates/3964894f-cb7e-4748-aad3-bf346a472004`
- Clinical Study template `…/templates/7a56f2b8-1411-4c7c-b11d-7402bb6695f0`
