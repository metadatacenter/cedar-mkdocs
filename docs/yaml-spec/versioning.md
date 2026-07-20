# Versioning and Status

A specification is not fixed once written. Fields are added, constraints tightened, wording
corrected. The CEDAR model tracks this change so that a specification can evolve while the
metadata already built against an earlier version stays anchored to it.

Two things record where an artifact stands. Its **status** marks its place in a lifecycle:
a working draft, or a published version in use. Its **version** is a released identity, a
`major.minor.patch` number, and links carry the version it succeeded and the artifact it was
derived from.

```yaml
type: template
name: Study
status: published
version: 2.0.0
previousVersion: https://repo.metadatacenter.org/templates/7b8977e
```

## Keys

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `status` | `draft` or `published` | optional | The artifact's lifecycle state. |
| `version` | string | optional | The artifact version, as `major.minor.patch` (for example `1.0.0`). |
| `previousVersion` | IRI | optional | The prior version of this artifact. |
| `derivedFrom` | IRI | optional | The artifact this one was derived from. |
| `modelVersion` | string | optional | The version of the CEDAR model the artifact conforms to (currently `1.6.0`). |

`version`, `previousVersion`, and `derivedFrom` describe the artifact's own history.
`modelVersion` is different. It names the version of the model the artifact is written
against, not a version of the artifact.
