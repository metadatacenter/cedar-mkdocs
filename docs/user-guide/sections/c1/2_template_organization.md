---
author: John Graybeal
status: Ready
---
# Template Organization

## **Internal Organization**

All information for the Metadata Template is stored internally in the JSON Schema format. 
CEDAR lets you view the template in this format at any time during template creation.
See [Viewing Resource as Raw JSON](../../a3/4_viewing_resource_as_raw_json/)
to learn how to view the template in its raw form.

The three Metadata Template functions (define questions, order the questions, and 
describe the template) are roughly organized into three sections in the JSON Schema template artifact.  
The details of the template artifact's format is described in more detail in the [CEDAR Template Model](https://metadatacenter.org/tools-training/outreach/cedar-template-model).

## **Logical Organization**

As a CEDAR user you will compose Metadata Templates from Template Elements and Template Fields.
These three CEDAR resources, which we call templating resources, together establish the  
questions for the metadata user to fill out. The actual process is described in 
the [Building Basic Templates](../../../cedar_templates/c2_building_basic_templates/)
chapter.

As you reuse elements that you or others have created, CEDAR copies those elements 
into the main template, in whatever order you place them. You can reorder the elements and 
top-level fields in the template, but can not reorder fields within the template's elements.

Metadata *about* the template are entered automatically by the system, and manually by you
as the template creator. Fields you add include the title and the description of the template.

You may also add metadata fields to the template that are hidden from the end user. 
(You set the values of those fields using the Default tab for the field.)
While these added fields can contain information about the template—or about 
anything else you want to describe in the final metadata instances—they are stored 
in the same way as the other metadata fields that you add to the template. 








