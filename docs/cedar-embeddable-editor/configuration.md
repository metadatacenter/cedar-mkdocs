# Configuration

The CEE takes a single configuration object. Every key in it is optional, so a minimal configuration
stays short and most applications never write a complete one. Nine keys exist in total, and only two
of them have to be set: the CEDAR servers the editor calls, which nothing but the embedding
application can know.

## Supplying the Configuration

Assign the object to the `config` property, writing it in the application's own source:

```javascript
cee.config = {
  terminologyBaseUrl: 'https://terminology.metadatacenter.org/',
  bridgeBaseUrl: 'https://bridge.metadatacenter.org/',
};
```

A framework binds to the same property. Angular writes `[config]="ceeConfig"`, and React and the
others assign through a ref, as [Embedding in a Framework](frameworks.md) describes.

An application that keeps its configuration in a deployed JSON file rather than in compiled source
fetches the file and assigns the result:

```javascript
customElements.whenDefined('cedar-embeddable-editor').then(async () => {
  const cee = document.querySelector('cedar-embeddable-editor');
  cee.config = await (await fetch('/assets/cee-config.json')).json();
});
```

## Configuration Is Set Once

The CEE applies a configuration once and keeps it. Assigning `config` a second time is reported and
ignored, and the first object stands:

```
CEE ERROR: CEDAR Embeddable Editor: "config" ignored, because the editor is already configured.
Configuration takes one assignment; create a new editor element to configure it differently.
```

So build the configuration you want, assign it once, and create a new element if it has to change.
An application that offers the user a choice between editing and viewing builds a new editor for the
other mode rather than reconfiguring the one on screen.

Configuration is not required at all. An element given a template and nothing else renders, taking
every default.

The artifact inputs work the same way, as [Templates and Metadata](templates-and-metadata.md)
describes. Nothing about the element accumulates: the same assignments in a different order give the
same editor, which is what lets an application reason about what it is looking at.

## What the CEE Reports About a Configuration

The CEE ignores a key it does not recognize, but it reports the key rather than passing over it in
silence. Every configuration meets a check as it crosses the boundary, and anything unusable is
named:

```
CEE ERROR: Unknown configuration key "readOnlyMod". It has no effect. Did you mean "readOnlyMode"?
CEE ERROR: Configuration key "readOnlyMode" expects a boolean, but was string. Ignored.
CEE ERROR: Configuration key "bridgeBaseUrl" must end in a slash, but was "https://bridge.example.org".
```

The messages go to the browser console and to any handler registered on the `eventHandler`
property. They diagnose only. The CEE rejects nothing and behaves exactly as it would without the
check.

A server the application never named is reported once, when a field first needs it, rather than on
every keystroke:

```
CEE ERROR: CEDAR Embeddable Editor: controlled-term search is off, because "terminologyBaseUrl"
is not configured. Set it to the CEDAR terminology server, ending in a slash.
```

## TypeScript Declarations

The package ships declarations, so a TypeScript application gets a checked configuration object and
a typed element:

```typescript
import type { CeeConfig, CedarEmbeddableEditorElement } from 'cedar-embeddable-editor';

const config: CeeConfig = { readOnlyMode: true, showDownloadMenu: true };

const cee = document.querySelector('cedar-embeddable-editor');
cee!.config = config;
const report = cee!.dataQualityReport;   // CeeDataQualityReport
```

The query needs no cast, because the package declares its tag in `HTMLElementTagNameMap`.

`CeeConfig` is closed: every key an application may set is declared, so a misspelling is a compile
error rather than a setting that silently does nothing.

The package publishes **types only**, which follows from the bundle rather than from an oversight.
The published file is a script that registers a custom element and exports no values, so nothing
exists to import at run time. Use `import type`, and let the interface catch a mistyped key rather
than reaching for a constant that would read `undefined` when the page runs.

## Reference

### The Two Servers

Each names a CEDAR server and nothing below it: the CEE appends the paths itself, so an application
supplies two hostnames and never restates a route. Both must end in a slash, and neither has a
default — the CEE cannot know which deployment it is embedded in, and a default would name one.

| Key | Type | Default | Meaning |
|---|---|---|---|
| `terminologyBaseUrl` | string | none | The CEDAR terminology server. Unset, controlled fields offer no terms. |
| `bridgeBaseUrl` | string | none | The CEDAR bridge server. Unset, the external-authority fields offer no terms and resolve no identifiers. |

`https://terminology.metadatacenter.org/` and `https://bridge.metadatacenter.org/` serve most
applications. [Controlled Terms](controlled-terms.md) explains what each one does.

Below `terminologyBaseUrl` the CEE appends `bioportal/integrated-search`. Below `bridgeBaseUrl` it
appends `ext-auth/`, then the search or details path of the authority a field is bound to. None of
those paths is configurable: they are the servers' own routes, so an application free to move them
could only move them somewhere nothing answers.

### What the User Sees

| Key | Type | Default | Meaning |
|---|---|---|---|
| `showTemplateDescription` | boolean | `false` | The template's description, under its title. |
| `showDownloadMenu` | boolean | `false` | A menu offering the CEE's views of the artifact as files. |

`showDownloadMenu` offers the instance and the template as JSON-LD, JSON Schema and YAML, plus the
rendering data, the multi-instance information and the data quality report. Each file is named from
the template, `AttributeValues-instance.yaml` rather than `instance.yaml`, so several open forms do
not collide.

A download is started by the page, and an application running under a restrictive sandbox can refuse
one with no event to observe. The CEE traces each attempt through the event handler, so a developer
seeing the trace and no file knows where to look.

### Editing Behaviour

| Key | Type | Default | Meaning |
|---|---|---|---|
| `readOnlyMode` | boolean | `false` | Present the metadata for reading, with no editing. |
| `trustTemplateRichText` | boolean | `false` | Render a template author's rich text verbatim instead of sanitizing it. See [Security](security.md). |

`readOnlyMode` is the only way in or out of read-only. Nothing inside the form can change it, so a
form embedded as a viewer stays one.

### Language

| Key | Type | Default | Meaning |
|---|---|---|---|
| `defaultLanguage` | string | `en` | The language to render in. |
| `fallbackLanguage` | string | `en` | The language consulted for a string the first one lacks. |
| `languageMapPathPrefix` | string | none | A directory of external language files. |

These govern the CEE's own interface strings. A template's labels, descriptions and help text are
rendered as their author wrote them.

[Appearance and Language](appearance.md#translations) describes how the sources of a translation are
tried in turn.

## Receiving the Diagnostics

The CEE reports its diagnostics to the console and to a handler the application registers:

```javascript
cee.eventHandler = {
  trace: (label, value) => console.debug('CEE', label, value),
  error: (label, value) => reportToMonitoring(label, value),
};
```

Both members are optional and the CEE calls only the ones present, so `{ error }` alone is a valid
handler and receives no traces. `error` carries the failures an application should surface: a
template the CEE could not read, a value it discarded, a configuration key it cannot use. `trace`
carries the running commentary, including which language maps loaded.
