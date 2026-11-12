# Templates and Metadata

A [template](../yaml-spec/templates-core.md) defines the form, and an
[instance](../yaml-spec/instances-core.md) holds its values. The CEE accepts both
as parsed JavaScript objects and exposes the current instance as JSON-LD or YAML.

## Supply a Template

Assign the template after configuring the element:

```javascript
cee.templateObject = template;
```

This assignment builds the form. Before an existing instance has been supplied,
the host may replace the template, as the CED does for a live preview. A replacement
with the same `@id` retains compatible answers and pager positions; incompatible
answers can be discarded. A different `@id` starts an empty form.

Once an instance has been supplied, its template is fixed. Create a new CEE
element to edit another stored instance or to change its template. Check for
unsaved work before replacing either a preview template or the element.

## Supply an Existing Instance

When the template and instance are available together, use the combined input:

```javascript
cee.templateAndInstanceObject = {
  templateObject: template,
  instanceObject: instance,
};
```

The CEE can then build the populated form once. The instance must have been
created from the supplied template.

Separate properties are available when the values arrive at different times:

```javascript
cee.instanceObject = instance;
cee.templateObject = template;
```

Either order works; the CEE waits for a template before rendering. The instance
accepts one successful assignment and fixes the template. Do not combine
`templateAndInstanceObject` with either separate property.

A duplicate assignment is ignored and reported through the console and
`eventHandler`:

```
CEE ERROR: CEDAR Embeddable Editor: "instanceObject" ignored, because the instance is already set.
Each input takes one assignment; create a new editor element to load a different artifact.
```

If the CEE cannot parse a combined input, it renders nothing and leaves both
properties available for a corrected assignment. An unreadable `instanceObject`
similarly does not consume that input.

## JSON Schema and YAML Templates

The CEE accepts templates in CEDAR's JSON Schema and
[YAML](../yaml-spec/index.md) representations. Assign the parsed object in either
case:

```javascript
cee.templateObject = template;
```

Use the model library's `JsonSourcePolicy.parse` for JSON source text and
`YamlSourcePolicy.parse` for YAML source text when numeric precision matters.
Both return a parsed artifact suitable for `templateObject`. Do not assign a
raw string or a model class instance to that property. Both representations
pass through the same CEDAR model library and produce the same form.

### Preserve Exact Numbers

Numeric constraints and values can exceed JavaScript's number precision.
The [CEDAR Model TypeScript Library](../developer-guide/cedar-model-typescript-library.md)
preserves such values as exact numeric atoms. Use its source readers and
`JsonSourcePolicy.stringify` rather than rounding through `Number`, native
`JSON.parse`, or `JSON.stringify`:

```typescript
import { JsonSourcePolicy, YamlSourcePolicy } from 'cedar-model-typescript-library';

const jsonTemplate = JsonSourcePolicy.parse(jsonSource);
const yamlTemplate = YamlSourcePolicy.parse(yamlSource);
const requestBody = JsonSourcePolicy.stringify(cee.currentMetadata);
```

This is host code compiled by a bundler. The CEE's classic script exports no
runtime helpers. Use a model-library version compatible with the installed
CEE release; its release notes identify the bundled model version.

## Read the Current Instance

The output properties are read-only and have no side effects:

| Property | Value |
|---|---|
| `currentMetadata` | The current instance as a CEDAR JSON-LD object. |
| `currentMetadataYaml` | The current instance as a CEDAR YAML string. |

```javascript
const instance = cee.currentMetadata;
const yaml = cee.currentMetadataYaml;
```

Existing instances are supplied as JSON-LD, regardless of the template's input
representation.

`currentMetadata` is `{}` when no readable artifact is loaded or the instance
names no template. A preview of an unsaved template can therefore render without
being saveable. `currentMetadataYaml` is empty when YAML cannot be written,
including when the instance has no template reference or name.

## Save an Instance

Check `cee.dataQualityReport.canSave === true` immediately before submission.
`isValid` and the change event's `validity` describe answer quality, which is a
different decision. Listen for `validationChange` when checks are pending;
see [Validation](validation.md).

Call `captureSave()` to retain the exact state being submitted:

```typescript
import { JsonSourcePolicy } from 'cedar-model-typescript-library';

if (cee.dataQualityReport.canSave === true) {
  const snapshot = cee.captureSave();
  if (snapshot) {
    const requestBody = JsonSourcePolicy.stringify(snapshot.metadata);
    // Submit requestBody through the host's persistence API.
    // Keep snapshot with that request until its response has been reconciled.
  }
}
```

The snapshot is `null` before a readable form is loaded or when its instance
names no template. It does not replace the save-readiness check.

If `snapshot.needsElementIds` is true, obtain the complete stored instance from
the revision acknowledged by the successful write. With CEDAR's REST API,
verify that a readback's ETag matches the write's returned ETag before calling
`snapshot.acknowledge(storedInstance)`.

Acknowledgement adopts assigned element identifiers without replacing the form
or losing edits and reordering made while the request was pending. It returns
the submitted metadata with those identifiers for the host's dirty baseline.
If acknowledgement or readback fails, retain the draft and reconcile the write
before permitting another save. The host and server still enforce permissions,
validation, and [revision checks](../developer-guide/cedar-rest-apis/etag-concurrency.md).

## Observe Changes

The CEE dispatches a bubbling `change` event across the shadow boundary whenever
an operation changes the serialized instance. It does not dispatch for focus,
blur, page navigation, read-only activity, or a write that leaves the instance
unchanged.

The package declares the event as `CustomEvent<CeeChangeDetail>`:

```typescript
import type { CeeChangeDetail } from 'cedar-embeddable-editor';

const cee = document.querySelector('cedar-embeddable-editor');
if (!cee) throw new Error('CEE element is missing');

cee.addEventListener('change', (event) => {
  const detail: CeeChangeDetail = event.detail;
  console.log(detail.operation, detail.path, detail.value);
  saveButton.disabled = detail.dataQualityReport.canSave !== true;
});
```

Each event detail contains the state after the operation:

| Member | Meaning |
|---|---|
| `operation` | `valueChanged`, `multiInstanceAdded`, `multiInstanceCopied`, or `multiInstanceDeleted`. |
| `path` | Component path from the template root. |
| `value` | Value supplied to the model operation. |
| `validity` | Whether the resulting instance is valid. |
| `dataQualityReport` | Full validation report for the resulting instance. |
| `title`, `description` | Current instance envelope values, or `null`. |

Repeating-group events also include the legacy `detail.message` value
`multiInstanceAdded`, `multiInstanceCopied`, or `multiInstanceDeleted`.

Use `dataQualityReport.canSave` for saving. `validity` reflects `isValid`, not
the save policy. Also handle `validationChange`, which can change readiness
without changing the instance; [Validation](validation.md#read-the-report)
shows both listeners.

Angular can receive the same event with `(change)="onChange($event)"`.

Loading a canonical instance does not produce a change event. The exception is a
temporal value with more precision than the template permits: the CEE normalizes
the value during loading and reports that change. Attach the listener before
assigning the artifact if the application needs to observe it.

## Track Unsaved Changes

The CEE does not maintain a dirty flag. Keep a structural baseline after loading
and compare it with the current metadata after each `change`. After a successful
save, advance the baseline to the submitted snapshot, including acknowledged
identifiers, rather than the current form: edits made during the request are
still unsaved. Reversing an edit can then return the form to its clean state.

Unfinished input may not appear in the accepted metadata. Include the draft
state returned by `captureDraft()` when detecting or preserving such work.

Autosave follows the same save-readiness and acknowledgement rules as an explicit
save. Serialize writes and reconcile each response before submitting another.
Saving a recovery draft is a separate operation and need not wait for validity.

## Recover Unfinished Work

`captureDraft()` returns the template, accepted metadata, and unfinished input
as a JSON-serializable recovery document. It returns `null` when no readable
form is loaded or the instance names no template. The result is recovery data,
not an artifact to submit to a CEDAR write endpoint.

Configure a fresh CEE element and call `restoreDraft(draft)` before assigning
artifact inputs. It returns `false` without consuming those inputs when the
draft is malformed or incompatible; a successful restore resumes validation.
The host owns storage, retention, account and deployment isolation, and checks
for an interrupted save before permitting another write.

## Temporal Values

A temporal field's `temporalType`, `temporalGranularity`, and `timezoneEnabled`
settings determine the stored lexical value. The CEE fills omitted lower-order
parts with their minimum valid value:

| Declared precision | Stored value |
|---|---|
| Date, year | `2026-01-01` |
| Date, month | `2026-08-01` |
| Date, day | `2026-08-09` |
| Time, hour | `21:00:00` |
| Time, minute | `21:45:00` |
| Time, second | `21:45:32` |
| Time, decimal second | `21:45:32.001` |
| Date-time, day | `2026-08-09T00:00:00` |
| Date-time, minute | `2026-08-09T21:45:00` |

When time zones are enabled, the CEE appends `Z` or the selected `+/-HH:mm`
offset. When they are disabled, it removes any offset.

The template's granularity also governs loaded values. For example, a day-level
date-time field normalizes `2026-08-09T21:45:32.125-07:00` to
`2026-08-09T00:00:00-07:00` rather than retaining invisible precision.
