# Stored Version Information

CEDAR records the version and its relationships in the artifact document:

| Property | Meaning |
|---|---|
| `@id` | Identifier of this specific version |
| `pav:version` | Version number |
| `bibo:status` | `bibo:draft` or `bibo:published` |
| `pav:previousVersion` | Identifier of the preceding version |
| `pav:derivedFrom` | Identifier of the artifact this copy came from |
| `schema:isBasedOn` | Identifier of the template version an instance uses |

Two other metadata values serve different purposes. The CEDAR model version identifies the artifact's
format. An HTTP `ETag` identifies a saved revision and helps prevent users from overwriting each
other's changes. Neither is the artifact's version number.

Administrators with explicit repair authority can correct a published document without creating a
new version. This is an exception for repairs, not part of the authoring workflow. Owning an artifact
does not grant repair authority.
