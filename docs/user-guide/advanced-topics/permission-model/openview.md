# OpenView

OpenView makes a read-only representation of a workspace resource available to people who are not
signed in to CEDAR. Only the resource's owner or a user with the Manager role on the resource may
enable or disable that representation.

OpenView exposes only the selected public representation. It does not expose the resource's ACL,
folder path, group membership or user profile data, and it never permits a write through any API.
