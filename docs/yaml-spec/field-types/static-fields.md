# Static Fields

Static fields present fixed content and collect no value. Five types are provided.

| Field type | Purpose |
|-----------|---------|
| `static-rich-text` | Formatted text. |
| `static-image` | An image. |
| `static-youtube-video` | An embedded video. |
| `static-section-break` | A labeled section divider. |
| `static-page-break` | A page divider. |

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `content` | string | optional | The text, image URL, or video URL. |
| `width` | integer | optional | Display width. |
| `height` | integer | optional | Display height. |

```yaml
- key: intro
  type: static-rich-text
  name: Introduction
  content: <p>Please complete <strong>all</strong> fields.</p>
```
