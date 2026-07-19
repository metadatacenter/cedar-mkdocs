# Templates

A template is a complete metadata specification: an ordered set of elements and fields that
describe one kind of thing. In YAML it is written with `type: template`, its elements and
fields listed under `children`:

```yaml
type: template
name: Study
children:
- key: study-name
  type: text-field
  name: Study Name
- key: address
  type: element
  name: Address
```

Each entry in `children` is a field or element, told apart by its own `type`. Its `name` is
the user-friendly label. Its `key` is essentially the child artifact's index within the
artifact: it must be unique per artifact, and it binds the child artifact's value in an
instance.

## Template keys

Beyond the [core keys](core-structure.md) every artifact carries, a template adds:

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `children` | sequence | optional | The elements and fields it contains, in display order. |
| `header` | string | optional | Content shown above the form. |
| `footer` | string | optional | Content shown below the form. |
| `instanceType` | IRI | optional | The type asserted on instances created from this template. |

## Minimal template

The least a template needs is a `type` and a `name`:

```yaml
type: template
name: Study
```

Such a template has no children. It is valid, but collects nothing until fields are added.
