# Controlled Term Field

> **Coming soon — a controlled-term field's value-constraint representation will change.** To support
> pinning a field to a specific vocabulary version, the way a field's permitted terms are declared will
> be revised. The current, production form still applies; the forthcoming, version-aware form is
> documented in [Versioned Value Constraints (Preview)](../appendices/versioned-value-constraints.md).

A controlled term field restricts its value to terms drawn from controlled vocabularies. In
YAML its `type` is `controlled-term-field` and its `datatype` is always `iri`, because a
controlled-term value is the IRI of a term.

The permitted terms are declared in a `values` sequence, which `actions` can refine and
`default` can seed with a starting term.

## Value Specifications

`values` is a sequence of entries, each naming one source of terms. An entry's `type` selects one of the
four source kinds — an entire ontology, a branch of an ontology, individual classes, or a value set — and
the remaining keys it takes depend on that `type`.

### An Entire Ontology

Every term in a named ontology. Here a **Cell Type** field is bound to the whole Cell
Ontology, so any cell type is permitted.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `ontology` | The source is a whole ontology. |
| `acronym` | string | The ontology's acronym, e.g. `CL`. |
| `ontologyName` | string | The ontology's name, e.g. Cell Ontology. |
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
| `ontologyName` | string | The source ontology's name, e.g. Uber Anatomy Ontology. |
| `acronym` | string | The source ontology's acronym, e.g. `UBERON`. |
| `termLabel` | string | The label of the branch's root term, e.g. organ. |
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
| `label` | string | The term's display label, e.g. histopathology assay. |
| `acronym` | string | The source's acronym, e.g. `OBI`. |
| `termType` | `class` or `value` | Whether the term is an ontology class or a value-set value. |
| `termLabel` | string | The term's preferred label, e.g. histopathology assay. |
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
| `acronym` | string | The value set's collection acronym, e.g. `HRAVS`. |
| `valueSetName` | string | The value set's name, e.g. Analyte class. |
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

A `values` list may hold several entries, and the four source kinds mix freely — an ontology, a
branch, individual classes, and a value set can all appear in one field. The permitted terms are the
**union** of what each entry contributes: an ontology entry yields all its terms, a branch its
subtree, a value set its members, and a `class` its single term, and those results merge into one
pick-list. Each entry is evaluated independently, so a term reached through two entries still appears
once.

Combining is how you assemble a value set no single source offers — for example every cell type from
one ontology plus a couple of named anatomical structures from another. The order of the entries sets
the initial order of the merged list, which [`actions`](#actions) can then refine.

```yaml
- key: sample-type
  type: controlled-term-field
  name: Sample Type
  datatype: iri
  values:
  - type: ontology
    acronym: CL
    ontologyName: Cell Ontology
    iri: https://data.bioontology.org/ontologies/CL
  - type: class
    label: blood
    acronym: UBERON
    termType: class
    termLabel: blood
    iri: http://purl.obolibrary.org/obo/UBERON_0000178
  - type: class
    label: bone tissue
    acronym: UBERON
    termType: class
    termLabel: bone tissue
    iri: http://purl.obolibrary.org/obo/UBERON_0002481
```

Here a **Sample Type** field permits any cell type (all of the Cell Ontology) plus the two named
UBERON classes *blood* and *bone tissue* — a single merged list of choices.

## Actions

The value specifications above are aggregated first — their union, per [Combining
Specifications](#combining-specifications). `actions` then refines that combined set: an action
removes a term, or moves one to a given position in the presented list. `actions` is a field-level
sequence, a sibling of `values`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `action` | `delete` or `move` | required | Remove the term, or reposition it. |
| `to` | integer | conditional | Target position for `move` — an index into the merged list across all value specifications, not within one source. |
| `termIri` | IRI | required | The affected term. |
| `sourceIri` | IRI | optional | The term's source. |
| `sourceAcronym` | string | required | The source's acronym. |
| `type` | `class` or `value` | required | Whether the term is a class or a value-set value. |

Because a `move` targets a position in the merged, cross-source list, `actions` lives at the field
level rather than under any one `values` entry; each action names its own term and source, so it
stands alone. Shown alongside `values` on an **Assay** field bound to the OBI *assay* branch, minus
one class:

```yaml
- key: assay
  type: controlled-term-field
  name: Assay
  datatype: iri
  values:
  - type: branch
    ontologyName: Ontology for Biomedical Investigations
    acronym: OBI
    termLabel: assay
    iri: http://purl.obolibrary.org/obo/OBI_0000070
    maxDepth: 0
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
