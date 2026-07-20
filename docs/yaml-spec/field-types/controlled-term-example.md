# Example: A Controlled-Term Template

This template ties the field types together in one artifact. It describes a tissue sample
with two plain text identifiers and four controlled-term fields, one for each kind of value
specification: a branch (Organ), individual classes (Assay Type), a value set (Analyte
Class), and an entire ontology (Cell Type).

```yaml
type: template
name: Tissue Sample
children:
- key: sample-id
  type: text-field
  name: Sample ID
- key: lab-id
  type: text-field
  name: Lab ID
- key: organ
  type: controlled-term-field
  name: Organ
  datatype: iri
  values:
  - type: branch
    ontologyName: Uber Anatomy Ontology
    acronym: UBERON
    termLabel: organ
    iri: http://purl.obolibrary.org/obo/UBERON_0000062
    maxDepth: 0
- key: assay-type
  type: controlled-term-field
  name: Assay Type
  datatype: iri
  values:
  - type: class
    label: histopathology assay
    acronym: OBI
    termType: class
    termLabel: histopathology assay
    iri: http://purl.obolibrary.org/obo/OBI_0002564
  - type: class
    label: imaging assay
    acronym: OBI
    termType: class
    termLabel: imaging assay
    iri: http://purl.obolibrary.org/obo/OBI_0000185
  - type: class
    label: microscopy assay
    acronym: OBI
    termType: class
    termLabel: microscopy assay
    iri: http://purl.obolibrary.org/obo/OBI_0002119
- key: analyte-class
  type: controlled-term-field
  name: Analyte Class
  datatype: iri
  values:
  - type: valueSet
    acronym: HRAVS
    valueSetName: Analyte class
    iri: https://purl.humanatlas.io/vocab/hravs#HRAVS_1000371
- key: cell-type
  type: controlled-term-field
  name: Cell Type
  datatype: iri
  values:
  - type: ontology
    acronym: CL
    ontologyName: Cell Ontology
    iri: https://data.bioontology.org/ontologies/CL
```
