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

An instance opens the same way, and additionally identifies the template it conforms to:

```yaml
type: instance
name: SDY232
id: https://repo.metadatacenter.org/template-instances/1f9a2b3
isBasedOn: https://repo.metadatacenter.org/templates/7b8977e
```

These four kinds fall into two families. A template, element, or field is a **schema
artifact**, describing the shape that metadata must take. An instance is an **instance
artifact**, holding metadata that conforms to a template. A few keys apply only to schema
artifacts, since only a schema artifact defines structure.

## The `type` Discriminator

Every definition opens with `type`, whose value names the artifact kind and, for fields, the
field type. The reader dispatches on it. The value fixes which further keys are meaningful.

| Value | Artifact |
|-------|----------|
| `template` | A template. |
| `element` | An element. |
| a field-type token | A field, of one of the field types below. |
| `instance` | A template instance. |
| `element-instance` | A standalone element instance. |

## Descriptive Keys

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `name` | string | required | The artifact's human-readable name. Required. |
| `description` | string | optional | A description of the artifact. Omitted when empty. |
| `identifier` | string | optional | An application-defined identifier, distinct from `id`. Not necessarily an IRI. Omitted when empty. |
| `language` | string | optional | The natural language of the artifact's content, as an IETF BCP 47 language tag (for example `en`). Omitted when empty. |

## Identity

An artifact's `id` is its own identifier, an IRI. The model fixes no particular form for it.
Any valid IRI serves. In practice CEDAR mints identifiers under its own repository, so a
CEDAR `id` usually looks like `https://repo.metadatacenter.org/templates/7b8977e`, with a
path segment naming the artifact kind and a trailing identifier. An `id` from another source
is equally valid, as long as it is a well-formed IRI.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `id` | IRI | conditional | The artifact's own identifier. Present when the artifact has been assigned one. |

A nested child is not required to have an `id`; when it does, it is preserved.

## Field Types

A field's `type` is one of 25 field types, each collecting a particular kind of value.

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
| `link-field` | An IRI. |
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

## Model Version

Every schema artifact records the version of the CEDAR model it is written against, in
`modelVersion`. The current model version is `1.6.0`. Because it names the modelling language
rather than any one artifact's content, `modelVersion` changes only when the CEDAR model
itself changes. An instance does not carry it.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `modelVersion` | string | optional | The version of the CEDAR model the artifact conforms to (currently `1.6.0`). |
