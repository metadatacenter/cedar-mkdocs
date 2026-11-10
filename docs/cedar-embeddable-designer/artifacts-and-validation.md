# Artifacts and Validation

CED edits templates and elements; CEFD edits standalone fields. Both expose the
current artifact, its validation state, and whether the session has unsaved
changes. The host owns persistence and decides when a new document replaces
the current one.

## Load or Create an Artifact

| API | Purpose |
|---|---|
| `artifact` | Assign a JSON object, JSON text, or CEDAR YAML text. Unreadable input is reported to the console. |
| `loadArtifact(source)` | Load the same formats synchronously, throwing on invalid input without replacing current work. |
| `newArtifact('template')` | Start an empty template in CED. |
| `newArtifact('element')` | Start an empty element in CED. |
| `newArtifact(type?)` on CEFD | Start a field of the requested type, or show the type chooser. |

These APIs deliberately replace the document and reset its dirty baseline on
success. A host should check for unsaved changes before calling them. They also
work in host read-only mode, so loading a different document does not require
temporarily allowing edits.

`template`, `currentTemplate`, and `templateChange` remain compatibility aliases
on CED. New integrations should use the artifact names, which also describe
standalone elements correctly.

## Read the Current Document

`currentArtifact` returns the complete root artifact as a JavaScript object.
Selecting a nested field or element does not change the output to that child.
`artifactChange` carries that same document when an accepted edit can be
serialized.

The object is CEDAR's JSON Schema representation with JSON-LD annotations.
There is no `currentArtifactYaml` getter. Hosts needing YAML can use the
[CEDAR Model TypeScript Library](../developer-guide/cedar-model-typescript-library.md)
to read and write the artifact model.

### Preserve Exact Numbers

Numeric constraints and defaults can exceed the precision of a JavaScript
number. Such values use `CedExactNumber` atoms. `String(value)` exposes their
digits without rounding; converting them to `Number` can lose information.

For a JSON request body, use the model library's `JsonSourcePolicy.stringify`
rather than ordinary `JSON.stringify`. In a bundled host application, install a
compatible model library and use:

```typescript
import { JsonSourcePolicy } from 'cedar-model-typescript-library';
import type { CedarEmbeddableDesignerElement } from 'cedar-embeddable-designer';

export function templateBody(designer: CedarEmbeddableDesignerElement): string {
  if (!designer.validate().canSave) {
    throw new Error('Resolve the template validation findings before saving.');
  }
  return JsonSourcePolicy.stringify(designer.currentArtifact);
}
```

This example is host application code compiled by a bundler; the designer's
classic script exports no runtime functions. CED 0.1.0 uses model library 1.0.27.

## Check Save Readiness

Read `validationReport` or call `validate()` for the current report. Check
`canSave` immediately before taking the payload, rather than relying on the last
`artifactChange`. An invalid or unfinished setting may remain visible while the
accepted model still holds its previous value.

| Report Member | Meaning |
|---|---|
| `valid` | Whether the current authoring state passes its checks. |
| `canSave` | Whether the current state permits saving, including access and pending edits. |
| `issues` | Model, draft, and host findings with locations and user-facing messages. |
| `pendingValidation` | Present while asynchronous pattern checks are running. |
| `semanticChecks` | Coverage and results of terminology verification, when present. |
| `superseded` | Stored shapes replaced by the designer's projection, when present. |

Listen for `validationChange` to refresh the host's save control. Its detail is
the report. A pending validation check keeps saving unavailable; a service
failure must not be interpreted as a successful terminology check.

Each issue includes a `message`, `severity`, `source`, `code`, settings `tab`,
`setting`, and session-local node/path information. Use the message for display
and the code for application logic. Messages follow the designer's language;
codes and tab identifiers do not. Do not persist node IDs across documents.

An issue's `shown` flag tells whether CED displays it in its summary. An
untouched required name can block saving before being displayed as an error.
Use `canSave` for the save decision even if every current issue has `shown: false`.

Local checks complement the server's validation, permission checks, and
publication rules. They do not authorize a repository write.

## Report Server Findings

Assign findings for the current submitted document through `validationFindings`:

```javascript
designer.validationFindings = [{
  location: '/properties/Title/_valueConstraints/regex',
  message: 'Review the pattern accepted by the server.',
  severity: 'error',
}];
```

Locations are JSON Pointers into the artifact, including any `properties` and
`items` segments. Recognized locations join the navigable summary.
`revealValidationFinding(location)` returns whether the setting can be revealed;
an unsupported location stays in the report as an unmapped finding.

Accepted edits and document replacement retire host findings. Assign `[]` to
clear them explicitly. Discard replies for obsolete submissions before assigning
a report, and render host messages as text. Warnings do not block saving.

## Validate a Merged Payload

A host that merges edits into a stored artifact must account for
`validationReport.superseded`. Each entry identifies a stored shape CED could
not represent and the validator refuses, with a JSON Pointer `location`, a `code`,
and an optional replacement `value`. Apply the replacement to the stored copy,
or remove the value when no replacement is present, before merging. Otherwise
the merge can restore a defect the author cannot repair in the interface.

`superseded` stays fixed until the next load and does not itself change `canSave`.
Call `validateArtifact(payload, kind?)` to check the exact final payload. It
returns `{ findings, structurallyValid, canSave, isValid }` without changing the
open document. Omit `kind` to infer it from the artifact's `@type`.

## Track Changes and Adopt Saved Documents

`isDirty` includes unfinished settings, even when they have not produced an
artifact change. Listen for `dirtyChange`, whose detail is a boolean, when
managing navigation away from unsaved work.

After a successful save, a host can call:

```javascript
designer.loadArtifact(savedArtifact, { preserveView: true });
```

This adopts server-assigned identifiers and metadata while retaining matching
selection, expansion, and settings tabs. Ordinary loads reset the view. Before
adopting a response, confirm it belongs to the current document and that doing
so will not overwrite edits made after submission.

## Recover Unfinished Work

`captureDraft()` returns a JSON-serializable recovery document that includes
unfinished controls, pending validation state, the artifact, and its clean
baseline. It is a recovery snapshot, not a server-saveable CEDAR artifact.

`restoreDraft(draft)` checks the snapshot before replacing the session and throws
on malformed or incompatible input. The host's current read-only policy still
applies, and interrupted asynchronous checks must be retried.

The host chooses storage, retention, and account/deployment isolation. Restoring
a draft does not establish whether an interrupted save succeeded or grant
permission to write; recheck the stored revision and current access before saving.
