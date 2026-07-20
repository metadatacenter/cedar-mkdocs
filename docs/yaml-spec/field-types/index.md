# Field Types

A field's `type` is one of 25 field types, each collecting a particular kind of value. Each
type has its own page, covering the keys specific to it. The keys every field shares — its
core keys and its `configuration` block — are on [Fields: Core Structure](../fields-core.md).

| Field type | Collects |
|-----------|----------|
| [`text-field`](text-field.md) | Free text. |
| [`text-area-field`](text-area-field.md) | Multi-line text. |
| [`numeric-field`](numeric-field.md) | A number. |
| [`temporal-field`](temporal-field.md) | A date, time, or datetime. |
| [`radio-field`](radio-field.md) | One option, as radio buttons. |
| [`single-select-list-field`](single-select-list-field.md) | One option, from a dropdown list. |
| [`checkbox-field`](checkbox-field.md) | Any number of options, as checkboxes. |
| [`multi-select-list-field`](multi-select-list-field.md) | Any number of options, from a dropdown list. |
| [`link-field`](link-field.md) | A URI. |
| [`phone-number-field`](phone-number-field.md) | A phone number. |
| [`email-field`](email-field.md) | An email address. |
| [`attribute-value-field`](attribute-value-field.md) | User-supplied attribute/value pairs. |
| [`controlled-term-field`](controlled-term-field.md) | A term from a controlled vocabulary. |
| [`ext-*`](external-authority-fields.md) | An identifier from an external authority (ROR, ORCID, DOI, …). |
| [`static-*`](static-fields.md) | Fixed content — a heading, image, or note — that collects no value. |

Examples throughout are shown as nested children (with a `key`), since that is how fields
most often appear.
