# Templates and Metadata

A [template](../yaml-spec/templates-core.md) defines the form, and an
[instance](../yaml-spec/instances-core.md) holds its values. The CEE accepts both
as parsed JavaScript objects and exposes the current instance as JSON-LD or YAML.

## Supply a Template

Assign the template after configuring the element:

```javascript
cee.templateObject = template;
```

This assignment builds the form. The property accepts one successful assignment;
to show another template, create a new CEE element.

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

Either order works; the CEE waits for a template before rendering. Each property
still accepts only one successful assignment. Do not combine
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

Browsers parse JSON natively but need a library such as
[js-yaml](https://www.npmjs.com/package/js-yaml) to parse YAML source text. Both
representations pass through the same CEDAR model library and produce the same
form.

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
  saveButton.disabled = !detail.validity;
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

Angular can receive the same event with `(change)="onChange($event)"`.

Loading a canonical instance does not produce a change event. The exception is a
temporal value with more precision than the template permits: the CEE normalizes
the value during loading and reports that change. Attach the listener before
assigning the artifact if the application needs to observe it.

## Track Unsaved Changes

The CEE does not maintain a dirty flag. Store a structural snapshot of
`currentMetadata` after loading and after each successful save, then compare it
with the current value after every `change`. This also clears the dirty state
when a user exactly reverses an edit.

Autosave works the same way: read the current instance on the application's
schedule and send it to the application's own service.

```javascript
const SAVE_INTERVAL = 15000;

setInterval(async () => {
  await fetch('/api/metadata/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/yaml' },
    body: cee.currentMetadataYaml,
  });
}, SAVE_INTERVAL);
```

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
