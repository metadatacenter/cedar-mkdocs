# Core Artifact Structure

In the YAML serialization, an artifact is written as a set of keys and values. Its opening
keys give the artifact's type, name, description, and identity:

```yaml
type: text-field
name: Study Name
description: The name of the study
id: https://repo.metadatacenter.org/template-fields/5c2d54c
```

Every artifact begins this way, differing only in its `type` and in the content it carries.
A template:

```yaml
type: template
name: Study
description: A clinical study
id: https://repo.metadatacenter.org/templates/7b8977e
```

Or an element:

```yaml
type: element
name: Address
description: A postal address
id: https://repo.metadatacenter.org/template-elements/be89d73
```

## The `type` discriminator

Every definition opens with `type`, whose value names the artifact kind and, for fields, the
field type. The reader dispatches on it: the value fixes which further keys are meaningful.

| Value | Artifact |
|-------|----------|
| `template` | A template. |
| `element` | An element. |
| a field-type token | A field, of one of the field types below. |
| `instance` | A template instance. |
| `element-instance` | A standalone element instance. |

## Descriptive keys

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `name` | string | required | The artifact's human-readable name. Required. |
| `description` | string | optional | A description of the artifact. Omitted when empty. |
| `identifier` | string | optional | An application-defined identifier, distinct from `id`. Not necessarily an IRI. Omitted when empty. |
| `language` | string | optional | The natural language of the artifact's content, as an IETF BCP 47 language tag (for example `en`). Omitted when empty. |

## Identity

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `id` | IRI | conditional | The artifact's own identifier. Present when the artifact has been assigned one. |

A nested child is not required to have an `id`; when it does, it is preserved.

## Field types

A field's `type` is one of 25 field types, each collecting a particular kind of value. We
will cover these in more detail later in the document.

| Field type | Collects |
|-----------|----------|
| `text-field` | Free text. |
| `text-area-field` | Multi-line text. |
| `numeric-field` | A number. |
| `temporal-field` | A date, time, or datetime. |
| `controlled-term-field` | A term from a controlled vocabulary. |
| `radio-field` | One option, as radio buttons. |
| `single-select-list-field` | One option, from a dropdown list. |
| `checkbox-field` | Any number of options, as checkboxes. |
| `multi-select-list-field` | Any number of options, from a dropdown list. |
| `link-field` | A URI. |
| `phone-number-field` | A phone number. |
| `email-field` | An email address. |
| `attribute-value-field` | User-supplied attribute/value pairs. |
| `ext-ror-field` | A ROR identifier. |
| `ext-orcid-field` | An ORCID identifier. |
| `ext-doi-field` | A DOI. |
| `ext-rrid-field` | An RRID. |
| `ext-pfas-field` | A PFAS identifier. |
| `ext-pubmed-field` | A PubMed identifier. |
| `ext-nih-grant-id-field` | An NIH grant identifier. |
| `static-rich-text` | Fixed formatted text (collects no value). |
| `static-image` | A fixed image (collects no value). |
| `static-youtube-video` | An embedded video (collects no value). |
| `static-section-break` | A section divider (collects no value). |
| `static-page-break` | A page divider (collects no value). |
