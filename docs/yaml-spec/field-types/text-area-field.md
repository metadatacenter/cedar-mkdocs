# Text Area Field

A text area field collects multi-line text. In YAML its `type` is `text-area-field`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `minLength` | integer | optional | Minimum length. |
| `maxLength` | integer | optional | Maximum length. |
| `regex` | string | optional | A pattern the value must match. |
| `default` | string | optional | Default value. |

```yaml
- key: summary
  type: text-area-field
  name: Summary
  maxLength: 1000
```
