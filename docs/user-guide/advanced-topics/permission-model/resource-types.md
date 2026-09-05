# Resource Types

CEDAR permissions apply to resources.

The permission model recognizes four resource types: **users**, **groups**, **artifacts** and
**folders.**

A **user** is an authenticated CEDAR account. A **group** is a named set of users. **Everyone** is a
built-in group. Every authenticated user belongs to the Everyone group.

An **artifact** is a resource that defines or contains metadata. An artifact is a **template**,
**element**, **field** or **metadata instance**. Templates, elements and fields define metadata.
Metadata instances contain populated metadata. A **folder** is a resource that contains artifacts
and other folders.

Every resource has an **owner**. The owner is the user recorded as responsible for the resource.
Exactly one user can own a resource at a time. A group cannot own a resource.
