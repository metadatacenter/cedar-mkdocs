# Controlled-Term Value Constraints

A `controlled-term-field` restricts its value to terms drawn from controlled vocabularies.
The permitted terms are declared in a `values` sequence; `actions` refine that set; and a
`default` names a starting term.

The field's `datatype` is always `iri`: a controlled-term value is the IRI of a term.

## Value specifications

`values` is a sequence. Each entry declares a source of permitted terms and is distinguished
by its `type`. The four types draw terms from progressively narrower sources.

### `ontology` — every term in an ontology

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `ontology` | Source is a whole ontology. |
| `acronym` | string | The ontology's acronym. |
| `ontologyName` | string | The ontology's name. |
| `iri` | IRI | The ontology's identifier. |
| `numTerms` | integer | Number of terms, when known. |

### `branch` — a subtree of an ontology

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `branch` | Source is a branch rooted at a term. |
| `ontologyName` | string | The source ontology's name. |
| `acronym` | string | The source ontology's acronym. |
| `termLabel` | string | The label of the branch's root term. |
| `iri` | IRI | The root term's identifier. |
| `maxDepth` | integer | How many levels below the root to include; `0` for unlimited. |

### `class` — a single term

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `class` | Source is one term. |
| `label` | string | The term's display label. |
| `acronym` | string | The source's acronym. |
| `termType` | `class` or `value` | Whether the term is an ontology class or a value-set value. |
| `termLabel` | string | The term's preferred label. |
| `iri` | IRI | The term's identifier. |

### `valueSet` — every term in a value set

| Key | Value | Meaning |
|-----|-------|---------|
| `type` | `valueSet` | Source is a value set. |
| `acronym` | string | The value set's collection acronym. |
| `valueSetName` | string | The value set's name. |
| `iri` | IRI | The value set's identifier. |
| `numTerms` | integer | Number of terms, when known. |

## Combining specifications

Several entries may appear together; the permitted values are their union.

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
  - type: class
    label: eyelid disease
    acronym: DOID
    termType: class
    termLabel: eyelid disease
    iri: http://purl.obolibrary.org/obo/DOID_530
```

## Actions

`actions` adjusts the term set drawn from the value specifications: it removes a term, or
moves one to a given position in the presented list. `actions` is a sequence.

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
    termIri: http://purl.org/datacite/v4.4/OtherTitle
    sourceIri: http://purl.org/datacite/v4.4/TitleType
    sourceAcronym: DATACITE-VOCAB
    type: class
```

## Default value

A controlled-term default names a term by IRI and its label.

| Key | Value | Meaning |
|-----|-------|---------|
| `value` | IRI | The default term's IRI. |
| `label` | string | The default term's label. |

```yaml
  default:
    value: http://purl.obolibrary.org/obo/DOID_530
    label: eyelid disease
```
