# Monitoring Design Token Adoption

`cedarcli check design-tokens` tracks shared styling across the embeddable components and the
applications that host them:

| Repository | Covers |
| --- | --- |
| `cedar-embeddable-editor` | CEE and CEF |
| `cedar-embeddable-designer` | CED and CEFD |
| `cedar-embeddable-term-picker` | CETP |
| `cedar-workspace` | Angular Workspace, account pages and CEE host |
| `cedar-template-designer` | Template Designer, which hosts CED and CETP |
| `cedar-openview` | OpenView |
| `cedar-monitoring` | Monitoring |
| `cedar-bridging` | Bridging |
| `mcp/cedar-cee-mcp` | The session page `cedar-cee-mcp` serves |

The legacy Template Editor, `cedar-template-editor`, is excluded. The default scan visits these
repositories when present under `CEDAR_HOME`; an explicitly selected repository must exist. Keep the
CLI and `cedar-design-tokens` checkouts up to date: the CLI runs the checker from the token
repository. No frontend build, running stack, registry credential or network connection is needed.

## Run the Check

```bash
cedarcli check design-tokens
cedarcli check design-tokens --repo cedar-embeddable-designer --all
cedarcli check design-tokens --strict
cedarcli check design-tokens --json > adoption.json
```

Each repository's summary shows its new, existing, and advisory findings, resolved baseline
entries, and the declared and locked token versions. These
are candidates for review, not an adoption percentage: a local dimension or a deliberate brand
swatch can be appropriate.

| Option | Effect |
| --- | --- |
| `--repo NAME` | Select a repository under `CEDAR_HOME`; repeat to select several. |
| `--all` | Include existing and excepted findings in the text details. The JSON report always includes all findings. |
| `--strict` | Fail on a new gated finding, a missing baseline, an inexact or unknown token pin, a pinned package that lacks a token the repository uses, a baseline allowance that is no longer needed, or a shared token that no scanned repository reads or only one does. A difference from the local token checkout's version remains advisory. |
| `--json` | Emit a machine-readable report with per-repository findings and errors. Combine with `--strict` for a gate. |
| `--init-baseline` | Create an initial baseline after review. Refuses to overwrite an existing baseline. |
| `--prune-baseline` | Remove resolved findings or reduce their occurrence allowances; never add or increase an allowance. |
| `--sync-surfaces` | Regenerate each scanned frontend's copy of the surface contract helper before reporting on it. |
| `--surface-inventory FILE` | Write the Markdown hierarchy of the modern UI's pages and surfaces to `FILE`. |

The baseline-writing options are mutually exclusive. Normal reporting does not change files.
[Keep Surface Contracts Current](#keep-surface-contracts-current) explains the two surface options.
Exit status **0** means the selected reporting or gate conditions passed; **1** means strict mode
found one of the conditions it fails on; **2** means the check could not run correctly, such
as a missing checker, invalid baseline or invalid arguments. Without `--strict`, findings alone
do not fail the command.

Which findings gate depends on the policy level each baseline records. At level 1, color and
typography findings gate, while spacing and geometry findings are advisory. From level 2, every
finding gates.

## Work Down Existing Findings

Each component repository owns `.design-tokens-baseline.json`. A finding is identified by its file,
rule, property and normalized value, with a count of allowed occurrences. Moving source lines does
not produce a new finding. Adding another copy, changing the literal, or moving it to another file
requires review.

Use an existing token when its semantic role fits. Do not select a token solely because its current
hex value or size matches. After replacing literals with tokens, prune the baseline and review the
change alongside the stylesheet:

```bash
cedarcli check design-tokens --repo cedar-embeddable-designer --prune-baseline
cedarcli check design-tokens --repo cedar-embeddable-designer --strict
```

For an intentional local value, the baseline's `exceptions` object maps the reported finding ID
to a specific written reason. Exceptions apply to the exact declaration, not a whole file or rule.
The [token usage guide](https://github.com/metadatacenter/cedar-design-tokens/blob/develop/README.md#monitor-adoption)
explains common role choices and exceptions. Do not delete and regenerate a baseline to hide new drift.

## Keep Surface Contracts Current

The token repository also holds rendered-style contracts for the registered surfaces of the modern
UI, which each frontend's browser tests check at desktop and phone widths. Each frontend declares
its surfaces in `.ui-surfaces.json` and carries a generated copy of the contract helper under
`browser/tests/` or `visual/tests/`. After the central rules change, or when the check reports a
stale helper, regenerate the copies and commit them in each frontend:

```bash
cedarcli check design-tokens --sync-surfaces
```

`--surface-inventory` writes the current hierarchy of pages and surfaces as Markdown, generated from
the registries rather than maintained by hand. It first validates the registries of all eight
frontends that must have one, and writes nothing if any is invalid. A relative path resolves
against the directory the command runs in:

```bash
cedarcli check design-tokens --surface-inventory ui-surfaces.md
```

## Use It in CI

The component workflows call the shared `adoption.yml` workflow in `cedar-design-tokens`. It runs
the same checker in strict mode and uploads `adoption.json` for inspection, including when the
gate fails. Pull requests use the base revision's baseline and exceptions: increasing an allowance
in the same pull request cannot conceal a new finding. An intentional exception therefore needs
a separately reviewed baseline change before the styling change it permits.

The first rollout uses the new baseline when the base revision has none and emits a review notice.
Merge the shared checker/workflow first, then the consumer baselines/workflows. Require the
adoption job in branch protection if it must block merging. This workflow consumes source from the
token repository; it does not require publishing a new npm package.

## Understand the Scope

The checker scans first-party CSS, SCSS and Less under `src` and `app`, including unignored new
files. It excludes vendor/assets directories, fixtures, ignored build output and the separate
Material icon font. Inline HTML/TypeScript styles, utility classes and runtime computed styles
are outside this first source check. It does not replace browser or accessibility testing.

Dependency versions are compared with the **local token checkout's version**, not the latest
version in Nexus. Matching versions do not prove that unpublished token edits have reached a
consumer. Use `cedarcli check components` to inspect served component freshness.

For visual review, the designer repository's `browser/fixtures/style-comparison.html` renders
CEE, CEF, CED and CEFD using real local bundles. It supports both entry densities, narrow hosts,
host overrides and supported read-only modes. The
[frontend runbook](https://github.com/metadatacenter/cedar-development/blob/develop/ops/FRONTEND-RUNBOOK.md#monitoring-token-adoption)
explains how to stage the bundles and serve the page.
