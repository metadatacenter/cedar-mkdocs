# Your First Embedded Editor

Putting a working editor on a page takes three things: a script that registers the custom element,
the element itself, and a template. A plain HTML page with no framework and no build step shows all
three at once, before any tooling hides them.

## Getting the Component

The CEE ships as an npm package carrying a single JavaScript file.

Stable releases are published to npmjs.org as
[`cedar-embeddable-editor`](https://www.npmjs.com/package/cedar-embeddable-editor):

```shell
npm install cedar-embeddable-editor
```

The installed package holds five files, of which two matter to an embedding application:

| File | Purpose |
|---|---|
| `cedar-embeddable-editor.js` | The component. One self-contained script, with no runtime dependencies. |
| `cedar-embeddable-editor.d.ts` | TypeScript declarations for the configuration and the element. |
| `bundle-manifest.json` | The SHA-256 digest and byte count of the script, for verifying what was installed. |
| `README.md`, `CHANGELOG.md` | Package documentation. |

Copy `node_modules/cedar-embeddable-editor/cedar-embeddable-editor.js` into whatever directory the
application serves static files from. A plain `<script src>` loads it, since it is a classic script
rather than an ES module, and no bundler need be involved.

Development builds are published separately, to the Stanford BMIR Nexus registry, under the scoped
name `@org.metadatacenter/cedar-embeddable-editor` and the `dev` tag. They carry work that has not
been released yet, and installing one is a deliberate act:

```shell
npm config set @org.metadatacenter:registry https://nexus.bmir.stanford.edu/repository/npm-cedar/
npm install @org.metadatacenter/cedar-embeddable-editor@dev
```

An application already depending on the unscoped name can keep it, with an npm alias:

```json
"cedar-embeddable-editor": "npm:@org.metadatacenter/cedar-embeddable-editor@<version>"
```

The two names are different packages, so a development build never reaches an application by
accident. Reading from Nexus needs no credentials.

Embedding platforms cannot absorb an upstream change without first checking it against their own
workflows, so the CEE expects releases to be adopted deliberately. Versions are stable and
npm-distributed, a public changelog records what changed, and breaking changes are announced ahead
of the release carrying them. Pin a version, read the changelog, and move when it suits the
application.

## The Page

Loading the script registers one custom element, `cedar-embeddable-editor`. Place the element where
the form should appear, load the script, then give the element a template:

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
        showSampleTemplateLinks: false,
        showTemplateSourceData: false,
        showInstanceDataFull: false,
        terminologyIntegratedSearchUrl:
          'https://terminology.metadatacenter.org/bioportal/integrated-search',
      };

      cee.templateObject = template;
    </script>
  </body>
</html>
```

That page is a complete metadata editor. Opening it renders the form the template describes, with
its field types, its required markers, its repeating groups, and its term autocompletes.

## What Each Part Does

**`customElements.whenDefined`** waits for the component to register itself. The CEE bootstraps
asynchronously after its script runs, so for a short while the tag in the page is an ordinary
unknown element. Awaiting the definition is the reliable point at which to hand it anything.

**`cee.config`** sets the editor's behavior. Every key is optional, and the four in the example are
the ones almost every application wants: no sample-template picker, no raw source panels, and a
terminology service for controlled fields. [Configuration](configuration.md) covers the rest.

**`cee.templateObject`** supplies the template, as a parsed object rather than as source text.
That assignment triggers the render, so it goes last, with the configuration already in place
when the form is built.

## Properties, Not Attributes

An application gives the CEE everything as a JavaScript **property** on the element, never as an
HTML attribute. Templates, instances and configuration are objects, and an HTML attribute carries
only a string.

```javascript
cee.templateObject = template;              // correct
```

```html
<cedar-embeddable-editor template-object="..."></cedar-embeddable-editor>
<!-- has no effect -->
```

The same rule shapes how frameworks bind to the CEE, which is why
[Embedding in a Framework](frameworks.md) spends most of its time on property binding.

## Reading the Metadata Back

The instance under edit is available at any moment, as a plain object:

```javascript
const instance = cee.currentMetadata;
```

Reading it has no side effects, so an application can read as often as it needs: on a save button,
on an interval, or when the user navigates away. The CEE submits nothing anywhere. The application
decides where the metadata goes.

```javascript
document.querySelector('#save').addEventListener('click', async () => {
  await fetch('/api/metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cee.currentMetadata),
  });
});
```

## Opening an Existing Instance

To edit metadata that already exists rather than start from an empty form, supply the
[instance](../yaml-spec/instances-core.md) as well. Both belong to the same assignment, so that the CEE
builds the form once with the values already known:

```javascript
cee.templateAndInstanceObject = {
  templateObject: template,
  instanceObject: instance,
};
```

The instance must be one built from the template being supplied alongside it.
[Templates and Metadata](templates-and-metadata.md) describes the alternatives to this single
assignment and when each is appropriate.

## Where Templates Come From

The CEE does not care how the application obtained its template. The usual sources are the CEDAR
Workbench, which can export any template it holds, and the CEDAR REST API, which can fetch one by
identifier.

A template can also be built in code. The
[CEDAR Artifact Library](../developer-guide/cedar-artifact-library.md) builds one in Java, and the
[CEDAR Model TypeScript Library](https://github.com/metadatacenter/cedar-model-typescript-library)
builds one in TypeScript. An application that embeds the CEE has particular reason to prefer the
TypeScript library, because the editor parses every template through it.

A template can equally be written by hand in [the YAML serialization](../yaml-spec/index.md) of the
CEDAR model, which the CEE reads once `inputSerialization` says so.
