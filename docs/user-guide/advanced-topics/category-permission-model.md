# CEDAR Category Permission Model

CEDAR categories form a hierarchy used to classify artifacts.

Categories help a community apply a shared organization to its work. Users can browse categories
when finding artifacts. Users can apply categories to artifacts. Users can maintain category names
and the category hierarchy. Users can also control access to categories.

These activities carry different responsibilities. Browsing a category does not require permission
to change it. Applying a category does not require permission to maintain it or control access to
it. The category permission model specifies who may perform each activity.

## Categories and Principals

A **category** is a named resource used to classify CEDAR artifacts. An **artifact** is a template,
element, field or metadata instance.

Categories form a tree. Every category except the root category has one parent category.

A category can be attached to an artifact. The attachment classifies the artifact with that
category. One category can classify multiple artifacts. One artifact can be classified with multiple
categories.

Every category has an **owner**. The owner is the user recorded as responsible for the category.
Exactly one user can own a category at a time. A group cannot own a category.

## Roles and Capabilities

CEDAR has four roles to control access to categories. Each role can be assigned to a user or group.
Each role provides a defined set of capabilities on the category.

| Category capability | **Viewer** | **Classifier** | **Editor** | **Manager** |
|---|:---:|:---:|:---:|:---:|
| Read the category and its descriptive metadata | ✓ | ✓ | ✓ | ✓ |
| Use the category to classify an artifact | — | ✓ | ✓ | ✓ |
| Remove the category from an artifact's classifications | — | ✓ | ✓ | ✓ |
| Change the category's name or descriptive metadata | — | — | ✓ | ✓ |
| Create a child category | — | — | ✓ | ✓ |
| Delete the category when it has no children or classified artifacts | — | — | ✓ | ✓ |
| Change who has the **Viewer**, **Classifier**, **Editor** or **Manager** role | — | — | — | ✓ |
| Move the category | — | — | — | ✓ |

The roles are cumulative. **Classifier** includes every **Viewer** action. **Editor** includes every
**Classifier** action. **Manager** includes every **Editor** action.

Assigning **Viewer**, **Classifier**, **Editor** or **Manager** to a user or group on one category is
called a **direct grant**.

The owner has every **Manager** capability. The owner alone can transfer ownership to another user.
Ownership is not a role. The system does not add a role grant to represent ownership.

The **Classifier** role separates classification from category editing. A user can use an approved
category without being allowed to rename it, add children or delete it.

The **Editor**/**Manager** boundary separates category maintenance from access control. An
**Editor** can maintain the category. Only a **Manager** or the owner can change which users and
groups can access it.

## Role Inheritance

A role granted on a category also applies to every descendant of that category. The role applies
through every level of the category tree.

If a user owns a category, the user has the **Manager** role on every descendant. Owning an ancestor
does not make the user the owner of a descendant.

Access flows down the category tree. It does not flow up the category tree. A direct grant on a
category does not provide access to its parent or siblings.

Moving a category moves its complete branch. The owner and direct grants recorded on every category
remain unchanged. Roles supplied by ancestors in the old location stop applying. Roles supplied by
ancestors in the new location begin applying.

Before completing a move, the system must show which users and groups will gain access, lose access
or receive a different role. The move must succeed or fail for the complete branch. A category
cannot be moved below itself or below one of its descendants.

## Access to a Category

To determine one user's access to one category, the system performs these checks:

1. Check whether the user owns the category. The owner may perform every **Manager** action and may
   transfer ownership.
2. Check whether the user has a direct grant on the category. If so, include the role from that
   grant.
3. Identify every group to which the user belongs. For each group, check whether the group has a
   direct grant on the category. Include the role from every grant found.
4. Examine every ancestor of the category, from its immediate parent to the root category. Include
   every role granted on those ancestors to the user or to one of the user's groups.
5. Check whether the user owns an ancestor of the category. If so, treat the user as having the
   **Manager** role on the category.

If more than one role applies, **Manager** takes precedence over **Editor**, **Editor** takes
precedence over **Classifier**, and **Classifier** takes precedence over **Viewer**. One grant never
reduces access supplied by another grant.

Revocation takes effect immediately when CEDAR checks whether a user may access a category. Search
indexes may take longer to remove the category from discovery. Search indexes never authorize
access.

## Required Authority

The following table defines the minimum authority required for each category operation. The
required authority may be a role or ownership. Ownership is not a role.

A more capable role satisfies a less capable role requirement. The owner of a category has every
**Manager** capability. The owner therefore satisfies every role-based requirement on that
category.

| Operation | Required authority |
|---|---|
| Read a category | **Viewer** on the category |
| Create a child category | **Editor** on the parent category |
| Update a category's name or descriptive metadata | **Editor** on the category |
| Delete an empty category | **Editor** on the category |
| Move a category | **Manager** on the category and **Editor** on the destination parent category |
| Attach a category to an artifact | **Classifier** on the category and permission to update the artifact |
| Detach a category from an artifact | **Classifier** on the category and permission to update the artifact |
| Add, change or remove a direct grant | **Manager** on the category |
| Transfer ownership | Owner of the category |

A user who creates a category becomes its owner.

A category is empty when it has no child categories and classifies no artifacts. Category deletion
must fail when the category is not empty.

## Classification

Classification changes an artifact. It also uses a category. CEDAR authorizes both sides of the
operation.

Attaching a category requires the **Classifier** role on that category. It also requires permission
to update the artifact. Detaching the category requires the same two permissions.

A role inherited from an ancestor category satisfies the category requirement. A role received
through group membership also satisfies the category requirement.

Attaching a category does not change the category's owner or access-control list. It does not change
the artifact's owner or access-control list.

A classification request containing several category attachments or removals must be atomic. Every
requested change must be authorized. The complete request fails if any requested change is not
authorized.

## Sharing

Each category records one owner and an **access-control list (ACL)**. The ACL contains the
**Viewer**, **Classifier**, **Editor** or **Manager** roles assigned directly to users and groups. It
can contain at most one role for each user or group.

Ownership is recorded separately from the ACL. Roles inherited from ancestor categories are not
stored in the category's ACL.

The owner and any user with the **Manager** role may add, change or remove a direct grant. An ACL
change does not change ownership. It does not change roles inherited from ancestor categories.
Ownership transfer is a separate operation.

The **Everyone** group can be assigned the **Viewer** role. It cannot be assigned the
**Classifier**, **Editor** or **Manager** role. A **Viewer** grant to **Everyone** allows every
authenticated CEDAR user to browse the category. It does not permit every user to classify an
artifact with that category.

An ACL change must be atomic. The request must carry the ACL revision that the caller read. The
server rejects the change if that revision is stale.

Any user who can read the category may read an **access report** containing:

1. The owner.
2. Every direct user and group grant.
3. Whether the requesting user owns the category.
4. The most capable category role that applies to the requesting user.
5. Every direct grant, group membership, ancestor-category grant or ancestor-category ownership
   from which the user's access comes.
6. The ACL revision required to update the direct grants.

## Ownership Transfer

Ownership transfer replaces the category's owner with one named user. If the new owner has a direct
grant on the category, the transfer removes that direct grant. All other direct grants remain
unchanged.

The roles inherited from ancestor categories remain unchanged. If the former owner owns an ancestor
or has the **Manager** role on an ancestor, the former owner retains the **Manager** role on the
transferred category.

The former owner loses the access provided by ownership. Any role that applies through a direct
grant, group membership, the **Everyone** group or an ancestor category remains unchanged.

Each grant is evaluated independently. Removing one grant does not remove access supplied by
another grant. To remove all access from the former owner, every grant that applies to that user must
be removed.

Before combining a transfer with grant changes or a move, the system must show who will gain access,
lose access or receive a different role. The grant changes, move and transfer must succeed or fail
together.

## Root Category

The root category anchors the category tree. It has no parent. A designated administrative user
owns it.

The root category cannot be renamed, moved, deleted or attached to an artifact. A role granted on
the root category applies to every other category.

CEDAR assigns the **Viewer** role on the root category to the **Everyone** group. Every authenticated
user can therefore browse the category tree. Browsing does not provide permission to classify an
artifact or change a category.

## Administrative Authority

CEDAR may give designated platform administrators explicit recovery authority for categories.
Recovery authority can bypass a category role requirement.

Recovery authority does not create a category role. It does not create a direct grant. It does not
change the owner. It does not appear in the category's ACL.

Ordinary users do not receive global category mutation authority. A service that maintains a
managed category branch must receive grants on that branch or explicitly scoped administrative
authority.
