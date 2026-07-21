# Static Fields

Static fields do not collect values from the person filling out a template. They carry fixed
content and structure, shaping how a form reads. A static field might introduce a group of
inputs with a heading, offer an explanatory note, show an illustrative image or video, or
break a long form into sections and pages. A template author places them for presentation,
and an instance author never fills them in.

Five types are available.

| Field type | Purpose |
|-----------|---------|
| `static-rich-text` | Displays a block of formatted text, such as instructions or a heading. |
| `static-image` | Displays an image loaded from a URL. |
| `static-youtube-video` | Embeds a YouTube video. |
| `static-section-break` | Marks a labeled divider between groups of fields. |
| `static-page-break` | Splits a long form across separate pages. |

## Content

The three types that display something carry it in `content`. What `content` holds depends
on the type. A `static-rich-text` field stores its formatted text, written as HTML. A
`static-image` field stores the image's URL. A `static-youtube-video` field stores the
video's URL. The two break types, `static-section-break` and `static-page-break`, take their
label from `name` and carry no `content`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `content` | string | optional | The formatted text, image URL, or video URL to display. |

```yaml
- key: intro
  type: static-rich-text
  name: Introduction
  content: <p>Please complete <strong>all</strong> fields.</p>
```

## Image and Video Size

An image or a video can be sized with `width` and `height`, given in pixels. Both are
optional. When omitted, the content displays at its natural or default size. No other static
field uses these keys.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `width` | integer | optional | Display width, in pixels. |
| `height` | integer | optional | Display height, in pixels. |

```yaml
- key: logo
  type: static-image
  name: Project Logo
  content: https://example.org/logo.png
  width: 300
  height: 120
```
