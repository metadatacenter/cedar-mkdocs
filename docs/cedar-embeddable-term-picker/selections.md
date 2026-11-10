# Constraints and Selections

The picker supports a table of constraints, a single term, or a single legacy
constraint selection. Choose the workflow before assigning a search query.
The result is structured selection data; the host's model library writes it
into the appropriate artifact representation.

## Collect a Set of Constraints

Use the table workflow when an author is defining a controlled-term field:

```javascript
picker.termTypes = ['ontology', 'branch', 'class', 'valueSet'];
picker.constraintSet = { constraints: [], actions: [] };
picker.addEventListener('constraintsSelected', (event) => {
  console.log('Apply the complete set:', event.detail);
});
```

Supply an existing set instead of empty arrays to edit it. Selections are added
to the draft table, where the author can inspect and remove entries and edit
branch depth. Pressing **Done** emits the complete draft; cancellation leaves
the host's original set unchanged.

| Event | Detail | Host Action |
|---|---|---|
| `constraintsChanged` | No payload | Invalidate any pending assessment of the earlier draft. |
| `constraintsSelected` | `ControlledTermSet` | Apply the completed set. |
| `cancelled` | No payload | Close the picker without applying its draft. |

A `ControlledTermSet` contains `constraints` and `actions`. Preserve both.
Existing actions for term exclusions and result positions are retained, even
though this release does not provide controls for authoring those actions or
reordering constraints.

## Understand Constraint Kinds

| Search Category | Selection `sourceType` | Meaning |
|---|---|---|
| `ontology` | `ontology` | Terms from a whole ontology. |
| `branch` | `ontology-branch` | A branch root and its descendants to the selected depth. |
| `class` | `ontology-term` | An individual ontology term or value. |
| `valueSet` | `value-set` | Values in a named value set. |
| `property` | `ontology-property` | An ontology property, handled separately by the host. |

Do not infer a selection's identity from its displayed label. Keep the IRI,
source, and version information. Identically named terms can belong to
different vocabularies or releases.

`maximumTerms` limits table entries, not the number of terms represented by an
ontology or branch. It must be a positive whole number. Omit it for no limit.
Changing the limit does not silently discard existing entries.

## Choose a Default Term

Use a fresh picker in term mode and give it the field's own constraints:

```javascript
picker.selectionMode = 'term';
picker.fieldConstraints = fieldConstraints;
picker.addEventListener('selected', (event) => {
  console.log('Candidate default term:', event.detail);
});
```

Here `fieldConstraints` is a `ControlledTermSet` supplied by the host. Search
uses the terminology server's integrated-search route to offer values within
those constraints, honoring branch depths, pinned versions, value sets, and
exclusions. `fieldConstraints` takes precedence over `sources`.

Leave `termTypes` and `maximumTerms` unset in this mode: assigning either selects
the table workflow. A `selected` event carries a `SelectedConstraint`, rather
than a `ControlledTermSet`. Its `type` identifies the result kind; term results
carry their identifier and label. The published declarations describe the full
shape.

Before applying a default, the host should verify it against the field's current
constraints, which may have changed while the picker was open.

## Select Ontology Properties

Use `picker.termTypes = ['property']` for a property-only table. Results include
object, datatype, and annotation properties. Their hierarchy supports multiple
parents.

Property selections contain `sourceType: 'ontology-property'`, the property's
IRI in `sourceId`, its `sourceName`, `ontologyId`, `propertyKind`, and a version
identity. They are not class/value constraints for a controlled-term field.
The host decides where to apply and store them.

Property search, hierarchy, and version requests use the terminology server's
versioned store. A snapshot without extracted properties produces a reported
failure rather than silently using another ontology release or BioPortal.

## Restrict Sources and Versions

`sources` accepts vocabulary selectors. For example:

```javascript
picker.sources = [
  { sourceAcronym: 'DOID', version: 'latest' },
];
```

To use a particular snapshot, replace `'latest'` with `{ id: versionId }`, using
the identity returned by the terminology service. A selector can also name a
`sourceSystem`. An empty source list searches all available sources.

When several scopes are supplied, the vocabulary/release selector searches one
at a time, including separate pinned releases of the same ontology. Preserve
the `version.id` returned with a pinned constraint. Without a pin, the server
resolves the current vocabulary release when the constraint is used.

## Existing Single-Selection Integrations

`selectionMode = 'constraint'` retains the single-selection `selected` event
for existing hosts. New integrations that assemble several constraints should
use `constraintSet` and `constraintsSelected`.

## TypeScript

The package exports declarations for the element and result types:

```typescript
import type {
  CedarEmbeddableTermPickerElement,
  ControlledTermSet,
} from 'cedar-embeddable-term-picker';

export function configurePicker(
  picker: CedarEmbeddableTermPickerElement,
  initial: ControlledTermSet,
  apply: (selection: ControlledTermSet) => void,
): void {
  picker.termTypes = ['ontology', 'branch', 'class', 'valueSet'];
  picker.constraintSet = initial;
  picker.addEventListener('constraintsSelected', (event) => apply(event.detail));
}
```

These are type-only imports. Load the classic JavaScript bundle to register the
element; the script does not export runtime constructors or helper functions.
