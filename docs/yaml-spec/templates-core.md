# Templates: Core Structure

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

Each entry in `children` is a field or element, told apart by its own `type`. Its `key` is
the master identifier for the child. It must be unique among the parent's children, and it is
what indexing, integrity checking, and instances all refer to. Its `name` is purely for
presentation. A value in an instance is bound to a
child by its `key`, never by its `name`.

## Template Keys

Beyond the [core keys](core-structure.md) every artifact carries, a template can carry a
header and a footer, content shown above and below the form.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `header` | string | optional | Content shown above the form. |
| `footer` | string | optional | Content shown below the form. |

## Instance Type

A template may declare an `instanceType`, the RDF type asserted on instances created from it.
This is what lets an instance be read as Linked Data; see [Mapping to RDF](rdf-mapping.md).

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `instanceType` | IRI | optional | The type asserted on instances created from this template. |
