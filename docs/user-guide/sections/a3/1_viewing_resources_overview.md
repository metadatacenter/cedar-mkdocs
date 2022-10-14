# Viewing Resources Overview

<h1>Introduction to the Resources</h1>

There are four types of resources in CEDAR: folders, metadata templates, metadata elements, metadata fields, and metadata instances. In this section we will drop the term 'metadata' from these names and refer to each resource by its shorter form.

CEDAR folders are used to organize CEDAR content and the sharing settings for that content. To view folder resources you navigate into the folders. This is described in [Navigating Within CEDAR](https://metadatacenter.github.io/cedar-manual/sections/a4/navigating_within_cedar/), under Browsing Within the Desktop.

The rest of this section emphasizes CEDAR artifacts: 
templates, elements, fields, and instances. 
The section summarizes the more detailed content found in subsequent sections.

<h1>Viewing Resource Content</h1>

We use the phrase 'viewing resource content' to mean looking at the resource in human-friendly form, either in the CEDAR application or on the web using OpenView.

<h2>Natively in CEDAR</h2>

To open an artifact for viewing in CEDAR that is listed in the Desktop view, 
either double-click on the artifact, 
or select the artifact and use the resource menu (*⋮*) to select Open.
Both techniques work whether you are in search or browse mode.

You will be shown a viewing window that lets you navigate throughout the artifact,
open and close sections of metadata instances, and if you have write permission,
make changes to the document. 

This is also the view which enables seeing the raw artifact content inside CEDAR.

For more details about this viewing mode, visit [Viewing Resource Content](https://metadatacenter.github.io/cedar-manual/sections/a3/2_viewing_resource_content_in_cedar/).

<h2>On the Web with OpenView</h2>

If you click on the resource menu (*⋮*) and find the OpenView section, 
you will be able to see whether OpenView is enabled for this artifact.
(The View in OpenView command must be selectable.) 

By selecting View in OpenView, you will be directed in a new browser tab
to the web page for this artifact that supports navigation and viewing features.
(Modifications are not available in OpenView mode.) 

You can also see artifact metadata and raw artifact content from the OpenView format.

For more details about this viewing mode, visit [Viewing Resource Content on the Web](https://metadatacenter.github.io/cedar-manual/sections/a3/3_viewing_resource_content_on_the_web/). 

<h1>Viewing Resources in Raw Formats</h1>

All three CEDAR templating artifacts—templates, elements, and fields—are maintained
as JSON Schema documents, an ASCII format following the JSON specification. 
CEDAR metadata instances are maintained in JSON-LD (for JSON-Linked Data), 
which also follows the JSON specification. 
JSON-LD is expressly designed for interoperability with RDF, 
so the CEDAR metadata instances can be expressed as JSON-LD or RDF.

Whichever format applies, the information is accessible at the bottom of the 
artifact's view in CEDAR by clicking on the appropriate link. 
(Raw formats can also be accessed via the web when OpenView is enabled for the artifact.)

For more details about this viewing mode, visit [Viewing Resource as Raw JSON](https://metadatacenter.github.io/cedar-manual/sections/a3/4_viewing_resource_as_raw_json/). 

<h1>Viewing Resource Metadata</h1>

Within CEDAR, metadata for an artifact or a folder is viewed from the Desktop.
Once a resource is selected, if the metadata panel is not visible on the right
side of the Desktop, click on the 'i' information icon to open it.

Another metadata panel is available from the top part of the OpenView format, 
with a different metadata collection appropriate to OpenView users. 

For more details about viewing resource , visit [Viewing Resource Metadata](https://metadatacenter.github.io/cedar-manual/sections/a3/5_viewing_resource_metadata/). 



