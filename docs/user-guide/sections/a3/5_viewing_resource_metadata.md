---
author: John Graybeal
status: Ready
---
# Viewing Resource Metadata

There are 3 ways you can view metadata about a CEDAR resource: within your CEDAR Workspace view; in the OpenView of any artifact that has OpenView enabled; and by looking at the content. Each of these is described below.

As a reminder, the term 'resource' refers to any CEDAR artifact or folder; while 'artifact' refers only to templating resources (templates, elements, and fields) and metadata instances. 

<h1>In the CEDAR Workspace</h1>

By selecting any resource in the main file viewing window in your CEDAR Workspace (see diagram below), you can view an information panel to the right side of the display
with metadata for that resource.
Click on the 'i' icon (shown as item L in the diagram) to make the metadata panel visible
if it is not already visible.

If no resource is selected, the 'i' icon presents metadata about the folder (B) shown in the Resources box. The right-hand smaller image below shows the information panel for one of these artifacts.

The information panel displays 3 types of metadata in the corresponding tabs: metadata about the resource's general characteristics; metadata about an <a href="https://metadatacenter.github.io/cedar-manual/sections/c4/updating_and_versioning/">artifact's version history</a> (for templating resources only, not instances); and metadata about the categories into which the resource has been classified (artifacts only, not folders).

In the main window, most of the metadata is self-explanatory, but there are two features of special interest. The Description field is the same content as the description at the top of the artifact when it is open, and this field is editable in the information panel. Also, for metadata templates the panel shows all the metadata instances that are visible to you; clicking on any of the instances in the list will open it. The count at the top of that metadata instances sub-panel is the count of instances you can see, and the total count of instances.

![](../../../../img/userguide/cedar-workspace-annotated-20190911.png){:width="75%" class="centered"}

<h1>Metadata in an artifact's OpenView</h1>

If an artifact has OpenView enabled, you can navigate to the OpenView either with the direct IRI (if you have it), or by navigating to the artifact in CEDAR (if you have access to that) and clicking on the Visit in OpenView resource menu item. 

In either case, the top line of the artifact in OpenView has a metadata block with the title in the middle. By clicking on this metadata block, you will unfold a metadata view, as shown in [Viewing Resource Content on the Web](https://metadatacenter.github.io/cedar-manual/sections/a3/3_viewing_resource_content_on_the_web/)

<h1>Metadata in the raw artifact views</h1>

By looking in any [raw artifact view](https://metadatacenter.github.io/cedar-manual/sections/a3/4_viewing_resource_as_raw_json/),
you can see the metadata that CEDAR maintains as part of that artifact.

To understand the metadata in more detail, 
you will need to understand the CEDAR Template Model, as described in the [Description of a Template](https://metadatacenter.github.io/cedar-manual/cedar_templates/c1_description_of_a_template/).
