# Required Authority

The following table defines the minimum access required for each workspace operation. When a row
names Viewer, Editor or Manager, a higher role also satisfies the requirement because the roles are
cumulative. The owner satisfies every role-based requirement because the owner has every Manager
capability.

| Operation | Minimum access |
|---|---|
| Read a resource | Viewer on the resource |
| Create a resource | Editor on the destination folder; the creating user becomes owner |
| Copy a resource | Viewer on the source and Editor on the destination folder; the copying user owns the copy |
| Update content or descriptive metadata | Editor on the resource |
| Move a resource | Manager on the resource and Editor on the destination folder |
| Delete a resource | Editor on the resource |
| Add, change or remove a direct grant | Manager on the resource |
| Transfer ownership | Owner of the resource |
| Enable or disable OpenView | Manager on the resource |

These rules answer only the access question.

Moving or deleting a folder affects its contained tree and must succeed or fail as one operation.
