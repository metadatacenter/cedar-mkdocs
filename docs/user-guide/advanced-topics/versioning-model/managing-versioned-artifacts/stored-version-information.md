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

## Latest-Version Flags

The graph and search index maintain three derived flags for each schema artifact. They describe the
whole version series, independently of folders, owners and access permissions.

| Flag | True For |
|---|---|
| `isLatestVersion` | The sole surviving draft, if one exists; otherwise the newest surviving published version. |
| `isLatestDraftVersion` | The sole surviving draft. False for every version when there is no draft. |
| `isLatestPublishedVersion` | The newest surviving published version. False for every version when there is no published version. |

“Newest” follows the increasing numeric `major.minor.patch` versions in the series. Publishing,
creating a successor draft and deleting a version maintain these flags across the surviving series.
A copy starts an independent series. Ordinary document edits do not change version numbers,
publication status or predecessor links; those belong to lifecycle operations. Privileged content
repairs must preserve the series metadata unless a separately reviewed lifecycle migration changes
both the document and graph consistently.

The default **Latest** filter selects `isLatestDraftVersion` or `isLatestPublishedVersion`, then
applies access, folder and other filters. If the current version is inaccessible, an earlier
accessible version does not become latest for that user. A filter for `isLatestVersion` alone selects
at most one artifact in the series. Missing flags on legacy data require reconciliation from its
history; they do not define another kind of latest version.
