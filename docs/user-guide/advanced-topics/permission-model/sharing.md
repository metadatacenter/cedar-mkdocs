# Sharing

Each resource records one owner and an **access-control list (ACL)**. The ACL contains the Viewer,
Editor or Manager roles assigned directly to users and groups. It can contain at most one role for
each user or group. The owner is recorded separately and is not also listed in the ACL as a Viewer,
Editor or Manager of the same resource. Roles that apply because of containing folders are not
stored in the resource's ACL.

The owner and any user with the Manager role may add, change or remove a direct Viewer, Editor or
Manager grant. An ACL change does not change ownership or roles that apply because of containing
folders. Ownership transfer is a separate operation.

An ACL change must be atomic and must carry the ACL revision the caller read. The server rejects the
change if that revision is stale.

Any user who can read the resource may read an **access report** containing:

1. The owner.
2. Every direct user and group grant.
3. Whether the requesting user owns the resource and the most capable Viewer, Editor or Manager role
   that applies to that user.
4. Every direct grant, group membership, ancestor-folder grant or ancestor-folder ownership from
   which the user's access comes.

Revocation takes effect immediately in the authoritative permission check. Search indexes may take
longer to remove a resource from discovery, but they must never authorize access.
