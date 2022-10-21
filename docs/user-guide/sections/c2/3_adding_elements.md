---
author: John Graybeal
status: Ready
---
# Adding Elements

An Element resource is composed of field definitions (possibly imported within Field artifacts) and other Element resources. 
(CEDAR does not handle recursion in Element resources.) 
These Element resources enable Template creators to share, reuse, and extend existing Element resources across different Template resources and across user groups. 

This section is divided into two parts. (1) First, we create a new Element resource. 
(2) We embed the newly created Element resource within our Template resource. 

## **Creating a new Element Resource**

To create a new Element resource, return to the Desktop if you are not already there. 
(Use the "Back" button in the Template Designer—you may be prompted to save the artifact you are currently editing.) 
Click on the "New" button in the navigation sidebar of the Desktop, 
and select the "Element" option from the dropdown menu. 
This action will launch the Element editor view of the Template Designer, 
as shown below. 

![](../../../img/userguide/element-artifact-created-20200101.png){:width="80%" class="centered"}

Enter the human-readable Name, Identifier and Description of the Field 
using the three text input fields ('Untitled', 'Identifier', 'Description') 
underlined in the image below. 
Note the Name is used as the name of the artifact in CEDAR, 
and can also be changed from the Desktop.

Now the content of the Element artifact can be created.
Field definitions can be added directly, or by importing Field artifacts;
instructions for both operations are found in the [Adding Fields](https://metadatacenter.github.io/cedar-manual/sections/c2/2_adding_fields/) section.

Element content can also be created by importing existing elements,
as described below.

At any time during or following the Field artifact's creation, 
you can save the artifact and use the Template Designer's left-arrow
to return to the Desktop. 
From there, you can modify the name, access permissions, and
public visibility of the Field artifact, as described in
[Managing CEDAR Resources](https://metadatacenter.github.io/cedar-manual/sections/a4/managing_cedar_resources/).

### **Spreadsheet-compatible Elements**

If you want users to be able to fill out their metadata using a spreadsheet—
especially valuable if there are a lot of fields to be filled out with existing metadata—
you must create your element to satisfy a particular requirement.

An element that is to be filled out as a spreadsheet must be 'flat', 
meaning there are no further hierarchies or arrays within the element. 
Embedding another element, or allowing multiple entries for any of its entries, 
will prevent the user from displaying the element in spreadsheet mode.
Also, the MULTIPLE attribute of the element must be defined to allow multiple entries.

The process of filling out the metadata using spreadsheet mode
is described in [Spreadsheet entry](https://metadatacenter.github.io/cedar-manual/sections/a5/2_filling_out_metadata/). 

## **Embedding the Element Resource**

When you are editing a Template or Element,
the search (magnifying glass) icon in the Template Designer's field addition menu 
brings up a window to find other CEDAR templating resources—Elements or Fields—that 
can be imported into the Element or Field you are editing.
![](../../../img/userguide/artifact-import-window-20200101.png){:width="60%" class="centered"}

The navigation path in the lower left of the window starts in the current directory
(from the last Desktop view), and can be used to navigate to other locations in CEDAR.
However, most users will find Elements and Fields by searching for them.

To perform a search, begin entering a search string in the search field of the window.
In the image below, 'Address' has been added and the search performed when the user
hit the return key. You can see that Elements and Fields are visible in the search results.
![](../../../img/userguide/artifact-import-window-search-20200101.png){:width="80%" class="centered"}

To investigate a particular discovered Element for suitability,
click on the Element to bring up its description, as seen below.
![](../../../img/userguide/artifact-import-window-metadata-20200101.png){:width="80%" class="centered"}

To embed an Element or Field artifact in your templating resource, 
either double-click on the artifact, 
or click once on the artifact and then click on the Open button.
The Element or Field will be incorporated at the end of your templating resource.

Within the templating resource, you can not edit the core characteristics of 
imported content (the Element or Field), 
including the order of components within an imported Element.
You will be able to relabel the imported content,
and will be able to choose a property that relates the imported artifact to its parent.

You can move an any imported Element or Field in your templating resource
by dragging it where you want it.
Use the drag handles at the upper left of the Element to grab it, and drag up or down. 
If you have trouble dragging it to the desired location,
try shrinking the view within your browser 
to put more of the templating resource on the screen.
(Note: You can not change or organize content in an imported Field or Element.)





