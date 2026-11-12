# Your First Embedded Designer

A CED integration needs the designer bundle, one custom element, and a host that
reads the resulting template. This example starts a new template in plain HTML.

## Install the Components

Install the stable packages from npm:

```shell
npm install cedar-embeddable-designer cedar-embeddable-editor cedar-embeddable-term-picker
```

The CED can run on its own. This example also loads the
[CEDAR Embeddable Editor (CEE)](../cedar-embeddable-editor/index.md) for preview
and field controls, and the
[CEDAR Embeddable Term Picker (CETP)](../cedar-embeddable-term-picker/index.md)
for vocabulary authoring when a terminology service is configured. The CED manages
these embedded components after the host loads their bundles and configures
the required services.

Create an `assets` directory in your web application's public directory and copy:

| Installed File | Public File |
|---|---|
| `node_modules/cedar-embeddable-designer/cedar-embeddable-designer.js` | `assets/cedar-embeddable-designer.js` |
| `node_modules/cedar-embeddable-editor/cedar-embeddable-editor.js` | `assets/cedar-embeddable-editor.js` |
| `node_modules/cedar-embeddable-term-picker/cedar-embeddable-term-picker.js` | `assets/cedar-embeddable-term-picker.js` |

These are classic scripts loaded with ordinary `<script>` tags. The designer
package also contains:

| File | Purpose |
|---|---|
| `cedar-embeddable-designer.host-fonts.js` | An alternative for pages that already register CEDAR fonts. |
| `cedar-embeddable-designer.d.ts` | TypeScript declarations for the CED and the CEFD. |
| `bundle-manifest.json`, `bundle-manifest.host-fonts.json` | Digests and byte counts for the two bundles. |
| `README.md`, `CHANGELOG.md` | Package and release documentation. |

Load one variant of each component. [Configuration and Appearance](configuration.md#appearance-and-fonts)
explains the host-font option. Coordinated builds using `integration.mjs` also
need matching model and framework runtimes; the separate classic scripts above
are the starting point for an ordinary embed.

Keep the installed versions in the application's lockfile and review the
[release notes](https://github.com/metadatacenter/cedar-embeddable-designer/releases)
before upgrading.

## Add the Designer to a Page

Save this page alongside `assets` and serve it through your web application's
HTTP server:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Design a metadata template</title>
  </head>
  <body>
    <h1>Design a metadata template</h1>
    <button id="read-template" type="button" disabled>Read template</button>
    <cedar-embeddable-designer></cedar-embeddable-designer>

    <script src="./assets/cedar-embeddable-term-picker.js"></script>
    <script src="./assets/cedar-embeddable-editor.js"></script>
    <script src="./assets/cedar-embeddable-designer.js"></script>
    <script type="module">
      await customElements.whenDefined('cedar-embeddable-designer');
      const designer = document.querySelector('cedar-embeddable-designer');
      const readButton = document.querySelector('#read-template');

      designer.config = {};
      designer.addEventListener('validationChange', (event) => {
        readButton.disabled = !event.detail.canSave;
      });
      designer.newArtifact('template');
      readButton.disabled = !designer.canSave;

      readButton.addEventListener('click', () => {
        if (!designer.validate().canSave) return;
        console.log('Template ready for the host:', designer.currentArtifact);
      });
    </script>
  </body>
</html>
```

Give the template a name and add fields using the designer. **Read template**
becomes available when the current definition can be saved. It prints the
artifact to the browser console; the example does not write to a repository.

`customElements.whenDefined()` waits for registration. Set `config` before
opening or creating a document. `newArtifact('template')` creates an empty
template without the development application's sample fields.

The empty configuration is sufficient for basic authoring. Controlled-term and
external-authority lookups need the services described below.

## Use JavaScript Properties

Assign objects such as `config`, `artifact`, and `childSource` through the
element reference, rather than string-valued HTML attributes. Framework hosts
use property binding or a DOM reference in the same way. The string-valued
`language` setting also supports an HTML attribute.

Configuration is accepted once per element. Document inputs may be replaced,
but doing so discards the current editing session; check for unsaved work first.
See [Artifacts and Validation](artifacts-and-validation.md).

## Configure Lookup Services

Replace the empty configuration with the URLs of services your application can
reach. Use this as the initial configuration instead of `{}`, since a second
assignment is ignored. The following names are placeholders for your deployment:

```javascript
designer.config = {
  terminologyBaseUrl: 'https://terminology.example.org/',
  bridgeBaseUrl: 'https://bridge.example.org/',
};
```

Supply the terminology server's base URL, rather than a BioPortal URL or a
particular search route. The service must support the Term Picker's version-aware
search API. CORS or a same-origin proxy must permit requests from the host page.
See [Configuration and Appearance](configuration.md).

## Open an Existing Template or Element

Use `loadArtifact()` when the host needs to handle a rejected input explicitly:

```javascript
const response = await fetch('./assets/dataset-template.json');
if (!response.ok) throw new Error(`Template request failed: ${response.status}`);
designer.loadArtifact(await response.text());
```

The source may be a JSON object, JSON text, or CEDAR YAML text. A load failure
throws without replacing the current document. The `artifact` property accepts
the same inputs but reports an unreadable source to the console.

Use `newArtifact('element')` to author a standalone element. Its output stays an
element even when CEE preview wraps it in a temporary template.

## Add Saving to Your Application

The host owns saving, permissions, and versioning. Check `validate().canSave`
immediately before reading `currentArtifact`; an earlier change event is not a
save-readiness check. Do not overwrite edits made while a save request was pending
with a late response.

[Artifacts and Validation](artifacts-and-validation.md) covers precise JSON
serialization, server findings, and adopting a saved document. For a field-only
workflow, continue with [Designing a Single Field](field-designer.md).

## Collect Metadata With the Finished Template

Once the host has saved the template, supply the chosen version to CEE to
collect metadata instances. The host stores those instances separately from
the template definition. CEE uses the field constraints authored with CETP
when looking up controlled terms through its configured terminology service;
a page that only fills an existing template needs only the CEE bundle.

[Your First Embedded Editor](../cedar-embeddable-editor/first-editor.md)
shows how to render the form, and
[Templates and Metadata](../cedar-embeddable-editor/templates-and-metadata.md)
explains how to read the resulting instance. To use vocabulary selection
outside CED, see
[Your First Embedded Term Picker](../cedar-embeddable-term-picker/first-picker.md).
