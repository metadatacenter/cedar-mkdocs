# Text Area Field

A text area field collects multi-line text, suited to longer prose such as a summary or a
set of notes. Like a text field, it accepts `minLength` and `maxLength` to bound the entry. It
takes no pattern, so a `regex` belongs to a text field alone. In YAML its `type` is
`text-area-field`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `minLength` | integer | optional | Minimum length. |
| `maxLength` | integer | optional | Maximum length. |
| `default` | string | optional | Default value. |

```yaml
- key: "summary"
  type: text-area-field
  name: "Summary"
  maxLength: 1000
```
