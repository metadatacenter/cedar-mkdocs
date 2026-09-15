# Creating the Next Version

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
