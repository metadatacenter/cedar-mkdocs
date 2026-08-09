# Controlled Terms and External Authorities

Two kinds of field in a CEDAR template collect an identifier rather than a string. A
[controlled-term field](../yaml-spec/field-types/controlled-term-field.md) draws its value from an
ontology or a value set. An
[external-authority field](../yaml-spec/field-types/external-authority-fields.md) draws it from a
registry such as ORCID or ROR. Both turn what the user types into a lookup, and both store a
resolvable identifier alongside a human-readable label.

These two field kinds are the only parts of the CEE that reach the network. One configured URL
each is all they need.

## Controlled-Term Fields

A template constrains a controlled-term field in one of
[four ways](../yaml-spec/field-types/controlled-term-field.md#value-specifications), and a field can
combine them:

| Constraint | Allows |
|---|---|
| Ontology | Any class in the named ontology. |
| Branch | Any class beneath a named class, so "any disease" rather than "any DOID class". |
| Class | One specific class, named outright. |
| Value set | Any member of a named value set. |

The constraint lives in the template rather than in the configuration. As the user types, the CEE
sends the typed text and the constraint together to CEDAR's integrated-search endpoint, which
searches the permitted terms and returns the matches. Choosing a suggestion stores the term.

### Configuring the Lookup

One key enables the lookup:

```json
{
  "terminologyIntegratedSearchUrl":
    "https://terminology.metadatacenter.org/bioportal/integrated-search"
}
```

That URL is CEDAR's production terminology service, and it serves most applications. An
organization running its own CEDAR deployment points the key at that deployment's terminology
service instead.

Left unset, the key stops the CEE making any request, and controlled fields show their
empty-results row. The rest of the form works unchanged, so an application can defer the decision
safely.

### What Gets Stored

A chosen term is stored as its IRI and its label together:

```json
"disease": {
  "@id": "http://purl.obolibrary.org/obo/DOID_10652",
  "rdfs:label": "Alzheimer's disease"
}
```

The IRI makes the metadata machine-actionable, and the label makes it readable without a lookup.
The CEE also renders a link beside the selected term, back to the term's page in BioPortal, built
from the `bioPortalPrefix` configuration value and the constraint the field carries.

### Text That Is Not a Term

A controlled-term field accepts a term, not free text. Typing something that matches nothing and
then leaving the field discards the entry rather than storing it, and the CEE says so:

> Entered value is not a term from the allowed set and has been cleared.

Where the field already held a valid term, the CEE restores that term instead, and says so. A
controlled field that quietly accepted free text would produce metadata that looks controlled and
is not.

## External Authorities

Seven authorities are supported, each with a field type of its own:

| Authority | Identifies | The user types |
|---|---|---|
| ORCID | A researcher | A name or an ORCID |
| ROR | An institution | An institution name or a ROR |
| DOI | A publication or dataset | A title or a DOI |
| PubMed | A publication | A title or a PubMed ID |
| RRID | A research resource | A resource name or an RRID |
| NIH Grant | A grant | Grant details or an NIH Grant ID |
| PFAS | A chemical | A chemical name or a PFAS identifier |

Each field offers suggestions as the user types, and stores the persistent identifier of whatever
is chosen. As with controlled terms, an entry that resolves to nothing is discarded on leaving the
field, and a previously valid identifier is restored where there was one.

### Configuring the Bridge

Lookups go through the CEDAR bridge service, which fronts the authorities. It defaults to CEDAR's
production deployment, so the fields work without configuration. An application using another CEDAR
deployment overrides the base URL, which **must** end in a slash:

```json
{
  "extAuthBaseUrl": "https://bridge.metadatacenter.org/ext-auth/"
}
```

The CEE appends a search path or a details path to that base, depending on whether it is offering
suggestions or resolving a chosen identifier. Both paths can be overridden per authority, for a
deployment that routes them differently:

| Authority | Search path key | Details path key | Default paths |
|---|---|---|---|
| ORCID | `orcidIntegratedExtAuthUrl` | `orcidIntegratedDetailsUrl` | `orcid/search-by-name`, `orcid` |
| ROR | `rorIntegratedExtAuthUrl` | `rorIntegratedDetailsUrl` | `ror/search-by-name`, `ror` |
| DOI | `doiIntegratedExtAuthUrl` | `doiIntegratedDetailsUrl` | `doi/search-by-name`, `doi` |
| PubMed | `pmidIntegratedExtAuthUrl` | `pmidIntegratedDetailsUrl` | `pmid/search-by-name`, `pmid` |
| RRID | `rridIntegratedExtAuthUrl` | `rridIntegratedDetailsUrl` | `rrid/search-by-name`, `rrid` |
| NIH Grant | `nihGrantIntegratedExtAuthUrl` | `nihGrantIntegratedDetailsUrl` | `nih-grant/search-by-name`, `nih-grant` |
| PFAS | `pfasIntegratedExtAuthUrl` | `pfasIntegratedDetailsUrl` | `comp-tox/search-by-name`, `comp-tox` |

## When a Lookup Service Is Unreachable

The CEE reports a failed request in the field as a search that could not be completed, rather
than as an empty result set. Empty results invite the user to try a different word; an unreachable
service invites them to try again later.

Nothing else in the form depends on either service, so a terminology outage degrades term selection
and leaves the rest of the form intact.

## What the CEE Does Not Check

The CEE does not verify that a stored term belongs to the ontologies, branches, classes or value
sets its field declares. Only the terminology service can answer that, and asking it would make an
otherwise local operation depend on the network.

The CEE does perform the structural checks. A controlled value must carry an `@id` and an
`rdfs:label` together, and the `@id` must be well formed. [Validation](validation.md) covers what the data
quality report does and does not examine.
