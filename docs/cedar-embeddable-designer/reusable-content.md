# Reusable Fields and Elements

CED can search and insert fields and elements from a repository selected by the
host. Reuse lets teams maintain common definitions across templates while
configuring how each definition appears in its parent.

## Supply a Repository Adapter

Set `designer.childSource` to an object implementing `CedChildSource`. The two
required methods are:

| Method | Contract |
|---|---|
| `search(query, { signal, cursor })` | Return `{ results, nextCursor? }`, filtered to resources the user may read. |
| `load(result, { signal })` | Return the complete field or element as CEDAR JSON-LD. |

A search result has `id`, `name`, and `type` (`field` or `element`), with optional
`createdOn`, `modifiedOn`, `version`, and `status` display values. Omit
`nextCursor` on the final page. Honor abort signals so a closed selector or a
replacement document can cancel obsolete requests.

The host handles authentication, permission filtering, repository routes, and
error handling. CED has no default repository. Replacing `childSource` closes an
open selector and cancels pending work. Without a source, repository selection
reports that it is unavailable.

The **Modular** authoring profile exposes the reusable-child selector. Existing
nested content stays visible in every profile.

## Understand Linked and Copied Content

Inserting a published artifact links its definition and identity. The author can
configure its placement in an editable parent, including its key, displayed
label, requirement, multiplicity, and property IRI. Its published definition
remains locked.

Inserting a draft creates an editable copy with a new identity and provenance
pointing to the source. Published descendants remain linked. A child created
directly within the open document is local and unversioned.

Everything inside a published element belongs to that definition, including the
placement of its children. Edit a new draft version to change it. Host read-only
mode or a published root prevents edits throughout the document.

## Connect Version Operations

Optional adapter methods enable the corresponding version actions:

| Method | Purpose |
|---|---|
| `versions(reference, { signal })` | Return readable versions newest first, or `null` if the artifact is unavailable. |
| `compatibility(current, candidate, options)` | Assess schema compatibility and the effect on existing instances. |
| `save(artifact, { type, publish, signal })` | Store a new reusable artifact for a supported lifecycle action and return the stored document. |
| `open(reference)` | Open the stored artifact in the host application. |

Each version contains its `id`, `name`, `version`, and `publicationStatus`
(`bibo:draft`, `bibo:published`, or `null`). Owner and folder display text are
optional. The Version tab offers only the actions supported by the host.

Linked content can be upgraded to a newer published version. A copied child can
be replaced with a published version of its source. Replacement retains the
child's parent placement. Detaching a linked child turns that child into an
editable copy; its published descendants retain their own links.

## Assess Compatibility Before Replacement

The `compatibility` callback receives both child artifacts and the complete
before/after parent documents as `options.document` and `options.replacement`.
It returns `{ compatible, invalidatedInstances? }`.

`compatible: true` means every instance valid under the old schema remains
valid under the new one. Checking only the currently stored instances does not
establish that guarantee.

A breaking replacement needs an explicit `invalidatedInstances: 0` to proceed.
An unknown verdict (`compatible: null`) with an explicit zero may allow manual
replacement, but cannot join **Upgrade all compatible**. Missing, invalid, or
contradictory impact results withhold replacement.

Editing the document retires an assessment, and CED checks the candidate again.
The server must enforce its update policy at write time too, since another
user may create an instance after the assessment.

## Edit a Standalone Definition

Use CED with `newArtifact('element')` for an element, or use
[CEFD](field-designer.md) for an individual field. The host manages creation,
saving, and publication of those definitions before offering them for reuse.
