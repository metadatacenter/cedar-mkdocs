# Field Types

CEDAR has four main kinds of field: core fields, controlled term fields, external authority
fields, and static fields.

## Core Fields

Core fields collect a value directly from the author: text, a number, a date, a choice from
a fixed list, a link, contact details, or free-form attribute/value pairs. Each holds
whatever the author types or picks, constrained only by its own type — the value is not
drawn from an external vocabulary or authority.

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

## Static Fields

[Static fields](static-fields.md) collect no value. They present fixed content — a heading,
an image, an explanatory note, or a divider — to structure and annotate the form the
template presents.

| Field type | Purpose |
|-----------|---------|
| `static-rich-text` | Formatted text. |
| `static-image` | An image. |
| `static-youtube-video` | An embedded video. |
| `static-section-break` | A labeled section divider. |
| `static-page-break` | A page divider. |
