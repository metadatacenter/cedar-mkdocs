# Versioning and Status

An artifact can evolve after it is first created. Fields can be added, constraints tightened,
wording corrected. The CEDAR model tracks this change so that an artifact can advance to a
new version while the metadata already built against an earlier one stays anchored to it.

Only schema artifacts — templates, elements, and fields — carry this record. An instance is
not versioned. It points instead to the template it was built from, with `isBasedOn`.

```yaml
type: template
name: Study
status: published
version: 2.0.0
previousVersion: https://repo.metadatacenter.org/templates/7b8977e
```

## Status

`status` marks where an artifact sits in its lifecycle. A **draft** is a working copy, open
to editing. A **published** artifact is a released version. Publishing freezes the artifact
so it will not change, which lets any instance built against it stay valid. A published
artifact is never edited in place. To revise it, a new draft is created, and that draft
carries the published version forward as its predecessor.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `status` | `draft` or `published` | optional | The artifact's lifecycle state. |

## Version and History

`version` gives the artifact a released identity, written as a `major.minor.patch` number in
the style of semantic versioning. The rightmost number marks a trivial change, the middle a
minor one, and the leftmost a major one. In CEDAR a new artifact starts at `0.0.1`, and each
release takes a number higher than the last.

`previousVersion` links a version back to the one it succeeded, so a chain of releases can be
followed from newest to oldest. Each version is a distinct artifact with its own `id`, and
`previousVersion` is what threads them together.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `version` | string | optional | The artifact version, as `major.minor.patch` (for example `1.0.0`). |
| `previousVersion` | IRI | optional | The previous version of this artifact, if any. |

The version of the CEDAR model an artifact is written against is recorded separately, in
`modelVersion`; see [Core Artifact Structure](core-structure.md#model-version).
