# Workspace Roles and Grants

CEDAR has three roles that can be assigned on a workspace resource.

The roles are cumulative. Editor includes every Viewer action, and Manager includes every Editor
action.

| Role | Capabilities |
|---|---|
| **Viewer** | Ability to read the resource and its descriptive metadata and, for a folder, see the resources it contains. |
| **Editor** | Ability to change the resource's content and descriptive metadata or delete the resource. For a folder, ability to create, copy or delete resources within it. |
| **Manager** | Ability to change who is a Viewer, Editor or Manager of the resource on which the role is held, and to move or delete that resource. Ability to enable or disable OpenView for that resource. |

Assigning one of these workspace roles to a user or group on one resource is called a **direct
grant**.

A grant to a group applies to every current member of that group. A user added to the group gains its
access; a user removed from the group loses that access unless another grant still supplies it.

The owner is the single user recorded as responsible for the resource. The owner has every Manager
capability. The owner alone can transfer ownership to another user. The transfer makes that user the
owner and ends the previous user's ownership.

The Editor/Manager boundary is deliberate. A user with the Editor role on a resource may change its
content but may not change which users or groups can access it. Changing that access requires the
Manager role on the resource or ownership of the resource.

The built-in Everyone group can be assigned the Viewer role. It cannot be assigned the Editor role
or the Manager role. Assigning the Viewer role to the Everyone group gives every authenticated CEDAR
user Viewer access. It does not give access to people who are not signed in; anonymous access is
controlled separately through OpenView.

When a user or group is given a role on a folder, that role also applies to every resource the folder
contains, including resources inside nested folders.
