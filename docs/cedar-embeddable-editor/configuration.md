# Configuration

The CEE takes a single configuration object. Every key in it is optional, and everything that needs a
default has one, so a minimal configuration is short and a complete one is rarely needed. The single
setting worth supplying before anything else is the terminology endpoint, without which controlled
fields have nothing to suggest.

## Supplying the Configuration

The direct route is an assignment to the `config` property, with the object written in the
application's own source:

```javascript
cee.config = {
  showSampleTemplateLinks: false,
  showTemplateSourceData: false,
  showInstanceDataFull: false,
  terminologyIntegratedSearchUrl:
    'https://terminology.metadatacenter.org/bioportal/integrated-search',
};
```

A framework binds to the same property. In Angular that is `[config]="ceeConfig"`; in React and
elsewhere it is an assignment through a ref, as [Embedding in a
Framework](frameworks.md) describes.

The CEE can also fetch its configuration, for an application that keeps it in a deployed JSON file
rather than in compiled source:

```javascript
customElements.whenDefined('cedar-embeddable-editor').then(() => {
  const cee = document.querySelector('cedar-embeddable-editor');
  cee.loadConfigFromURL('/assets/cee-config.json');
});
```

Optional success and error callbacks receive the parsed configuration and the failed request
respectively. This route exists for applications that cannot construct the object themselves.
Prefer assigning `config` when the choice is open: it keeps the CEE out of the business of fetching,
and it lets a compiler check the object.

## Treat Configuration as Set-Once

Reassigning `config` does not currently behave uniformly. Most keys are **patched**, so a key
omitted from the second object keeps the value the first one gave it, while `outputSerialization`
follows the new object exactly. Two settings are one-way: once `readOnlyMode` or `hideEmptyFields`
is enabled, passing `false` afterwards does not turn it off again.

Build the configuration once, assign it once, and rebuild the element if it genuinely has to change.

## What the CEE Reports About a Configuration

A key the CEE does not recognize is ignored, exactly as an unread key always was. What has changed is
that the CEE now says so. Every configuration passes a check as it crosses the boundary, whether it was
assigned or fetched, and anything unusable is named:

```
CEE ERROR: Unknown configuration key "readOnlyMod". It has no effect. Did you mean "readOnlyMode"?
CEE ERROR: Configuration key "outputSerialization" expects "json" or "yaml", but was "xml".
CEE ERROR: Configuration key "hideEmptyFields" only takes effect in read-only mode, which is not enabled.
```

The messages go to the browser console and to any handler registered on the `eventHandler` property.
They are diagnostics only: nothing is rejected, and the CEE behaves as it would have without the check.

## TypeScript Declarations

The package ships declarations, so a TypeScript application gets a checked configuration object and
a typed element:

```typescript
import type { CeeConfig, CedarEmbeddableEditorElement } from 'cedar-embeddable-editor';

const config: CeeConfig = { readOnlyMode: true, outputSerialization: 'yaml' };

const cee = document.querySelector('cedar-embeddable-editor');
cee!.config = config;
const report = cee!.dataQualityReport;   // CeeDataQualityReport
```

No cast is needed on the query, because the package declares its tag in
`HTMLElementTagNameMap`.

The declarations are **types only**, and that is a property of the bundle rather than an oversight.
The published file is a script that registers a custom element and exports no values, so there is
nothing to import at run time. Use `import type`, and let the interface catch a mistyped key rather
than reaching for a constant that would be `undefined` when the page runs.

One part of the interface is deliberately open. The per-authority endpoint keys are declared through
an index signature rather than individually, so that an application can set a key for an authority
added after its copy of the declarations was published. Typos in those keys are caught at run time,
by the configuration check, rather than by the compiler.

## Reference

### The One Key Worth Setting First

| Key | Type | Default | Meaning |
|---|---|---|---|
| `terminologyIntegratedSearchUrl` | string | none | The CEDAR integrated-search endpoint that controlled fields query. With no value, controlled fields offer no suggestions. |

`https://terminology.metadatacenter.org/bioportal/integrated-search` serves most applications.
[Controlled Terms](controlled-terms.md) explains what it does and when another value is right.

### What the User Sees

| Key | Type | Default | Meaning |
|---|---|---|---|
| `showHeader` | boolean | `false` | A CEDAR title bar above the form. |
| `showFooter` | boolean | `false` | An attribution footer below the form. |
| `showPreferencesMenu` | boolean | `true` | A menu offering the user a read-only toggle. |
| `showTemplateDescription` | boolean | `false` | The template's description, under its title. |
| `showStaticText` | boolean | `true` | Render the template's [static content fields](../yaml-spec/field-types/static-fields.md). |
| `collapseStaticComponents` | boolean | `false` | Start static content collapsed. |
| `showAllMultiInstanceValues` | boolean | `true` | A summary of every value in a repeating group, not only the one on the current page. |
| `showSpinnerBeforeInit` | boolean | `true` | A spinner until the first render completes. |

### Editing Behaviour

| Key | Type | Default | Meaning |
|---|---|---|---|
| `readOnlyMode` | boolean | `false` | Present the metadata for reading, with no editing. One-way. |
| `hideEmptyFields` | boolean | `false` | Omit fields that have no value. Takes effect only in read-only mode, and only when template and instance arrive together. One-way. |
| `trustTemplateMarkup` | boolean | `false` | Render a template author's rich text verbatim instead of sanitizing it. See [Security](security.md). |

### Serialization

The two are independent, and each defaults to the JSON form.

| Key | Type | Default | Meaning |
|---|---|---|---|
| `inputSerialization` | `json` or `yaml` | `json` | Whether the supplied template is read as JSON Schema or as YAML. |
| `outputSerialization` | `json` or `yaml` | `json` | Whether `currentMetadataSerialized` returns JSON-LD or YAML. |

### Diagnostic Panels

The CEE can render collapsible panels beneath the form, showing what it read and what it is producing.
Each has a `show` key that renders it and an `expanded` key that opens it.

| Panel | `show` key | Default | `expanded` key |
|---|---|---|---|
| JSON Schema - Template | `showTemplateSourceData` | `true` | `expandedTemplateSourceData` |
| JSON-LD - Instance | `showInstanceDataFull` | `true` | `expandedInstanceDataFull` |
| JSON-LD - Instance - Core | `showInstanceDataCore` | `false` | `expandedInstanceDataCore` |
| Template Rendering Data | `showTemplateRenderingRepresentation` | `false` | `expandedTemplateRenderingRepresentation` |
| Multi-Instance Information | `showMultiInstanceInfo` | `false` | `expandedMultiInstanceInfo` |
| Data Quality Report | `showDataQualityReport` | `false` | `expandedDataQualityReport` |
| Sample templates | `showSampleTemplateLinks` | `false` | `expandedSampleTemplateLinks` |

Every `expanded` key defaults to `false`.

**Two of these are on by default**, which is a legacy of the CEE's origins as a developer tool. A
production embedding almost always wants:

```json
{
  "showTemplateSourceData": false,
  "showInstanceDataFull": false
}
```

### Endpoints

| Key | Type | Default | Meaning |
|---|---|---|---|
| `terminologyIntegratedSearchUrl` | string | none | The CEDAR integrated-search endpoint controlled fields query. |
| `extAuthBaseUrl` | string | `https://bridge.metadatacenter.org/ext-auth/` | The CEDAR bridge serving external authorities. A trailing slash is required. |

Fourteen further keys override the path appended to `extAuthBaseUrl`, two for each authority.
[Controlled Terms](controlled-terms.md#external-authorities) lists them.

### IRI Prefixes

| Key | Type | Default | Meaning |
|---|---|---|---|
| `iriPrefix` | string | `https://repo.metadatacenter.org/` | The base for identifiers the CEE mints inside the instance, such as those of element instances. |
| `bioPortalPrefix` | string | `https://bioportal.bioontology.org/ontologies/` | The base of the BioPortal link offered beside a selected term. |
| `orcidPrefix` | string | `https://orcid.org/` | The prefix by which the CEE recognizes an ORCID held in a text field, so it can show the bare identifier. |
| `rorPrefix` | string | `https://ror.org/` | The same, for a ROR. |

### Language

| Key | Type | Default | Meaning |
|---|---|---|---|
| `defaultLanguage` | string | `en` | The language to render in. |
| `fallbackLanguage` | string | `en` | The language to fall back to when the first is unavailable. |
| `languageMapPathPrefix` | string | none | A directory of external language files. |

[Appearance and Language](appearance.md#translations) describes how the four sources of a
translation are tried in turn.

### Fetching a Template

| Key | Type | Default | Meaning |
|---|---|---|---|
| `sampleTemplateLocationPrefix` | string | none | A directory holding template folders, each with a `template.json` and a `metadata.json`. |
| `loadSampleTemplateName` | string | none | Which folder under that prefix to load. |

[Templates and Metadata](templates-and-metadata.md#letting-the-cee-fetch-the-template) covers when this
is appropriate, which is mostly demonstrations.

## Hearing What the CEE Has to Say

The CEE reports its diagnostics to the console, and to a handler an application registers:

```javascript
cee.eventHandler = {
  trace: (label, value) => console.debug('CEE', label, value),
  error: (label, value) => reportToMonitoring(label, value),
};
```

Both members are optional, and the CEE calls only the ones present, so `{ error }` alone is a valid
handler that will not be bothered with traces. `error` carries the things worth surfacing: a
template the CEE could not read, a value it discarded, a configuration key it cannot use. `trace`
carries the running commentary, including which language maps were loaded and which template was
fetched.
