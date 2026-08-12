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
instead of building it empty and then filling it, which is faster and is the only route on which
`hideEmptyFields` takes effect. The two properties inside the object are named `templateObject` and
`instanceObject`, matching the separate inputs.

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

### Letting the CEE Fetch the Template

The CEE can fetch a template itself, given a location prefix and a name:

```javascript
cee.config = {
  sampleTemplateLocationPrefix: '/assets/templates/',
  loadSampleTemplateName: 'dataset',
};
```

The CEE then requests `/assets/templates/dataset/template.json` and, alongside it,
`/assets/templates/dataset/metadata.json` as the instance to open. Setting
`showSampleTemplateLinks` additionally renders a picker, whose entries come from a `registry.json`
at the prefix.

This route serves demonstrations and the standalone developer application. A production embedding
should hand the CEE a template it has already obtained, keeping both the choice of template and the
authentication of the request inside the application.

### Choosing the Template's Serialization

A template is supplied as JSON Schema or as [YAML](../yaml-spec/index.md), and
`inputSerialization` says which. Its default is `json`, and any value other than `yaml` means the
same thing, so an application holding JSON Schema sets nothing:

```javascript
cee.templateObject = template;
```

For YAML, set the key and assign the **parsed** YAML object rather than the YAML source text:

```javascript
cee.config = { inputSerialization: 'yaml' };
cee.templateObject = parsedTemplateYaml;
```

Parsing falls to the application. Browsers parse JSON natively and YAML not at all, so a YAML template obliges the page to carry a
parser such as [js-yaml](https://www.npmjs.com/package/js-yaml). Nothing else differs, because the
CEE reads both serializations through the same model library and either builds the same editor.

## Reading the Metadata Back

Three read-only properties expose the instance under edit. Each reads the current state of the form
at the moment it is accessed, and none of them has side effects.

| Property | Returns |
|---|---|
| `currentMetadata` | The instance as a CEDAR JSON-LD object. Always JSON-LD, whatever the configuration says. |
| `currentMetadataYaml` | The instance as a CEDAR YAML string. Always YAML, whatever the configuration says. |
| `currentMetadataSerialized` | Whichever of the two `outputSerialization` selects. |

Use the first two where the code knows which form it wants, and neither has to reason about what
the configuration happens to be:

```javascript
const instance = cee.currentMetadata;
const asYaml = cee.currentMetadataYaml;
```

`currentMetadataSerialized` suits an application whose output format is a deployment choice rather
than a fixed decision. It returns a JSON-LD object by default, and a YAML string when configured:

```json
{
  "outputSerialization": "yaml"
}
```

`outputSerialization` governs only that third property. It has no effect on what the other two
return, and none on how the template was read. An instance supplied to the editor is likewise always
read as JSON-LD: `inputSerialization` selects the template parser and nothing else.

## Knowing When Something Changed

The CEE re-publishes its internal edits as a `change` event on the custom element. That event
crosses the shadow boundary and bubbles, so an ordinary listener on the element hears every value
edit in the form:

```javascript
cee.addEventListener('change', () => {
  saveButton.disabled = !cee.dataQualityReport.isValid;
});
```

Structural edits to a [repeating group](../yaml-spec/elements-core.md#repetition) carry a
`detail.message` naming what happened:

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
