# Your First Embedded Term Picker

A working picker needs the component bundle, a custom element, and access to a
compatible CEDAR terminology service. This example collects a set of vocabulary
constraints in a plain HTML page.

## Install the Component

Install the stable npm package:

```shell
npm install cedar-embeddable-term-picker
```

The package contains:

| File | Purpose |
|---|---|
| `cedar-embeddable-term-picker.js` | The self-contained component bundle, including fonts. |
| `cedar-embeddable-term-picker.host-fonts.js` | An alternative for pages that already register CEDAR fonts. |
| `cedar-embeddable-term-picker.d.ts` and `search/*.d.ts` | TypeScript declarations for the public API and selection types. |
| `bundle-manifest.json`, `bundle-manifest.host-fonts.json` | Digests and byte counts for the two bundles. |
| `README.md`, `CHANGELOG.md` | Package and release documentation. |

Copy `node_modules/cedar-embeddable-term-picker/cedar-embeddable-term-picker.js`
to `assets/cedar-embeddable-term-picker.js` in your web application's public
directory. Load it as a classic script with an ordinary `<script>` tag.

Keep the installed version in the application's lockfile and review the
[release notes](https://github.com/metadatacenter/cedar-embeddable-term-picker/releases)
before upgrading.

## Connect a Terminology Service

The picker speaks to the **CEDAR terminology server**, rather than directly to
BioPortal. It needs the version-aware search API, including `POST /search` and
the associated hierarchy and version routes. An older deployment supporting
only metadata-entry autocomplete is insufficient.

The example below assumes your application proxies `/terminology/` to that
service. Configure this route first, or replace `terminologyBaseUrl` with the
absolute base URL of your deployment. A different origin must allow the host's
requests through CORS. Keep upstream service credentials on the server.

## Add the Picker to a Page

Save this page alongside `assets` and serve it through your application's
HTTP server:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Choose a vocabulary</title>
  </head>
  <body>
    <h1>Choose a vocabulary</h1>
    <p id="selection-status" aria-live="polite">No selection applied.</p>
    <cedar-embeddable-term-picker></cedar-embeddable-term-picker>

    <script src="./assets/cedar-embeddable-term-picker.js"></script>
    <script type="module">
      await customElements.whenDefined('cedar-embeddable-term-picker');
      const picker = document.querySelector('cedar-embeddable-term-picker');
      const status = document.querySelector('#selection-status');

      picker.terminologyBaseUrl = new URL('/terminology/', location.origin).href;
      picker.termTypes = ['ontology', 'branch', 'class', 'valueSet'];
      picker.constraintSet = { constraints: [], actions: [] };

      picker.addEventListener('constraintsSelected', (event) => {
        console.log('Constraints ready for the host:', event.detail);
        const count = event.detail.constraints.length;
        status.textContent = `${count} constraint${count === 1 ? '' : 's'} selected.`;
      });
      picker.addEventListener('cancelled', () => {
        status.textContent = 'Selection cancelled; the host keeps its previous constraints.';
      });

      picker.query = 'melanoma';
    </script>
  </body>
</html>
```

The query searches the configured service. Open a result category, add entries
to the selection table, and press **Done** to return the complete set. The
example prints it to the browser console without writing to a repository.

The four enabled categories are the kinds usable as controlled-term field
constraints. To build a property picker instead, enable `['property']`; the
host must handle those selections as properties.

## Use JavaScript Properties

Wait for `customElements.whenDefined()` before configuring the element. Set the
service and selection settings before assigning a query.

Arrays, objects, and numbers are properties, not HTML attributes:

```javascript
picker.maximumTerms = 4;
picker.constraintSet = { constraints: [], actions: [] };
```

The limit counts table entries across all enabled categories. A whole ontology
counts as one entry, regardless of its term count. Omitting the limit permits
any number of entries.

The `language` setting also has a string attribute:

```html
<cedar-embeddable-term-picker language="hu"></cedar-embeddable-term-picker>
```

## Apply the Selection

`constraintsSelected` carries `{ constraints, actions }` when the author presses
**Done**. `constraintsChanged` signals an edit to the in-progress selection;
it does not carry the completed set. `cancelled` lets the host close its dialog
without applying the draft.

The host's model library writes the selected constraints into a field's CEDAR
representation. CETP does not serialize or save a template. Preserve term
identifiers, source information, pinned versions, and any actions when applying
the set. [Constraints and Selections](selections.md) covers these details and
the separate single-term workflow.

## Use the Picker With the Designer and Editor

The [CEDAR Embeddable Designer (CED)](../cedar-embeddable-designer/index.md)
integrates CETP into template authoring. Load the picker bundle and configure
CED's terminology endpoint; CED manages the embedded picker and applies its
constraint or default-term selections to the field definition. See
[Your First Embedded Designer](../cedar-embeddable-designer/first-designer.md)
for that setup. A standalone picker such as the example above leaves those
steps to its host.

The host saves the template and supplies a selected version to the
[CEDAR Embeddable Editor (CEE)](../cedar-embeddable-editor/index.md). CEE renders
the form and returns the metadata instance for the host to save. It also
provides CED's form preview and, through its included CEF widget, individual
field controls. CEE's controlled-term fields perform their own lookup through
the configured terminology service, so a page filling an existing template
needs only the CEE bundle. Continue with
[Your First Embedded Editor](../cedar-embeddable-editor/first-editor.md)
to collect metadata from the finished template.
