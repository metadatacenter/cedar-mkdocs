# Text Field

A text field collects a single line of free text, the usual choice for a short,
unconstrained value such as a name or an identifier. Optional keys bound and validate what
the author enters. `minLength` and `maxLength` limit its length, and `regex` requires it to
match a regular expression. In YAML its `type` is `text-field`.

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

A text field may also restrict its value to a fixed list of literals, turning it into a
chooser among preset strings. Each entry has a `label`, and one may be marked `selected` as
the default.

```yaml
- key: phase
  type: text-field
  name: Phase
  values:
  - label: Phase I
    selected: true
  - label: Phase II
```
