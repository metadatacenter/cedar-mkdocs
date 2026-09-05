# Roles and Grants

CEDAR uses roles, grants and ownership to define who may access and control artifacts, folders and
groups.

## Artifacts and Folders

CEDAR has three roles for access to artifacts and folders. Each role can be assigned to a user or
group.

| Role | Capabilities |
|---|---|
| **Viewer** | Ability to read the resource and its descriptive metadata. If the resource is a folder, ability to see the resources it contains. |
| **Editor** | Ability to change the resource's content and descriptive metadata. Ability to delete the resource. If the resource is a folder, ability to create resources within it, place copies there when the user can read the source, and delete resources it contains. |
| **Manager** | Ability to change which users and groups have the **Viewer**, **Editor** or **Manager** role on the resource. Ability to move or delete the resource. Ability to enable or disable OpenView for the resource. |

The roles are cumulative. **Editor** includes every **Viewer** action. **Manager** includes every
**Editor** action.

Assigning **Viewer**, **Editor** or **Manager** to a user or group on one artifact or folder is called
a **direct grant**.

The owner is the single user recorded as responsible for the resource. The owner has every **Manager**
capability. The owner alone can transfer ownership to another user. The transfer makes the other user
the owner. The previous owner no longer owns the resource.

The **Editor**/**Manager** boundary is deliberate. A user with the **Editor** role on a resource may
change its content but may not change which users or groups can access it. Changing that access
requires the **Manager** role on the resource or ownership of the resource.

When a user or group is given a role on a folder, that role also applies to every resource the folder
contains, including resources inside nested folders.

## Groups

Groups also have a separate **Group Administrator** role. A user with this role may change a group's
name, membership and administrators.

A grant to a group applies to every current member of that group. A user added to the group gains the
access given to the group. A user removed from the group loses the access received through the group.
Another grant may still provide that user with access.

The built-in **Everyone** group can be assigned the **Viewer** role. It cannot be assigned the
**Editor** role or the **Manager** role. Assigning the **Viewer** role to the **Everyone** group gives
every authenticated CEDAR user **Viewer** access. It does not give access to people who are not
signed in. Access for people who are not signed in is controlled separately through
[OpenView](openview.md).
