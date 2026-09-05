# Access to Resources

To determine one user's access to one resource, the system performs these checks:

1. Check whether the user owns the resource. The owner may perform every Manager action and may
   transfer ownership.
2. Check whether the user has a direct grant on the resource. If so, include the role from that
   grant.
3. Identify every group to which the user belongs. For each group, check whether the group has a
   direct grant on the resource. Include the role from every grant found.
4. Examine every folder that contains the resource, from its immediate parent to the top of the
   folder tree. Include every role granted on those folders to the user or to one of the user's
   groups.
5. Check whether the user owns any folder that contains the resource. If so, treat the user as having
   the Manager role on the resource. Owning a containing folder does not make the user the owner of
   the resource itself.

If more than one role applies, Manager takes precedence over Editor, and Editor takes precedence over
Viewer. One grant never reduces access supplied by another grant.

Access flows down the folder tree, never up it. Access to a child does not reveal an unreadable parent
or sibling.

When a resource is moved to another folder, it keeps its owner and direct grants, loses any roles
supplied by its old folder, and gains any roles supplied by its new folder. Before completing the
move, the system must show which users and groups will gain access, lose access or receive a different
role.
