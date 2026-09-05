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
| Delete a resource | **Editor** on the resource |
| Add, change or remove a direct grant | **Manager** on the resource |
| Transfer ownership | Owner of the resource |
| Enable or disable OpenView | **Manager** on the resource |

A user who creates a resource becomes its owner. A user who copies a resource becomes the owner of
the copy.

Moving or deleting a folder affects every resource it contains. The operation must succeed or fail
for the complete folder tree.
