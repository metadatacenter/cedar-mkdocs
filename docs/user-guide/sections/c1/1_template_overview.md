---
author: John Graybeal
status: Ready
---
# Template Overview

## **Goals for CEDAR's Metadata Template**

The CEDAR Metadata Template ('template') serves three goals:
- defining the template questions (including their possible answers and other features);
- documenting the order in which the questions and elements will appear; and
- describing the template artifact: its name, its provenance including creation and update times,
and its other characteristics. 

We designed the template to meet these goals in a principled and efficient way, 
so that users could easily create templates that maximized production of effective metadata.
We particularly wanted the templates and metadata to be applicable to any discipline or data system, 
and interoperable across those domains with any other system adopting our template model.

## **Basic Description of CEDAR's Metadata Template**

The template is in JSON Schema format, and conforms to a higher-level JSON Schema
specification. 
The higher-level JSON Schema can be used to validate the syntax of any CEDAR template
at any time; errors in this validation are displayed in the Template Designer user interface,
as described in [Filling Out (Creating) Metadata: Saving and Validating](../../a5/3_saving_and_validating/).

The JSON Schema of a given metadata template similarly validates 
any Metadata Instance that CEDAR users create with that template, 
so that the validity of the instance 
can be easily checked inside or outside the CEDAR system. 

You can specify the content and order of questions in the template using the Template Designer. 
You make up a template from Template Fields and Template Elements. 
The Template Elements are made up of other Template Elements and Template Fields.
The [Building Basic Templates](../../../cedar_templates/c2_building_basic_templates/)
chapter describes the template specification process using the Template Designer.

Before reading about the specification process, you may want to review the [next section](../../c1/2_template_organization/),
which more explicitly addresses the organization of the template.




