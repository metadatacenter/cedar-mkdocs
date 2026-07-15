# Description of a Template

In CEDAR, forms are created as what we call Metadata Templates, or just 'templates'. 
The templates contain individual questions—what we call Metadata Fields, or 'fields'—and 
collections of those fields called Metadata Elements ('elements'). 

## Template Overview

### **Goals for CEDAR's Metadata Template**

The CEDAR Metadata Template ('template') serves three goals:
- defining the template questions (including their possible answers and other features);
- documenting the order in which the questions and elements will appear; and
- describing the template artifact: its name, its provenance including creation and update times,
and its other characteristics. 

We designed the template to meet these goals in a principled and efficient way, 
so that users could easily create templates that maximized production of effective metadata.
We particularly wanted the templates and metadata to be applicable to any discipline or data system, 
and interoperable across those domains with any other system adopting our template model.

### **Basic Description of CEDAR's Metadata Template**

The template is in JSON Schema format, and conforms to a higher-level JSON Schema
specification. 
The higher-level JSON Schema can be used to validate the syntax of any CEDAR template
at any time; errors in this validation are displayed in the Template Designer user interface,
as described in [Filling Out (Creating) Metadata: Saving and Validating](filling-out-metadata.md#saving-and-validating).

The JSON Schema of a given metadata template similarly validates 
any Metadata Instance that CEDAR users create with that template, 
so that the validity of the instance 
can be easily checked inside or outside the CEDAR system. 

You can specify the content and order of questions in the template using the Template Designer. 
You make up a template from Template Fields and Template Elements. 
The Template Elements are made up of other Template Elements and Template Fields.
The [Building Basic Templates](building-basic-templates.md)
chapter describes the template specification process using the Template Designer.

## Template Organization

### **Internal Organization**

All information for the Metadata Template is stored internally in the JSON Schema format. 
CEDAR lets you view the template in this format at any time during template creation.
See [Viewing Resource as Raw JSON](viewing-resource-information.md#viewing-resource-as-raw-json)
to learn how to view the template in its raw form.

The three Metadata Template functions (define questions, order the questions, and 
describe the template) are roughly organized into three sections in the JSON Schema template artifact.  
The details of the template artifact's format is described in more detail in the [CEDAR Template Model](https://metadatacenter.org/tools-training/outreach/cedar-template-model).

### **Logical Organization**

As a CEDAR user you will compose Metadata Templates from Template Elements and Template Fields.
These three CEDAR resources, which we call templating resources, together establish the  
questions for the metadata user to fill out. The actual process is described in 
the [Building Basic Templates](building-basic-templates.md)
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
