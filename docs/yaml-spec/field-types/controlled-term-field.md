# Controlled Term Field

A controlled term field restricts its value to terms drawn from controlled vocabularies. In
YAML its `type` is `controlled-term-field` and its `datatype` is always `iri`, because a
controlled-term value is the IRI of a term.

The permitted terms are declared in a `values` sequence. Each entry names a source of terms,
and the four source kinds — an ontology, a branch of an ontology, individual classes, and a
value set — cover the ways a field can be bound to a vocabulary. `actions` refines the set,
and `default` names a starting term.

## Value Specifications

`values` is a sequence. Each entry is distinguished by its `type`.

### An Entire Ontology

Every term in a named ontology. Here a **Cell Type** field is bound to the whole Cell
Ontology, so any cell type is permitted.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `ontology` | The source is a whole ontology. |
| `acronym` | string | The ontology's acronym. |
| `ontologyName` | string | The ontology's name. |
| `iri` | IRI | The ontology's identifier. |
| `numTerms` | integer | Number of terms, when known. |

```yaml
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

### A Branch of an Ontology

Every term at or below a chosen class. Here an **Organ** field is bound to the *organ*
branch of Uberon, so the value must be an organ.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `branch` | The source is a branch rooted at a term. |
| `ontologyName` | string | The source ontology's name. |
| `acronym` | string | The source ontology's acronym. |
| `termLabel` | string | The label of the branch's root term. |
| `iri` | IRI | The root term's identifier. |
| `maxDepth` | integer | How many levels below the root to include; `0` for unlimited. |

```yaml
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
```

### Individual Classes

One or more specific terms, listed explicitly. Here an **Assay Type** field permits exactly
three assay classes from the Ontology for Biomedical Investigations.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `class` | The source is one term. |
| `label` | string | The term's display label. |
| `acronym` | string | The source's acronym. |
| `termType` | `class` or `value` | Whether the term is an ontology class or a value-set value. |
| `termLabel` | string | The term's preferred label. |
| `iri` | IRI | The term's identifier. |

```yaml
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
```

### A Value Set

Every term in a curated value set. Here an **Analyte Class** field is bound to the *Analyte
class* value set from HRAVS.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `valueSet` | The source is a value set. |
| `acronym` | string | The value set's collection acronym. |
| `valueSetName` | string | The value set's name. |
| `iri` | IRI | The value set's identifier. |
| `numTerms` | integer | Number of terms, when known. |

```yaml
- key: analyte-class
  type: controlled-term-field
  name: Analyte Class
  datatype: iri
  values:
  - type: valueSet
    acronym: HRAVS
    valueSetName: Analyte class
    iri: https://purl.humanatlas.io/vocab/hravs#HRAVS_1000371
```

## Combining Specifications

Several entries may appear together; the permitted values are their union. A field could, for
example, allow every term in one ontology plus a handful of named classes from another.

## Actions

`actions` adjusts the term set drawn from the value specifications. An action removes a term,
or moves one to a given position in the presented list. `actions` is a sequence.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `action` | `delete` or `move` | required | Remove the term, or reposition it. |
| `to` | integer | conditional | Target position, for `move`. |
| `termIri` | IRI | required | The affected term. |
| `sourceIri` | IRI | optional | The term's source. |
| `sourceAcronym` | string | required | The source's acronym. |
| `type` | `class` or `value` | required | Whether the term is a class or a value-set value. |

```yaml
  actions:
  - action: delete
    termIri: http://purl.obolibrary.org/obo/OBI_0000185
    sourceIri: https://data.bioontology.org/ontologies/OBI
    sourceAcronym: OBI
    type: class
```

## Default Value

A controlled-term default names a term by IRI and its label.

| Key | Value | Meaning |
|-----|-------|---------|
| `value` | IRI | The default term's IRI. |
| `label` | string | The default term's label. |

```yaml
  default:
    value: http://purl.obolibrary.org/obo/UBERON_0002107
    label: liver
```
