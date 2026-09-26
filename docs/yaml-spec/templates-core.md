# Templates: Core Structure

A template is a complete metadata specification: an ordered set of elements and fields that
describe one kind of thing. In YAML it is written with `type: template`, its elements and
fields listed under `children`:

```yaml
type: template
name: "Study"
children:
- key: "study-name"
  type: text-field
  name: "Study Name"
- key: "address"
  type: element
  name: "Address"
```

Each entry in `children` is a field or element, told apart by its own `type`. Its `key` is
the master identifier for the child. It must be unique among the parent's children, and it is
what indexing, integrity checking, and instances all refer to. Its `name` is purely for
presentation. A value in an instance is bound to a
child by its `key`, never by its `name`.

## Reserved Child Keys

A child's `key` is also a property name in the JSON-LD form of the template's instances,
where it sits beside the properties CEDAR writes into every instance. A key that would collide
with one of those properties is reserved, whichever form an artifact is written in. No field
or element may take:

- a key that begins with `@`, which covers every JSON-LD keyword;
- one of the CEDAR instance properties `schema:name`, `schema:description`,
  `schema:identifier`, `schema:isBasedOn`, `pav:createdOn`, `pav:createdBy`,
  `pav:lastUpdatedOn`, `pav:derivedFrom`, `oslc:modifiedBy`, `rdfs:label`, `skos:notation`,
  `skos:prefLabel`, `skos:altLabel` or `_annotations`;
- `__proto__`, `constructor` or `prototype`, which a JavaScript object cannot hold as
  ordinary keys.

Keys such as `type`, `name` and `children` remain available to an ordinary field or element,
because an instance writes its value under `children`. An attribute-value field is written
differently, so its key has [further reservations](field-types/attribute-value-field.md#reserved-keys).
The attribute names an instance author supplies for an attribute-value field are subject to
the reservations listed here.

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
