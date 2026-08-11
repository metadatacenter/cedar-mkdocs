# Appearance and Language

The CEE renders inside a shadow root. The page's stylesheets do not reach into the form, and the
form's styles do not leak out, so an application cannot restyle the CEE with CSS selectors written
against its internals, and the CEE cannot disturb the application's own layout.

Three things cross that boundary, each deliberately: the CSS custom properties the CEE publishes,
the width of the container the application puts it in, and the language it is told to render in.

Two of the things an application is most likely to try are among those that do not work, so the
whole picture is worth having before the detail:

| What the application writes | How far it gets |
|---|---|
| `--cee-element-heading-size`, `--cee-element-heading-weight`, `--cee-element-content-gap` | Reaches the CEE's element headings and the space beneath them. |
| `--cee-color-primary`, `--cee-color-warn`, `--cee-color-warning` | Reaches the CEE's own accents and error text. |
| `font-size` or `font-family` on the element | Inherits into the text the CEE styles itself — field labels, the time picker, chips — and stops before the form controls. |
| A rule naming the CEE's internals, such as `.mat-mdc-text-field-wrapper` | Stops at the shadow boundary. Nothing changes. |
| `html { font-size: 62.5% }` on the page | Nothing changes. The CEE states its own sizes absolutely. |
| Anything at all, for input text, hints and the colour of the controls | Nothing reaches them. Angular Material compiles those sizes and colours into the bundle. |

## Sizing and Layout

The element fills whatever width it is given, so the application controls its size by sizing the
container around it:

```css
.metadata-panel {
  max-width: 60rem;
  margin: 0 auto;
}
```

The CEE measures itself as a CSS container, so it lays itself out against that width rather than
against the browser window. A form in a narrow sidebar arranges itself as it would on a narrow
screen, even on a wide monitor. No configuration and no breakpoint are involved.

## Theming

The CEE publishes eight custom properties on the element. Custom properties inherit through a shadow
boundary, so setting one on the element, or anywhere above it, reaches the CEE's internals:

```css
cedar-embeddable-editor {
  --cee-element-heading-size: 20px;
  --cee-element-heading-weight: 700;
  --cee-element-content-gap: 16px;
}
```

| Property | Default | Range | Affects |
|---|---|---|---|
| `--cee-element-heading-size` | `18px` | `12px`–`32px` | The type size of a collapsible element's heading. |
| `--cee-element-heading-weight` | `600` | `400`–`700` | The weight of that heading. |
| `--cee-element-content-gap` | `12px` | `0`–`32px` | The space between an element's heading and its content. |
| `--cee-color-primary` | `#0f7686` | — | The CEE's own accents, such as the focused time picker. |
| `--cee-color-warn` | `#f44336` | — | The CEE's own error emphasis. |
| `--cee-color-warning` | `#856404` | — | Warning text. |
| `--cee-color-text-primary` | `#ffffff` | — | Reserved. No effect today. |
| `--cee-color-accent` | `#ff5c55` | — | Reserved. No effect today. |

The three heading and spacing properties are the ones that change how a form reads. They adapt
typography and density without giving the application a second, competing say in the form's
structure: which [elements](../yaml-spec/elements-core.md) nest, and which collapse, remains the
template's decision.

Two of the color properties are reserved rather than inert by oversight. They are published so the
set can grow into them without a breaking change, and they are listed here so nobody spends an
afternoon working out why setting one changes nothing.

These names are part of the published contract. Renaming or dropping one would break an application
silently, so the set only grows.

### Values Outside the Range

Each numeric property is clamped. A value below the range renders at the minimum and a value above it
at the maximum, so a heading cannot be set to a size that clips its own text or overlaps the fields
beneath it.

Prefer absolute units. A `rem` value resolves against the *host page's* root font size, not the
CEE's, so `3rem` means different things on different pages — and the clamp is what keeps that from
mattering much.

A value of the wrong kind is discarded in favor of the default. `--cee-element-heading-size: 20`,
missing its unit, renders at `18px` rather than at some unrelated size, and so does a misspelled one.

```css
cedar-embeddable-editor {
  --cee-element-heading-size: 100px;  /* renders at 32px  */
  --cee-element-heading-weight: 900;  /* renders at 700   */
  --cee-element-content-gap: -8px;    /* renders at 0     */
}
```

## What the Application Cannot Change

The appearance contract is the eight properties the CEE declares on its own element, and nothing
else. Other `--cee-` names occur inside the bundle, and they are internals rather than published
API: they are not declared on the element, and they can be renamed or dropped without notice.
Setting one may happen to work today and will not be kept working.

Three things that look like they should work do not, and each fails in a way worth knowing before
you spend time on it.

**Selectors written against the CEE's internals do nothing.** The shadow boundary is the point of the
design, and it holds in both directions:

```css
/* No effect. The CEE's internals are not in the page's tree. */
cedar-embeddable-editor .mat-mdc-text-field-wrapper { min-height: 80px; }
```

**Setting a font on the element changes only part of the form.** `font-size` and `font-family`
inherit across the shadow boundary, so they reach the CEE's own text — field labels, the time picker,
chips — but not the form controls, whose type is set by the CEE's Angular Material theme at build
time. The result is a form whose labels have moved and whose input values have not:

```css
/* Avoid. Labels become 24px; the values inside the fields stay 14px. */
cedar-embeddable-editor { font-size: 24px; }
```

There is no property for the body type size, the field height, or the color of the form controls
themselves, because those come from a Material theme compiled into the bundle. Making them settable
is [open work](https://github.com/metadatacenter/cedar-embeddable-editor) rather than a decision
against it.

**The host page's root font size does not resize the form.** The CEE states its own sizes
absolutely, so `html { font-size: 62.5% }` — a common CSS reset — leaves the form as it is. This is
deliberate: a form embedded in an application should not change size because the application adjusted
a root value for its own typography.

## Read-Only Viewing

One setting turns the editor into a viewer:

```json
{
  "readOnlyMode": true
}
```

Read-only mode presents the values without controls and permits no editing. An application uses it
to show a submitted record, a previous version, or someone else's metadata, and avoids building a
second renderer that would drift from the editor. The RADx Data Hub and HuBMAP both display
metadata records and templates through the CEE this way.

Read-only mode can also hide fields that were never filled, which turns a long sparse template into
a short summary of what is actually recorded:

```json
{
  "readOnlyMode": true,
  "hideEmptyFields": true
}
```

`hideEmptyFields` carries two constraints. It is honoured only in read-only mode, and only when
the template and the instance arrive together on `templateAndInstanceObject`, because the decision
about which fields to omit is taken while the form is being built. Both settings are also one-way:
once enabled, passing `false` afterwards does not turn them off. An application offering the user a
choice between editing and viewing should rebuild the element rather than reconfigure it.

The CEE offers the user that switch itself, through a read-only toggle in a menu at the corner of
the form. An application that governs the mode from its own interface turns the menu off:

```json
{
  "showPreferencesMenu": false
}
```

## Surrounding Chrome

The CEE can render a CEDAR title bar above the form and an attribution footer below it. Both are
off by default, because an embedded editor usually sits within the application's own headings and
navigation:

```json
{
  "showHeader": true,
  "showFooter": true,
  "showTemplateDescription": true
}
```

`showTemplateDescription` adds the template's own description under its title. Turn it on where
users meet a template they have not filled in before.

## Translations

The CEE ships language maps for English and Hungarian, and renders in English unless told otherwise.
Selecting the other built-in language takes two keys:

```json
{
  "defaultLanguage": "hu",
  "fallbackLanguage": "en"
}
```

An application can supply its own language file instead. Point `languageMapPathPrefix` at a
directory, and the CEE looks there for `<language>.json`, structured like [the CEE's own English
map](https://github.com/metadatacenter/cedar-embeddable-editor/blob/main/src/assets/i18n-cee/en.json):

```json
{
  "languageMapPathPrefix": "/assets/i18n-cee/",
  "defaultLanguage": "de",
  "fallbackLanguage": "en"
}
```

That configuration asks for `/assets/i18n-cee/de.json`. A leading slash makes the path absolute; a
relative prefix resolves against the page.

The CEE tries four sources in turn, so a partial or missing translation degrades the wording
rather than breaking the form:

1. The external file for the default language.
2. The external file for the fallback language.
3. The built-in map for the default language.
4. The built-in map for the fallback language.

With that configuration and no German file present, the CEE loads `/assets/i18n-cee/en.json`. With
neither file present it uses the built-in English map, because no built-in German map exists.

The CEE logs each step to the console under a `CEE TRACE` prefix and reports it to any handler
registered on `eventHandler`. That trace is the quickest way to see which map a page actually
loaded.

## Fonts

The CEE embeds the fonts it needs and registers them under private names, `CEE Roboto` and
`CEE Material Icons`, rather than the global `Roboto` and `Material Icons`. A page defining fonts
under the ordinary names therefore cannot collide with the CEE's, and the CEE cannot change how the
page's own text renders.
