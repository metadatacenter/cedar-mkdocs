---
author: Jennifer Vendetti
---
# Use Case: Building resusable groups of CDEs

This page covers the basics of building elements in the {{ page.cedarw }}, with a special focus on CDEs.

- [Introduction](#intro)
- [Step-by-step guide: build an element](#step-by-step-guide)
  - Step 1 - [Navigate to your workspace](#workspace)
  - Step 2 - [Create a new element](#create-element)
  - Step 3 - [Add CDEs to your element](#add-cdes)
  - Step 4 - [Configure CDE options](#configure-cdes)
    - [Preferred labels](#opts-labels)
    - [Cardinality](#opts-cardinality)
    - [Required vs. optional](#opts-required)
    - [Suggestions](#opts-suggest)
    - [Hidden](#opts-hide)
    - [Permissible values](#opts-values)
- [Arranging CDEs in elements](#arrange-cdes)
- [Deleteing CDEs from elements](#delete-cdes)
- [Nesting elements](#nesting)
- [Adding elements to templates](#cdes-in-templates)

***

# Introduction
<a name="intro"></a>

Modules in the NCI Form Builder act as containers for one or more questions, allowing end users to create reusable groupings of questions for placement on forms. Equivalent functionality is available in the {{ page.cedarw }}, i.e., users can create elements with one or more fields and add them to templates.

Refer to the following graphical representations for terminology comparison:

**Form Builder**

~~~
|-- Module
|   |-- Question/CDE
|   |-- Question/CDE
|   |-- Question/CDE
~~~

**{{ page.cedarw }}**

~~~
|-- Element
|   |-- Field/CDE
|   |-- Field/CDE
|   |-- Field/CDE
~~~
<br />

# Step-by-step guide: build an element
<a name="step-by-step-guide"></a>


This section of the documentation will walk you through the mechanical steps of creating elements in the {{ page.cedarw }}.

## Step 1 - Go to your Workspace
<a name="workspace"></a>

Navigate to the [{{ page.cedarw }}](https://cedar.metadatacenter.org/){:target="_blank"} and make sure you're logged in. If you need help creating an account and logging in, see the [Accounts and Logging In](../../basic_topics/a1_accounts_and_logging_in/) section of this guide.

Click the Workspace link in the upper-left portion of the window to start out in your personal workspace.

## Step 2 - Create a new element
<a name="create-element"></a>

Click on the "New +" button in the upper-left portion of the window, and select "Element" from the resulting dropdown menu:

!["New +" menu with Element selected {{ page.cedarw }} element designer view](../../../../img/userguide/cadsr/new-element-menu-item.png)<br />

This will create a new element and open the element designer view. 

In the dark gray header at the top of the page, enter a name and description for your element, leaving the Identifier field blank:

![New element in the {{ page.cedarw }} element designer view](../../../../img/userguide/cadsr/new-element.png)<br />

Click the "SAVE ELEMENT" button. This will ensure that your new element is saved in the {{ page.cedarw }}. If you need to exit your browser and return to this tutorial at a later time, your new element will appear in your workspace, and you can double-click on it to reopen the element designer.

## Step 3 - Add some CDEs
<a name="add-cdes"></a>

Locate the vertical toolbar on the right-hand side of the element designer and click the "Search for fields and elements" button (depicted with a magnifying glass icon):

![Search for fields and elements button in the vertical toolbar](../../../../img/userguide/cadsr/vertical-toolbar-magnifier-icon.png)<br />

This will launch a modal dialog where you can use the search bar across the top to locate the desired CDE by entering, e.g., the Public ID or double quoted CDE title. Use the search icon or press the Enter key to perform a search and view the results:

![Modal search dialog](../../../../img/userguide/cadsr/search-dialog2.png)<br />

You can select items in the list of search results to display a details pane on the right hand side of the dialog for viewing informaton such as the CDE owner, storage location, version number, etc.

If you need more information about how to efficiently search for CDEs in the {{ page.cedarw }}, please refer to the ["Finding CDEs"](../finding_cdes) page.

Once you locate the desired CDE, select it in the middle pane of the search dialog and click the "SELECT" button. This will insert the CDE into your element and return to the element designer.

![CDE inside an element](../../../../img/userguide/cadsr/add-cde-to-element.png)<br /> 

Feel free to practice by adding several more CDEs of your choice to your element:

![Element with multiple CDEs](../../../../img/userguide/cadsr/element-with-cdes.png)<br />

Note that CDEs aren't the only type of fields you can add to elements. The {{ page.cedarw }} has a large variety of field types such as short or long text, links, images, section breaks, multiple choice, etc. All of these fields are accessible via the vertical toolbar on the right hand side of the element designer. For more detail on the various field types, you may find the [Field Type Reference](../../sections/c2/field_type_reference/) page in the [Building Basic Templates](../../cedar_templates/c2_building_basic_templates/) portion of the user guide helpful.

Don't forget to periodically click the SAVE ELEMENT button to save your changes as you work your way through the documentation.

## Step 4 - Configure CDE options
<a name="configure-cdes"></a>

Click on the header bar (shows the field type and CDE's public identifier) of any of the CDEs you added to your element to show the expanded view of the CDE:

![CDE in expanded view](../../../../img/userguide/cadsr/expanded-cde.png)<br />

CDEs are imported into the {{ page.cedarw }} as trusted artifacts, which means that many of the options are write protected and unmodifiable, e.g., the CDE's name and help text. There are some common options however, that users are allowed to configure.

### Preferred labels
<a name="opts-labels"></a>

To modify the preferred question text (aka "preferred label" in the {{ page.cedarw }}), click the second text box from the top to display a dropdown list of alternate preferred labels. You can also click the "OPTIONS" link at the bottom of the CDE to view a tag group depiction of all possible labels:

![CDE preferred label options](../../../../img/userguide/cadsr/cde-options.png)<br />

The other bits of information displayed under the OPTIONS link are unmodifiable, but still may be of interest because they allow you to see configurations specific to the CDE type. In the screen shot above, minimm and maximum string length options are displayed because the CDE is a text type field. If you open the options for a CDE that is a numeric type field, you see a different set of options, e.g., unit of measure, decimal places, etc.:

![CDE numeric options](../../../../img/userguide/cadsr/cde-options-numeric.png)<br />

### Cardinality
<a name="opts-cardinality"></a>

Use the MULTIPLE link at the bottom of any CDE to specify whether the CDE is allowed to appear multiple times (or not at all) in your element. Click the horizontal bar under YES, and use the MIN and MAX buttons to specify the number of allowed occurrences:

![CDE cardinality options](../../../../img/userguide/cadsr/cde-options-multi.png)<br />

If you specify a cardinality and click the SAVE ELEMENT button, note that the cardinality is then shown as part of the field header, e.g., "1..N" for minimum of one, maximum of unlimited:

![CDE cardinality options](../../../../img/userguide/cadsr/cde-header-cardinality.png)<br />

### Required vs. optional
<a name="opts-required"></a>

The REQUIRED link allows you to specify whether or not the CDE needs to be filled out. If YES is selected, a red asterisk appears in the CDE header:

![CDE cardinality options](../../../../img/userguide/cadsr/cde-header-required.png)<br />

### Suggestions
<a name="opts-suggest"></a>

Setting SUGGESTIONS to YES enables the {{ page.cedarw }} intelligent authoring suggestion system for the field. For a detailed explanation of this functionality, see [Understanding the Suggestion System](../../sections/c4/understanding_the_suggestion_system/).

### Hidden
<a name="opts-hide"></a>

Use HIDDEN if you want a particular field/CDE to be hidden from the end user during template population.

### Permissible values
<a name="opts-values"></a>

If you added a CDE to your element with permissible values, aka "values" in the {{ page.cedarw }}, you will see a VALUES link at the bottom of the CDE:

![CDE cardinality options](../../../../img/userguide/cadsr/cde-values-link.png)<br />

To view the values, click the ARRANGE link, which launches the Arrange Values modal dialog:

![Arrange Values modal dialog](../../../../img/userguide/cadsr/arrange-values-modal.png)<br />

Hover your mouse over individual values to display right hand icons that allow you to either delete a value, or move the value to the top and/or a specific position in the list:

![Reposition allowed values](../../../../img/userguide/cadsr/reposition-values.png)<br />

Adding values is not currently possible from within the {{ page.cedarw }}. Requests for new values should be submitted via email to the following address: [caDSR.RA@mail.nih.gov](mailto:caDSR.RA@mail.nih.gov).

# Arranging CDEs in elements
<a name="arrange-cdes"></a>

The {{ page.cedarw }} user interface has full drag-and-drop support. To rearrange the ordering of your CDEs and other fields, simply click on the headers and drag to the desired location.

# Deleteing CDEs from elements
<a name="delete-cdes"></a>

To delete CDEs and other fields from your element, click the 'X' icon on the top right corner of the header:

![Delete button for a field](../../../../img/userguide/cadsr/field-delete-button.png)<br />

# Nesting elements
<a name="nesting"></a>

The {{ page.cedarw }} allows users to nest elements inside of other elements. Note that nesting is restricted to one level deep. Adding an element to your element is done in the same way that you added CDEs. Click the "Search for fields and elements" button in the vertical toolbar, and select your element using the modal search dialog. When you add an element inside of another element, the user interface uses a slightly different border display to indicate the nesting:

![A nested element](../../../../img/userguide/cadsr/nested-element.png)<br />

# Adding elements to templates
<a name="cdes-in-templates"></a>

Once you have created and saved elements in the {{ page.cedarw }}, you are now able to add those elements to any templates for which you have write access. As a quick example, navigate to your workspace, click the "New +" button, and select Template from the resulting dropdown menu. Use the "Search for fields and elements" button in the vertical toolbar to launch the modal search dialog and select one of your newly created elements. The following screen shot depicts a new template that contains the element created in this step-by-step guide:

![A new template with an embedded element](../../../../img/userguide/cadsr/template-with-element.png)<br />

A key thing to note about elements embedded within templates is that only the element name, preferred label, and help text are modifiable. If you need to make changes to the fields within an element, this can't be done from inside the template. 

If you find that you added an element to a template and later decide you want to make changes to the element, you could use a workflow something like the following:

- Remove the element from your template
- Exit your template
- Locate the element, make the desired changes in the element designer, and save the element
- Reopen the template
- Add the element with the desired modifications
