# Managing Resources

In CEDAR, resources are the artifacts (templates, elements, fields, and metadata instances)
and the folders that hold them. You manage them from your
[workspace](your-cedar-workspace.md). Management covers copying, moving, renaming, and deleting
resources, and setting their sharing permissions.

To fill out metadata for a template, the **Populate** command opens the Metadata Creator set
up for that template. To edit an artifact, including a filled-out instance, the **Open**
command opens the right tool: the Template Designer for templates, elements, and fields, and
the Metadata Creator for instances. For a folder, **Open** shows that folder in the middle
pane. Other commands, such as Publish, Create Version, and Submit, are covered in their own
sections of this guide.

Every command lives on a resource's menu, opened by the vertical dots (the kebab menu, **⋮**)
at the right of the resource. From it you can move, copy, rename, delete, and share the
resource. A grayed-out item, such as Copy…, is unavailable for that resource. If *every* item
is grayed out, no resource is selected, or there is a permissions inconsistency.

## Choosing a Destination

The **Copy to…** and **Move to…** commands open a window for choosing where the resource
should go, starting from your current folder. Click the left arrow to move up the hierarchy,
the right arrow on a folder to move into it, and the Home icon at the upper left to return to
your workspace. Navigating to a folder you lack permission for shows an error.

A destination is always selected. With no folder highlighted, the destination is the folder on
display; with one highlighted, that folder is the destination.

![](../img/userguide/destination-selection-window-20190912.png){:width="50%" class="centered"}

### Copy To

After choosing **Copy to…**, select the destination folder and click COPY. Copying needs read
permission on the resource, and write permission on the destination. You can copy any artifact
to a folder you can write to, but you cannot copy a whole folder in one command.

### Move To

After choosing **Move to…**, select the destination folder and click MOVE. Moving needs write
permission on the resource. You can move any artifact or folder to a folder you can write to.

## Rename

After choosing **Rename…**, enter the new name. Renaming needs write permission on the
resource.

## Share

The **Share…** command opens the sharing window, where you handle all sharing and group
management. See [Sharing Resources](sharing-resources.md) for details.

## Delete

**Delete** shows a confirmation box, then removes the item. Use it with care: there is no undo.

![](../img/userguide/cedar-resource-menu-20190912.png){:width="75%" class="centered"}
