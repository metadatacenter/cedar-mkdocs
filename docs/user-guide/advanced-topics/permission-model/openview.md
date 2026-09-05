# OpenView

OpenView makes a read-only representation of a workspace resource available to people who are not
signed in to CEDAR. Only the resource's owner or a user with the Manager role on the resource may
enable or disable that representation.

A resource is available through OpenView when OpenView is enabled on that resource or on any folder
that contains it. Enabling OpenView on a folder therefore makes the folder and every resource below
it available through OpenView, including resources inside nested folders. Disabling OpenView on one
of those resources does not make it private while a containing folder remains enabled.

The OpenView setting recorded directly on a resource moves with that resource. A resource moved into
an OpenView-enabled folder becomes available through OpenView. A resource moved out of such a folder
loses that folder's OpenView access, unless OpenView is enabled directly on the resource or on a
folder in its new location.

OpenView exposes only the selected public representation. It does not expose the resource's ACL,
folder path, group membership or user profile data, and it never permits a write through any API.
