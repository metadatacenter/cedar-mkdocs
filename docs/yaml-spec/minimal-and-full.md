# Compact and Full Serializations

The same artifact can be written in a compact (minimal) form or a full form. The CEDAR user
interfaces call the former **Compact YAML**. The compact form describes an artifact being authored;
the full form represents one a repository has stored and carries what the repository assigned to it.

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

## The Minimal Form Carries No Schema-Artifact Identity

A minimal document leaves out the `id` of the artifact it describes and the repository-assigned `id`
of every embedded field and element. It is an identity-free structural description, not a compressed
representation of stored artifacts. A reader refuses a root `id`; for compatibility it can read older
minimal documents containing child IDs, but canonical output does not reproduce them.

So a minimal document describes something new. To represent a stored artifact, use the full form,
which carries both the artifact's `id` and its children's `propertyIri`.

Semantic references are unaffected because they are data, not schema-artifact identity:

- An instance's `isBasedOn`, which identifies the template the instance conforms to.
- An `id` used as a link value or controlled-term value in an instance.

One thing the form cannot express: renaming a child. A minimal document identifies children by key, so
a renamed child reads as one child gone and another arrived, and the new one is given a fresh
name-derived property IRI. Rename in the full form, where the child's `propertyIri` is written down.
