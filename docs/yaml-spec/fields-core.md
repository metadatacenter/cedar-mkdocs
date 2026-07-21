# Fields: Core Structure

A field collects one value, or a list of values. In YAML its `type` names its
[field type](field-types/index.md). The type-specific keys differ, but every field shares the
same frame: the [core keys](core-structure.md) each artifact carries, plus a
`configuration` block when the field sits inside a parent.

## Field Configuration

A field placed inside a template or element carries a `configuration` block. Its settings
depend on where the field sits, not on the field's own type. The most common is `required`.

```yaml
- key: study-name
  type: text-field
  name: Study Name
  configuration:
    required: true
```

The settings fall into a few groups.

### Requirement

`required` and `recommended` say how strongly a value is expected.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `required` | boolean | optional | A value must be supplied. Default false. |
| `recommended` | boolean | optional | A value is encouraged but not enforced. |

### Repetition

By default a field collects one value. `multiple` makes it collect a list, and `minItems`
and `maxItems` bound the length. Checkbox, multi-select list, and attribute-value fields are
multi-valued by nature and do not use `multiple`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `multiple` | boolean | optional | The field accepts a list of values. |
| `minItems` | integer | optional | Minimum number of values, when multiple. |
| `maxItems` | integer | optional | Maximum number of values, when multiple. |

### Property Binding

`propertyIri` sets the property the field maps to when its value appears in an instance,
giving the field a semantic identity beyond its name.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `propertyIri` | IRI | optional | The property the field binds to in an instance. |

### Presentation

These affect how the field appears in this parent, not what it means. `overrideLabel` and
`overrideDescription` replace the field's own `name` and description for this placement.
`hidden` keeps the field out of the form, and `continuePreviousLine` sets it beside the
previous field rather than on a new line.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `overrideLabel` | string | optional | A display label for this field in this parent, replacing its `name`. |
| `overrideDescription` | string | optional | A display description for this field in this parent. |
| `hidden` | boolean | optional | The field is hidden in the form. |
| `continuePreviousLine` | boolean | optional | Lay the field out on the same line as the previous one. |

Static fields additionally carry `width` and `height` here; see [Static Fields](field-types/static-fields.md).

## Nested and Standalone Fields

A field written as a child of a template or element carries its parent-relative settings in
`configuration`. A field written as a top-level definition has no parent, so the
field-level settings that do not depend on a parent — `hidden`, `continuePreviousLine`, and
the static-field `width` and `height` — appear directly among the field's keys instead. The parent-only settings (`propertyIri`, `overrideLabel`,
`overrideDescription`, and the required/recommended/multiple bindings) do not apply to a
standalone field.

## Semantic Labels

Any field may carry semantic labels, independent of its type:

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `prefLabel` | string | optional | A preferred label for the field's meaning. |
| `altLabels` | sequence of strings | optional | Alternate labels. |
