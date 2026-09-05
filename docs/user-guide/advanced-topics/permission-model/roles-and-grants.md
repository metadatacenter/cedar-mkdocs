# Roles and Grants

CEDAR uses roles, grants and ownership to define who may access and control artifacts, folders and
groups.

## Artifacts and Folders

CEDAR has three roles for access to artifacts and folders. Each role can be assigned to a user or
group. Each role provides a defined set of capabilities on the artifact or folder. The tables below
show the capabilities provided by each role for each resource type.

### Artifact Capabilities

| Capability | **Viewer** | **Editor** | **Manager** |
|---|:---:|:---:|:---:|
| Read the artifact and its descriptive metadata | ✓ | ✓ | ✓ |
| Change the artifact's content or descriptive metadata | — | ✓ | ✓ |
| Delete the artifact | — | ✓ | ✓ |
| Change who has the **Viewer**, **Editor** or **Manager** role | — | — | ✓ |
| Move the artifact | — | — | ✓ |
| Enable or disable OpenView for the resource | — | — | ✓ |

### Folder Capabilities

| Capability | **Viewer** | **Editor** | **Manager** |
|---|:---:|:---:|:---:|
| Read the folder and its descriptive metadata | ✓ | ✓ | ✓ |
| View resources contained in the folder | ✓ | ✓ | ✓ |
| Change the folder's descriptive metadata | — | ✓ | ✓ |
| Create a resource in the folder | — | ✓ | ✓ |
| Copy a resource into the folder | — | ✓ | ✓ |
| Delete the folder | — | ✓ | ✓ |
| Change who has the **Viewer**, **Editor** or **Manager** role | — | — | ✓ |
| Move the folder | — | — | ✓ |
| Enable or disable OpenView for the folder | — | — | ✓ |

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

Groups have a separate **Group Administrator** role. The table below compares the capabilities of
every group member with the additional capabilities provided by this role.

| Group capability | Member | **Group Administrator** |
|---|:---:|:---:|
| View the group's name | ✓ | ✓ |
| View the group's members and administrators | ✓ | ✓ |
| Change the group's name | — | ✓ |
| Add or remove members | — | ✓ |
| Add or remove a **Group Administrator** role | — | ✓ |

Membership is not a role. Every **Group Administrator** is also a member. A **Group Administrator**
therefore has every member capability.

A grant to a group applies to every current member of that group. A user added to the group gains the
access given to the group. A user removed from the group loses the access received through the group.
Another grant may still provide that user with access.

The built-in **Everyone** group can be assigned the **Viewer** role. It cannot be assigned the
**Editor** role or the **Manager** role. Assigning the **Viewer** role to the **Everyone** group gives
every authenticated CEDAR user **Viewer** access. It does not give access to people who are not
signed in. Access for people who are not signed in is controlled separately through
[OpenView](openview.md).
