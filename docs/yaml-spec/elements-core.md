# Elements: Core Structure

An element is a named group of elements and fields, reusable across templates. In
YAML it is written with `type: element`, its members listed under `children`:

```yaml
type: element
name: Address
children:
- key: street
  type: text-field
  name: Street
- key: country
  type: element
  name: Country
  children:
  - key: country-name
    type: text-field
    name: Country Name
```

An element's `children` may hold elements and fields. Because an element can itself hold
elements, this allows nesting to any depth. An element may stand as its own definition or sit
inside a template or another element.

## Element Keys

Beyond the [core keys](core-structure.md) every artifact carries, an element adds:

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `children` | sequence | optional | The elements and fields it contains. |
| `instanceType` | IRI | optional | The type asserted on instances of this element. |

## Element Configuration

Inside a parent, an element carries a `configuration` block. Its settings depend on where the
element sits, not on the element itself. They fall into a few groups.

### Repetition

A repeating element stands for a list of occurrences. `multiple` marks it as repeating, and
`minItems` and `maxItems` bound how many times it may occur.

| Key | Value | Meaning |
|-----|-------|---------|
| `multiple` | boolean | The element may occur more than once. |
| `minItems` | integer | Minimum number of occurrences. |
| `maxItems` | integer | Maximum number of occurrences. |

### Property Binding

`propertyIri` sets the property the element maps to when its contents appear in an instance.

| Key | Value | Meaning |
|-----|-------|---------|
| `propertyIri` | IRI | The property the element binds to in an instance. |

### Presentation

`overrideLabel` and `overrideDescription` replace the element's own `name` and description
for this placement, without changing the element itself.

| Key | Value | Meaning |
|-----|-------|---------|
| `overrideLabel` | string | A display label for this element in this parent, replacing its `name`. |
| `overrideDescription` | string | A display description for this element in this parent. |

```yaml
- key: address
  type: element
  name: Address
  configuration:
    multiple: true
    minItems: 0
    maxItems: 4
    overrideLabel: Postal Address
    overrideDescription: The mailing address for this site
  children:
  - key: street
    type: text-field
    name: Street
```
