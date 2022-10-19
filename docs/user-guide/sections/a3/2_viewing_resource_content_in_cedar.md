---
author: John Graybeal
status: Ready
---
# Viewing Resource Content in CEDAR

We use the phrase 'viewing resource content' to mean looking at the resource in human-friendly form, in this case within the CEDAR application.

When you want to open an artifact for viewing that is listed in the Desktop view, 
either double-click on the artifact,
or select the artifact and use the resource menu (*⋮*) to select Open.
Both techniques work whether you are in search or browse mode.

The artifact will open in the appropriate editor for that artifact. This is the Template Designer for templating artifacts—templates, elements, and fields—and the Metadata Editor for metadata instances. 

In either case, the editor is opening a modal window, and no other CEDAR tools are accessible until the window is dismissed. 
The artifact is saved only when you click the Save button; it will not be saved if the browser window is closed or a back button is pressed, although a warning is issued.

<h1>All Artifact Editors</h1>

When the artifact opens, you will see a formatted view of its content.
You can navigate throughout the artifact,
in some cases open and close sections of the document, 
and if you have write permission, make changes to the document. 

<h2>Artifact Headers</h2>

At the top of the view, you will see the name of the artifact, 
an identifier field, and the artifact description. 
All three fields can be modified by a user with write permission on the artifact.

To the left of the artifact name is a left arrow. 
If you click on this left arrow, CEDAR will return to the previous folder view.
(If the current document is modified but not saved, 
you will be warned and given a chance to save your work.)

To the right of the left arrow is an artifact type icon, 
showing the kind of artifact being modified. 
The following images show the artifact type icons 
for templates and instances.
![](../../../../img/userguide/metadata-editor-title-icon-2019117.png){:width="44%" class="right"}
![](../../../../img/userguide/template-designer-title-icon-2019117.png){:width="40%"}

![](../../../../img/userguide/artifact-editor-artifact-status-good-2019117.png){:width="15%" class="right"}
In the upper right of each editor is an artifact status display, shown to the right.
The artifact display shows white icons to reflect normal status, 
and yellow icons if there is an issue. 
The left-most icon indicates whether the artifact has been modified without saving. 
The center icon indicates whether the document can be edited, 
showing a locked icon if it can not be edited. (This can happen if you do not have permission to edit the document, or if the document is a published version, 
which means no one can edit it.) 
The right icon shows whether the document validates. 
(The document should always validate if the system correctly implements
the template model specifications.)

<h2>Artifact Footers</h2>

At the foot of every artifact one or two horizontal bars let you view the raw format of the artifact.  See [Viewing Resource as Raw JSON](https://metadatacenter.github.io/cedar-manual/sections/a3/4_viewing_resource_as_raw_json/) for more information.

<h1>Template Designer View</h1>

For templating artifacts, the Template Designer
will show the elements and fields of the template,
with visual indentation to show the organization of the elements within the template.

![](../../../../img/userguide/template-designer-example-2019117.png){:width="75%" class="centered"}

There is also an identifier field, which can be used to provide an external identifier for the template. (This is not the same as the artifact's identifier, which is always a CEDAR-generated IRI.) The external identifier does not have to be an IRI, and does not have to be unique across different artifacts, though both are highly recommended.

More information about using the Template Designer can be found in the CEDAR Templates chapter, starting with [Description of a Template](https://metadatacenter.github.io/cedar-manual/cedar_templates/c1_description_of_a_template/).

<h1>Metadata Editor View</h1>

For metadata instances, the Metadata Editor
will show the metadata as a form to be filled out,
again with visual indentation to show the organization of the elements within the form.

![](../../../../img/userguide/metadata-editor-example-2019117.png){:width="75%" class="centered"}

If there is an arrow to the left of a given line, 
clicking on the arrow will expand or collapse the content under that entity.

Information about using the Metadata Editor can be found in the Filling Out (Creating) Metadata chapter, starting with [Filling Out Metadata](https://metadatacenter.github.io/cedar-manual/sections/a5/2_filling_out_metadata/).



