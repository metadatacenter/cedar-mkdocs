# Sharing Resources

CEDAR offers several ways to share content, with group and permission management for its
artifacts and a web-sharing service called OpenView.

## Creating Groups

### What Are Groups?

A group is a set of people who share the same access to particular content. If you want your
whole team to see the metadata it produces, put that metadata in a folder and share the folder
with a group of your teammates. You might also use a group to make metadata visible to a team of
curators once it is ready for review. Any time a set of people should have equal access, read or
write, to some content, use a group.

### Sharing with Everybody

Suppose you have created an element and want everyone in CEDAR to use it. CEDAR has a built-in
group called Everyone; share your content with it for reading and every CEDAR user can find and
view it.

Open the sharing window as described in [Sharing for Reading and Writing](#sharing-for-reading-and-writing),
then start typing the name of the Everyone group. Several groups may appear; pick the one you
want.

![](../img/userguide/share-settings-find-your-group-20190909.png){:width="75%" class="centered"}

With the Everyone group selected, choose the kind of sharing. Leave it at the default, "can
read", which is strongly recommended.

![](../img/userguide/share-with-everyone-group-20190909.png){:width="75%" class="centered"}

Click OK. The group then appears in the right-hand panel with its permission.

![](../img/userguide/shared-with-everyone-group-20190909.png){:width="75%" class="centered"}

To share with a different group, such as the CEDAR Dev Team, choose it instead after typing the
start of its name.

### Creating a New Group

If the group does not exist yet, type its name in the box labeled 'enter new group name' rather
than choosing an existing one. Here the name is "ABCD Lab Team".

![](../img/userguide/share-settings-create-group-20190909.png){:width="40%" class="centered"}

Press Return to create the group, then give it read or write access by clicking OK.

![](../img/userguide/group-created-ready-to-ok-20190909.png){:width="40%" class="centered"}

### Modifying Groups

Click the blue Group settings link (the green arrow below).

[//]: # (![]&#40;../img/userguide/group-settings-xselector-20190909.png&#41;{:width="75%" class="centered"})

A window opens in which you re-select the group to modify.

![](../img/userguide/group-settings-empty-20190909.png){:width="75%" class="centered"}

Choose the group, and its members appear.

![](../img/userguide/group-settings-selected-group-20190909.png){:width="75%" class="centered"}

To add someone, start typing their name in the Add people box, select it from the list, and
click OK. To remove someone, click the X by their name. The Detailed info link below the box on
the right shows more about the group, some of which you can edit.

![](../img/userguide/group-settings-detailed-info-20190909.png){:width="75%" class="centered"}

### Group Administration

You can make several people administrators of a group by checking the box next to each name in
the People list.

## How Permissions Work

You may have questions about CEDAR's access privileges:

1. How do I keep my files private, or make them public?
2. How can someone collaborate with me on many files?
3. Why can't I save metadata where its template is?
4. How can I tell who else can see my file?
5. Why can't I see some shared files just after my first login?

The answers are at the end of this section.

### Permission Types

To control access to a resource, what matters is whether a given user can, for that node:

- read it,
- write it,
- publish it,
- create a draft version of it,
- change its permissions (sharing), or
- change its owner.

CEDAR computes these on the fly. They are not stored on nodes but derived, when needed, from
relationships such as the folder hierarchy and from properties. A helpful rule of thumb: you
need only one grant of a permission on a resource to perform that operation.

### Permission Rules

The rules below speak of a resource, meaning a template, element, field, or metadata instance,
but they apply to folders too. For practical reasons, the CEDAR system administrator can perform
all six operations.

#### Who Can Change the Owner of a Resource?

Only the owner. Each resource has exactly one owner.

#### Who Can Change a Resource's Permissions?

Permissions are changed through the resource's Share menu. To change them, the user must have
write access to the resource.

#### Who Can Read a Resource?

At least one of these must hold:

- The user owns the resource, or a folder containing it.
- The user, or a group they belong to, can read or write the resource or a folder containing it
  (except the root folder '/' and the users folder '/Users').

For example, because any user can read '/Shared', any user can read everything beneath it. This
is also why users cannot be given write permission there; it would let them overwrite anyone's
shared content.

#### Who Can Update a Resource?

Much like reading. At least one of these must hold:

- The user owns the resource, or a folder containing it.
- The user, or a group they belong to, can write the resource or a folder containing it.

Creating a resource is similar but simpler, since a user cannot own or write something that does
not exist yet. To create a resource (with the **New+** icon at the upper left of your
workspace), one of these must hold:

- The user owns some folder above the new resource.
- The user can write some folder above the new resource.

No one can write or create resources directly in '/', '/Users', or '/Shared'. Copying or moving
a resource into a folder needs the same permission as creating one there.

#### Who Can Create a Draft Version of a Published Resource?

A draft is a resource that can be overwritten by editing and saving. Everything in CEDAR starts
as a draft and must be published before this applies. To create a draft from a published
resource, all of these must hold:

- The user owns the published resource the draft is based on.
- The resource is a versioned type: a field, element, or template.
- The resource is the most recent in its version history.

The last rule means you cannot branch a draft from an earlier published version.

#### Who Can Publish a Resource?

Publishing is like releasing software or fixing a document version: a published resource can
never be modified. Only templates, elements, and fields can be published, and they must be in
draft state (publishing replaces the draft). All of these must hold:

- The user owns the resource.
- The resource is in draft state.
- The resource is a versioned type: a field, element, or template.

### Answers

1. **Keeping files private or making them public.** Resources stay private while they sit in
   your own user folder and none of their parent folders are shared. To make them public, share
   them, or a parent folder, with the people or groups who should have access. The Everyone
   group shares with all CEDAR users.
2. **Collaborating on many files.** Share the folder that holds them. Granting write on the
   folder lets collaborators modify everything inside. For a shared project folder under
   `/Users/Shared/`, ask the CEDAR team to create it, remembering its contents are readable by
   *all* users.
3. **Saving metadata where its template is.** Templates often live in a read-only folder, so
   they cannot be changed. CEDAR saves new metadata to your home folder, from which you can move
   it to any folder you can write to.
4. **Seeing who else can access a file.** There is no simple readout; you would have to examine
   the sharing on the resource and on every folder above it.
5. **Missing shared files just after first login.** CEDAR resolves permissions through a search
   index, and that index must be built for your account when you first log in, which takes a
   while. A later permission change is likewise not reflected instantly; for a large folder, it
   can take several seconds to propagate.

## Sharing for Reading and Writing

### What It Means

Sharing comes in two kinds: for reading and for writing. Sharing for reading lets people see
your content but change nothing, not its metadata, its sharing, or its existence. Sharing for
writing lets them change the content, change its sharing, and even delete it.

Sharing a folder applies the permission to everything inside it, and inside every folder within
it. Be sure you want everyone to read, or write, **all** of a folder's content before sharing it
that way.

### How to Share

Find the artifact in your workspace and open its menu (the small green arrow below), then click
Share (the larger green arrow).

![](../img/userguide/opening-share-menu-20190909.png){:width="75%" class="centered"}

Type a person's or a group's name; matches appear as you type, and you select the one you want.

![](../img/userguide/sharing-with-person-20190909.png){:width="75%" class="centered"}

The chosen name appears with the default permission, read. To allow writing, or (as owner) to
reassign ownership, click the down arrow and pick the permission.

![](../img/userguide/sharing-with-person-choose-permission-20190909.png){:width="25%" class="centered"}

Click OK to complete the share.

![](../img/userguide/sharing-with-person-click-ok-20190909.png){:width="25%" class="centered"}

The person now appears in the list of shared permissions on the right.

![](../img/userguide/sharing-with-person-completed-20190909.png){:width="75%" class="centered"}

To share with groups, see [Creating Groups](#creating-groups).

## Sharing Via the Web

### What OpenView Does

CEDAR OpenView shares your content on the web. It works for templates, elements, fields, and
metadata instances. You must own the content to share it, and to share an instance its template
must already be shared. Templates, elements, and fields appear as empty forms showing their
fields.

### Sharing to the Web

To share a template, element, or field, choose Enable OpenView from its menu. CEDAR confirms
the share.

![](../img/userguide/enable-openview-menu-20190908.png){:width="25%" class="centered"}

To share a metadata instance, also share the template it is based on. If you do not own that
template, ask its owner or the CEDAR team for help. Until the template is shared, anyone who
opens the shared instance sees an error rather than the metadata.

### Viewing Shared Content on the Web

Choose Visit OpenView from an artifact's menu to open its public view in a new page. You can
copy that page's URL and give it to anyone to view. On the page, click the down-arrow in the
title bar to see the content's metadata, which includes a link to open the document in CEDAR
(the link works only for users whose account has permission to view it). The page also offers
the raw source representations of the content for anyone who wants them.

### Ending Sharing

The owner of a document with OpenView enabled can turn it off at any time by choosing Disable
OpenView from the document's menu.
