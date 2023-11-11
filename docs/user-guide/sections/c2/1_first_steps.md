---
author: John Graybeal
status: Ready
---
# First Steps

In the first steps to create a CEDAR Metadata Template resource, 
you will provide a human-readable label, a unique identifier, 
and a description of what the Template resource represents (e.g., "Injury-related treatments"). 

To create a new template, first click the "New" button on the Desktop's navigation sidebar
(upper left of the Workspace view) and
select the "Template" option in the dropdown menu. 
This step opens the Template Designer as shown below. 

Enter the human-readable Name, Identifier and Description of the Template resource 
using the three text input fields ('Untitled', 'Identifier', 'Description') 
underlined in the image below. 
The Name is used as the name of the artifact in the Desktop, 
and can be changed from the Desktop view.

![](../../../img/userguide/creating-new-template-20191216.png){:width="80%" class="centered"}

You can [save and close your Template](../../c2/4_saving_and_closing/) at any time and return to it later. You can open it for viewing or editing
(or any other Template for which you have those access privileges) 
by double-clicking on its icon in the Desktop. 

## **Useful Content Tips**

By default CEDAR searches look at the artifact Name, Identifier, Description,
and Version fields for matches,
so consider what terms will be most important to include 
for searches to find your template. 

**Name:** The name of the template should fit easily into the Workspace view if possible, 
keeping in mind that CEDAR names metadata instances by appending 'metadata' 
to the template name. 
The Name is analogous to the title of a web page. 
As a rough guideline, allow about 40-50 characters for your label.

You don't need to append 'Template' or 'Form' to the end of the label; 
this will be clear from context.

**Identifier:** For CEDAR templating artifacts, the Identifier 
refers to an external identifier
of an artifact corresponding to this template, not a CEDAR identifier.
You do not have to create an identifier; 
in fact, typically you will leave this field blank. 
The attribute is provided for users
who want to identify an external entity associated with this template. 
The Identifier works best when unique identifiers for the external objects
can be automatically assigned and persistently maintained.
(Please note this Identifier corresponds to the template, 
*not* for the metadata instances filled out for this template.)

**Description:** This description can be any length; 
a sentence or short paragraph is common. 
Describe the subject that the template is documenting; 
since we already know from context this is a CEDAR template, 
you don't have to include that in the description.  
Of course we also know it describes metadata, 
but "Metadata describing …" often offers a useful setup for your description.

Because Description is a longer field, it is a good place to include key words or other
information you want to be able to search on to find this field. 

## **Next Steps**

Now, you can fill in the content of your template by [Adding Fields](../../c2/2_adding_fields/) 
and [Adding Elements](../../c2/3_adding_elements/),
or [save and close it](../../c2/4_saving_and_closing/)
to return to it later.
