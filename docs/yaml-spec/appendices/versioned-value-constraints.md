# Versioned Value Constraints (Preview)

**Coming soon — not yet in production.** The forthcoming form of a controlled-term field's value
constraints adds the ability to pin a field to a specific vocabulary *version*. Nothing here is emitted
or accepted by the released tools yet; the current, production keys are on the
[Controlled Term Field](../field-types/controlled-term-field.md) page.

A controlled-term field draws its value from one of four source kinds — an entire ontology, a branch,
individual classes, or a value set. Each can be left unpinned, resolving against the latest version, or
pinned to one snapshot of its source by adding a `version`. The keys fall into two groups: `source*`
names the vocabulary the terms come from, and `term*` names the term or branch within it.

## Without a Version

`values` is a sequence. Each entry is distinguished by its `type`. An entry with no `version` — or an
explicit `version: latest` — is *unpinned*: at populate time it resolves against whatever version of its
source the terminology server currently serves. This is exactly how the current keys behave; they carry
no version at all.

Unpinned is convenient while authoring, but it is not reproducible. As the source ontology is revised, an
unpinned field's permitted terms — and their labels and place in the hierarchy — can change under an
already-published template without warning. A value someone picked last year may be renamed, moved, or
obsoleted this year. Pin a version when a published template must offer and resolve the same terms every
time.

### An Entire Ontology

Every term in a named ontology. Here a **Cell Type** field is bound to the whole Cell Ontology, so any
cell type is permitted.

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
- key: cell-type
  type: controlled-term-field
  name: Cell Type
  datatype: iri
  values:
  - type: ontology
    sourceSystem: bioportal
    sourceAcronym: CL
    sourceName: Cell Ontology
    sourceIri: http://purl.obolibrary.org/obo/cl
```

### A Branch of an Ontology

Every term at or below a chosen class. Here an **Organ** field is bound to the *organ* branch of Uberon,
so the value must be an organ.

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
- key: organ
  type: controlled-term-field
  name: Organ
  datatype: iri
  values:
  - type: branch
    sourceSystem: bioportal
    sourceAcronym: UBERON
    sourceName: Uber Anatomy Ontology
    sourceIri: http://purl.obolibrary.org/obo/uberon
    termBaseIri: http://purl.obolibrary.org/obo/UBERON_0000062
    termBaseLabel: organ
    termMaxDepth: 0
```

### Individual Classes

One or more specific terms, listed explicitly. Here an **Assay Type** field permits exactly three assay
classes from the Ontology for Biomedical Investigations.

A class entry has a single label in this dialect: `termLabel`, the ontology's preferred label. CEDAR also
keeps an author-facing display label, but it defaults to the preferred label and is not part of the
compact YAML.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `class` | The source is one term. |
| `sourceSystem` | string | The system that serves the source; absent means BioPortal. |
| `sourceAcronym` | string | The source's acronym, e.g. `OBI`. |
| `sourceIri` | IRI | The source ontology's canonical identity. |
| `termIri` | IRI | The term's identifier. |
| `termType` | `class` or `value` | Whether the term is an ontology class or a value-set value. |
| `termLabel` | string | The term's preferred label, e.g. histopathology assay. |

```yaml
- key: assay-type
  type: controlled-term-field
  name: Assay Type
  datatype: iri
  values:
  - type: class
    sourceSystem: bioportal
    sourceAcronym: OBI
    sourceIri: http://purl.obolibrary.org/obo/obi
    termIri: http://purl.obolibrary.org/obo/OBI_0002564
    termType: class
    termLabel: histopathology assay
  - type: class
    sourceSystem: bioportal
    sourceAcronym: OBI
    sourceIri: http://purl.obolibrary.org/obo/obi
    termIri: http://purl.obolibrary.org/obo/OBI_0000185
    termType: class
    termLabel: imaging assay
  - type: class
    sourceSystem: bioportal
    sourceAcronym: OBI
    sourceIri: http://purl.obolibrary.org/obo/obi
    termIri: http://purl.obolibrary.org/obo/OBI_0002119
    termType: class
    termLabel: microscopy assay
```

### A Value Set

Every term in a curated value set. Here an **Analyte Class** field is bound to the *Analyte class* value
set from HRAVS.

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `valueSet` | The source is a value set. |
| `sourceSystem` | string | The system that serves the value set; absent means BioPortal. |
| `sourceAcronym` | string | The value set's collection acronym, e.g. `HRAVS`. |
| `termBaseIri` | IRI | The value set's identifier. |
| `termBaseLabel` | string | The value set's name, e.g. Analyte class. |
| `termCount` | integer | Number of terms, when known. |

```yaml
- key: analyte-class
  type: controlled-term-field
  name: Analyte Class
  datatype: iri
  values:
  - type: valueSet
    sourceSystem: bioportal
    sourceAcronym: HRAVS
    termBaseIri: https://purl.humanatlas.io/vocab/hravs#HRAVS_1000371
    termBaseLabel: Analyte class
```

## With a Pinned Version

A published template should stay reproducible: the terms a field offers should not shift when the
underlying vocabulary is later updated. Adding a `version` to any of the four entries pins it to one
snapshot of its source. At populate time, terms then resolve against that snapshot rather than against
whatever is latest. Omitting `version` (or writing `version: latest`) tracks the latest version — the
unpinned behaviour.

A `version` names one snapshot. Its keys, in order:

| Key | Value | Meaning |
|-----|-------|---------|
| `id` | string | The snapshot's content hash — a hash of the extracted ontology. Unique *within* an ontology (snapshots are partitioned by ontology iri, so two ontologies can share a hash), so together with `sourceIri` — the ontology's canonical identity — it pins the constraint to one exact snapshot. |
| `effectiveDate` | date | When that snapshot was ingested or released. A human-facing label. |
| `declaredVersion` | string | The version string the source itself declared, when it has one. A human-facing label; not guaranteed unique. |

Only the content-hash `id` — read together with the ontology's `sourceIri` — pins reproducibly;
`effectiveDate` and `declaredVersion` are provenance labels for people to read. Each example shows one
`values` entry with a `version` added; the surrounding field is unchanged from its unpinned form.

### An Entire Ontology, Pinned

```yaml
- type: ontology
  sourceSystem: bioportal
  sourceAcronym: CL
  sourceName: Cell Ontology
  sourceIri: http://purl.obolibrary.org/obo/cl
  version:
    id: a1b2c3d4e5f6
    effectiveDate: 2026-06-15
    declaredVersion: 2026-06-15
```

### A Branch, Pinned

```yaml
- type: branch
  sourceSystem: bioportal
  sourceAcronym: UBERON
  sourceName: Uber Anatomy Ontology
  sourceIri: http://purl.obolibrary.org/obo/uberon
  termBaseIri: http://purl.obolibrary.org/obo/UBERON_0000062
  termBaseLabel: organ
  termMaxDepth: 0
  version:
    id: 7a8b9c0d1e2f
    effectiveDate: 2026-05-30
    declaredVersion: 2026-05-01
```

### Individual Classes, Pinned

Each class entry pins independently, so a field can mix terms from different versions if needed.

```yaml
- type: class
  sourceSystem: bioportal
  sourceAcronym: OBI
  sourceIri: http://purl.obolibrary.org/obo/obi
  termIri: http://purl.obolibrary.org/obo/OBI_0002564
  termType: class
  termLabel: histopathology assay
  version:
    id: 3c4d5e6f7a8b
    effectiveDate: 2026-04-20
    declaredVersion: 2026-04-20
```

### A Value Set, Pinned

```yaml
- type: valueSet
  sourceSystem: bioportal
  sourceAcronym: HRAVS
  termBaseIri: https://purl.humanatlas.io/vocab/hravs#HRAVS_1000371
  termBaseLabel: Analyte class
  version:
    id: 9e0f1a2b3c4d
    effectiveDate: 2026-03-10
    declaredVersion: "2.3"
```

## Coming from the Current Keys

For readers migrating from the production keys, the existing keys are renamed. The
`Applies to` column names which of the four constraint kinds — ontology, branch, class, value set — a
key applies to, and so disambiguates the current `iri` keys by what they identify. The ontology `iri`
(its backend URL, `uri` in JSON) has no preview key: it is reconstructed from the acronym rather than
stored.

| Current key | Preview key | Applies to |
|-------------|-------------|------------|
| `acronym` | `sourceAcronym` | all four |
| `ontologyName` | `sourceName` | ontology, branch |
| `iri` | `termIri` | class |
| `iri` | `termBaseIri` | branch, value set |
| `termLabel` | `termBaseLabel` | branch |
| `valueSetName` | `termBaseLabel` | value set |
| `maxDepth` | `termMaxDepth` | branch |
| `numTerms` | `termCount` | ontology, value set |

A class's `termLabel` keeps its name. Three keys are new, each applying to every constraint kind:

| New key | Meaning |
|---------|---------|
| `sourceSystem` | The system that serves the vocabulary; absent means BioPortal. |
| `sourceIri` | The canonical, source-independent ontology identity. |
| `version` | The pinned snapshot; omit to resolve against latest. |
