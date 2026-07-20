# Link Field

A link field collects a URI. In YAML its `type` is `link-field`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `default` | IRI | optional | A default URI. |

```yaml
- key: homepage
  type: link-field
  name: Institution Home Page
  default: https://stanford.edu
```
