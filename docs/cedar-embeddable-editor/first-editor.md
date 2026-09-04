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
| `cedar-embeddable-editor.d.ts` | TypeScript declarations for the element and its public API. |
| `bundle-manifest.json` | The bundle's SHA-256 digest and byte count. |
| `README.md`, `CHANGELOG.md` | Package and release documentation. |

Copy `cedar-embeddable-editor.js` to the application's static assets. Load it
with a regular `<script>` tag; it is a classic script, not an ES module.

Pin the package version used by the application and review the changelog before
upgrading. This keeps deployment on the host application's schedule.

## Add the Editor to a Page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Describe your dataset</title>
  </head>
  <body>
    <h1>Describe your dataset</h1>

    <cedar-embeddable-editor></cedar-embeddable-editor>

    <script src="/assets/cedar-embeddable-editor.js"></script>
    <script type="module">
      const template = await (await fetch('/assets/dataset-template.json')).json();

      await customElements.whenDefined('cedar-embeddable-editor');
      const cee = document.querySelector('cedar-embeddable-editor');

      cee.config = {
        terminologyBaseUrl: 'https://terminology.metadatacenter.org/',
        bridgeBaseUrl: 'https://bridge.metadatacenter.org/',
      };

      cee.templateObject = template;
    </script>
  </body>
</html>
```

`customElements.whenDefined()` waits for the bundle to register the custom
element. Set `config` next, before the form is built. Assigning `templateObject`
last supplies the template and renders the editor.

The two service URLs are needed only for controlled-term and
external-authority lookups. [Configuration](configuration.md) documents every
setting.

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

The CEE does not submit or store the instance. The host application decides when
and where to save it:

```javascript
document.querySelector('#save').addEventListener('click', async () => {
  await fetch('/api/metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cee.currentMetadata),
  });
});
```

For YAML output, read `currentMetadataYaml` instead.

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

Templates can be exported from the CEDAR Workbench or retrieved through the
[CEDAR REST API](../developer-guide/cedar-rest-apis/working-with-artifacts.md).
They can also be created in code with the
[CEDAR Artifact Library](../developer-guide/cedar-artifact-library.md) or the
[CEDAR Model TypeScript Library](../developer-guide/cedar-model-typescript-library.md).

The CEE accepts both the JSON Schema representation exported by the Workbench
and the [CEDAR YAML representation](../yaml-spec/index.md).
