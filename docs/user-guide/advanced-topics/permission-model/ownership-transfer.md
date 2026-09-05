# Ownership Transfer

Ownership transfer replaces the resource's owner with one named user. As mentioned, the owner is
recorded separately from the ACL. If the new owner has a direct grant on the resource, the transfer
removes that direct grant. All other direct grants remain unchanged.

When ownership is transferred, the roles that users and groups receive from containing folders
remain unchanged. If the former owner owns an ancestor folder or has the **Manager** role on an
ancestor folder, the former owner retains the **Manager** role on the transferred resource.

When ownership is transferred, the former owner loses the access provided by ownership. Any role
that applies through group membership, the **Everyone** group or a containing folder remains
unchanged.

Each grant is evaluated independently. Removing one grant does not remove access supplied by
another. To remove all access from the former owner, every grant that applies to that user must be
removed. If one of those grants is assigned to a group, removing it also changes access for every
other group member who depends on it. The same rule applies to a grant assigned to **Everyone**.

Before combining a transfer with grant changes or a move, the system must show who will gain access,
lose access or receive a different role. The grant changes, move and transfer must succeed or fail
together.
