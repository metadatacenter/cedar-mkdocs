# Developing a Draft

A new CEDAR artifact starts in the **Draft** state at version `0.0.1`. The author can edit and
save it throughout development. Each save updates the same artifact, so its identifier stays the
same and its version number does not automatically increase. Individual saves do not appear as
separate versions in the history.

CEDAR uses the `major.minor.patch` number format from **Semantic Versioning**. The author chooses the
number to assign to a release. CEDAR does not determine the number from the changes or guarantee
compatibility with earlier versions. Even a minor or patch release can contain changes that
invalidate existing instances.
