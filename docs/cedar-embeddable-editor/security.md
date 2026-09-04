# Security

The CEE executes in the host page's origin and has the same access to cookies,
storage, and network resources as the rest of that page. Shadow DOM isolates
markup and styles; it is not a security boundary.

## Treat Templates as Input

Most template content is data. The exception is a
[static rich-text field](../yaml-spec/field-types/static-fields.md), whose body
contains HTML written by the template author.

The CEE sanitizes this HTML by default. It always sanitizes values from metadata
instances when rendering them in editable and read-only views.

Sanitizing at render time does not modify the instance. `currentMetadata`
contains the user's original text, so the host must sanitize that text again if
it later renders the value elsewhere.

## Default Rich-Text Sanitizing

The default sanitizer removes executable content, including:

- `<script>` and `<iframe>` elements;
- event-handler attributes such as `onerror`;
- `javascript:` URLs;
- form controls; and
- AngularJS directive attributes such as `ng-click`.

Formatting such as headings, lists, tables, links, inline styles, and raster
`data:` images remains available.

## Trusted Rich Text

The host can disable sanitizing for template-authored rich text:

```json
{
  "trustTemplateRichText": true
}
```

Enable this only when template authors are trusted to run JavaScript in the host
application's origin. This is appropriate only when templates ship with the
application or come from a repository controlled by the same operators.

Do not enable it when users can select templates from a public library, a
collaborator, or any other source whose authors do not have permission to deploy
application code.

## Sanitizing by Content Type

| Content | Source | Treatment |
|---|---|---|
| Static rich-text body | Template author | Sanitized unless `trustTemplateRichText` is `true`. |
| Static section break, image, or YouTube field | Template author | Treated as text or a validated URL, not arbitrary HTML. |
| Field values in editable or read-only views | Instance | Always sanitized. |
| Repeating-value summaries | Instance | Always sanitized. |

Static image fields accept image URLs and image `data:` URLs. Static video fields
accept validated YouTube identifiers on the fixed `youtube.com` origin. Invalid
URLs are refused and reported in the form.

An image field may display `image/svg+xml` because the CEE creates the `<img>`
element itself. Rich-text HTML permits only raster `data:` images, since those
elements originate in author-supplied markup.

## Network Requests

The CEE can make requests from four sources:

| Source | Request |
|---|---|
| `terminologyBaseUrl` | Controlled-term search using the user's text and the template constraint. |
| `bridgeBaseUrl` | External-authority search and identifier details. |
| `languageMapPathPrefix` | External interface language maps. |
| Static template content | Images from author-selected origins and video from `youtube.com`. |

The two CEDAR service URLs and the language-map path have no defaults. Leaving
them unset prevents those requests. Organizations that must keep lookup queries
inside their network should use endpoints from their own CEDAR deployment.

The host supplies templates and instances directly; the CEE never fetches a
template or submits completed metadata.

Static content deserves separate review because its destinations come from the
template. Loading an image or video reveals the reader's network address and
referrer information permitted by the browser. The YouTube player uses a
`strict-origin-when-cross-origin` referrer policy. Hosts with stricter privacy
requirements should proxy or host approved images and restrict destinations with
a content security policy.

## Content Security Policy

The CEE is a precompiled classic script and does not require `unsafe-eval`. Fonts
are embedded in the bundle, so it introduces no remote `font-src` requirement.

Account for these directives in the host policy:

| Directive | Required allowance |
|---|---|
| `script-src` | The origin serving `cedar-embeddable-editor.js`. |
| `style-src` | Inline styles, because the component installs compiled styles in its shadow root. |
| `connect-src` | Configured terminology, bridge, and external language-map origins. |
| `img-src` | Image origins allowed by templates, plus `data:` if inline images are permitted. |
| `frame-src` | `https://www.youtube.com` when templates may contain video fields. |

If the service and language settings are unset, the CEE adds no `connect-src`
destinations. Blocking a template image or video affects only that content; the
rest of the form continues to render.
