# Artifact Versioning

CEDAR lets you publish versions of templates, elements and fields so that people can keep using
an existing version while you work on changes. A **draft** is editable. A **published** version
has fixed content and remains available when you create a newer version.

You publish and create versions from the resource's menu in the workspace. The same steps apply
to templates, elements and fields. For the full versioning rules, see the
[CEDAR Versioning Model](advanced-topics/versioning-model/index.md).

## Working on a Draft

A new template, element or field starts as a draft with version number `0.0.1`. You can edit and
save it as often as you need. Saving updates the draft without changing its identifier or
version number.

The example below is a Principal Investigator element with fields for an investigator's name
and ORCID. Its version number appears in the Version box beside the name and description.
The open padlock at the top right indicates that you can edit it. Click **Save** to save your
changes. See [Saving and Closing](building-basic-templates.md#saving-and-closing) for an
explanation of the three status icons.

![](../img/userguide/versioning-element-draft.png){:width="80%" class="centered"}

## Publishing a Version

To publish a draft, open the resource's menu (the vertical dots, **⋮**) and choose
**Publish version…**. **Create version…** is unavailable for drafts.

![](../img/userguide/versioning-draft-menu.png){:width="80%" class="centered"}

In the dialog, choose a version number in `major.minor.patch` format, following the
[semantic versioning](https://semver.org/#summary) convention. CEDAR accepts only the three
numeric parts; suffixes such as `-RC1` or `-beta` are not supported. You can keep the draft's
number or enter a higher one. You cannot publish with a lower number.

Use the major number for changes that require users to adapt their templates or metadata, the
minor number for compatible additions, and the patch number for small corrections. CEDAR does
not choose a number based on your changes or check compatibility with earlier versions.

![](../img/userguide/versioning-publish-dialog.png){:width="80%" class="centered"}

After publishing, the workspace shows the globe icon and the version number. In the resource's
menu, **Publish version…** is grayed out and **Create version…** is available.

![](../img/userguide/versioning-published-menu.png){:width="80%" class="centered"}

Published versions open read-only in the Template Designer. The padlock at the top right is
closed and yellow, and the Clear, Cancel and Save buttons are no longer shown.

![](../img/userguide/versioning-published-locked.png){:width="80%" class="centered"}

## Creating the Next Version

To update a published artifact, choose **Create version…** from its menu. CEDAR creates a new
draft with its own identifier and records which published version it came from. The published
version remains unchanged.

The dialog suggests the next patch number: for example, `1.0.1` after `1.0.0`. You can choose a
higher number now or when you publish the draft.

![](../img/userguide/versioning-create-version-dialog.png){:width="80%" class="centered"}

The workspace lists the new draft and its published predecessor under the same title.

![](../img/userguide/versioning-series-listing.png){:width="80%" class="centered"}

An artifact can have only one draft at a time. Publish that draft before creating another.
Only the owner of the latest published version can create the next draft, and they must have
Editor access to the destination folder. See
[Versioning and Permissions](advanced-topics/versioning-model/managing-versioned-artifacts/versioning-and-permissions.md)
for details.

To make a separate artifact instead, use **Copy to…**. A copy starts at draft version `0.0.1`
and has its own version history. CEDAR records which artifact it was copied from.

## Reusing a Version in a Template

When you import an element into a template, CEDAR embeds a copy of the selected version.
Later changes to the original element do not automatically update that copy.

Open the import window as described in [Adding Elements](building-basic-templates.md#adding-elements).
Versions of an element have the same title, so select an entry and check its version in the
details pane on the right. A globe icon indicates a published version.

![](../img/userguide/versioning-import-window.png){:width="80%" class="centered"}

Here, the Study template contains a copy of the Principal Investigator draft, version `1.0.1`.
The number beside the element icon identifies the version that was imported.

![](../img/userguide/versioning-template-with-element.png){:width="80%" class="centered"}

## Updating Imported Elements

When you save changes to an element, CEDAR lets you update templates and elements that have
imported it. For example, adding an Institution field to the Principal Investigator draft
allows you to add that field to the Study template too.

Save the element first. CEDAR saves your changes, then opens the **Update Bubbling** window
with the templates and elements that contain a copy.

![](../img/userguide/versioning-update-bubbling.png){:width="80%" class="centered"}

Select the artifacts you want to update and click **Update**. The information icon beside each
name shows its location, owner and provenance. Updating replaces the imported copy in each
selected artifact; its identifier, name and version number stay the same. Artifacts you leave
unselected keep their existing copies. Cancelling leaves all copies unchanged, but your changes
to the original element are already saved.

Only drafts can be updated. Published artifacts have a globe icon and a disabled checkbox.
To update one, first create a new draft of that artifact, then select the draft in the Update
Bubbling window.

After the update, the Study template includes the Institution field.

![](../img/userguide/versioning-template-updated.png){:width="80%" class="centered"}

### Updating Elements Used by Existing Metadata

CEDAR warns you when you open an element for editing if a template that uses it already has
metadata instances. Changes to the element's fields could make those instances incompatible
with their template.

![](../img/userguide/versioning-element-in-use.png){:width="80%" class="centered"}

You can update display labels, descriptions, help text and the order of fields and elements
without changing the structure of existing metadata. CEDAR allows these changes to be applied
to the templates that use the element.

For other changes, CEDAR refuses the update and leaves all selected artifacts unchanged. Create
a new version of the template before adding the updated element. Existing metadata instances
remain associated with the template version used to create them.

## Finding Earlier Versions

Earlier published versions remain available after you publish a new one.

In the workspace, published versions display a globe icon and a version number. Drafts display
only the number, except for an initial `0.0.1` draft, which has no version marking.

To see all versions of an artifact, open its information panel and select the **Version** tab.
Versions are listed newest first. A globe icon marks published versions, and a **Latest** badge
marks the current version. Click a title to open that version. See
[Viewing Resource Metadata](viewing-resource-information.md#viewing-resource-metadata) for more
about the information panel.

![](../img/userguide/versioning-version-history.png){:width="80%" class="centered"}

The **Latest** checkbox in the Filter sidebar's Version section controls which versions appear
in workspace listings and search results. When selected, it shows the latest published version
of each artifact and its draft, if one exists.

![](../img/userguide/versioning-latest-on.png){:width="80%" class="centered"}

Clear **Latest** to include earlier versions in listings and search results.

![](../img/userguide/versioning-latest-off.png){:width="80%" class="centered"}

Your current folder, access permissions and other filters still determine which artifacts you
see. **Reset all** at the top of the sidebar resets the filters, including selecting **Latest**
again.
