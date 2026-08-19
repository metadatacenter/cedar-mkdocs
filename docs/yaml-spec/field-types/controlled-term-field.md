# Controlled Term Field

A controlled term field restricts its value to terms drawn from controlled vocabularies. In
YAML its `type` is `controlled-term-field` and its `datatype` is always `iri`, because a
controlled-term value is the IRI of a term.

The permitted terms are declared in a `values` sequence, which `actions` can refine and
`default` can seed with a starting term.

## Value Specifications

`values` is a sequence of entries, each naming one source of terms. An entry's `type` selects one of the
four source kinds — an entire ontology, a branch of an ontology, individual classes, or a value set — and
the remaining keys it takes depend on that `type`. Within an entry the keys fall into two groups:
`source*` names the vocabulary the terms come from, and `term*` names the term or branch within it.

Each entry can be left unpinned, resolving against the latest version of its source, or pinned to one
exact snapshot by adding a `version`, described under [Pinning a Version](#pinning-a-version).

### An Entire Ontology

Every term in a named ontology. Here a **Cell Type** field is bound to the whole Cell
Ontology, so any cell type is permitted.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `ontology` | The source is a whole ontology. |
| `sourceSystem` | string | The system that serves the ontology; absent means BioPortal. |
| `sourceAcronym` | string | The ontology's acronym, e.g. `CL`. |
| `sourceName` | string | The ontology's name, e.g. Cell Ontology. |
| `sourceIri` | IRI | The ontology's canonical, source-independent identity. |
| `termCount` | integer | Number of terms, when known. |

The ontology's backend address is not an authored key: it is reconstructed from the acronym —
`https://data.bioontology.org/ontologies/{sourceAcronym}` for BioPortal — when the constraint is
converted to a CEDAR JSON Schema.

```yaml
- key: "cell-type"
  type: controlled-term-field
  name: "Cell Type"
  datatype: iri
  values:
  - type: ontology
    sourceSystem: "bioportal"
    sourceAcronym: "CL"
    sourceName: "Cell Ontology"
    sourceIri: "http://purl.obolibrary.org/obo/cl"
```

### A Branch of an Ontology

Every term at or below a chosen class. Here an **Organ** field is bound to the *organ*
branch of Uberon, so the value must be an organ.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `branch` | The source is a branch rooted at a term. |
| `sourceSystem` | string | The system that serves the ontology; absent means BioPortal. |
| `sourceAcronym` | string | The source ontology's acronym, e.g. `UBERON`. |
| `sourceName` | string | The source ontology's name, e.g. Uber Anatomy Ontology. |
| `sourceIri` | IRI | The source ontology's canonical identity. |
| `termBaseIri` | IRI | The branch root term's identifier. |
| `termBaseLabel` | string | The branch root term's label, e.g. organ. |
| `termMaxDepth` | integer | How many levels below the root to include; `0` for unlimited. |

```yaml
- key: "organ"
  type: controlled-term-field
  name: "Organ"
  datatype: iri
  values:
  - type: branch
    sourceSystem: "bioportal"
    sourceAcronym: "UBERON"
    sourceName: "Uber Anatomy Ontology"
    sourceIri: "http://purl.obolibrary.org/obo/uberon"
    termBaseIri: "http://purl.obolibrary.org/obo/UBERON_0000062"
    termBaseLabel: "organ"
    termMaxDepth: 0
```

### Individual Classes

One or more specific terms, listed explicitly. Here an **Assay Type** field permits exactly
three assay classes from the Ontology for Biomedical Investigations.

A class entry carries two labels, and usually writes one. `termLabel` is what the ontology calls the
term. `termDisplayLabel` is what this field calls it in this form, for an author who wants wording of
their own; it is written only where the two differ, and a class without one is shown under its preferred
label.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `class` | The source is one term. |
| `sourceSystem` | string | The system that serves the source; absent means BioPortal. |
| `sourceAcronym` | string | The source's acronym, e.g. `OBI`. |
| `sourceIri` | IRI | The source ontology's canonical identity. |
| `termIri` | IRI | The term's identifier. |
| `termType` | `class` or `value` | Whether the term is an ontology class or a value-set value. |
| `termLabel` | string | The term's preferred label in its ontology, e.g. histopathology assay. |
| `termDisplayLabel` | string | What this field calls the term instead; omitted when it matches `termLabel`. |

```yaml
- key: "assay-type"
  type: controlled-term-field
  name: "Assay Type"
  datatype: iri
  values:
  - type: class
    sourceSystem: "bioportal"
    sourceAcronym: "OBI"
    sourceIri: "http://purl.obolibrary.org/obo/obi"
    termIri: "http://purl.obolibrary.org/obo/OBI_0002564"
    termType: class
    termLabel: "histopathology assay"
  - type: class
    sourceSystem: "bioportal"
    sourceAcronym: "OBI"
    sourceIri: "http://purl.obolibrary.org/obo/obi"
    termIri: "http://purl.obolibrary.org/obo/OBI_0000185"
    termType: class
    termLabel: "imaging assay"
  - type: class
    sourceSystem: "bioportal"
    sourceAcronym: "OBI"
    sourceIri: "http://purl.obolibrary.org/obo/obi"
    termIri: "http://purl.obolibrary.org/obo/OBI_0002119"
    termType: class
    termLabel: "microscopy assay"
```

Here the same field renames one of its terms for the people filling it in, while the term itself is
unchanged:

```yaml
  - type: class
    sourceAcronym: "OBI"
    termIri: "http://purl.obolibrary.org/obo/OBI_0002564"
    termType: class
    termLabel: "histopathology assay"
    termDisplayLabel: "Histopathology"
```

### A Value Set

Every term in a curated value set. Here an **Analyte Class** field is bound to the *Analyte
class* value set from HRAVS.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `valueSet` | The source is a value set. |
| `sourceSystem` | string | The system that serves the value set; absent means BioPortal. |
| `sourceAcronym` | string | The value set's collection acronym, e.g. `HRAVS`. |
| `termBaseIri` | IRI | The value set's identifier. |
| `termBaseLabel` | string | The value set's name, e.g. Analyte class. |
| `termCount` | integer | Number of terms, when known. |

```yaml
- key: "analyte-class"
  type: controlled-term-field
  name: "Analyte Class"
  datatype: iri
  values:
  - type: valueSet
    sourceSystem: "bioportal"
    sourceAcronym: "HRAVS"
    termBaseIri: "https://purl.humanatlas.io/vocab/hravs#HRAVS_1000371"
    termBaseLabel: "Analyte class"
```

## Pinning a Version

A published template should stay reproducible: the terms a field offers should not shift when the
underlying vocabulary is later updated. An entry with no `version` — or an explicit `version: latest` —
is *unpinned*, and at populate time it resolves against whatever version of its source the terminology
server currently serves. That is convenient while authoring and is how a field behaves unless you say
otherwise, but it is not reproducible: as the source ontology is revised, an unpinned field's permitted
terms, their labels, and their place in the hierarchy can change under an already-published template. A
value someone picked last year may be renamed, moved, or obsoleted this year.

Adding a `version` to any of the four entries pins it to one snapshot of its source, and terms then
resolve against that snapshot. A `version` names one snapshot with these keys, in order:

| Key | Value | Meaning |
|-----|-------|---------|
| `id` | string | The snapshot's content hash — a hash of the extracted ontology. Unique *within* an ontology (snapshots are partitioned by ontology iri, so two ontologies can share a hash), so together with `sourceIri` — the ontology's canonical identity — it pins the constraint to one exact snapshot. |
| `effectiveDate` | date | When that snapshot was ingested or released. A human-facing label. |
| `declaredVersion` | string | The version string the source itself declared, when it has one. A human-facing label; not guaranteed unique. |

Only the content-hash `id` — read together with the ontology's `sourceIri` — pins reproducibly;
`effectiveDate` and `declaredVersion` are provenance labels for people to read. Each example below shows
one `values` entry with a `version` added; the surrounding field is unchanged from its unpinned form.

### An Entire Ontology, Pinned

```yaml
- type: ontology
  sourceSystem: "bioportal"
  sourceAcronym: "CL"
  sourceName: "Cell Ontology"
  sourceIri: "http://purl.obolibrary.org/obo/cl"
  version:
    id: "a1b2c3d4e5f6"
    effectiveDate: "2026-06-15"
    declaredVersion: "2026-06-15"
```

### A Branch, Pinned

```yaml
- type: branch
  sourceSystem: "bioportal"
  sourceAcronym: "UBERON"
  sourceName: "Uber Anatomy Ontology"
  sourceIri: "http://purl.obolibrary.org/obo/uberon"
  termBaseIri: "http://purl.obolibrary.org/obo/UBERON_0000062"
  termBaseLabel: "organ"
  termMaxDepth: 0
  version:
    id: "7a8b9c0d1e2f"
    effectiveDate: "2026-05-30"
    declaredVersion: "2026-05-01"
```

### Individual Classes, Pinned

Each class entry pins independently, so a field can mix terms from different versions if needed.

```yaml
- type: class
  sourceSystem: "bioportal"
  sourceAcronym: "OBI"
  sourceIri: "http://purl.obolibrary.org/obo/obi"
  termIri: "http://purl.obolibrary.org/obo/OBI_0002564"
  termType: class
  termLabel: "histopathology assay"
  version:
    id: "3c4d5e6f7a8b"
    effectiveDate: "2026-04-20"
    declaredVersion: "2026-04-20"
```

### A Value Set, Pinned

```yaml
- type: valueSet
  sourceSystem: "bioportal"
  sourceAcronym: "HRAVS"
  termBaseIri: "https://purl.humanatlas.io/vocab/hravs#HRAVS_1000371"
  termBaseLabel: "Analyte class"
  version:
    id: "9e0f1a2b3c4d"
    effectiveDate: "2026-03-10"
    declaredVersion: "2.3"
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
- key: "sample-type"
  type: controlled-term-field
  name: "Sample Type"
  datatype: iri
  values:
  - type: ontology
    sourceAcronym: "CL"
    sourceName: "Cell Ontology"
    sourceIri: "http://purl.obolibrary.org/obo/cl"
  - type: class
    sourceAcronym: "UBERON"
    termIri: "http://purl.obolibrary.org/obo/UBERON_0000178"
    termType: class
    termLabel: "blood"
  - type: class
    sourceAcronym: "UBERON"
    termIri: "http://purl.obolibrary.org/obo/UBERON_0002481"
    termType: class
    termLabel: "bone tissue"
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
- key: "assay"
  type: controlled-term-field
  name: "Assay"
  datatype: iri
  values:
  - type: branch
    sourceAcronym: "OBI"
    sourceName: "Ontology for Biomedical Investigations"
    termBaseIri: "http://purl.obolibrary.org/obo/OBI_0000070"
    termBaseLabel: "assay"
    termMaxDepth: 0
  actions:
  - action: delete
    termIri: "http://purl.obolibrary.org/obo/OBI_0000185"
    sourceIri: "https://data.bioontology.org/ontologies/OBI"
    sourceAcronym: "OBI"
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
    value: "http://purl.obolibrary.org/obo/UBERON_0002107"
    label: "liver"
```

## Coming from the Older Keys

An earlier form of these entries used a different set of keys, and CEDAR no longer reads it: a document
written that way is refused rather than silently misread. The `Applies to` column names which of the four
source kinds a key applies to, and so disambiguates the older `iri` keys by what each identified. The
ontology `iri` — its backend address — has no key here at all: it is reconstructed from the acronym.

| Older key | Key | Applies to |
|-------------|-------------|------------|
| `acronym` | `sourceAcronym` | all four |
| `ontologyName` | `sourceName` | ontology, branch |
| `iri` | `termIri` | class |
| `iri` | `termBaseIri` | branch, value set |
| `termLabel` | `termBaseLabel` | branch |
| `valueSetName` | `termBaseLabel` | value set |
| `maxDepth` | `termMaxDepth` | branch |
| `numTerms` | `termCount` | ontology, value set |

A class's `termLabel` keeps its name, and the display label it carried as `label` is now
`termDisplayLabel`, written only where it differs from the preferred label. Three further keys are new,
each applying to every source kind: `sourceSystem`, `sourceIri`, and `version`.
