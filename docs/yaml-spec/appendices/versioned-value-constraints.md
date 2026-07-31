# Versioned Value Constraints (Preview)

**Coming soon — not yet in production.** This page previews the forthcoming form of a controlled-term
field's value constraints, which adds the ability to pin a field to a specific vocabulary *version*.
Until it ships, the [Controlled Term Field](../field-types/controlled-term-field.md) page describes the
current, production keys. Nothing here is emitted or accepted by the released tools yet.

The change is a renaming of the value-constraint keys into two clear groups — `source*` (which
vocabulary the terms come from) and `term*` (which term or branch within it) — plus a new optional
`version` that records the pinned snapshot. A constraint with no `version` resolves against the latest
available version, exactly as today.

## What Changed

| Current key | Preview key | Applies to |
|-------------|-------------|------------|
| `acronym` | `sourceAcronym` | all kinds |
| `ontologyName` | `sourceName` | ontology, branch |
| `iri` (of an ontology) | `sourceUri` | ontology |
| `iri` (of a class) | `termIri` | class |
| `iri` (of a branch root or value set) | `termBaseIri` | branch, value set |
| `termLabel` (of a branch root) | `termBaseLabel` | branch |
| `valueSetName` | `termBaseLabel` | value set |
| `maxDepth` | `termMaxDepth` | branch |
| `numTerms` | `termCount` | ontology, value set |
| *(unchanged)* | `termLabel` | class |
| *(new)* | `sourceSystem` | all kinds — the system that serves the vocabulary |
| *(new)* | `sourceIri` | all kinds — the canonical, source-independent ontology identity |
| *(new)* | `version` | all kinds — the pinned snapshot; omit for latest |

## Without a Version

With no `version`, each entry resolves against the latest available version of its source — the same
behaviour as the current keys. The four source kinds (an entire ontology, a branch, individual classes,
and a value set) appear here as one `values` sequence.

```yaml
values:
- type: ontology
  sourceSystem: bioportal
  sourceAcronym: CL
  sourceName: Cell Ontology
  sourceIri: http://purl.obolibrary.org/obo/cl
  sourceUri: https://data.bioontology.org/ontologies/CL
- type: branch
  sourceSystem: bioportal
  sourceAcronym: UBERON
  sourceName: Uber Anatomy Ontology
  sourceIri: http://purl.obolibrary.org/obo/uberon
  termBaseIri: http://purl.obolibrary.org/obo/UBERON_0000062
  termBaseLabel: organ
  termMaxDepth: 0
- type: class
  sourceSystem: bioportal
  sourceAcronym: OBI
  sourceIri: http://purl.obolibrary.org/obo/obi
  termIri: http://purl.obolibrary.org/obo/OBI_0002564
  termType: class
  termLabel: histopathology assay
  label: histopathology assay
- type: valueSet
  sourceSystem: bioportal
  sourceAcronym: HRAVS
  termBaseIri: https://purl.humanatlas.io/vocab/hravs#HRAVS_1000371
  termBaseLabel: Analyte class
```

## With a Pinned Version

The same four entries, each pinned to a specific snapshot by adding a `version`. The pin is what makes a
published template reproducible: terms resolve against the named snapshot, not against whatever is latest
at fill time.

```yaml
values:
- type: ontology
  sourceSystem: bioportal
  sourceAcronym: CL
  sourceName: Cell Ontology
  sourceIri: http://purl.obolibrary.org/obo/cl
  sourceUri: https://data.bioontology.org/ontologies/CL
  version:
    id: a1b2c3d4e5f6
    effectiveDate: 2026-06-15
    declaredVersion: 2026-06-15
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
- type: class
  sourceSystem: bioportal
  sourceAcronym: OBI
  sourceIri: http://purl.obolibrary.org/obo/obi
  termIri: http://purl.obolibrary.org/obo/OBI_0002564
  termType: class
  termLabel: histopathology assay
  label: histopathology assay
  version:
    id: 3c4d5e6f7a8b
    effectiveDate: 2026-04-20
    declaredVersion: 2026-04-20
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

## The version Block

A `version` names one snapshot of a source. Its keys, in order:

| Key | Value | Meaning |
|-----|-------|---------|
| `id` | string | The snapshot's content-hash identity — a hash of the extracted ontology. This is what actually pins the constraint; it names one exact snapshot. |
| `effectiveDate` | date | When that snapshot was ingested or released. A human-facing label. |
| `declaredVersion` | string | The version string the source itself declared, when it has one. A human-facing label; not guaranteed unique. |

Writing `version: latest` (or omitting `version`) means resolve against the latest available version,
the current default. Only the content-hash `id` pins reproducibly; `effectiveDate` and `declaredVersion`
are provenance labels for people to read.
