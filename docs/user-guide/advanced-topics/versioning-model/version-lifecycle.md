# Version Lifecycle

CEDAR supports versioning for templates, elements and fields, collectively called **schema artifacts**.
Instances are not versioned in CEDAR.

Each **version** of a schema artifact has its own identifier, version number and publication status.
The identifier lets users refer to that specific version. The number distinguishes it from earlier
and later versions of the same artifact. Its status is either **Draft** or **Published**.

## Developing a Draft

A new CEDAR artifact starts in the **Draft** state at version `0.0.1`. The author can edit and
save it throughout development. Each save updates the same artifact, so its identifier stays the
same and its version number does not automatically increase. Individual saves do not appear as
separate versions in the history.

CEDAR uses the `major.minor.patch` number format from **Semantic Versioning**. The author chooses the
number to assign to a release. CEDAR does not determine the number from the changes or guarantee
compatibility with earlier versions. Even a minor or patch release can contain changes that
invalidate existing instances.

## Publishing a Version

When the draft is ready, its owner can publish it. Publishing changes its status from **Draft** to
**Published** and keeps its identifier. The owner can keep the draft's version number or choose a
higher one, but cannot lower it.

The published version is then closed to normal editing. Its owner must create a new draft to make
further changes. A published version cannot be published again or returned to the **Draft** state.

Publishing a version does not change who can access it. Its sharing settings continue to control
access by CEDAR users and groups. To make the artifact available to people without a CEDAR account,
a user with **Manager** access can enable [OpenView](../permission-model/openview.md).

## Creating the Next Version

To continue development, the owner creates a draft from the latest published version. CEDAR copies
that version into a new artifact and assigns a new identifier. The published version stays unchanged
and remains available to its existing users.

The new draft must have a higher version number than the published version. CEDAR suggests
the next patch number, but the author can choose a higher number. For example, a draft created from
`1.0.0` starts with the suggested number `1.0.1`. The owner can later publish it as `1.0.1`, `1.1.0`
or another higher version.

Each new draft records the published version it came from as its **predecessor**. Repeating the
publish-and-draft process builds a **version series**: a sequence of versions linked to their
predecessors.

A series can have only one draft at a time. The owner must publish that draft before creating the
next one. Earlier versions that already have a successor cannot produce another draft. These rules
keep development in a single sequence without branches.

The following example follows a template through two releases. A and B stand for its two identifiers.

| Action | Template A | Template B |
|---|---|---|
| Create the template | **Draft** `0.0.1` | — |
| Publish the first release | **Published** `1.0.0` | — |
| Create the next draft | **Published** `1.0.0` | **Draft** `1.0.1`, with A as its predecessor |
| Publish the second release | **Published** `1.0.0` | **Published** `1.1.0`, with A as its predecessor |

## Starting a Separate Series

An author who wants to develop an artifact independently can copy it. The copy starts a separate
series at **Draft** `0.0.1` with a new identifier. CEDAR records where the copy came from, but the copy
does not become the next version of the source artifact.

This lets an author reuse an existing definition without continuing its release history. The source
series and the copy can then develop independently.

## Version History

As the series grows, CEDAR keeps the current work and the current release visible. Its
default **Latest** filter shows the newest published version and any draft. Turning the filter off also
shows older versions. The selected folder, access permissions and other filters still determine
which results appear.

The **latest version** is the draft when one exists. Otherwise it is the newest published version.
The default filter can therefore show two artifacts: the latest version and its published
predecessor.

The version-history view lists the linked versions in the series. Users can select an earlier
version to inspect it, but still need read access to open it. Selecting an older version does not
make it the latest or allow development to restart from it.
