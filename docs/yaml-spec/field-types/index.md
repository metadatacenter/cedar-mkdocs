# Field Types

CEDAR has five main kinds of field: core fields, controlled term fields, external authority
fields, attribute-value fields, and static fields.

## Core Fields

Core fields collect a value directly from the author: text, a number, a date, a choice from
a fixed list, a link, or contact details. Each holds whatever the author types or picks,
constrained only by its own type. The value is not drawn from an external vocabulary or
authority.

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
| [`link-field`](link-field.md) | An IRI. |
| [`phone-number-field`](phone-number-field.md) | A phone number. |
| [`email-field`](email-field.md) | An email address. |

## Controlled Term Field

A [controlled term field](controlled-term-field.md) binds a field's value to terms from a
controlled vocabulary — an ontology, a branch of one, specific classes, or a value set — so
the value is a shared, resolvable identifier rather than free text. This is what makes
metadata from different authors and templates comparable and interoperable.

| Field type | Collects |
|-----------|----------|
| [`controlled-term-field`](controlled-term-field.md) | A term from a controlled vocabulary. |

## External Authority Fields

[External authority fields](external-authority-fields.md) collect an identifier issued and
maintained by an outside registry, such as an organization from ROR, a person from ORCID, or
a publication from DOI. The stored value is a resolvable identifier from that authority, not
a typed-in name. CEDAR can extend this set with further authorities.

| Field type | Authority |
|-----------|-----------|
| `ext-ror-field` | ROR — Research Organization Registry. |
| `ext-orcid-field` | ORCID — researcher identifiers. |
| `ext-doi-field` | DOI — digital object identifiers. |
| `ext-rrid-field` | RRID — research resource identifiers. |
| `ext-pfas-field` | PFAS identifiers. |
| `ext-pubmed-field` | PubMed identifiers. |
| `ext-nih-grant-id-field` | NIH grant identifiers. |

## Attribute-Value Field

An [attribute-value field](attribute-value-field.md) lets the person filling out the
template supply their own attribute-value pairs, naming each attribute and giving its value.
Every other field has a name fixed by the template; an attribute-value field is open-ended,
so the author adds as many pairs as they need. It suits metadata whose shape is not known in
advance, capturing properties that vary from one instance to the next.

| Field type | Collects |
|-----------|----------|
| [`attribute-value-field`](attribute-value-field.md) | User-supplied attribute/value pairs. |

## Static Fields

[Static fields](static-fields.md) do not collect values. They control a template's presentation
and display, governing its layout and the supporting content shown alongside the fields. A
static field might present a heading, an image, or an explanatory note, or break the form
into sections and pages.

| Field type | Purpose |
|-----------|---------|
| `static-rich-text` | Formatted text. |
| `static-image` | An image. |
| `static-youtube-video` | An embedded video. |
| `static-section-break` | A labeled section divider. |
| `static-page-break` | A page divider. |
