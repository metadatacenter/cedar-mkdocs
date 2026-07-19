# Common Artifact Structure

In the YAML serialization, an artifact is written as a set of keys and values. Its opening
keys give the artifact's type, name, description, and identity:

```yaml
type: text-field
name: Study Name
description: The name of the study
id: https://repo.metadatacenter.org/template-fields/5c2d54c8-e32b-47aa-9393-48885fc75cff
```

A template or element begins the same way, differing in its `type` and in the content it
carries:

```yaml
type: template
name: Study
description: A clinical study
id: https://repo.metadatacenter.org/templates/7b8977ed-c4d7-4c29-b202-53e38a41c723
```

## The `type` discriminator

Every document opens with `type`, whose value names the artifact kind and, for fields, the
field type. The reader dispatches on it: the value fixes which further keys are meaningful.

| Value | Artifact |
|-------|----------|
| `template` | A template. |
| `element` | An element. |
| a field-type token | A field. The 25 tokens are listed in [Field Types](field-types.md). |
| `instance` | A template instance. |
| `element-instance` | A standalone element instance. |

## Descriptive keys

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `name` | string | required | The artifact's human-readable name. |
| `description` | string | optional | A description of the artifact. Omitted when empty. |
| `identifier` | string | optional | An application-defined identifier, distinct from `id`. |
| `language` | string | optional | The natural language of the artifact's content. |

```yaml
type: element
name: Address
description: A postal address
```

## Identity

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `id` | IRI | conditional | The artifact's own identifier. Present when the artifact has been assigned one. |

A newly created artifact that has not yet been assigned a permanent IRI may carry a
temporary `id` (for example `tmp-1680730278523-26677`) or omit `id` entirely. A nested
child is not required to have an `id`; when it does, it is preserved.
