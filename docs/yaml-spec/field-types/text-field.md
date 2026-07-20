# Text Field

A text field collects free text. In YAML its `type` is `text-field`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `minLength` | integer | optional | Minimum length. |
| `maxLength` | integer | optional | Maximum length. |
| `regex` | string | optional | A pattern the value must match. |
| `default` | string | optional | Default value. |
| `values` | sequence | optional | A list of permitted literal values. |

```yaml
- key: study-id
  type: text-field
  name: Study ID
  minLength: 2
  maxLength: 10
```

A text field may constrain its value to a fixed list of literals. Each entry has a `label`;
one may be marked `selected` as the default.

```yaml
- key: phase
  type: text-field
  name: Phase
  values:
  - label: Phase I
    selected: true
  - label: Phase II
```
