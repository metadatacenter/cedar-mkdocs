# Configuration

Assign configuration as a JavaScript object on the element. All nine keys are
optional:

```javascript
cee.config = {
  terminologyBaseUrl: 'https://terminology.metadatacenter.org/',
  bridgeBaseUrl: 'https://bridge.metadatacenter.org/',
};
```

Frameworks bind to the same property. An application may also fetch a deployed
JSON file and assign the parsed result:

```javascript
await customElements.whenDefined('cedar-embeddable-editor');
const cee = document.querySelector('cedar-embeddable-editor');
cee.config = await (await fetch('/assets/cee-config.json')).json();
```

## Assign Configuration Once

The first valid configuration assignment is retained. A second is ignored:

```
CEE ERROR: CEDAR Embeddable Editor: "config" ignored, because the editor is already configured.
Configuration takes one assignment; create a new editor element to configure it differently.
```

Create a new element when configuration must change, including switches between
editing and read-only display. Supplying no configuration is valid and applies
all defaults.

A value that is not an object, such as `null`, a string, or an array, is rejected
without consuming the assignment.

## Configuration Errors

The CEE validates each key independently. Unknown keys, wrong types, and malformed
base URLs are ignored and reported through the console and `eventHandler`:

```
CEE ERROR: Unknown configuration key "readOnlyMod". It has no effect. Did you mean "readOnlyMode"?
CEE ERROR: Configuration key "readOnlyMode" expects a boolean, but was string. Ignored, and the key reads as unset.
CEE ERROR: Configuration key "bridgeBaseUrl" must end in a slash, but was "https://bridge.example.org". Ignored, and the key reads as unset.
```

Other valid keys in the same object still apply. The CEE does not modify an
invalid URL. A missing service URL is reported once when a field first needs it.

## TypeScript Declarations

The npm package provides types for the configuration, element, events, and data
quality report:

```typescript
import type { CeeConfig, CedarEmbeddableEditorElement } from 'cedar-embeddable-editor';

const config: CeeConfig = { readOnlyMode: true, showDownloadMenu: true };
const cee = document.querySelector('cedar-embeddable-editor');

cee!.config = config;
const report = cee!.dataQualityReport; // CeeDataQualityReport
```

The package augments `HTMLElementTagNameMap`, so `querySelector()` infers the
element type. `CeeConfig` lists every supported key and catches misspellings at
compile time.

Use `import type`: the bundle registers the custom element but exports no runtime
values.

## Service Endpoints

Both base URLs must end in `/`. Neither has a default.

| Key | Type | Default | Purpose |
|---|---|---|---|
| `terminologyBaseUrl` | string | none | CEDAR terminology service used by controlled-term fields. |
| `bridgeBaseUrl` | string | none | CEDAR bridge service used by external-authority fields. |

The public services are:

- `https://terminology.metadatacenter.org/`
- `https://bridge.metadatacenter.org/`

Use the corresponding endpoints from your own CEDAR deployment when applicable.
The CEE appends its fixed service routes to these bases. See
[Controlled Terms and External Authorities](controlled-terms.md).

## Display Options

| Key | Type | Default | Purpose |
|---|---|---|---|
| `showTemplateDescription` | boolean | `false` | Show the template description below its title. |
| `showDownloadMenu` | boolean | `false` | Offer artifact and validation downloads. |

The download menu provides:

| Entry | Filename suffix |
|---|---|
| JSON-LD instance | `-instance.json` |
| YAML instance | `-instance.yaml` |
| Compact YAML instance | `-instance-compact.yaml` |
| JSON Schema template | `-template.json` |
| YAML template | `-template.yaml` |
| Compact YAML template | `-template-compact.yaml` |
| Data quality report | `-data-quality.json` |

The filename begins with a filename-safe form of the template's `schema:name`.
For example, `AttributeValues-instance.yaml` identifies both the template and the
representation.

A sandboxed host can block downloads without raising a CEE event. The component
traces each download attempt through `eventHandler` to aid diagnosis.

## Editing Options

| Key | Type | Default | Purpose |
|---|---|---|---|
| `readOnlyMode` | boolean | `false` | Display the metadata without editing controls. |
| `trustTemplateRichText` | boolean | `false` | Render template-authored rich text without sanitizing it. |

Only enable `trustTemplateRichText` when template authors are trusted to run code
in the host application's origin. See [Security](security.md).

## Language Options

| Key | Type | Default | Purpose |
|---|---|---|---|
| `defaultLanguage` | string | `en` | Preferred interface language. |
| `fallbackLanguage` | string | `en` | Language used when the preferred map lacks a string. |
| `languageMapPathPrefix` | string | none | Directory containing external language maps. |

These settings affect the CEE interface, not labels or help text supplied by the
template. [Appearance and Language](appearance.md#translations) describes the
translation lookup order.

## Receive Diagnostics and Lifecycle Events

Assign an optional event handler before configuration and artifact inputs if the
application needs all diagnostics:

```javascript
cee.eventHandler = {
  trace: (label, value) => console.debug('CEE', label, value),
  error: (label, value) => reportToMonitoring(label, value),
  ready: () => enableSaveControls(),
};
```

- `trace` receives operational details, including language-map loading.
- `error` receives rejected configuration, templates, and values.
- `ready` runs once after the first successful render. It is not replayed when a
  handler is attached later.
- `valueChanged(path, value)` is available for field mutations, although the
  typed DOM `change` event is preferable when the application also needs
  structural changes, validity, or the current report.

Each callback is optional. Unlike configuration and artifact inputs,
`eventHandler` can be replaced; the most recently assigned handler receives later
events.

## Scroll to a Field

An application that lists the problems in the
[data quality report](validation.md) can take the user to each one. The CEE shows
one page of a paged template at a time, one entry of each repeating field or
element at a time, and an element's fields only while its panel is open, so a
field with a problem is often not on screen. The `reveal` method brings it there.
The CEE turns to the field's page, moves each repeating field or element above it
to the entry that holds it, expands the elements around it, scrolls it into view,
and moves keyboard focus to its control.

Each problem record carries the location `reveal` needs, so the application can
pass the record itself:

```javascript
for (const problem of cee.dataQualityReport.problems) {
  const item = document.createElement('button');
  item.textContent = describeProblem(problem); // the application's own wording
  item.addEventListener('click', () => cee.reveal(problem));
  problemList.append(item);
}
```

An application can also state a location itself. `path` is the component path
from the template root, as a problem record gives it. `occurrences` gives the
entry to show at each repeating field or element along the path, outermost first
and counting from zero:

```javascript
// The email field in the second entry of the repeating author element.
await cee.reveal({ path: ['_author', '_email'], occurrences: [1] });
```

`occurrences` is optional. A repeating field or element that it does not reach
keeps the entry it already shows.

`reveal` returns a promise. It resolves to `true` once the field is on screen,
and to `false`, having changed nothing, when the path names nothing the template
declares, when the field is hidden, or when a named entry does not exist. When a
repeating element along the path has no entries, the CEE shows that element
instead, because nothing inside it appears on the form.

A field the user has been taken to also states an unanswered requirement. Until
the user reaches an empty required field, the CEE keeps it quiet, so that a new
form does not open with every required field in error.

By default `reveal` moves keyboard focus to the field. An application that keeps
focus in its own controls, such as a list the user is stepping through with the
keyboard, passes `focus: false`:

```javascript
cee.reveal({ path: ['_title'] }, { focus: false });
```

`reveal` is defined once the element is in the document, and resolves to `false`
until it has a template. The npm package declares its arguments as `CeeLocation`
and `CeeRevealOptions`.
