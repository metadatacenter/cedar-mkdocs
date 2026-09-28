# Required Authority

The following table defines the minimum authority required for each operation on an artifact or
folder. The required authority may be a role or ownership. Ownership is not a role.

An **Editor** satisfies a **Viewer** requirement. A **Manager** satisfies an **Editor** or **Viewer**
requirement. The owner of a resource has every **Manager** capability. The owner therefore satisfies
every role-based requirement.

| Operation | Required authority |
|---|---|
| Read a resource | **Viewer** on the resource |
| Create a resource | **Editor** on the destination folder |
| Copy a resource | **Viewer** on the source and **Editor** on the destination folder |
| Update content or descriptive metadata | **Editor** on the resource |
| Move a resource | **Manager** on the resource and **Editor** on the destination folder |
| Delete a resource | **Editor** on the resource, except for recursive folder deletion below |
| Delete a folder and its contents in Workspace | Owner of the selected folder and **Editor** on every descendant |
| Add, change or remove a direct grant | **Manager** on the resource |
| Transfer ownership | Owner of the resource |
| Enable or disable OpenView | **Manager** on the resource |

A user who creates a resource becomes its owner. A user who copies a resource becomes the owner of
the copy.

Moving a folder affects every resource it contains. The move must succeed or fail for the complete
folder tree.

Recursive folder deletion is an exception to the normal delete rule: **Editor** or **Manager**
access to the selected folder is not sufficient. Only its owner may delete it and its contents.
The descendants may have different owners, but the user deleting the folder must have delete
permission on every descendant. Home and system folders cannot be deleted.

Before confirmation, Workspace inventories the complete folder tree, checks permissions and
template references, and shows the number of folders, templates, elements, fields and instances
that will be deleted. A failed check blocks the entire deletion. If ownership, permissions or
contents change after deletion starts, it can stop partway through; Workspace reports confirmed
deletions and requires a fresh inventory and confirmation before continuing.

A template cannot be deleted while it has instances, including instances the user cannot see.
Recursive folder deletion is allowed when all instances of each template being deleted are also
inside the selected folder tree and can be deleted: Workspace deletes those instances before their
templates. If any instance is outside the tree, the folder deletion is refused. The dialog reports
how many templates have instances and how many have instances outside the tree.
