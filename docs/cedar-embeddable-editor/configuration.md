# Configuration

The CEE takes a single configuration object. Every key in it is optional and everything that needs
a default has one, so a minimal configuration stays short and few applications ever write a complete
one. Supply the terminology endpoint before anything else, because without it controlled fields have
nothing to suggest.

## Supplying the Configuration

Assign the object to the `config` property, writing it in the application's own source:

```javascript
cee.config = {
  showSampleTemplateLinks: false,
  showTemplateSourceData: false,
  showInstanceDataFull: false,
  terminologyIntegratedSearchUrl:
    'https://terminology.metadatacenter.org/bioportal/integrated-search',
};
```

A framework binds to the same property. Angular writes `[config]="ceeConfig"`, and React and the
others assign through a ref, as [Embedding in a Framework](frameworks.md) describes.

The CEE can also fetch its configuration, for an application that keeps it in a deployed JSON file
rather than in compiled source:

```javascript
customElements.whenDefined('cedar-embeddable-editor').then(() => {
  const cee = document.querySelector('cedar-embeddable-editor');
  cee.loadConfigFromURL('/assets/cee-config.json');
});
```

Optional success and error callbacks receive the parsed configuration and the failed request.
This route serves applications that cannot construct the object themselves. Prefer assigning
`config` where the choice is open, since it keeps fetching out of the CEE and lets a compiler check
the object.

## Treat Configuration as Set-Once

Reassigning `config` behaves inconsistently. The CEE **patches** most keys, so a key omitted from
the second object keeps the value the first one gave it, while `outputSerialization` follows the new
object exactly. Two settings run one way only: once `readOnlyMode` or `hideEmptyFields` is enabled,
passing `false` afterwards does not turn it off.

Build the configuration once, assign it once, and rebuild the element if it must change.

## What the CEE Reports About a Configuration

The CEE ignores a key it does not recognize, as it always has, but it now reports the key rather
than passing over it in silence. Every configuration meets a check as it crosses the boundary,
whether assigned or fetched, and anything unusable is named:

```
CEE ERROR: Unknown configuration key "readOnlyMod". It has no effect. Did you mean "readOnlyMode"?
CEE ERROR: Configuration key "outputSerialization" expects "json" or "yaml", but was "xml".
CEE ERROR: Configuration key "hideEmptyFields" only takes effect in read-only mode, which is not enabled.
```

The messages go to the browser console and to any handler registered on the `eventHandler`
property. They diagnose only. The CEE rejects nothing and behaves exactly as it would without the
check.

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

The query needs no cast, because the package declares its tag in `HTMLElementTagNameMap`.

The package publishes **types only**, which follows from the bundle rather than from an oversight.
The published file is a script that registers a custom element and exports no values, so nothing
exists to import at run time. Use `import type`, and let the interface catch a mistyped key rather
than reaching for a constant that would read `undefined` when the page runs.

One part of the interface stays deliberately open. An index signature covers the per-authority
endpoint keys instead of fourteen declarations, so an application can set a key for an authority
added after its copy of the declarations was published. The configuration check catches typos in
those keys at run time, where the compiler cannot.

## Reference

### The Key to Set First

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

[Templates and Metadata](templates-and-metadata.md#letting-the-cee-fetch-the-template) covers that
route, which suits demonstrations rather than a production embedding.

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
carries the running commentary, including which language maps loaded and which template was fetched.
