# Ownership Transfer

Ownership transfer replaces the resource's owner with one named user. It does not edit the ACL.

When ownership is transferred, the roles that users and groups receive from containing folders remain
unchanged. If the former owner owns an ancestor folder or has the Manager role on an ancestor folder,
that user retains the Manager role on the transferred resource.

A transfer intended to remove the former owner's access must also remove every user or group grant
that gives the former owner access and move the resource outside any folder that gives the former
owner inherited access. The grant changes, move and transfer must succeed or fail together.
