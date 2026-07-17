# Templates

A template is a complete metadata specification: an ordered set of fields and elements that
describe one kind of thing. In YAML it is a mapping whose `type` is `template`, with its
fields and elements listed under `children`:

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

Each entry in `children` is a field or element, told apart by its own `type`. Each carries a
`key`: the name that identifies it within the template and binds its value in an instance.
The order of `children` is the order the template presents.

## Template keys

Beyond the [common keys](common-structure.md) every artifact carries, a template adds:

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `children` | sequence | optional | The template's fields and elements, in display order. |
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
