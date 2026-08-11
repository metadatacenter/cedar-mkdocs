# Security

The CEE runs inside the embedding page, in the embedding origin. Its content lives in a shadow
root, but **Shadow DOM is not a security boundary**: it scopes styles and markup, not privileges.
Anything the CEE executes reaches cookies, storage and network exactly as the rest of the
application does.

## Templates Are Trusted Input

For a component whose inputs are data, that arrangement carries no risk. One of the CEE's inputs is
not purely data: a CEDAR template can carry a
[static rich-text field](../yaml-spec/field-types/static-fields.md), whose body is HTML composed by
the template's author and rendered as HTML by the CEE. Template authors use it for instructions,
formatted notes and links.

Instance data raises no such question. The CEE always sanitizes a value a user typed, on the way
in and on the way out, and no configuration changes that. A person filling in a form cannot
introduce markup that runs.

The question is only what a *template author* may do.

## The Default: Sanitize

The CEE sanitizes template rich text unless told not to. Script elements, event-handler attributes such
as `onerror`, `javascript:` URLs, `iframe` elements, form controls and AngularJS directive
attributes such as `ng-click` are removed before rendering.

Formatting survives. Inline styles, tables, lists, headings, links, and inline `data:` images in
the raster formats all render as the author composed them. Sanitizing removes the executable parts
and leaves the rendering otherwise untouched, so template authors gain nothing by turning it off.

## Rendering Markup Verbatim

An application that controls which templates load can choose to render an author's markup exactly as
written:

```json
{
  "trustTemplateMarkup": true
}
```

**Set this only if template authors are as trusted as the application's own source code.** With it
on, a template author can run JavaScript in the application's origin. "Allowed to define a form"
and "allowed to run code in this page" are very different permissions, and setting this key declares
them to be the same.

Only a narrow case justifies it. Templates ship with the application, or come from a repository
the operators control, and whoever can write a template could already deploy code.

**Do not set it if users choose their own templates.** A template from CEDAR's public library, from
a colleague, or from anywhere users can write to is untrusted input, and rendering its markup
verbatim hands whoever wrote it the application's session. Leaving the key off renders the
formatting without the risk.

## What Is Sanitized Where

| Content | Origin | Treatment |
|---|---|---|
| Static rich-text field body | Template author | Sanitized, unless `trustTemplateMarkup` is on |
| Static section break, image, YouTube | Template author | Not rendered as HTML. Used as text or as a URL |
| Field values, in the form and in read-only view | Instance data | Always sanitized. Not configurable |
| Multi-instance value summaries | Instance data | Always sanitized. Not configurable |

## Requests the CEE Makes

The CEE issues requests to the endpoints it is configured with, and to nothing else. A default
configuration reaches two: CEDAR's terminology service for term suggestions, and CEDAR's bridge
service for external-authority lookups. Each request carries only the text the user typed and the
constraint the template declares. An application that must keep those queries inside its own
network points both settings at its own CEDAR deployment.

Everything else happens locally. The application supplies the template and the instance, the
browser renders the form, and the browser produces the metadata. The CEE sends metadata nowhere.

Two configuration keys make the CEE fetch on its own: `loadConfigFromURL`, and the
`sampleTemplateLocationPrefix` route that has it fetch a template. An application that would rather
hold every network decision itself avoids both by assigning `config` and `templateObject`
directly.

## A Content Security Policy

The CEE is a classic script, compiled ahead of time, and does not need `unsafe-eval`. Its fonts and
stylesheets travel inside the bundle rather than being fetched, so nothing has to be added to
`font-src` or to `style-src` for a remote origin.

A policy does have to allow two things. The CEE installs its component styles as inline `<style>`
elements, in the manner of any Angular application, so `style-src` must permit inline styles. The
endpoints the CEE is configured with also have to appear in `connect-src`: in a default
configuration that is the terminology service and the bridge, and nothing else.
