# Controlled Term Field

A controlled term field restricts its value to terms drawn from controlled vocabularies. In
YAML its `type` is `controlled-term-field` and its `datatype` is always `iri`, because a
controlled-term value is the IRI of a term.

The permitted terms are declared in a `values` sequence. Each entry names a source of terms,
and the four source kinds — an ontology, a branch of an ontology, individual classes, and a
value set — cover the ways a field can be bound to a vocabulary. `actions` refines the set,
and `default` names a starting term.

Each entry's keys fall into two groups: `source*` keys identify the *vocabulary* the terms are
drawn from, and `term*` keys identify the *member* within it. Every entry may also carry the
optional versioning keys described in [Pinned Versions](#pinned-versions).

## Value Specifications

`values` is a sequence. Each entry is distinguished by its `type`.

### An Entire Ontology

Every term in a named ontology. Here a **Cell Type** field is bound to the whole Cell
Ontology, so any cell type is permitted.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `ontology` | The source is a whole ontology. |
| `sourceAcronym` | string | The ontology's acronym — the handle used to resolve it. |
| `sourceName` | string | The ontology's name. |
| `sourceIri` | IRI | The ontology's canonical, cross-source identity. |
| `sourceUri` | IRI | The ontology's URL in the backend. |
| `termCount` | integer | Number of terms, when known. |

```yaml
- key: cell-type
  type: controlled-term-field
  name: Cell Type
  datatype: iri
  values:
  - type: ontology
    sourceAcronym: CL
    sourceName: Cell Ontology
    sourceIri: http://purl.obolibrary.org/obo/cl
    sourceUri: https://data.bioontology.org/ontologies/CL
```

### A Branch of an Ontology

Every term at or below a chosen class. Here an **Organ** field is bound to the *organ*
branch of Uberon, so the value must be an organ.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `branch` | The source is a branch rooted at a term. |
| `sourceAcronym` | string | The source ontology's acronym. |
| `sourceName` | string | The source ontology's name. |
| `sourceIri` | IRI | The source ontology's canonical, cross-source identity. |
| `termBaseIri` | IRI | The branch root term's identifier. |
| `termBaseLabel` | string | The branch root term's label. |
| `termMaxDepth` | integer | How many levels below the root to include; `0` for unlimited. |

```yaml
- key: organ
  type: controlled-term-field
  name: Organ
  datatype: iri
  values:
  - type: branch
    sourceAcronym: UBERON
    sourceName: Uber Anatomy Ontology
    sourceIri: http://purl.obolibrary.org/obo/uberon
    termBaseIri: http://purl.obolibrary.org/obo/UBERON_0000062
    termBaseLabel: organ
    termMaxDepth: 0
```

### Individual Classes

One or more specific terms, listed explicitly. Here an **Assay Type** field permits exactly
three assay classes from the Ontology for Biomedical Investigations.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `class` | The source is one term. |
| `sourceAcronym` | string | The source ontology's acronym. |
| `sourceIri` | IRI | The source ontology's canonical, cross-source identity. |
| `termIri` | IRI | The term's identifier. |
| `termType` | `class` or `value` | Whether the term is an ontology class or a value-set value. |
| `termLabel` | string | The term's preferred label. |
| `label` | string | The term's display label. |

```yaml
- key: assay-type
  type: controlled-term-field
  name: Assay Type
  datatype: iri
  values:
  - type: class
    sourceAcronym: OBI
    termIri: http://purl.obolibrary.org/obo/OBI_0002564
    termType: class
    termLabel: histopathology assay
    label: histopathology assay
  - type: class
    sourceAcronym: OBI
    termIri: http://purl.obolibrary.org/obo/OBI_0000185
    termType: class
    termLabel: imaging assay
    label: imaging assay
  - type: class
    sourceAcronym: OBI
    termIri: http://purl.obolibrary.org/obo/OBI_0002119
    termType: class
    termLabel: microscopy assay
    label: microscopy assay
```

### A Value Set

Every term in a curated value set. Here an **Analyte Class** field is bound to the *Analyte
class* value set from HRAVS.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `valueSet` | The source is a value set. |
| `sourceAcronym` | string | The value set's collection acronym. |
| `sourceIri` | IRI | The collection's canonical, cross-source identity. |
| `termBaseIri` | IRI | The value set's identifier. |
| `termBaseLabel` | string | The value set's name. |
| `termCount` | integer | Number of terms, when known. |

```yaml
- key: analyte-class
  type: controlled-term-field
  name: Analyte Class
  datatype: iri
  values:
  - type: valueSet
    sourceAcronym: HRAVS
    termBaseIri: https://purl.humanatlas.io/vocab/hravs#HRAVS_1000371
    termBaseLabel: Analyte class
```

### Pinned Versions

Every value entry may pin the exact vocabulary version its terms are drawn from, so a
published template reproduces its term state instead of drifting as the vocabulary changes.
Three optional keys apply to any of the four entry kinds:

| Key | Value | Meaning |
|-----|-------|---------|
| `sourceSystem` | string | The backend the vocabulary is served from. Absent ⇒ `bioportal`. |
| `sourceIri` | IRI | The vocabulary's canonical, source-independent identity. Absent ⇒ derived from the acronym. |
| `version` | `latest` or a triple | The pinned version. Absent, or the string `latest`, ⇒ the current version. |

When pinned, `version` is a triple: `id` (the vocabulary snapshot's content hash, required),
`effectiveDate` (the snapshot's release day), and `declaredVersion` (the source's self-declared
label). The last two are for display and may be absent.

```yaml
  values:
  - type: ontology
    sourceAcronym: DOID
    sourceName: Human Disease Ontology
    sourceIri: http://purl.obolibrary.org/obo/doid
    sourceUri: https://data.bioontology.org/ontologies/DOID
    version:
      id: 63ef56dff672b6a1d3f9f23201aae788bacac7f073b858e705b9a6624525dd8b
      effectiveDate: 2026-07-01
      declaredVersion: 2026-06-30
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
