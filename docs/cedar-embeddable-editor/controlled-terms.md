# Controlled Terms and External Authorities

CEDAR templates can require identifiers instead of unconstrained text:

- a [controlled-term field](../yaml-spec/field-types/controlled-term-field.md)
  selects a class from an ontology or value set; and
- an [external-authority field](../yaml-spec/field-types/external-authority-fields.md)
  selects a record from a registry such as ORCID or ROR.

Both store a resolvable identifier together with a human-readable label. Their
lookups are the only form controls that depend on CEDAR network services.

## Controlled-Term Fields

A template may combine four kinds of value constraint:

| Constraint | Permitted values |
|---|---|
| Ontology | Any class in the named ontology. |
| Branch | Any class below the named root class. |
| Class | One specified class. |
| Value set | Any member of the named value set. |

As the user types, the CEE sends the text and the template constraint to CEDAR's
integrated-search endpoint. Selecting a result stores the term.

### Configure Terminology Lookup

```json
{
  "terminologyBaseUrl": "https://terminology.metadatacenter.org/"
}
```

The base URL must end in `/`. The CEE appends
`bioportal/integrated-search`; do not include that route in the setting.

There is no default endpoint. If the setting is absent, controlled-term fields
return no suggestions and the CEE reports the missing key once. Other fields
continue to work.

### Stored Value

The instance records both the IRI and label:

```json
"disease": {
  "@id": "http://purl.obolibrary.org/obo/DOID_10652",
  "rdfs:label": "Alzheimer's disease"
}
```

The selected value also links to its BioPortal page in the interface.

A controlled-term field does not accept free text. If the user leaves an
unresolved value, the CEE clears it or restores the previous valid term and
displays an explanation.

## External Authorities

The CEE supports seven authority field types:

| Authority | Identifies | Search input |
|---|---|---|
| ORCID | Researcher | Name or ORCID |
| ROR | Institution | Name or ROR |
| DOI | Publication or dataset | Title or DOI |
| PubMed | Publication | Title or PubMed ID |
| RRID | Research resource | Name or RRID |
| NIH Grant | Grant | Grant details or NIH grant ID |
| PFAS | Chemical | Name or PFAS identifier |

Each field offers suggestions and stores the selected record's persistent
identifier. Unresolved text is handled in the same way as a controlled-term
field.

### Configure the Bridge

```json
{
  "bridgeBaseUrl": "https://bridge.metadatacenter.org/"
}
```

This base URL must also end in `/` and has no default. The CEE appends the
authority-specific route:

| Authority | Search route | Details route |
|---|---|---|
| ORCID | `ext-auth/orcid/search-by-name` | `ext-auth/orcid` |
| ROR | `ext-auth/ror/search-by-name` | `ext-auth/ror` |
| DOI | `ext-auth/doi/search-by-name` | `ext-auth/doi` |
| PubMed | `ext-auth/pmid/search-by-name` | `ext-auth/pmid` |
| RRID | `ext-auth/rrid/search-by-name` | `ext-auth/rrid` |
| NIH Grant | `ext-auth/nih-grant/search-by-name` | `ext-auth/nih-grant` |
| PFAS | `ext-auth/comp-tox/search-by-name` | `ext-auth/comp-tox` |

## Service Failures

The CEE distinguishes a failed request from an empty result. A failed request is
shown as an unavailable search so the user knows to try again later. Other parts
of the form remain usable.

## Validation Boundary

Local validation checks that a controlled value has a well-formed `@id` and a
matching `rdfs:label`. It does not verify that an existing value still belongs to
the ontology, branch, class, or value set declared by the template; that would
require a terminology-service request.

See [Validation and the Data Quality Report](validation.md) for the complete list
of local checks.
