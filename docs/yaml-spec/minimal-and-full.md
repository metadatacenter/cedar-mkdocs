# Minimal and Full Serializations

The same artifact can be written in a minimal form or a full form. Both describe the same
thing. They differ in how much is stated explicitly and how much is supplied by the system
that stores the artifact.

## What an Artifact Requires

Very little has to be written by hand. Every artifact needs a `type` and a `name`. A template
or element also needs its `children`. An instance also needs `isBasedOn`, the template it
conforms to. Everything else is optional.

A minimal template, of the kind a person might author directly, carries just its structure:

```yaml
type: template
name: Study
children:
- key: study-name
  type: text-field
  name: Study Name
- key: enrolled
  type: numeric-field
  name: Enrolled Participants
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
- `propertyIri` — the property each child binds to, assigned as the artifact is stored.

The same template, serialized in full, carries all of them:

```yaml
type: template
name: Study
id: https://repo.metadatacenter.org/templates/7b8977e
status: published
version: 1.0.0
modelVersion: 1.6.0
createdBy: https://metadatacenter.org/users/6d21a88
createdOn: '2022-11-30T13:12:40-08:00'
modifiedBy: https://metadatacenter.org/users/6d21a88
modifiedOn: '2022-12-01T14:25:30-08:00'
children:
- key: study-name
  type: text-field
  name: Study Name
  configuration:
    propertyIri: https://schema.org/name
- key: enrolled
  type: numeric-field
  name: Enrolled Participants
  datatype: xsd:int
```

An instance follows the same pattern. Authored minimally it needs only `type`, `name`,
`isBasedOn`, and its field values under `children`; the system adds the `id` and provenance.
`version`, `status`, and `modelVersion` belong to schema artifacts and do not appear on an
instance.
