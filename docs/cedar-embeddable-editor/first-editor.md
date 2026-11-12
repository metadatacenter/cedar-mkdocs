# Your First Embedded Editor

A working CEE integration needs the component bundle, a
`<cedar-embeddable-editor>` element, and a template. This example uses plain HTML
so that each part is visible.

## Install the Component

Install the stable npm package:

```shell
npm install cedar-embeddable-editor
```

The package contains:

| File | Purpose |
|---|---|
| `cedar-embeddable-editor.js` | The self-contained component bundle. |
| `cedar-embeddable-editor.host-fonts.js` | An alternative for pages that already register CEDAR fonts. |
| `cedar-embeddable-editor.d.ts` | TypeScript declarations for the element and its public API. |
| `bundle-manifest.json`, `bundle-manifest.host-fonts.json` | Digests and byte counts for the two bundles. |
| `README.md`, `CHANGELOG.md` | Package and release documentation. |

Copy `node_modules/cedar-embeddable-editor/cedar-embeddable-editor.js` to
`assets/cedar-embeddable-editor.js` in the application's public directory. Load it
with a regular `<script>` tag; it is a classic script, not an ES module.

Keep the installed version in the application's lockfile and review the
[release notes](https://github.com/metadatacenter/cedar-embeddable-editor/releases)
before upgrading. Load only one bundle variant; [Appearance and Language](appearance.md#fonts)
explains the host-font option.

## Add the Editor to a Page

Export a saved template with an `@id` to `assets/dataset-template.json`; see
[Obtain a Template](#obtain-a-template). Start with a text-only template, which
needs no lookup service. Save this page alongside `assets` and serve it through
your application's HTTP server:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Describe your dataset</title>
  </head>
  <body>
    <h1>Describe your dataset</h1>
    <button id="read-metadata" type="button" disabled>Read metadata</button>
    <cedar-embeddable-editor></cedar-embeddable-editor>

    <script src="./assets/cedar-embeddable-editor.js"></script>
    <script type="module">
      await customElements.whenDefined('cedar-embeddable-editor');
      const cee = document.querySelector('cedar-embeddable-editor');
      const readButton = document.querySelector('#read-metadata');

      function updateReadiness(report) {
        readButton.disabled = report.canSave !== true;
      }

      cee.eventHandler = {
        ready: () => updateReadiness(cee.dataQualityReport),
        error: (label, value) => console.error(label, value),
      };
      cee.addEventListener('change', ({ detail }) => updateReadiness(detail.dataQualityReport));
      cee.addEventListener('validationChange', ({ detail }) => updateReadiness(detail));
      cee.config = {};

      const response = await fetch('./assets/dataset-template.json');
      if (!response.ok) throw new Error(`Template request failed: ${response.status}`);
      cee.templateObject = await response.json();

      readButton.addEventListener('click', () => {
        if (cee.dataQualityReport.canSave !== true) return;
        console.log('Metadata ready for the host:', cee.currentMetadata);
      });
    </script>
  </body>
</html>
```

`customElements.whenDefined()` waits for the bundle to register the custom
element. Set `config` next, before the form is built. Assigning `templateObject`
last supplies the template and renders the editor.

**Read metadata** prints the instance to the browser console when the save
policy permits it. The example does not write to a repository. A quality warning
can coexist with `canSave: true`; see [Validation](validation.md).

The example's native JSON parser is sufficient for its text-only template.
[Templates and Metadata](templates-and-metadata.md#preserve-exact-numbers)
shows how to preserve exact numeric constraints and values in a general host.

## Configure Lookup Services

Replace the empty configuration before supplying the template when you need
controlled-term or external-authority lookups. These are placeholders for your
deployment:

```javascript
cee.config = {
  terminologyBaseUrl: 'https://terminology.example.org/',
  bridgeBaseUrl: 'https://bridge.example.org/',
};
```

Both URLs must end in `/`. Configure CORS or a same-origin proxy for the host
page and keep upstream credentials on the server. [Configuration](configuration.md)
and [Controlled Terms and External Authorities](controlled-terms.md) describe
the endpoints. A second configuration assignment is ignored, so use this
configuration in place of `{}`, rather than assigning both.

## Use Properties, Not Attributes

Templates, instances, and configuration are JavaScript objects. Assign them as
properties on the element:

```javascript
cee.templateObject = template;
```

An HTML attribute can carry only a string, so this does not work:

```html
<cedar-embeddable-editor template-object="..."></cedar-embeddable-editor>
```

Framework integrations must also use property binding or an element reference.
See [Embedding in a Framework](frameworks.md).

## Read the Metadata

`currentMetadata` returns the current CEDAR JSON-LD instance:

```javascript
const instance = cee.currentMetadata;
```

For YAML output, read `currentMetadataYaml` instead. An unsaved template without
an identifier can render a preview but cannot produce a repository-saveable
instance; the JSON getter then returns `{}`.

The CEE does not submit or store the instance. The host checks `canSave` at
submission time, captures the submitted state with `captureSave()`, and handles
the server's response. See [Save an Instance](templates-and-metadata.md#save-an-instance)
for exact serialization and adoption of server-assigned element identifiers.

## Edit an Existing Instance

Supply the template and instance together when editing an existing record:

```javascript
cee.templateAndInstanceObject = {
  templateObject: template,
  instanceObject: instance,
};
```

The instance must have been created from the supplied template. The combined
assignment lets the CEE build the populated form once.

[Templates and Metadata](templates-and-metadata.md) covers the separate input
properties, serialization formats, change events, and temporal values.

## Obtain a Template

To author a template within your own application, use the
[CEDAR Embeddable Designer (CED)](../cedar-embeddable-designer/index.md).
Its integration with the
[CEDAR Embeddable Term Picker (CETP)](../cedar-embeddable-term-picker/index.md)
lets authors choose the vocabularies and default terms for controlled-term fields.
The host stores the resulting template and passes its chosen version to the CEE
for metadata entry. [Your First Embedded Designer](../cedar-embeddable-designer/first-designer.md)
covers that authoring setup; the CEE performs its own term lookup when the form is filled.

Templates can be exported from the CEDAR Workbench or retrieved through the
[CEDAR REST API](../developer-guide/cedar-rest-apis/working-with-artifacts.md).
They can also be created in code with the
[CEDAR Artifact Library](../developer-guide/cedar-artifact-library.md) or the
[CEDAR Model TypeScript Library](../developer-guide/cedar-model-typescript-library.md).

The CEE accepts both the JSON Schema representation exported by the Workbench
and the [CEDAR YAML representation](../yaml-spec/index.md).
