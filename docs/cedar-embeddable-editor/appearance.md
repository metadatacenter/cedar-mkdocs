# Appearance and Language

The CEE renders inside a shadow root. The page's stylesheets do not reach into the form, and the
form's styles do not leak out, so an application cannot restyle the CEE with CSS selectors written
against its internals, and the CEE cannot disturb the application's own layout.

Two things cross that boundary, each deliberately: the width of the container the application puts
the CEE in, and the language it is told to render in.

| What the application writes | How far it gets |
|---|---|
| `font-size` or `font-family` on the element | Inherits into the text the CEE styles itself — field labels, the time picker, chips — and stops before the form controls. |
| A rule naming the CEE's internals, such as `.mat-mdc-text-field-wrapper` | Stops at the shadow boundary. Nothing changes. |
| `html { font-size: 62.5% }` on the page | Nothing changes. The CEE states its own sizes absolutely. |
| A Material token, such as `--mat-form-field-container-text-size` | Nothing changes. The theme writes px literals into the bundle instead of emitting those tokens, so input text, hints and the colour of the controls have nothing to override. |

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

Height is not part of the contract in either direction. The form is as tall as its content and
reports that height to the page. Giving the container a fixed height clips the form rather than
scrolling it, because the CEE has no internal scroller.

## Theming

The CEE publishes no theming properties. It renders in its own type and its own colours, and an
application places it rather than styles it.

Setting a `--cee-*` custom property does nothing, and nothing reports it: a custom property nobody
reads is not an error.

An appearance contract — colours named for the roles the interface has, a Material theme that
reads them, and a stated position on type — is open work rather than a decision against it.

## What the Application Cannot Change

Everything about the CEE's appearance except its width, short of the language it renders in. Any
`--cee-` name occurring inside the bundle is an internal: it is not declared on the element, and it
can be renamed or dropped without notice, so setting one may happen to work today and will not be
kept working.

Three things that look like they should work do not, and each fails differently.

**Selectors written against the CEE's internals do nothing.** The CEE draws the shadow boundary
deliberately, and it holds in both directions:

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

There is no property for the body type size, the field height, or the colour of the form controls,
because those come from a Material theme compiled into the bundle. Making them settable is open work
rather than a decision against it.

**The host page's root font size does not resize the form.** The CEE states its own sizes
absolutely, so `html { font-size: 62.5% }` — a common CSS reset — leaves the form as it is. That is
deliberate. A form embedded in an application should not change size because the application adjusted
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

Configuration is applied once, so an application offering the user a choice between editing and
viewing builds a new element for the other mode rather than reconfiguring this one.

`readOnlyMode` is the only way in or out of read-only mode. Nothing inside the form can change it,
so a record shown for reading stays that way.

## Surrounding Chrome

The CEE draws no page chrome. An application renders its own headings and navigation around the
element.

What the CEE keeps is the CEDAR mark and the version stamp inside the form's own title block, which
is a component naming itself rather than dressing someone else's page.

One key adds to that block:

```json
{
  "showTemplateDescription": true
}
```

It renders the template's own description under its title. Turn it on where users meet a template
they have not filled in before, and leave it off where the application already shows the description
in its own header.

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

### What a Language Map Does Not Cover

A language map holds the CEE's own wording: its buttons, its picker labels, the multi-instance
controls, and its validation messages. Everything the template supplies stays in the language its
author wrote it in, including field and element names, help text, and the template's title and
description. So do the labels of controlled terms, which arrive from the terminology service. A
German map therefore gives a German interface around English field names.

The date fields ignore the setting entirely. `defaultLanguage` selects a string map and nothing else,
so the calendar names its months in English and a date field reads `MM/DD/YYYY` in every language.

## Fonts

The CEE embeds the fonts it needs and registers them under private names, `CEE Roboto` and
`CEE Material Icons`, rather than the global `Roboto` and `Material Icons`. A page defining fonts
under the ordinary names therefore cannot collide with the CEE's, and the CEE cannot change how the
page's own text renders.

The private names are also why an application cannot give the CEE its own typeface. The Material
theme names `CEE Roboto` for the form controls when the bundle is built, so a `font-family` set on
the element restyles the CEE's own text and leaves the controls in Roboto.
