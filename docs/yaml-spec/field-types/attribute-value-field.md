# Attribute-Value Field

An attribute-value field collects a set of user-supplied attribute/value pairs. The instance
author names each attribute and gives its value, so the field suits metadata whose
properties are not known when the template is designed. In YAML its `type` is
`attribute-value-field`.

The definition takes no type-specific keys, since the attribute names are not known until the
instance is filled in.

```yaml
- key: "extra-attributes"
  type: attribute-value-field
  name: "Additional Characteristics"
```

## In an Instance

An attribute-value field is represented differently from other fields in instances. Its
values do not sit under the instance's `children`. Instead the field's `key` becomes a
top-level key of the instance, and beneath it each attribute the author supplied is paired
with its value. Those attribute names are chosen by the author at fill-in time, not fixed by
the template.

```yaml
type: instance
name: "SDY232"
isBasedOn: "https://repo.metadatacenter.org/templates/ec3f500"
children:
  study-name:
    value: "Cardiology cohort"
extra-attributes:
  Batch Number:
    value: "3"
  Freezer ID:
    value: "F-12"
```

A parent may hold more than one attribute-value field. Each appears as its own top-level key,
keyed by the field's `key`, carrying its own set of attribute-value pairs.

```yaml
extra-attributes:
  Batch Number:
    value: "3"
storage-details:
  Freezer ID:
    value: "F-12"
  Shelf:
    value: "4"
```

## Reserved Keys

An attribute-value field's `key` is written beside its parent's own keys rather than under
`children`, so it may not be one of them. The reserved keys depend on the parent. In a
template, the field sits beside every key of the instance: `type`, `name`, `description`,
`id`, `isBasedOn`, `derivedFrom`, `children`, `annotations`, `createdOn`, `createdBy`,
`modifiedOn` and `modifiedBy`. In an element, the field sits beside the keys of an element
instance nested in its parent, which are only `type`, `id` and `children`.

These reservations add to the [reserved child keys](../templates-core.md#reserved-child-keys)
that apply to every field and element. The attribute names an instance author supplies are
subject only to the latter. An attribute may be called `type`, for example, because it is
written beneath the field's `key`.
