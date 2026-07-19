# Fields: Common Structure

A field collects one value, or a list of values. In YAML its `type` names its
[field type](field-types.md). The type-specific keys differ, but every field shares the
same frame: the [common keys](common-structure.md) each artifact carries, plus a
`configuration` block when the field sits inside a parent.

## The `configuration` block

Inside a template or element, a field carries a `configuration` block for the settings
that depend on its place in that parent — whether it is required, whether it repeats, how it
binds and displays:

```yaml
- key: study-name
  type: text-field
  name: Study Name
  configuration:
    required: true
```

These settings are meaningful only for a field embedded in a parent, so they live in
`configuration` rather than among the field's own keys.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `required` | boolean | optional | A value must be supplied. Default false. |
| `recommended` | boolean | optional | A value is recommended but not required. |
| `hidden` | boolean | optional | The field is hidden in the form. |
| `multiple` | boolean | optional | The field accepts a list of values. |
| `minItems` | integer | optional | Minimum number of values when multiple. |
| `maxItems` | integer | optional | Maximum number of values when multiple. |
| `propertyIri` | IRI | optional | The property the field binds to in an instance. |
| `overrideLabel` | string | optional | A display label for this field in this parent, replacing its `name`. |
| `overrideDescription` | string | optional | A display description for this field in this parent. |
| `continuePreviousLine` | boolean | optional | Lay the field out on the same line as the previous one. |
| `valueRecommendation` | boolean | optional | Enable value recommendation for the field. |
| `width` | integer | optional | Display width, for static fields. |
| `height` | integer | optional | Display height, for static fields. |

## Nested and standalone fields

A field written as a child of a template or element carries its parent-relative settings in
`configuration`. A field written as a top-level definition has no parent, so the
field-level settings that do not depend on a parent — `hidden`, `continuePreviousLine`,
`valueRecommendation`, and the static-field `width` and `height` — appear directly among
the field's keys instead. The parent-only settings (`propertyIri`, `overrideLabel`,
`overrideDescription`, and the required/recommended/multiple bindings) do not apply to a
standalone field.

## Semantic labels

Any field may carry semantic labels, independent of its type:

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `prefLabel` | string | optional | A preferred label for the field's meaning. |
| `altLabels` | sequence of strings | optional | Alternate labels. |

## Single and multiple values

By default a field collects one value. Marking it `multiple` makes it collect a list, with
`minItems` and `maxItems` bounding the length. Checkbox, multi-select list, and
attribute-value fields are inherently multi-valued and do not use `multiple`; see their
entries in [Field Types](field-types.md).
