# Elements

An element is a named group of fields and other elements, reusable across templates. In
YAML it is a mapping whose `type` is `element`, with its members under `children`:

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

An element's `children` may hold fields and further elements, nesting to any depth. An
element may stand as its own document or sit inside a template or another element.

## Element keys

Beyond the [common keys](common-structure.md) every artifact carries, an element adds:

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `children` | sequence | optional | The element's fields and elements, in display order. |
| `instanceType` | IRI | optional | The type asserted on instances of this element. |

Inside a parent, an element also carries a `key` and a `configuration` mapping.

## Repetition

A nested element may repeat, standing for a list of occurrences rather than one. Its
`configuration` marks it multiple and bounds the count.

| Key in `configuration` | Value | Meaning |
|------------------------|-------|---------|
| `multiple` | boolean | The element may occur more than once. |
| `minItems` | integer | Minimum number of occurrences. |
| `maxItems` | integer | Maximum number of occurrences. |
| `propertyIri` | IRI | The property the element binds to in an instance. |
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
  children:
  - key: street
    type: text-field
    name: Street
```
