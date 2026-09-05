# Ownership Transfer

Ownership transfer replaces the resource's owner with one named user. If that user has a direct grant
on the resource, the transfer removes it because the owner is recorded separately from the ACL. All
other direct grants remain unchanged.

When ownership is transferred, the roles that users and groups receive from containing folders remain
unchanged. If the former owner owns an ancestor folder or has the Manager role on an ancestor folder,
that user retains the Manager role on the transferred resource.

Transferring ownership does not by itself remove the former owner's access. A role supplied through
group membership, the Everyone group or a containing folder continues to apply. Because one grant
cannot cancel another, the former owner cannot be excluded while any of those grants remains.
Removing a group or Everyone grant also changes access for every other user who depends on that
grant.

Before combining a transfer with grant changes or a move, the system must show who will gain access,
lose access or receive a different role. The grant changes, move and transfer must succeed or fail
together.
