# Project Instructions

Guidance for AI coding agents (and humans) working in this repository.
`CLAUDE.md` and `AGENTS.md` are identical copies, provided for different agents.

## What This Repository Is

This is the source for the CEDAR documentation site, published with
[Read the Docs](https://metadatacenter.readthedocs.io). It is a
[MkDocs](https://www.mkdocs.org/) project using the Material theme. Prose lives
in `docs/` as Markdown, and the site navigation is defined in `mkdocs.yml`.

## Branch and Build

- Work on **`main`**. All documentation changes go here. The former `develop`
  branch is retired.
- Read the Docs builds the `latest` site from `main` on every push.
- Preview locally before pushing. `mkdocs serve` renders the full themed site
  with hot reload at `http://localhost:8000`. `./preview.sh` renders a single
  tutorial page standalone for a quick look, with `?src=` to switch pages.

Set up the Python environment as described in the [README](README.md).

## Screenshots Are Generated, Not Hand-Captured

This is the most important convention in the repository. The screenshots in the
documentation are produced by code that drives the live CEDAR application, not
captured by hand. Generating them keeps every screenshot current, visually
consistent (same viewport, scale, theme, and account), and reproducible. When
CEDAR's UI changes, you re-run the generator instead of re-shooting images one at
a time.

When you add or update a page that needs CEDAR Workbench screenshots, extend the
generator rather than pasting in manual screenshots.

### The Workbench Runner

[`runner/`](runner/) is a Playwright step-driver that logs into the live CEDAR
Workbench, walks a scripted sequence of UI actions, and writes screenshots
straight into the docs tree (`docs/tutorials/img/` and
`docs/tutorials/term-img/`). It is local authoring tooling (Node and Playwright)
and never runs during a Read the Docs build.

```bash
cd runner
npm install
npx playwright install chromium
node auth.mjs            # one-time: log in to CEDAR; saves storageState.json
node run.mjs             # regenerate the CEDAR Tutorial screenshots
node term-run.mjs        # regenerate the CEDAR Controlled Term Tutorial screenshots
```

[`runner/README.md`](runner/README.md) has the full workflow, the file layout,
and the verified selectors and timing notes for driving the Workbench. To capture
a new page's screenshots, add a steps script that follows the pattern in
`steps.mjs` and `term-steps.mjs`.

`storageState.json` (your CEDAR login) and `node_modules/` are git-ignored. Never
commit them.

### Preview-Editor Screenshots

The CEDAR MCPs Tutorial illustrates its templates with previews from the CEDAR
Embeddable Editor, captured by pointing headless Chrome at the read-only preview
URLs the CEDAR MCP servers return. That is a lighter variant of the same
principle: generate screenshots programmatically, do not hand-capture them.

## Authoring Conventions

- Use title case for page titles and section headings.
- New tutorials go under `docs/tutorials/` and are listed in the `Tutorials`
  section of `mkdocs.yml`.
- Keep prose clear and neutral.
