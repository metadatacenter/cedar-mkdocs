# Appendices

## Appendix A: Key index

Keys, in alphabetical order, with the chapter that defines each.

| Key | Defined in |
|-----|-----------|
| `acronym` | [Value Constraints](value-constraints.md) |
| `action` | [Value Constraints](value-constraints.md#actions) |
| `actions` | [Value Constraints](value-constraints.md#actions) |
| `altLabels` | [Fields: Core Structure](fields-core.md#semantic-labels) |
| `annotations` | [Annotations](annotations.md) |
| `children` | [Templates: Core Structure](templates-core.md), [Elements: Core Structure](elements-core.md), [Instances](instances.md) |
| `configuration` | [Fields: Core Structure](fields-core.md) |
| `content` | [Field Types](field-types.md#static-fields) |
| `continuePreviousLine` | [Fields: Core Structure](fields-core.md) |
| `createdBy` | [Provenance](provenance.md) |
| `createdOn` | [Provenance](provenance.md) |
| `datatype` | [Field Types](field-types.md), [Instances](instances.md) |
| `decimalPlaces` | [Field Types](field-types.md#numeric-fields) |
| `default` | [Field Types](field-types.md), [Value Constraints](value-constraints.md#default-value) |
| `derivedFrom` | [Versioning and Status](versioning.md) |
| `description` | [Core Artifact Structure](core-structure.md#descriptive-keys) |
| `footer` | [Templates: Core Structure](templates-core.md) |
| `granularity` | [Field Types](field-types.md#temporal-fields) |
| `header` | [Templates: Core Structure](templates-core.md) |
| `height` | [Fields: Core Structure](fields-core.md), [Field Types](field-types.md#static-fields) |
| `hidden` | [Fields: Core Structure](fields-core.md) |
| `id` | [Core Artifact Structure](core-structure.md#identity), [Instances](instances.md) |
| `identifier` | [Core Artifact Structure](core-structure.md#descriptive-keys) |
| `inputTimeFormat` | [Field Types](field-types.md#temporal-fields) |
| `inputTimeZone` | [Field Types](field-types.md#temporal-fields) |
| `instanceType` | [Templates: Core Structure](templates-core.md), [Elements: Core Structure](elements-core.md) |
| `iri` | [Value Constraints](value-constraints.md) |
| `isBasedOn` | [Instances](instances.md) |
| `key` | [Templates: Core Structure](templates-core.md), [Fields: Core Structure](fields-core.md) |
| `label` | [Field Types](field-types.md#choice-fields), [Value Constraints](value-constraints.md), [Instances](instances.md) |
| `language` | [Core Artifact Structure](core-structure.md#descriptive-keys), [Instances](instances.md) |
| `maxDepth` | [Value Constraints](value-constraints.md) |
| `maxItems` | [Fields: Core Structure](fields-core.md), [Elements: Core Structure](elements-core.md#element-configuration) |
| `maxLength` | [Field Types](field-types.md#text-fields) |
| `maxValue` | [Field Types](field-types.md#numeric-fields) |
| `minItems` | [Fields: Core Structure](fields-core.md), [Elements: Core Structure](elements-core.md#element-configuration) |
| `minLength` | [Field Types](field-types.md#text-fields) |
| `minValue` | [Field Types](field-types.md#numeric-fields) |
| `modelVersion` | [Versioning and Status](versioning.md) |
| `modifiedBy` | [Provenance](provenance.md) |
| `modifiedOn` | [Provenance](provenance.md) |
| `multiple` | [Fields: Core Structure](fields-core.md), [Elements: Core Structure](elements-core.md#element-configuration) |
| `name` | [Core Artifact Structure](core-structure.md#descriptive-keys) |
| `notation` | [Instances](instances.md#field-values) |
| `numTerms` | [Value Constraints](value-constraints.md) |
| `ontologyName` | [Value Constraints](value-constraints.md) |
| `overrideDescription` | [Fields: Core Structure](fields-core.md), [Elements: Core Structure](elements-core.md#element-configuration) |
| `overrideLabel` | [Fields: Core Structure](fields-core.md), [Elements: Core Structure](elements-core.md#element-configuration) |
| `prefLabel` | [Fields: Core Structure](fields-core.md#semantic-labels), [Instances](instances.md#field-values) |
| `previousVersion` | [Versioning and Status](versioning.md) |
| `propertyIri` | [Fields: Core Structure](fields-core.md), [Elements: Core Structure](elements-core.md#element-configuration) |
| `recommended` | [Fields: Core Structure](fields-core.md) |
| `regex` | [Field Types](field-types.md#text-fields) |
| `required` | [Fields: Core Structure](fields-core.md) |
| `sourceAcronym` | [Value Constraints](value-constraints.md#actions) |
| `sourceIri` | [Value Constraints](value-constraints.md#actions) |
| `status` | [Versioning and Status](versioning.md) |
| `termLabel` | [Value Constraints](value-constraints.md) |
| `termType` | [Value Constraints](value-constraints.md) |
| `termIri` | [Value Constraints](value-constraints.md#actions) |
| `to` | [Value Constraints](value-constraints.md#actions) |
| `type` | [Core Artifact Structure](core-structure.md#the-type-discriminator) |
| `unit` | [Field Types](field-types.md#numeric-fields) |
| `value` | [Value Constraints](value-constraints.md#default-value), [Instances](instances.md#field-values), [Annotations](annotations.md) |
| `valueSetName` | [Value Constraints](value-constraints.md) |
| `values` | [Field Types](field-types.md), [Value Constraints](value-constraints.md) |
| `version` | [Versioning and Status](versioning.md) |
| `width` | [Fields: Core Structure](fields-core.md), [Field Types](field-types.md#static-fields) |

## Appendix B: Controlled vocabularies

**Artifact and instance `type`**: `template`, `element`, `instance`, `element-instance`,
and the 25 field-type tokens.

**Field-type tokens**: `text-field`, `text-area-field`, `numeric-field`, `temporal-field`,
`controlled-term-field`, `radio-field`, `checkbox-field`, `single-select-list-field`,
`multi-select-list-field`, `link-field`, `ext-ror-field`, `ext-orcid-field`,
`ext-doi-field`, `ext-rrid-field`, `ext-pfas-field`, `ext-pubmed-field`,
`ext-nih-grant-id-field`, `phone-number-field`, `email-field`, `attribute-value-field`,
`static-rich-text`, `static-image`, `static-youtube-video`, `static-section-break`,
`static-page-break`.

**`status`**: `draft`, `published`.

**Numeric `datatype`**: `xsd:decimal`, `xsd:int`, `xsd:long`, `xsd:short`, `xsd:byte`,
`xsd:float`, `xsd:double`.

**Temporal `datatype`**: `xsd:date`, `xsd:time`, `xsd:dateTime`.

**`granularity`**: `year`, `month`, `day`, `hour`, `minute`, `second`, `decimalSecond`.

**`inputTimeFormat`**: `12h`, `24h`.

**Value-specification `type`**: `ontology`, `branch`, `class`, `valueSet`.

**`termType`**: `class`, `value`.

**`action`**: `delete`, `move`.

## Appendix C: Datatypes

CEDAR uses XSD datatypes, written with the `xsd:` prefix, to type numeric and temporal
values.

| Token | Datatype |
|-------|----------|
| `xsd:decimal` | Arbitrary-precision decimal number. |
| `xsd:int` | 32-bit integer. |
| `xsd:long` | 64-bit integer. |
| `xsd:short` | 16-bit integer. |
| `xsd:byte` | 8-bit integer. |
| `xsd:float` | Single-precision floating point. |
| `xsd:double` | Double-precision floating point. |
| `xsd:date` | Calendar date. |
| `xsd:time` | Time of day. |
| `xsd:dateTime` | Date and time. |

The token `iri` is used where a value is an IRI rather than a typed literal.

## Appendix D: Glossary

**Artifact** — a CEDAR template, element, field, or instance.

**Schema artifact** — an artifact that describes the shape of metadata: a template,
element, or field.

**Instance artifact** — an artifact that holds metadata: a template instance or element
instance.

**Template** — a complete metadata specification, built from elements and fields.

**Element** — a reusable, nestable group of elements and fields.

**Field** — an atomic unit that collects one value or a list of values.

**Instance** — filled-in metadata conforming to a template.

**Controlled term** — a value drawn from a controlled vocabulary, identified by an IRI.

**Value constraint** — a declaration of the terms a controlled-term field may take.

**Attribute-value field** — a field whose instance author supplies both the attribute names
and their values.

**Provenance** — the record of who created and modified an artifact, and when.

**Key** — for a nested child, the name identifying it within its parent and binding its
value in an instance.
