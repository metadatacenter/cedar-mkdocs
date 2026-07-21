# Worked Examples

These examples put the pieces together. Each is complete.

## A Template and a Conforming Instance

A template with three fields — a required text field, a numeric field, and a controlled-term
field:

```yaml
type: template
name: Study
description: A clinical study
children:
- key: study-name
  type: text-field
  name: Study Name
  configuration:
    required: true
- key: participants
  type: numeric-field
  name: Participants
  datatype: xsd:int
  minValue: 0
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

An instance of it:

```yaml
type: instance
name: SDY232
isBasedOn: https://repo.metadatacenter.org/templates/ec3f500
children:
  Study Name:
    value: Cardiology cohort
  Participants:
    value: 2323
    datatype: xsd:int
  Disease:
    id: http://purl.obolibrary.org/obo/DOID_114
    label: heart disease
```

## A Repeating, Nested Element

A template whose one child is an element that may occur up to four times, each holding two
fields:

```yaml
type: template
name: Contact Record
children:
- key: contact
  type: element
  name: Contact
  configuration:
    multiple: true
    minItems: 0
    maxItems: 4
  children:
  - key: name
    type: text-field
    name: Name
  - key: email
    type: email-field
    name: Email
```

The corresponding instance supplies two occurrences:

```yaml
type: instance
name: Project contacts
isBasedOn: https://repo.metadatacenter.org/templates/1a2b3c
children:
  Contact:
  - children:
      Name:
        value: Dr Bob
      Email:
        value: bob@example.edu
  - children:
      Name:
        value: Dr Joe
      Email:
        value: joe@example.edu
```

## Controlled Terms with an Attribute-Value Field

A template combining a controlled-term field with an attribute-value field for
author-supplied extras:

```yaml
type: template
name: Specimen
children:
- key: preservation
  type: controlled-term-field
  name: Preservation Medium
  datatype: iri
  values:
  - type: branch
    ontologyName: Uber-anatomy Ontology
    acronym: UBERON
    termLabel: material entity
    iri: http://purl.obolibrary.org/obo/UBERON_0000465
    maxDepth: 0
- key: extras
  type: attribute-value-field
  name: Additional Characteristics
```

An instance filling both:

```yaml
type: instance
name: Specimen 9OLC
isBasedOn: https://repo.metadatacenter.org/templates/9d8e7f
children:
  Preservation Medium:
    id: http://purl.obolibrary.org/obo/UBERON_0000479
    label: tissue
  Additional Characteristics:
    Collection Site:
      value: Left lobe
    Ischemic Time:
      value: "12"
```
