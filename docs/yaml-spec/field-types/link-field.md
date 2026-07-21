# Link Field

A link field collects an IRI, typically the web address of an external resource such as a
home page or a dataset. Its optional `default` supplies a starting value. In YAML its `type`
is `link-field`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `default` | IRI | optional | A default IRI. |

```yaml
- key: homepage
  type: link-field
  name: Institution Home Page
  default: https://stanford.edu
```
