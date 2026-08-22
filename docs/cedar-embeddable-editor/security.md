# Security

The CEE runs inside the embedding page, in the embedding origin. Its content lives in a shadow
root, but **Shadow DOM is not a security boundary**: it scopes styles and markup, not privileges.
Anything the CEE executes reaches cookies, storage and network exactly as the rest of the
application does.

## Templates Are Trusted Input

For a component whose inputs are data, that arrangement costs nothing, because data does not
execute. But one of the CEE's inputs is not purely data: a CEDAR template can carry a
[static rich-text field](../yaml-spec/field-types/static-fields.md), whose body is HTML composed by
the template's author and rendered as HTML by the CEE. Template authors use it for instructions,
formatted notes and links.

Instance data raises no such question inside the CEE. A value a user typed is sanitized every time
it is rendered, in the editable form and in read-only view alike, and no configuration changes
that. A person filling in a form cannot introduce markup that runs in the editor.

Sanitizing happens at render, though, and not in the data. The instance the CEE hands back holds
what the user typed, verbatim, because that is the metadata the application asked for. An
application that displays those values somewhere else, in a summary or a search result, sanitizes
them there as it would any other user input.

That leaves a template author's rich text as the one input whose treatment an application can change.

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
  "trustTemplateRichText": true
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
| Static rich-text field body | Template author | Sanitized, unless `trustTemplateRichText` is on |
| Static section break, image, YouTube | Template author | Not rendered as HTML. Used as text or as a URL |
| Field values, in the form and in read-only view | Instance data | Always sanitized. Not configurable |
| Multi-instance value summaries | Instance data | Always sanitized. Not configurable |

The three static kinds in the second row render no markup at all, so nothing an author writes in
them executes. Their URLs are still checked before the browser sees them. An image field refuses a
scheme that cannot address an image, and refuses a `data:` URL that declares anything other than
one. A video field embeds a validated YouTube video ID on a fixed `youtube.com` origin, so a link
to a host that merely ends in the YouTube one is refused. Every refusal names the offending URL on
the card rather than leaving it blank, so a template author can see what to correct.

The image field accepts any image type, `image/svg+xml` among them, because it renders an `img`
element the CEE writes itself and an SVG cannot execute from one. Rich text is stricter about the
same URL, allowing the raster types only, because there the `img` is one element in an allowlist
over markup the author composed.

## Requests the CEE Makes

Requests come from three places: the two CEDAR servers the application configures, a language map it
may point the CEE at, and the template itself. Only the first two are the application's to decide.

Of the servers, neither `terminologyBaseUrl` nor `bridgeBaseUrl` has a default, so an application
that sets neither has the CEE make no requests of its own: a controlled-term field offers no terms,
an external-authority field resolves no identifiers, and the CEE reports which key is missing the
first time a field needs it.

Each request carries only the text the user typed and the constraint the template declares. An
application that must keep those queries inside its own network points both settings at its own
CEDAR deployment.

A template adds requests the application did not configure. A static image field makes the browser
fetch the URL the template author wrote, at whatever origin that names, and a video field loads
the player from `youtube.com`. Both tell that origin the reader's address and the page they are
on. The player is loaded with a `strict-origin-when-cross-origin` referrer policy; an image sends
the referrer its origin would ordinarily see. An application that must not leak either serves the
images it is willing to show, and bounds the rest with a content security policy.

Everything else happens locally. The application supplies the template and the instance, the
browser renders the form, and the browser produces the metadata. The CEE sends metadata nowhere.

One configuration key makes the CEE fetch on its own: `languageMapPathPrefix`, which sends it
looking for a language map instead of using the one inside the bundle. An application that would
rather hold every network decision itself leaves it unset and takes the built-in languages. The CEE
never fetches a template — the application supplies it.

## A Content Security Policy

The CEE is a classic script, compiled ahead of time, and does not need `unsafe-eval`. Its fonts and
stylesheets travel inside the bundle rather than being fetched, so nothing has to be added to
`font-src` or to `style-src` for a remote origin.

A policy does have to allow the styles and the endpoints. The CEE installs its component styles as
inline `<style>` elements, in the manner of any Angular application, so `style-src` must permit
inline styles.

`connect-src` has to name every origin the CEE fetches from, which is exactly what the application
configured: the terminology service, the bridge, and the origin serving the language maps if
`languageMapPathPrefix` points at another one. Configure none of the three and `connect-src` needs
nothing for the CEE at all. There is no default to account for — a policy written against one would
be naming an origin the CEE never contacts.

Templates carrying static content need two more directives. An image field renders an `img`, so
`img-src` has to cover the origins those templates point at, along with `data:` for an image
carried inline in a rich-text body or in the field itself. A video field renders an `iframe`, so
`frame-src` has to allow `https://www.youtube.com`. Omitting either costs the content and not the
form: a blocked image reports that it could not be loaded, a blocked video leaves an empty frame,
and the rest of the template renders.
