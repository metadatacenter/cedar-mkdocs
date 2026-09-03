# Minimal, Compact, and Full Serializations

An artifact being authored can be written in a minimal form. Once a repository has assigned its
identity and metadata, that same stored artifact can be serialized in compact or full form. Compact
YAML keeps artifact identity but omits repository-recorded metadata; full YAML carries both.

## What an Artifact Requires

Very little has to be written by hand. Every artifact needs a `type` and a `name`. A template
or element also needs its `children`. An instance also needs `isBasedOn`, the template it
conforms to. Everything else is optional.

A minimal template, of the kind a person might author directly, carries just its structure:

```yaml
type: template
name: "Study"
children:
- key: "study-name"
  type: text-field
  name: "Study Name"
- key: "enrolled"
  type: numeric-field
  name: "Enrolled Participants"
  datatype: xsd:int
```

## What a System Supplies

When an artifact is created or uploaded, CEDAR, or an equivalent system that stores CEDAR
artifacts, fills in the keys that identify it and record its standing. These are rarely
written by hand.

- `id` — the artifact's assigned IRI. See [Core Artifact Structure](core-structure.md#identity).
- `modelVersion` — the version of the CEDAR model the artifact conforms to. See [Core Artifact Structure](core-structure.md#model-version).
- `version` and `status` — the released identity and lifecycle state. See [Versioning and Status](versioning.md).
- `createdBy`, `createdOn`, `modifiedBy`, `modifiedOn` — provenance. See [Provenance](provenance.md).
- `propertyIri` — the property each child binds to, minted as the artifact is first stored.

The same template, serialized in full, carries all of them:

```yaml
type: template
name: "Study"
id: "https://repo.metadatacenter.org/templates/7b8977e"
status: published
version: 1.0.0
modelVersion: 1.6.0
createdBy: "https://metadatacenter.org/users/6d21a88"
createdOn: '2022-11-30T13:12:40-08:00'
modifiedBy: "https://metadatacenter.org/users/6d21a88"
modifiedOn: '2022-12-01T14:25:30-08:00'
children:
- key: "study-name"
  type: text-field
  name: "Study Name"
  configuration:
    propertyIri: "https://schema.org/name"
- key: "enrolled"
  type: numeric-field
  name: "Enrolled Participants"
  datatype: xsd:int
```

An instance follows the same pattern. Authored minimally it needs only `type`, `name`,
`isBasedOn`, and its field values under `children`; the system adds the `id` and provenance.
`version`, `status`, and `modelVersion` belong to schema artifacts and do not appear on an
instance.

## Minimal Does Not Name an Artifact; Compact Does

A minimal document leaves out the `id` of the artifact it describes. It describes something new,
which a repository will name when it is stored.

Compact YAML is different: it is a lean representation of an existing artifact and retains the
artifact's `id`, including the assigned IDs of embedded fields and elements when present. It omits
`modelVersion`, version, status, provenance, and child `propertyIri` values. Those omissions make it
read-only: writing a compact document back would silently regenerate repository state, so the REST
API rejects it. Use the full form for an update, or omit the root `id` to author minimally.

Semantic references appear in every applicable form because they are data, not the document's own
identity:

- An instance's `isBasedOn`, which identifies the template the instance conforms to.
- An `id` used as a link value or controlled-term value in an instance.

One thing the minimal form cannot express: renaming a child. A minimal document identifies children by key, so
a renamed child reads as one child gone and another arrived, and the new one is given a fresh
name-derived property IRI. Rename in the full form, where the child's `propertyIri` is written down.
