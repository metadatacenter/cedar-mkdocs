# Appearance and Language

The CEE renders inside Shadow DOM. Its styles do not affect the host page, and
selectors from the host page cannot reach the form's internal elements. The host
controls the editor's available width; CEE configuration controls its language
and read-only state.

## Size and Layout

The element fills its container. Size that container to place the editor within
the host layout:

```css
.metadata-panel {
  max-width: 60rem;
  margin: 0 auto;
}
```

The CEE uses container queries, so its layout responds to the space actually
available rather than to the browser viewport. A narrow sidebar therefore gets
the narrow layout even on a wide screen.

The form grows to the height of its content and has no internal scroller. A
fixed-height container clips it unless the host provides scrolling.

## Styling and Theming

The CEE uses CEDAR's shared control styles. Supported `--cedar-*` custom
properties inherit through Shadow DOM; private selectors and `--cee-*`
implementation properties are not a public theme API.

| Host style | Result |
|---|---|
| A selector for a CEE internal element | No effect because of the shadow boundary. |
| `font-size` or `font-family` on the CEE element | Inherited by some CEE-owned text, but not Material form controls. |
| `html { font-size: ... }` | No effect on the CEE's absolute sizes. |
| Documented `--cedar-*` control properties | Customize shared controls, including the CEF and the CED's field settings. |
| Angular Material custom properties | The CEE binds its own Material settings; use the shared CEDAR properties instead. |
| A `--cee-*` property | Unsupported; no public property currently reads it. |

Avoid rules such as these:

```css
/* No effect: the selector cannot cross the shadow boundary. */
cedar-embeddable-editor .mat-mdc-text-field-wrapper {
  min-height: 80px;
}

/* Partial effect: labels change, but Material controls do not. */
cedar-embeddable-editor {
  font-size: 24px;
}
```

Names beginning with `--cee-` that appear inside the bundle are internal and may
change without notice.

Set supported overrides on the element or a common ancestor:

```css
.metadata-panel {
  --cedar-control-height: 36px;
  --cedar-control-font-size: 14px;
  --cedar-control-line-height: 21px;
  --cedar-control-radius: 4px;
  --cedar-control-border: rgba(0, 0, 0, 0.45);
  --cedar-control-focus: #0f7686;
}
```

The default compact controls are 36px high. `density="authoring"` selects the
32px profile used for the CED's settings, while `density="comfortable"` selects
48px editable controls. Density is an attribute on the custom element, separate
from its `config` and read-only setting. Multiline content can grow in every
profile. Keep overrides large enough for text and actions, with visible focus
and readable contrast.

The [shared styling contract](https://github.com/metadatacenter/cedar-embeddable-editor/blob/main/STYLING.md)
lists all supported control and read-only-display properties. The CETP uses its
own [appearance properties](../cedar-embeddable-term-picker/configuration.md#match-the-hosts-appearance).

## Read-Only Display

Use `readOnlyMode` to display a template or instance without editing controls:

```json
{
  "readOnlyMode": true
}
```

This allows the same component to render records during authoring and review.
RADx and HuBMAP use the CEE in this mode for metadata presentation.

Configuration is accepted once. To switch between editable and read-only modes,
replace the CEE element with a newly configured one.

## Host Page and Template Description

The CEE does not provide page-level navigation or headings. The host application
supplies that surrounding interface. The form normally retains the CEDAR mark and
bundle version in its own title block. Set `previewMode: true` in the initial
configuration to hide that identity header when the host supplies its own.

To show the template's description below its title, set:

```json
{
  "showTemplateDescription": true
}
```

Leave this off if the host already displays the description.

## Translations

English and Hungarian interface maps are bundled with the CEE. English is the
default. To use Hungarian with English fallback:

```json
{
  "defaultLanguage": "hu",
  "fallbackLanguage": "en"
}
```

For another language, host a JSON map and configure its directory:

```json
{
  "languageMapPathPrefix": "/assets/i18n-cee/",
  "defaultLanguage": "de",
  "fallbackLanguage": "en"
}
```

This example requests `/assets/i18n-cee/de.json`. A relative prefix is resolved
against the page URL. Custom files follow the structure of the
[bundled English map](https://github.com/metadatacenter/cedar-embeddable-editor/blob/main/src/assets/i18n-cee/en.json).

The CEE checks translation sources in this order:

1. external map for `defaultLanguage`;
2. external map for `fallbackLanguage`;
3. bundled map for `defaultLanguage`; and
4. bundled map for `fallbackLanguage`.

Missing or partial maps therefore fall back without preventing the form from
rendering. `CEE TRACE` messages in the console and `eventHandler` show which maps
were loaded.

### Translation Scope

Language maps cover the CEE's own buttons, picker labels, repetition controls,
and validation text. They do not translate content supplied by the template:

- template titles and descriptions;
- field and element labels;
- help text; or
- controlled-term labels returned by the terminology service.

Date controls also remain in English and use `MM/DD/YYYY`; `defaultLanguage`
selects an interface string map, not a date locale.

## Fonts

The default bundle embeds CEDAR Roboto at weights 400 and 500 and includes its
icon font. Text fonts use the shared `CEDAR Roboto` family, which the CEE, the
CED, and the CETP can reuse on the same page.

A host already registering those two weights in its global stylesheet can load
`cedar-embeddable-editor.host-fonts.js` instead. It has the same API and retains
the icon font while omitting the embedded text fonts. Load one variant only.
Without the host's font faces, text falls back to the shared system stack.

Hosts using CEDAR's design-token package can import its `fonts/regular` and
`fonts/medium` Sass exports into their global stylesheet before loading the
host-font bundle. Merely setting `font-family` on the custom element does not
register those fonts or consistently restyle Material controls.
