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

## Element keys

Beyond the [core keys](core-structure.md) every artifact carries, an element adds:

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `children` | sequence | optional | The elements and fields it contains. |
| `instanceType` | IRI | optional | The type asserted on instances of this element. |

## Element Configuration

Inside a parent, an element carries a `configuration` block: the settings that depend on
where the element sits rather than on the element itself. They control how it binds to a
property, how it is labelled and described in this parent, and whether it repeats. A
repeating element stands for a list of occurrences, bounded by a minimum and maximum count.

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
    overrideLabel: Postal Address
    overrideDescription: The mailing address for this site
  children:
  - key: street
    type: text-field
    name: Street
```
