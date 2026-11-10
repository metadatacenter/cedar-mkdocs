# Designing a Single Field

The CEDAR Embeddable Field Designer (CEFD) authors one field definition. It is
included in the CED bundle and uses the same field controls, model conversion,
and validation as the full designer.

CEFD defines a field. The [CEDAR Embeddable Field
(CEF)](../cedar-embeddable-editor/using-the-cef.md) displays that definition or
collects a value for it. The two components serve different parts of a workflow.

## Create a Field

Load the CED bundle as described in
[Your First Embedded Designer](first-designer.md). Load CEE and the Term Picker
too when you need their default-value and terminology controls.

```html
<cedar-embeddable-field-designer></cedar-embeddable-field-designer>

<script src="./assets/cedar-embeddable-term-picker.js"></script>
<script src="./assets/cedar-embeddable-editor.js"></script>
<script src="./assets/cedar-embeddable-designer.js"></script>
<script type="module">
  await customElements.whenDefined('cedar-embeddable-field-designer');
  const fieldDesigner = document.querySelector('cedar-embeddable-field-designer');

  fieldDesigner.config = {};
  fieldDesigner.addEventListener('validationChange', (event) => {
    console.log('Field can be saved:', event.detail.canSave);
  });
  fieldDesigner.newArtifact('text');
</script>
```

Omit the argument to `newArtifact()` to show the field-type chooser. Supported
types include text, numeric, temporal, choices, controlled terms, external
identifiers, attribute-value fields, and static content. The public
`CedFieldType` declaration lists the accepted names.

## Load and Read a Field

`loadArtifact(source)` accepts a JSON object, JSON text, or CEDAR YAML text.
Invalid input throws without replacing current edits. Successful loads and
`newArtifact()` reset the dirty baseline.

Read `currentArtifact` only after checking `validate().canSave`. It is `null`
before a type is chosen and may throw while a draft is invalid. `artifactChange`
fires only for a serializable artifact, so the last event alone cannot establish
whether the current field is ready to save.

CEFD supports the same `validationReport`, `validationChange`, `dirtyChange`,
`validationFindings`, `validateArtifact`, and recovery methods as CED. See
[Artifacts and Validation](artifacts-and-validation.md), including the guidance
on exact numeric serialization and server response handling.

## Field Definition and Parent Placement

A field definition includes its own name, description, datatype, constraints,
defaults, language, and annotations. Requirement, repetition, property IRI, and
parent display overrides belong to the template or element that places it.
Those placement controls therefore appear in CED, not in CEFD.

Set `readOnly = true` when the host permits inspection only. Published field
definitions remain read-only even if the host clears that flag. The host owns
authentication, fetching, saving, and publication.

## Language and Multiple Instances

Set `language` to `en` or `hu`, as a property or attribute. Each CEFD instance
has its own document, language, and shadow root, and can coexist with other
field designers and full designers on the same page.

TypeScript hosts can import `CedarEmbeddableFieldDesignerElement` as a type from
`cedar-embeddable-designer`; there is no separate CEFD npm package.
