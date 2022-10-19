---
author: John Graybeal
status: Ready
---
# Sharing Via the Web

## **Introduction**

With CEDAR OpenView, you can share your CEDAR content via the web. 
This feature works for templates, elements, fields, and metadata instances. 
You must be the owner of the content to share it, and if you are sharing a metadata instance, 
the template for that instance must already be shared.
Templates, elements, and fields are displayed as empty metadata instances containing the relevant fields.

## **Sharing to the Web**

To share your CEDAR template, element, or field via the web, simply select Enable OpenView via its drop-down menu. 
The CEDAR system will display a message indicating the sharing was successful. 

![](../../../../img/userguide/enable-openview-menu-20190908.png){:width="25%" class="centered"}

To share a CEDAR metadata instance via the web, 
you must also share the template on which the instance is based. 
If you are not the owner, contact the owner or the CEDAR team to get help sharing the template. 
After the template has been shared, you will be able to successfully share the instance. 
(If you do not share the template, anyone who visits the shared metadata instance 
will see an error message rather than the actual metadata.)

## **Viewing the Shared Content on the Web**

To view the shared content, select Visit OpenView via the artifacts drop-down menu. 
This brings up the OpenView, a public view of the shared content, in another web page.  
You can copy the URL for the OpenView and share it with anyone else for viewing.

Once at the OpenView page display the content, you can view the metadata for the content by clicking on a downarrow in the title bar. 
The document metadata includes a link to open the document within CEDAR. 
This link will only work if the user has a CEDAR account with permissions to view the document.

The OpenView page lists the field type icons at the bottom of the main section. 
Below that it offers the option to view the 'raw source' representations of the content. 
For a template, element, or field, that will display the JSON Schema for the CEDAR artifact.
For a metadata instance, you can view JSON-LD or RDF views of the metadata, 
as well as the JSON Schema of the template on which the metadata instance is based.

## **Ending Sharing**

The owner of a CEDAR document that has OpenView enabled may choose to disable the OpenView at any time, 
using the Disable OpenView menu item from the document's drop-down menu.
