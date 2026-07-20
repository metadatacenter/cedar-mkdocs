# External Authority Fields

External authority fields collect a URI that is a specific kind of identifier, issued by an
external registry or authority. Seven types are provided, one per authority.

| Field type | Authority |
|-----------|-----------|
| `ext-ror-field` | ROR — Research Organization Registry. |
| `ext-orcid-field` | ORCID — researcher identifiers. |
| `ext-doi-field` | DOI — digital object identifiers. |
| `ext-rrid-field` | RRID — research resource identifiers. |
| `ext-pfas-field` | PFAS identifiers. |
| `ext-pubmed-field` | PubMed identifiers. |
| `ext-nih-grant-id-field` | NIH grant identifiers. |

Each takes an optional `default` holding a URI.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `default` | IRI | optional | A default identifier URI. |

```yaml
- key: institution
  type: ext-ror-field
  name: Institution
  default: https://ror.org/00f54p054
```
