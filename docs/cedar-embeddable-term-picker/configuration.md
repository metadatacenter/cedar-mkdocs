# Configuration and Appearance

Configure the picker through its element reference after registration. Set the
service and selection mode before assigning a query.

## Configuration Properties

| Property | Purpose |
|---|---|
| `terminologyBaseUrl` | Base URL of the CEDAR terminology service. Set it explicitly. |
| `query` | Search text; assigning it starts or updates the search. |
| `termTypes` | Enabled categories: `ontology`, `branch`, `class`, `valueSet`, `property`. Omitted enables all five; `[]` enables none. |
| `maximumTerms` | Optional positive whole-number limit on table entries. |
| `constraintSet` | Existing constraints and actions to edit in the table workflow. |
| `selectionMode` | `constraints`, `constraint`, or `term`; see [Constraints and Selections](selections.md). |
| `sources` | Vocabulary and release scopes; an empty array searches all sources. |
| `fieldConstraints` | The allowed values for term-mode default selection; takes precedence over `sources`. |
| `language` | `en` or `hu`, also available as an HTML attribute. |

Assigning `termTypes` or `maximumTerms` selects the table workflow. Leave both
unset when using single-term selection. Arrays, objects, and numbers must be
properties rather than HTML attributes.

## Terminology Service Requirements

Use the base of a compatible CEDAR terminology server, not BioPortal's own URL.
The picker uses version-aware search, hierarchy, and version routes. Property
selection additionally needs the server's property routes and extracted property
data for the requested snapshots. Constrained default selection uses the
integrated-search route.

Without `terminologyBaseUrl`, requests target the page's own origin. This supports
a development proxy but does not connect an arbitrary host to CEDAR. Set an
absolute base URL or an absolute URL to your application's same-origin proxy.

Keep BioPortal and other upstream credentials on the server. A host on a separate
origin needs appropriate CORS responses. Its content security policy must permit
requests to the configured service through `connect-src`.

The service determines which vocabularies and releases are available. A failed
or unavailable source is not evidence that it contains no matching terms.

## Language

```javascript
picker.language = 'hu';
```

English is the default and the fallback for unsupported values. Changing the
language at runtime updates the interface and existing messages. Each picker
owns its language, so multiple instances may differ.

English and Hungarian maps are bundled with the component. Vocabulary labels,
identifiers, and messages returned by the server retain the form the server
supplied; interface language does not translate the underlying vocabulary.

## Match the Host's Appearance

The picker renders inside Shadow DOM. Style its supported custom properties on
the host element rather than reaching into private selectors:

```css
cedar-embeddable-term-picker {
  --cetp-color-primary: #0f7686;
  --cetp-color-on-primary: #ffffff;
  --cetp-color-heading: #0b3938;
  --cetp-color-text: rgba(0, 0, 0, 0.87);
  --cetp-color-muted: #555555;
  --cetp-color-surface: #f5f5f5;
  --cetp-color-border: #d7e0df;
  --cetp-color-warning: #b45309;
  --cetp-font-family: 'CEDAR Roboto', 'Helvetica Neue', sans-serif;
  --cetp-font-size: 14px;
}
```

These ten properties also style the constraint table. Text sizes scale with the
base font size, and selection tints derive from the primary color. Choose a
palette that preserves readable contrast and the distinction between ordinary
results and warnings.

## Hosts That Supply CEDAR Fonts

The default bundle embeds and registers CEDAR Roboto 400 and 500. A page already
registering those fonts globally can load
`cedar-embeddable-term-picker.host-fonts.js` instead. Both variants have the same
API; load only one. The host-font variant falls back to the configured font
stack if the faces are absent.

Fonts must be registered in the document's global stylesheet. The CEDAR design
tokens package provides the shared font files and styles for hosts using it.

## Frameworks and Multiple Instances

Load the classic script once on the client, obtain an element reference, and
wait for `customElements.whenDefined('cedar-embeddable-term-picker')` before
assigning properties. Add selection listeners with `addEventListener` and remove
them when the host view is destroyed.

Angular hosts can use `CUSTOM_ELEMENTS_SCHEMA` and property binding or a view
reference. React hosts can use a DOM ref and effect. Keep server-side rendering
separate from browser element initialization. The published TypeScript
declarations require no Angular runtime in the host.

Multiple pickers can coexist with independent queries, selections, languages,
and service URLs. `integration.mjs` is an advanced option for coordinated Angular
builds with matching runtime dependencies; it is not the standalone script.

## Troubleshooting

| Symptom | Check |
|---|---|
| Empty custom element | The bundle loaded successfully and the tag registered. Use the classic script, not `integration.mjs`. |
| Requests go to the host's `/search` | Set `terminologyBaseUrl` to the intended service base. |
| Search returns 404 | Confirm the deployment supports version-aware search; metadata-entry autocomplete alone is insufficient. |
| Browser blocks a request | Check HTTPS, CORS, the proxy route, and `connect-src`. |
| Property lookup fails for one release | Confirm the server holds extracted properties for that snapshot. |
| Term mode shows a table | Remove `termTypes` and `maximumTerms` assignments and configure a fresh instance in term mode. |
| No completed-selection event | Listen for `constraintsSelected` after **Done** in table mode, or `selected` in single-selection modes. |
