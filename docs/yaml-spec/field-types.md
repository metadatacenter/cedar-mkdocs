# Field Types

There are 25 field types, each named by the `type` value of the field. The keys common to
all fields — description, identity, `configuration`, and semantic labels — are defined in
[Fields: Core Structure](fields-core.md).

Examples are shown as nested children (with a `key`), since that is how fields most often
appear.

## Text fields

`text-field` collects free text.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `minLength` | integer | optional | Minimum length. |
| `maxLength` | integer | optional | Maximum length. |
| `regex` | string | optional | A pattern the value must match. |
| `default` | string | optional | Default value. |
| `values` | sequence | optional | A list of permitted literal values. |

```yaml
- key: study-id
  type: text-field
  name: Study ID
  minLength: 2
  maxLength: 10
```

A text field may constrain its value to a fixed list of literals. Each entry has a `label`;
one may be marked `selected` as the default.

```yaml
- key: phase
  type: text-field
  name: Phase
  values:
  - label: Phase I
    selected: true
  - label: Phase II
```

## Text-area fields

`text-area-field` collects multi-line text. Its keys are `minLength`, `maxLength`, `regex`,
and `default`, as for text fields.

```yaml
- key: summary
  type: text-area-field
  name: Summary
  maxLength: 1000
```

## Numeric fields

`numeric-field` collects a number of a given XSD datatype.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `datatype` | numeric datatype token | required | The value's type: `xsd:decimal`, `xsd:int`, `xsd:long`, `xsd:short`, `xsd:byte`, `xsd:float`, or `xsd:double`. |
| `minValue` | number | optional | Minimum value. |
| `maxValue` | number | optional | Maximum value. |
| `decimalPlaces` | integer | optional | Number of decimal places. |
| `unit` | string | optional | Unit of measure. |
| `default` | number | optional | Default value. |

```yaml
- key: completed
  type: numeric-field
  name: Treatment Completed %
  datatype: xsd:int
  minValue: 0
  maxValue: 100
  default: 0
```

## Temporal fields

`temporal-field` collects a date, time, or datetime.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `datatype` | `xsd:date`, `xsd:time`, or `xsd:dateTime` | required | The temporal kind. |
| `granularity` | `year`, `month`, `day`, `hour`, `minute`, `second`, or `decimalSecond` | required | The finest unit recorded. |
| `inputTimeFormat` | `12h` or `24h` | conditional | Clock format; applies when granularity is finer than day. |
| `inputTimeZone` | boolean | optional | Whether a time zone is recorded. |
| `default` | string | optional | Default value. |

```yaml
- key: visit-time
  type: temporal-field
  name: Visit Time
  datatype: xsd:dateTime
  granularity: minute
  inputTimeFormat: 24h
  inputTimeZone: true
```

## Controlled-term fields

`controlled-term-field` constrains its value to terms drawn from ontologies, branches,
classes, and value sets. Its value is an IRI (`datatype: iri`), and its permitted values
are given in a `values` list, optionally refined by `actions`. Because this machinery is
substantial, it has its own chapter: [Controlled-Term Value Constraints](value-constraints.md).

```yaml
- key: disease
  type: controlled-term-field
  name: Disease
  datatype: iri
  values:
  - type: ontology
    acronym: DOID
    ontologyName: Human Disease Ontology
    iri: https://data.bioontology.org/ontologies/DOID
```

## Choice fields

Four types collect a value from a fixed option list. Each option has a `label`; one or more
may be marked `selected` as a default.

| Type | Selection |
|------|-----------|
| `radio-field` | One option, radio buttons. |
| `single-select-list-field` | One option, dropdown list. |
| `checkbox-field` | Any number of options, checkboxes. |
| `multi-select-list-field` | Any number of options, dropdown list. |

```yaml
- key: vaccine
  type: single-select-list-field
  name: Vaccine
  values:
  - label: Moderna
  - label: Pfizer
  - label: None
    selected: true
```

Checkbox and multi-select fields are multi-valued by nature and do not take `multiple` in
their `configuration`.

## Link fields

`link-field` collects a URI, with an optional `default` holding one.

```yaml
- key: homepage
  type: link-field
  name: Institution Home Page
  default: https://stanford.edu
```

## Contact fields

`phone-number-field` and `email-field` collect a phone number and an email address. Neither
takes type-specific keys.

```yaml
- key: contact-email
  type: email-field
  name: Contact Email
```

## Attribute-value fields

`attribute-value-field` collects a set of user-supplied attribute/value pairs. The instance
author names each attribute and gives its value. The field takes no type-specific keys; the
attribute names are supplied in the instance (see [Template Instances](instances.md)).

```yaml
- key: extra-attributes
  type: attribute-value-field
  name: Additional Characteristics
```

## Identifier fields

Seven field types collect a URI that is a specific kind of external identifier:
`ext-ror-field`, `ext-orcid-field`, `ext-doi-field`, `ext-rrid-field`, `ext-pfas-field`,
`ext-pubmed-field`, and `ext-nih-grant-id-field`. Each takes an optional `default` holding a
URI.

```yaml
- key: funder
  type: ext-ror-field
  name: Funder
  default: https://ror.org/00f54p054
```

## Static fields

Five types present fixed content and collect no value.

| Type | Purpose |
|------|---------|
| `static-rich-text` | Formatted text. |
| `static-image` | An image. |
| `static-youtube-video` | An embedded video. |
| `static-section-break` | A labeled section divider. |
| `static-page-break` | A page divider. |

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `content` | string | optional | The text, image URL, or video URL. |
| `width` | integer | optional | Display width. |
| `height` | integer | optional | Display height. |

```yaml
- key: intro
  type: static-rich-text
  name: Introduction
  content: <p>Please complete <strong>all</strong> fields.</p>
```

## Summary

| Type | Category | Type-specific keys |
|------|----------|--------------------|
| `text-field` | text | `minLength`, `maxLength`, `regex`, `default`, `values` |
| `text-area-field` | text | `minLength`, `maxLength`, `regex`, `default` |
| `numeric-field` | numeric | `datatype`, `minValue`, `maxValue`, `decimalPlaces`, `unit`, `default` |
| `temporal-field` | temporal | `datatype`, `granularity`, `inputTimeFormat`, `inputTimeZone`, `default` |
| `controlled-term-field` | controlled term | `datatype`, `values`, `actions`, `default` |
| `radio-field` | choice | `values` |
| `single-select-list-field` | choice | `values` |
| `checkbox-field` | choice | `values` |
| `multi-select-list-field` | choice | `values` |
| `link-field` | link | `default` |
| `phone-number-field` | contact | — |
| `email-field` | contact | — |
| `attribute-value-field` | attribute-value | — |
| `ext-ror-field` | identifier | `default` |
| `ext-orcid-field` | identifier | `default` |
| `ext-doi-field` | identifier | `default` |
| `ext-rrid-field` | identifier | `default` |
| `ext-pfas-field` | identifier | `default` |
| `ext-pubmed-field` | identifier | `default` |
| `ext-nih-grant-id-field` | identifier | `default` |
| `static-rich-text` | static | `content`, `width`, `height` |
| `static-image` | static | `content`, `width`, `height` |
| `static-youtube-video` | static | `content`, `width`, `height` |
| `static-section-break` | static | `content`, `width`, `height` |
| `static-page-break` | static | `content`, `width`, `height` |
