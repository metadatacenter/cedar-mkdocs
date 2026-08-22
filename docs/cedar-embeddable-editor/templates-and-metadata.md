# Templates and Metadata

A [template](../yaml-spec/templates-core.md) goes into the CEE and an
[instance](../yaml-spec/instances-core.md) comes out. Each direction offers more than one route:
several ways to supply a template and an existing instance, several ways to read the metadata back,
a serialization to choose on each side, and an event that fires when a value changes.

## Supplying a Template

The template is a parsed object, assigned to `templateObject`:

```javascript
cee.templateObject = template;
```

Assigning it builds the form, so configuration should already be set when it happens. Each input
takes one assignment: a second template is reported and ignored, and the first form stays. An
application that has to show a different template creates a new element.

### Supplying an Instance as Well

An instance can be supplied on its own input, `instanceObject`, or together with its template on
`templateAndInstanceObject`. Prefer the combined input:

```javascript
cee.templateAndInstanceObject = {
  templateObject: template,
  instanceObject: instance,
};
```

One assignment produces one build. The CEE constructs the form with the values already known
instead of building it empty and then filling it, which is faster. The two properties inside the
object are named `templateObject` and `instanceObject`, matching the separate inputs.

The separate inputs remain available for an application that genuinely obtains the two at different
times. They are independent, and either order works, because the CEE does not build the form until a
template is present — an instance supplied ahead of one waits rather than loading against nothing:

```javascript
cee.instanceObject = instance;
cee.templateObject = template;
```

An instance must have come from the template it is loaded against. A mismatched pair produces no
single clear error. The CEE drops values whose fields it cannot find, leaving a form that has
silently lost data.

An artifact is a template and optionally an instance, and each half can be claimed once.
`templateAndInstanceObject` claims both, so it cannot be combined with either separate input. What
an application supplies twice is reported and ignored:

```
CEE ERROR: CEDAR Embeddable Editor: "instanceObject" ignored, because the instance is already set.
Each input takes one assignment; create a new editor element to load a different artifact.
```

The error reaches the browser console and any handler on the `eventHandler` property. Loading a
different template or instance means a new element, which is also what keeps the two halves of a
document from being mixed across artifacts.

The combined object contains exactly `templateObject` and `instanceObject`. If the CEE cannot read
the instance, it reports the rejection, renders no replacement empty form, and leaves the artifact
inputs available for a corrected value. A failed combined assignment therefore claims neither half.
The same rule applies to `instanceObject` on its own: only a readable instance spends the one
assignment.

### Supplying a YAML Template

A template is supplied as JSON Schema or as [YAML](../yaml-spec/index.md), and the CEE recognizes
which it has been given. An application holding either assigns it directly:

```javascript
cee.templateObject = template;
```

For YAML, assign the **parsed** YAML object rather than the YAML source text.

Parsing falls to the application. Browsers parse JSON natively and YAML not at all, so a YAML template obliges the page to carry a
parser such as [js-yaml](https://www.npmjs.com/package/js-yaml). Nothing else differs, because the
CEE reads both serializations through the same model library and either builds the same editor.

## Reading the Metadata Back

Two read-only properties expose the instance under edit. Each reads the current state of the form
at the moment it is accessed, and none of them has side effects.

| Property | Returns |
|---|---|
| `currentMetadata` | The instance as a CEDAR JSON-LD object. |
| `currentMetadataYaml` | The instance as a CEDAR YAML string. |

Each says which form it returns, so no code has to reason about what the configuration happens to
be:

```javascript
const instance = cee.currentMetadata;
const asYaml = cee.currentMetadataYaml;
```

An instance supplied to the editor is always read as JSON-LD, whichever serialization the template
was written in.

## Knowing When Something Changed

The CEE publishes a `change` event only when an operation changes the serialized instance. That
event crosses the shadow boundary and bubbles. Focus, blur, paging, read-only control traffic and a
write that leaves `currentMetadata` identical produce no event; field edits, clears,
controlled-term selections and repeating-group operations do.

The package declarations type the listener as `CustomEvent<CeeChangeDetail>`:

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

Every detail carries the state after the operation:

| Member | Meaning |
|---|---|
| `operation` | `valueChanged`, `multiInstanceAdded`, `multiInstanceCopied` or `multiInstanceDeleted`. |
| `path` | The component path from the template root. |
| `value` | The value supplied to the model operation. |
| `validity` | Whether the resulting instance is valid. |
| `dataQualityReport` | The full report for the resulting instance. |
| `title`, `description` | The current instance envelope values, or `null` when absent. |

Structural edits to a [repeating group](../yaml-spec/elements-core.md#repetition) also retain a
compatibility `detail.message` naming what happened:

| `detail.message` | Meaning |
|---|---|
| `multiInstanceAdded` | An empty instance was added to a multi-valued element. |
| `multiInstanceCopied` | The current instance was duplicated. |
| `multiInstanceDeleted` | The current instance was removed. |

```javascript
cee.addEventListener('change', (event) => {
  if (event.detail?.message === 'multiInstanceDeleted') {
    // ...
  }
});
```

In Angular the same event is available as an output binding, `(change)="onChange($event)"`.

A canonical instance produces no event merely because it was loaded. Temporal values are the
exception when their stored precision exceeds the field's declared granularity: loading normalizes
the serialized value, so the CEE publishes that real change during initialization. Install the
listener before assigning the artifact if the application needs to observe normalization.

The CEE does not own an unsaved-changes flag. Keep a structural snapshot of `currentMetadata` after
load and after each successful save, then compare the current value after every `change`. This marks
an edit dirty, clears dirty state when the edit is exactly undone, and establishes a new baseline
only after persistence succeeds.

### Saving Periodically

The CEE persists nothing. An application wanting an autosave writes one, reading the instance on
a timer:

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

## How Dates and Times Are Stored

A [temporal field's](../yaml-spec/field-types/temporal-field.md) `temporalType`,
`temporalGranularity` and `timezoneEnabled` settings are a storage contract, and the CEE treats them as
one. The editor shows only the parts the template asks for, and writes a complete lexical
`xsd:date`, `xsd:time` or `xsd:dateTime` value:

| Declared precision | Stored value |
|---|---|
| date, year | `2026-01-01` |
| date, month | `2026-08-01` |
| date, day | `2026-08-09` |
| time, hour | `21:00:00` |
| time, minute | `21:45:00` |
| time, second | `21:45:32` |
| time, decimal second | `21:45:32.001` |
| date-time, day | `2026-08-09T00:00:00` |
| date-time, minute | `2026-08-09T21:45:00` |

The same padding rule applies to the remaining date-time granularities. When time zones are enabled
the CEE appends the selected fixed offset, `Z` or `+/-HH:mm`; when they are disabled it removes any
offset present.

Granularity wins when an existing instance is loaded. The CEE discards information finer than the
template declares rather than carrying it along invisibly, so a day-granularity date-time field
given `2026-08-09T21:45:32.125-07:00` stores `2026-08-09T00:00:00-07:00`. An application comparing
a saved instance against the bytes it supplied should expect that normalization.
