# Controlled Terms and External Authorities

Two kinds of field in a CEDAR template collect an identifier rather than a string. A
[controlled-term field](../yaml-spec/field-types/controlled-term-field.md) draws its value from an
ontology or a value set. An
[external-authority field](../yaml-spec/field-types/external-authority-fields.md) draws it from a
registry such as ORCID or ROR. Both turn what the user types into a lookup, and both store a
resolvable identifier alongside a human-readable label.

These are the only parts of the CEE that reach the network, and each is a single configured URL away
from working.

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

The constraint lives in the template, not in the configuration. The CEE reads it, and as the user types
it sends the typed text and the constraint together to CEDAR's integrated-search endpoint, which
searches the permitted terms and returns the matches. Choosing a suggestion stores the term.

### Configuring the Lookup

One key enables all of it:

```json
{
  "terminologyIntegratedSearchUrl":
    "https://terminology.metadatacenter.org/bioportal/integrated-search"
}
```

That URL is CEDAR's production terminology service, and it serves most applications. An
organization running its own CEDAR deployment points the key at that deployment's terminology
service instead.

With no value set, the CEE makes no requests and controlled fields show their empty-results row. The
rest of the form is unaffected, so an application can defer the decision without breaking anything.

### What Gets Stored

A chosen term is stored as its IRI and its label together:

```json
"disease": {
  "@id": "http://purl.obolibrary.org/obo/DOID_10652",
  "rdfs:label": "Alzheimer's disease"
}
```

The IRI makes the metadata machine-actionable, and the label makes it readable without a lookup. The CEE also renders a link beside the selected term, back to the term's page in
BioPortal, built from the `bioPortalPrefix` configuration value and the constraint the field
carries.

### Text That Is Not a Term

A controlled-term field accepts a term, not free text. Typing something that matches nothing and
then leaving the field discards the entry rather than storing it, and the CEE says so:

> Entered value is not a term from the allowed set and has been cleared.

Where the field already held a valid term, the previous term is restored instead, and the message
reflects that. The behavior is deliberate: a controlled field that quietly accepted free text
would produce metadata that looks controlled and is not.

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

A failed request is reported in the field, as a search that could not be completed, and is not
treated as an empty result set. The distinction matters: an empty result set invites the user to
try a different word, whereas an unreachable service invites them to try again later.

Nothing else in the form depends on either service. An application can be confident that a
terminology outage degrades term selection and leaves everything else intact.

## What the CEE Does Not Check

The CEE does not verify that a stored term actually belongs to the ontologies, branches, classes or
value sets its field declares. Membership is a question only the terminology service can answer, and
answering it would make an otherwise local operation depend on the network.

The structural checks are performed: a controlled value must carry an `@id` and an `rdfs:label`
together, and the `@id` must be well formed. [Validation](validation.md) covers what the data
quality report does and does not examine.
