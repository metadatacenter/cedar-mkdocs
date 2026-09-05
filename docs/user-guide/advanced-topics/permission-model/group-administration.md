# Group Administration

Only users can be members of a group. A group cannot be a member of another group.

Groups use a separate **Group Administrator** role. A user with this role may change the group's
name, add or remove members, and add or remove a **Group Administrator** role. Being a member of a
group does not allow a user to add or remove other members. Every **Group Administrator** is also a
member of the group. Every group must have at least one **Group Administrator**. Removing a
**Group Administrator** from the group also removes that user's **Group Administrator** role.

Every group member may read the group's name, administrators and membership.

When a user is removed from a group, every grant to the group stops applying to that user. Other
grants may continue to provide access.
