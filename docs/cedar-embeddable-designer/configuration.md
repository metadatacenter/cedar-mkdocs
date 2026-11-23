# Configuration and Appearance

Configure a designer after its custom element is registered and before opening
or creating a document. Object settings are JavaScript properties, rather than
string-valued HTML attributes.

The `config` object is accepted once per element. Other host inputs have their
own lifetimes: `language`, `readOnly`, and `preferences` can change at runtime,
and `childSource` can be replaced between documents. Loading an artifact replaces
the editing session; see [Artifacts and Validation](artifacts-and-validation.md).

## Service Endpoints

```javascript
designer.config = {
  terminologyBaseUrl: 'https://terminology.example.org/',
  bridgeBaseUrl: 'https://bridge.example.org/',
};
```

Replace these example addresses with your deployment's service bases. Both keys
are optional and have no default. CED normalizes a missing trailing slash and
forwards the settings to the relevant embedded components. Configuration is
accepted once per instance; create a new instance for a different configuration.

| Setting | Used For |
|---|---|
| `terminologyBaseUrl` | Vocabulary constraints, controlled-term defaults, and their verification. Requires the Term Picker and a compatible version-aware CEDAR terminology service. |
| `bridgeBaseUrl` | External-authority default lookups through CEF. |

Load `cedar-embeddable-editor.js` for CEE preview and CEF field controls, and
`cedar-embeddable-term-picker.js` for vocabulary selection. These sibling
components are separate packages and are not bundled into CED. When a required
component is absent, the corresponding control reports that it is unavailable
and preserves existing values.

Repository access is configured through `childSource`, separately from service
endpoints. See [Reusable Fields and Elements](reusable-content.md).

## Language

```html
<cedar-embeddable-designer language="hu"></cedar-embeddable-designer>
```

Both CED and CEFD accept `language = 'en'` or `'hu'`. English is the default and
fallback for unsupported values. The language may change at runtime, and each
instance owns its language independently.

The setting applies to interface text and validation messages and is passed to
the embedded CEE and Term Picker. Names, descriptions, options, and other content
written by the author are not translated. Both language maps are bundled, so
selecting a language does not fetch a translation file.

## Read-Only Mode

Set `readOnly = true` for inspection without edits. Navigation, expansion,
settings inspection, and preview remain available, while `canSave` is false.
A published root is read-only independently of the host flag.

Published children inside an editable parent retain their definitions while
allowing the parent to configure their placement. Descendants of a published
element remain locked, including their placement within that element.

## Author Preferences

An author sets preferences from the designer's user menu. **Preferences** selects
the field settings and field types the designer offers and the place of the
field-type picker. **Define Presets** changes what each preset sets. CED keeps
these choices in memory for one element, so an author returns to the defaults on
every reload unless the host stores them.

The `preferences` property and the `preferencesChange` event let a host store
them. Both were added after CED 0.1.3. CEFD has no preferences.

```javascript
const key = 'designer-preferences';
const stored = localStorage.getItem(key);
if (stored) designer.preferences = JSON.parse(stored);

designer.addEventListener('preferencesChange', (event) => {
  localStorage.setItem(key, JSON.stringify(event.detail));
});
```

The value is plain JSON. This example uses the browser's `localStorage`. A host
can equally keep the value with the author's account on its server.

| Member | Behavior |
|---|---|
| `preferences`, when read | Returns the complete current preferences. |
| `preferences`, when assigned | Replaces the preferences. An assignment can come at any time, including before the element is connected to the page. An omitted key takes its default, and `null` restores every default. |
| `preferencesChange` | Carries the complete preferences after each change the author makes. CED sends none at startup and none for the host's own assignment. |

A host can therefore store every value it receives. It never stores defaults the
author did not choose, and it never receives its own assignment back. Because an
omitted key takes its default, a value stored by one CED version remains
assignable after a later version adds a preference.

Preferences change the controls the designer offers and never the document. A
field of a hidden type, or an element while elements are switched off, stays in
the artifact and stays visible.

### Preference Keys

| Key | Type | Default | Purpose |
|---|---|---|---|
| `showRequired` | boolean | `true` | Offer the Required setting on a field. |
| `showAllowMultiple` | boolean | `true` | Offer the Allow multiple setting on a field. |
| `showDefaultValue` | boolean | `true` | Record the dialog's Default Value setting. No control depends on it at present. |
| `showElements` | boolean | `true` | Offer the action that adds an element. |
| `fieldSelectionStyle` | `'inline'` or `'sidebar'` | `'inline'` | Offer field types beside the insertion point, or in the library sidebar. |
| `hiddenFieldTypes` | array of field types | `[]` | Leave these field types out of the type pickers. |
| `presets` | object | see [Presets](#presets) | Define what the Basic, Semantic, and Modular presets set. |

The package's `CedFieldType` type lists the field types, such as `'text'`,
`'email'`, and `'controlledTerms'`. `CedPreferences` types the complete value,
and `CedPreferencesInput` types the value a host assigns, in which every key is
optional.

### Presets

`presets` holds one definition under each of `basic`, `semantic`, and `modular`.
A definition has the keys `showRequired`, `showAllowMultiple`,
`showDefaultValue`, `showElements`, and `hiddenFieldTypes`. Choosing a preset
copies its definition into the preferences.

| Preset | Default Definition |
|---|---|
| Basic | Hides the Controlled Terms field type and the element action. |
| Semantic | Offers every field type and hides the element action. |
| Modular | Offers every field type and the element action. A new designer starts in Modular. |

The designer identifies the active preset by comparing the preferences with each
definition. While Basic is active, it also withholds the selector for reusable
fields and elements. An author can redefine a preset, so the definitions travel
with the preferences. A stored value that omitted them could open the next page
in a different preset.

### Values CED Cannot Use

An assignment never throws. CED checks each key independently, names what it
cannot use in a console warning, and leaves that preference at its default.
The warnings read:

```
Unknown designer preference "theme". Ignored.
Designer preference "showRequired" must be true or false. Ignored.
Unknown field type "hologram" in "hiddenFieldTypes". Ignored.
```

Other valid keys in the same object still apply. A value that is not an object,
such as a string or an array, is rejected whole and leaves the preferences as
they were, with this warning:

```
CEDAR designer preferences must be an object. Ignored.
```

## Appearance and Fonts

The components use Shadow DOM and CEDAR's shared design tokens. The host controls
the available page space and can supply inherited CEDAR font and control tokens.
Avoid styling private component selectors. CEE's
[shared styling guide](https://github.com/metadatacenter/cedar-embeddable-editor/blob/main/STYLING.md)
describes the shared control contract.

The default CED bundle includes CEDAR Roboto at weights 400 and 500. A host that
already registers those fonts in its global stylesheet can load
`cedar-embeddable-designer.host-fonts.js` instead. Load one variant only; both
register CED and CEFD with the same API. The font-free variant falls back to the
shared system stack if the host has not registered the fonts.

## Framework Integration and TypeScript

Load the classic bundle once on the client. Obtain an element reference, wait
for `customElements.whenDefined()`, and assign its object properties through
that reference. Register event listeners on the element and remove them when
the host view is destroyed.

In Angular, allow custom elements with `CUSTOM_ELEMENTS_SCHEMA` and use property
bindings or a `ViewChild` reference. In React, use a DOM ref and effect for
property assignment and event listeners. Server-side rendering should leave
the element unconfigured until the browser has loaded the bundle.

The package provides types without requiring the host to install Angular:

```typescript
import type { CedarEmbeddableDesignerElement } from 'cedar-embeddable-designer';

await customElements.whenDefined('cedar-embeddable-designer');
const designer = document.querySelector('cedar-embeddable-designer') as CedarEmbeddableDesignerElement;
designer.language = 'en';
```

`integration.mjs` is a separate option for coordinated Angular builds that share
runtime dependencies. It is not the standalone script. Its manifest records
the runtime identities a host must match; ordinary embeds should use the
self-contained bundle shown in the installation guide.

## Network Access and Host Security

Allow configured service origins in the page's content security policy and
configure CORS or a same-origin proxy. Keep service credentials on the server.
Repository requests made by `childSource` use the host's authentication policy.

Pattern validation runs in bounded workers and requires `worker-src blob:`.
When evaluation is pending or unavailable, the validation report explains why
saving is blocked. Imported image and video content can also cause requests to
the origins named in the artifact when rendered in field controls or preview.

Validate writes on the server and recheck permissions and revisions there.
Recovery snapshots can contain unfinished user content; scope their storage
to the correct account and deployment. Stored preferences contain no document
content, and belong to the author who chose them.

## Troubleshooting

| Symptom | Check |
|---|---|
| Empty custom element | The classic bundle loaded and the tag registered; wait for `customElements.whenDefined()`. |
| Preview or field controls are unavailable | Load the CEE bundle before using the CED. |
| Vocabulary authoring is unavailable | Load the CETP bundle and configure a compatible version-aware terminology service. |
| Changing `config` has no effect | Supply the complete configuration once, or create a new element. |
| Saving is unavailable | Inspect `validate().canSave`, pending checks, read-only state, and unfinished settings. |
| Repository selector is unavailable | Supply `childSource` and choose a preset other than Basic. |
| Preferences return to their defaults on reload | Store the value `preferencesChange` carries and assign it to `preferences`. |
| Browser blocks a request | Check HTTPS, CORS, the proxy route, and the content security policy. |
