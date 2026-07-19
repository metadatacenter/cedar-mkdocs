# Template Instances

A template instance is an instance artifact: it holds metadata that conforms to a template.
In YAML it names its template with `isBasedOn` and gives a value for each field under
`children`, keyed by the field's name:

```yaml
type: instance
name: SDY232
isBasedOn: https://repo.metadatacenter.org/templates/ec3f500
children:
  Study Name:
    value: Cardiology cohort
```

## Instance keys

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `type` | `instance` | required | Marks the document as a template instance. |
| `name` | string | required | The instance's name. |
| `description` | string | optional | A description of the instance. |
| `id` | IRI | optional | The instance's own identifier. |
| `isBasedOn` | IRI | required | The template this instance conforms to. |
| `children` | mapping | optional | The element and field values, keyed by name. |
| `annotations` | mapping | optional | Annotations on the instance; see [Annotations](annotations.md). |

Provenance keys (`createdOn`, `createdBy`, `modifiedOn`, `modifiedBy`) are optional, as for
schema artifacts.

## Field values

A field's value is a mapping. Which keys it carries depends on the kind of value.

| Key | Value | Meaning |
|-----|-------|---------|
| `value` | string or number | A literal value. |
| `datatype` | datatype token | The value's type, when typed (for example `xsd:int`, `iri`). |
| `id` | IRI | The identifier of a controlled term or linked resource. |
| `label` | string | The display label of a controlled term. |
| `prefLabel` | string | The preferred label of a controlled term. |
| `notation` | string | The term's notation. |
| `language` | string | The value's language. |

A plain literal carries just `value`. A typed literal adds `datatype`. A controlled term
carries `id` with a `label`.

```yaml
type: instance
name: SDY232
isBasedOn: https://repo.metadatacenter.org/templates/ec3f500
children:
  Study Name:
    value: Cardiology cohort
  Participants:
    value: 2323
    datatype: xsd:int
  Disease:
    id: http://purl.obolibrary.org/obo/DOID_530
    label: eyelid disease
```

A field with no value is omitted from `children` entirely.

## Multiple values

A multi-valued field holds a sequence of value mappings.

```yaml
  Keywords:
  - value: genomics
  - value: oncology
```

## Nested elements

An element value is a mapping with its own `children`. A repeating element holds a sequence
of such mappings.

```yaml
  Address:
    children:
      Street:
        value: 450 Serra Mall
      City:
        value: Stanford
  Contributors:
  - children:
      Name:
        value: Dr Bob
  - children:
      Name:
        value: Dr Joe
```

## Attribute-value fields

An attribute-value field appears as a mapping keyed by the field's name. Each entry names a
user-supplied attribute and gives its value.

```yaml
  Extra Attributes:
    Study ZIP:
      value: "94402"
    Study Duration:
      value: "2"
```

## Standalone element instances

An element instance may be written as its own document, using `type: element-instance`. It
carries the same `name`, `description`, `id`, and `children` as a nested element value, plus
the `type` discriminator so it stands alone.

```yaml
type: element-instance
name: Address
children:
  Street:
    value: 450 Serra Mall
```
