# CEDAR Embeddable Editor

The CEDAR Embeddable Editor (CEE) adds structured metadata forms to an existing web
application. The host supplies a [CEDAR template](../yaml-spec/templates-core.md),
and the CEE renders the corresponding form. As the user completes it, the host can
read the resulting [metadata instance](../yaml-spec/instances-core.md) as JSON-LD or
YAML.

The CEE is a framework-independent
[Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components),
distributed as a single JavaScript file. It can be embedded in a plain HTML page or
used from Angular, React, Ember, and other web frameworks. It does not require a CEDAR
account or a running CEDAR installation to render a form.

## Why Use the CEE?

CEDAR templates express metadata requirements in a form that software can interpret.
A template defines the fields to collect, their types and cardinalities, validation
constraints, repeatable groups, and any controlled vocabularies or identifier
authorities associated with them.

The CEE turns that specification into a working interface. A platform can therefore
adopt or revise a metadata standard without writing a new form for every template.
Researchers enter metadata without leaving the platform they already use, while the
platform keeps control of template selection, persistence, and the surrounding
workflow.

The division of responsibilities is:

| Part | Responsibility |
|---|---|
| Template author | Defines the metadata structure, constraints, labels, and vocabulary bindings. |
| CEE | Renders the form, validates input, resolves configured terms and identifiers, and serializes the instance. |
| Host application | Supplies the template, stores the metadata, chooses service endpoints, and decides when a record may be submitted. |

The same component also supports read-only display, so a platform can use one renderer
for both authoring and reviewing metadata.

## What Goes In and What Comes Out

The CEE accepts templates in CEDAR's JSON Schema or YAML representation. It can start
with an empty form or load an existing instance for editing.

The resulting instance contains more than display text. A controlled term records its
IRI as well as its label, and an external-authority field records a persistent
identifier such as an ORCID, ROR, DOI, PubMed ID, RRID, NIH grant identifier, or PFAS
identifier. This preserves the semantics needed for validation, indexing, and reuse.

[Templates and Metadata](templates-and-metadata.md) describes the input properties,
output properties, and change event in detail.

## CEDAR Embeddable Field (CEF)

The CEDAR Embeddable Field (CEF) is a separate widget for displaying and acquiring
values for an individual CEDAR field, rather than an entire template. It supports
all CEDAR field types. The host supplies the field definition and the surrounding
label, description, and layout, and can use the resulting values in its own
workflow.

The CEF is included in the CEE bundle and supports both editing and read-only
display. See [Using the CEF](#using-the-cef) for embedding and API details.

## Optional Network Services

Rendering, editing, local validation, and serialization all happen in the browser.
Network access is needed only for features that depend on remote data or content:

| Feature | Source |
|---|---|
| Controlled-term suggestions | The CEDAR terminology service configured by the host. |
| External-authority lookup | The CEDAR bridge service configured by the host. |
| Additional interface languages | A language-map location configured by the host. |
| Images and videos in a template | The origins named by the template author. |

Neither CEDAR service has a default endpoint. If the host does not configure one, the
corresponding lookup feature is unavailable but the rest of the form continues to
work. The CEE never stores or submits the completed metadata; the host application
decides where it goes.

See [Security](security.md) for the trust model, network requests, and content security
policy guidance.

## Using the CEF

An application sometimes needs to display or collect one value without presenting
an entire metadata form. The CEF provides that interface: the host supplies a CEDAR
field definition, and the component presents the appropriate control, such as a
text box, date picker, or controlled-term lookup. The host can supply an existing
value, receive edits, and decide how to use or store the result.

A **field definition** describes the field's type and constraints. A **field value**
is the answer being displayed or edited. These are supplied separately through the
`fieldObject` and `value` properties. The same definition can therefore be used to
edit different values.

### Present a Field on a Page

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

### Pass Values to the Field

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

### Retrieve Values and Check Validity

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

### Display Values Without Editing

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

## Current Limits

The CEE is intended for template-driven forms. It does not currently provide:

- conditional branching based on earlier answers;
- validation rules that compare multiple fields; or
- spreadsheet-style bulk entry.

For tabular workflows, see
[CEDAR's spreadsheet tooling](https://www.nature.com/articles/s41597-025-04589-6).

## Deployments

The CEE is used for metadata entry in the Open Science Framework and Dryad, and for
read-only presentation in the RADx Data Hub and HuBMAP. The HuBMAP templates used by
Dryad and OSF are the same exported templates: each platform supplies its own
configuration and integrates the resulting metadata into its own workflow.

These deployments illustrate the main design goal of the CEE: a community can define
a machine-actionable metadata standard once and use it in several independent
applications without rebuilding the authoring interface for each one.

## Browser and Accessibility Support

The CEE requires native Custom Elements and Shadow DOM support. Its automated browser
suite covers current Chromium, Firefox, and WebKit engines; partner deployments have
also tested releases in Chrome, Firefox, Safari, Edge, and selected mobile browsers.
Internet Explorer, EdgeHTML, and web views without these Web Component APIs are not
supported.

The editor is designed for keyboard and screen-reader use, with WCAG AA as its
accessibility target.

## Get Started

- [Build Your First Embedded Editor](first-editor.md).
- [Integrate the CEE with a Framework](frameworks.md).
- [Configure Services and Behavior](configuration.md).
- [Work with Controlled Terms and External Authorities](controlled-terms.md).
- [Read Validation Results](validation.md).

## Citation and Source

The design, architecture, and deployments are described in:

> O'Connor, M.J., Martinez-Romero, M., Egyedi, A.L., Akdogan, M.U., Dorf, M.V. and
> Musen, M.A. 2026. [Author Once, Publish Everywhere: Portable Metadata Authoring
> with the CEDAR Embeddable Editor](https://doi.org/10.5334/dsj-2026-002).
> *Data Science Journal*, 25: 2, pp. 1-18.

Source code is available from
[metadatacenter/cedar-embeddable-editor](https://github.com/metadatacenter/cedar-embeddable-editor)
under the BSD 2-Clause License.
