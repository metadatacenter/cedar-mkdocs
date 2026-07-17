# Provenance

Every artifact records where it came from: who created it and when, and who last changed it
and when. This provenance travels with the artifact, so its history stays legible wherever
it is stored or exchanged. Both schema artifacts and instances carry it.

```yaml
type: template
name: Study
createdOn: '2022-11-30T13:12:40-08:00'
createdBy: https://metadatacenter.org/users/6d21a887-b704-49a9-922a-aa71632f3232
modifiedOn: '2022-12-01T14:25:30-08:00'
modifiedBy: https://metadatacenter.org/users/6d21a887-b704-49a9-922a-aa71632f3232
```

## Keys

Datetimes are ISO-8601 with offset. The `*By` keys are IRIs identifying the acting user.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `createdOn` | datetime | optional | When the artifact was created. |
| `createdBy` | IRI | optional | Who created it. |
| `modifiedOn` | datetime | optional | When it was last modified. |
| `modifiedBy` | IRI | optional | Who last modified it. |
