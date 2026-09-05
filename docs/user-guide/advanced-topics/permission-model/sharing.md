# Sharing

Each resource has sharing settings that record its owner and the Viewer, Editor or Manager roles
assigned directly to users and groups. This record is called the **access-control list (ACL)**. It can
contain at most one role for each user or group. The owner is recorded only as the owner and is not
also listed as a Viewer, Editor or Manager of the same resource. Roles that apply because of
containing folders are not stored in the resource's ACL.

The owner and any user with the Manager role may add, change or remove a direct Viewer, Editor or
Manager grant. An ACL change does not change ownership or roles that apply because of containing
folders. Ownership transfer is a separate operation.

An ACL change must be atomic and must carry the ACL revision the caller read. The server rejects the
change if that revision is stale.

Any user who can read the resource may read an **access report** containing:

1. The owner.
2. Every direct user and group grant.
3. Whether the requesting user is the owner or which role gives that user access.
4. The direct grant, group membership or ancestor folder from which that access comes.

Revocation takes effect immediately in the authoritative permission check. Search indexes may take
longer to remove a resource from discovery, but they must never authorize access.
