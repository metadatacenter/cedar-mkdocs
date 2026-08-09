# Templates and Metadata

Everything the CEE does sits between two artifacts. A [template](../yaml-spec/templates-core.md) goes
in, and an [instance](../yaml-spec/instances-core.md) comes out. Both
directions have more than one route: several ways to supply a template and an existing instance,
several ways to read the metadata back, a choice of serialization on each side, and a way to know
when something changed.

## Supplying a Template

The template is a parsed object, assigned to `templateObject`:

```javascript
cee.templateObject = template;
```

Assigning it builds the form, so configuration should already be set when it happens. Assigning a
different template later replaces the form.

### Supplying an Instance as Well

An instance can be supplied on its own input, `instanceObject`, or together with its template on
`templateAndInstanceObject`. Prefer the combined input:

```javascript
cee.templateAndInstanceObject = {
  templateObject: template,
  instanceObject: instance,
};
```

One assignment means one build. The form is constructed with the values already known, rather than
built empty and then filled, which is both faster and the only route on which `hideEmptyFields` can
take effect. The property name inside the object is `templateObject` and `instanceObject`, matching
the two separate inputs.

The separate inputs remain available for an application that genuinely obtains the two at different
times. When using them, assign the instance first and the template second, because assigning the
template is what triggers the build:

```javascript
cee.instanceObject = instance;
cee.templateObject = template;
```

An instance must have been produced from the template it is loaded against. Loading a mismatched
pair is not diagnosed as a single clear error: values whose fields cannot be found are dropped, and
the result is a form that silently lost data.

Three inputs can each supply an artifact, and what happens when more than one is set is not defined.
Supply exactly one.

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

This route exists for demonstrations and for the standalone developer application. A production
embedding should hand the CEE the template it has already obtained, and keep the decision about what to
fetch, and how to authenticate the request, in the application.

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

That parsing is the application's job, and it is the one practical difference between the two.
Browsers parse JSON natively and YAML not at all, so a YAML template obliges the page to carry a
parser such as [js-yaml](https://www.npmjs.com/package/js-yaml). Nothing else changes: both
serializations are read through the same model library, so either builds the same editor.

## Reading the Metadata Back

Three read-only properties expose the instance under edit. Each reads the current state of the form
at the moment it is accessed, and none of them has side effects.

| Property | Returns |
|---|---|
| `currentMetadata` | The instance as a CEDAR JSON-LD object. Always JSON-LD, whatever the configuration says. |
| `currentMetadataYaml` | The instance as a CEDAR YAML string. Always YAML, whatever the configuration says. |
| `currentMetadataSerialized` | Whichever of the two `outputSerialization` selects. |

The first two are for code that knows which form it wants, and they save an application from having
to reason about what the configuration happens to be:

```javascript
const instance = cee.currentMetadata;
const asYaml = cee.currentMetadataYaml;
```

`currentMetadataSerialized` is for an application whose output format is a deployment choice rather
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

The CEE re-publishes its internal edits as a `change` event on the custom element. The event crosses
the shadow boundary and bubbles, so an ordinary listener on the element hears every value edit in
the form:

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

Nothing in the CEE persists anything. An application that wants an autosave writes one, reading the
instance on a timer:

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

Granularity wins when an existing instance is loaded, and information finer than the template
declares is discarded rather than carried along invisibly. A day-granularity date-time field given
`2026-08-09T21:45:32.125-07:00` stores `2026-08-09T00:00:00-07:00`. An application comparing a
saved instance against the bytes it originally supplied should expect that normalization.
