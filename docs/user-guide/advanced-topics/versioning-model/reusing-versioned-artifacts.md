# Reusing Versioned Artifacts

A template or element stores a copy of each field or element added to it. Publishing a new version
of the original does not update those copies. To adopt the change, the author must replace the
embedded definition with the new version.

Nested definitions follow the same rule at each level. If template A contains element B and B
contains field C, the author first updates C, then replaces C in B, then replaces B in A.

Metadata instances use a specific template version through its identifier. Publishing a new version
of the template leaves existing instances attached to the earlier version. When creating a new
draft, the author can also request copies of those instances for the new template. CEDAR does not
copy them automatically.

Users can create instances from a draft template as well as a published one. Further edits to the
draft can make those instances invalid. Publishing the template protects its definition from normal
editing and lets users continue to rely on that version.

Controlled-term constraints also depend on external vocabulary versions. During publication, CEDAR
tries to record the current vocabulary version for each constraint that does not already specify
one. It keeps existing version selections. If a vocabulary version cannot be resolved, publication
still succeeds and that constraint remains without a fixed version.
