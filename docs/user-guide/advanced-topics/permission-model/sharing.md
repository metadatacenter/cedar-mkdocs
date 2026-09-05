# Sharing

Each resource records one owner and an **access-control list (ACL)**. The ACL contains the
**Viewer**, **Editor** or **Manager** roles assigned directly to users and groups. It can contain at
most one role for each user or group. Ownership is recorded separately from the ACL. The system does
not add a **Viewer**, **Editor** or **Manager** grant to represent ownership. Roles that apply because
of containing folders are not stored in the resource's ACL.

The owner and any user with the **Manager** role may add, change or remove a direct **Viewer**,
**Editor** or **Manager** grant. An ACL change does not change ownership or roles that apply because
of containing folders. Ownership transfer is a separate operation.

An ACL change must be atomic. The request must carry the ACL revision that the caller read. The
server rejects the change if that revision is stale.

Any user who can read the resource may read an **access report** containing:

1. The owner.
2. Every direct user and group grant.
3. Whether the requesting user owns the resource.
4. The most capable **Viewer**, **Editor** or **Manager** role that applies to the requesting user.
5. Every direct grant, group membership, ancestor-folder grant or ancestor-folder ownership from
   which the user's access comes.

Revocation takes effect immediately when CEDAR checks whether a user may access the resource. Search
indexes may take longer to remove a resource from discovery. Search indexes never authorize access.
