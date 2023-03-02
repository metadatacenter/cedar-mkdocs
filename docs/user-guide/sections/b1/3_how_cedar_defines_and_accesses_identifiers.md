---
author: John Graybeal
status: Ready
---
# How CEDAR Defines and Applies IRIs (URIs, URLs)

This page describes the CEDAR unique identifier format. 
The advanced user may wish to consult the [CEDAR Template Model Specification](https://more.metadatacenter.org/tools-training/outreach/cedar-template-model) for more information.

A CEDAR artifact has a unique identifier that is of the following form:
`https://repo.metadatacenter.org` / `[type]` / `[UUID]`

Here, `type` can be any of template-instances, template-fields, template-elements, templates, or folders.
A UUID is a unique 36-character string with 4 hyphens embedded, as in the following: `4595e3d3-b0c5-467b-a967-fec870801624` .

These IRIs are not directly resolvable, but can be plugged into one of the following forms to try to resolve them:

- Folder: `https://cedar.metadatacenter.org/dashboard?folderId=` followed by the _encoded_ IRI 
- Template: `https://cedar.metadatacenter.org/templates/edit/` followed by the IRI
- Element: `https://cedar.metadatacenter.org/elements/edit/` followed by the IRI
- Field: `https://cedar.metadatacenter.org/fields/edit/` followed by the IRI
- Metadata Instance: `https://cedar.metadatacenter.org/instances/edit/` followed by the IRI

CEDAR users also have unique identifiers, which are encoded in any artifact that the user creates or updates. 
These are of the form 
`https://metadatacenter.org/users` / `[UUID]`

CEDAR metadata instances also create another kind of template-element-instance identifer, 
but these are not of practical use to anyone using the CEDAR user interface.
