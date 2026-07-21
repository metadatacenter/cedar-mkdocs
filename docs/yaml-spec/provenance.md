# Provenance

Every artifact records where it came from: who created it and when, and who last changed it
and when. This provenance travels with the artifact, so its history stays legible wherever
it is stored or exchanged. Both schema artifacts and instances carry it.

```yaml
type: template
name: Study
createdOn: '2022-11-30T13:12:40-08:00'
createdBy: https://metadatacenter.org/users/6d21a88
modifiedOn: '2022-12-01T14:25:30-08:00'
modifiedBy: https://metadatacenter.org/users/6d21a88
```

## Creation and Modification

Four keys record who created and last modified the artifact, and when. Datetimes are ISO-8601
with offset, and the `*By` keys are IRIs identifying the acting user.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `createdOn` | datetime | optional | When the artifact was created. |
| `createdBy` | IRI | optional | Who created it. |
| `modifiedOn` | datetime | optional | When it was last modified. |
| `modifiedBy` | IRI | optional | Who last modified it. |

## Derivation

When an artifact is copied within CEDAR, the copy records the artifact it was made from in
`derivedFrom`. It captures lineage inside the system, showing that one artifact began as a
duplicate of another, such as a template cloned to serve as the starting point for a new one.
Unlike `previousVersion`, which links successive releases of the same artifact, `derivedFrom`
points to a different artifact that served as the source.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `derivedFrom` | IRI | optional | The source artifact of this copy. |
