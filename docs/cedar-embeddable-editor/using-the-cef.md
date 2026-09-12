# Using the CEF

An application sometimes needs to display or collect one value without presenting
an entire metadata form. The CEF provides that interface: the host supplies a CEDAR
field definition, and the component presents the appropriate control, such as a
text box, date picker, or controlled-term lookup. The host can supply an existing
value, receive edits, and decide how to use or store the result.

A **field definition** describes the field's type and constraints. A **field value**
is the answer being displayed or edited. These are supplied separately through the
`fieldObject` and `value` properties. The same definition can therefore be used to
edit different values.

## Present a Field on a Page

Place a `<cedar-embeddable-field>` element wherever the control belongs in your
page. The host provides its surrounding heading, description, and actions. Load
`cedar-embeddable-editor.js`, which registers the CEF as well as the full editor.

This example assumes the bundle is served from `/assets/cedar-embeddable-editor.js`
and a CEDAR text-field definition is served as JSON from
`/assets/sample-name-field.json`. The definition is a field artifact, not a complete
template or a metadata instance.

```html
<section>
  <h2>Sample Name</h2>
  <p>Enter the name used to identify this sample.</p>
  <cedar-embeddable-field id="sample-name"></cedar-embeddable-field>
  <button id="use-value" type="button" disabled>Use Value</button>
  <pre id="result" aria-live="polite"></pre>
</section>

<script src="/assets/cedar-embeddable-editor.js"></script>
<script type="module">
  await customElements.whenDefined('cedar-embeddable-field');
  const cef = document.querySelector('#sample-name');
  const button = document.querySelector('#use-value');
  const result = document.querySelector('#result');

  // Configure the component before supplying the field definition.
  cef.config = { readOnlyMode: false };

  // Follow changes as the user edits the field.
  cef.addEventListener('valueChange', (event) => {
    const { value, valid } = event.detail;
    button.disabled = !valid;
    result.textContent = JSON.stringify({ value, valid }, null, 2);
  });

  const response = await fetch('/assets/sample-name-field.json');
  if (!response.ok) throw new Error('Could not load the field definition');
  cef.fieldObject = await response.json();

  // Supply an existing value for the user to edit.
  cef.value = { kind: 'literal', value: 'Sample A' };

  // Alternatively, read the current value when the host needs it.
  button.addEventListener('click', () => {
    if (cef.currentValueValid) {
      result.textContent = JSON.stringify(cef.currentValue, null, 2);
      // Store or submit cef.currentValue through the host application.
    }
  });
</script>
```

Assign `fieldObject` a parsed JSON field artifact. If the host builds its fields
with the CEDAR TypeScript model library, serialize the field to its JSON artifact
representation before assigning it. Reassigning `fieldObject` rebuilds the control
with the new definition.

## Pass Values to the Field

Assign `value` to populate or replace the field's current answer. Each value has a
`kind` identifying its representation:

| Field Value | Example |
|---|---|
| Empty | `{ kind: 'none' }` |
| Text or a single choice | `{ kind: 'literal', value: 'Sample A' }` |
| Number | `{ kind: 'number', value: 12.5 }` |
| Date or time | `{ kind: 'temporal', value: '2026-09-12' }` |
| Term or identifier | `{ kind: 'iri', iri: 'https://example.org/term/123', label: 'Example term' }` |
| Multiple choices | `{ kind: 'literals', values: ['A', 'B'] }` |

Use the representation appropriate to the supplied field definition. For example,
a numeric field takes a `number`, and a date field takes a `temporal` value matching
its declared granularity. Assign `{ kind: 'none' }` to clear a value. Incompatible
value kinds are rejected rather than converted. Attribute-value fields report
named values as `{ kind: 'attributes', values: { name: 'value' } }`; their slots
are created through the control, and programmatic assignment currently accepts
only `{ kind: 'none' }`.

## Retrieve Values and Check Validity

Listen for `valueChange` to receive edits as they happen. Its `detail.value` holds
the typed value, and `detail.valid` indicates whether the current input satisfies
the field's constraints. Validity changes also produce an event when the normalized
value has not changed.

To read on demand, use `currentValue` and `currentValueValid`, as the button handler
above does. Check validity before accepting a value: partially entered input may
be invalid even when its normalized value is empty. The CEF does not store values
or submit them to a service; those actions belong to the host.

TypeScript applications can import `CedarEmbeddableFieldValue` and
`CedarEmbeddableFieldChangeDetail` from `cedar-embeddable-editor` to type these
assignments and events.

## Display Values Without Editing

Set `config` to `{ readOnlyMode: true }` before assigning the field definition to
create a read-only display. Supply the definition and value through the same
properties as in the editable example. When no value is present, the component
shows a description of what the field accepts.

Configuration is assigned once per element. To switch between editable and
read-only presentation, create a new element with the desired configuration.
Fields using controlled terms or external authorities also need the appropriate
`terminologyBaseUrl` or `bridgeBaseUrl` in that configuration.

The CEF handles one field occurrence. Requiredness and repetition imposed by a
containing template do not apply, and an absent value is allowed. If the field
definition declares a default, it is shown initially unless the host supplies a
value.
