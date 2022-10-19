---
author: John Graybeal
status: Ready
---
# Field Type Reference

## **Field Type Reference**

While specifying a field in a templating resource (a Template, Element, or Field), 
you can customize the Field resource in a number of ways,
including constraining the values that metadata editors can input 
when they enter their metadata for the field. 
Some customizations apply to almost every field type; 
others are only allowed for one or two field types.

All the customizations listed in the Reference tables are described 
after the Reference Tables subsection. 

### Reference Tables

The tables in this subsection show the field types that CEDAR offers, 
and the customizations or purpose supported by that field type.

#### Data entry fields

All data entry fields support the Required and Value Relation features, 
and all of them support the Multiple feature except those noted in the next table.

The following table lists CEDAR's supported customizations 
unique to each field type for data entry. 
It also shows the Data Type(s) used by CEDAR
for those field types.
If the Data Type(s) column is blank, the field type is the default (a text string).

| Unique Field Type | Data Type(s) | Unique Supported Customizations |
| --------- | :----- | :-------------- |
| Short Text |   | Values; Suggestions; Hidden; Default  |
| Paragraph Text |   |   |
| Email |   |   |
| Phone |   |   |
| Link |   |   |
| Numeric | any number (xsd:decimal); integer (xsd:integer); long integer (xsd:long); single-precision real (xsd:float); double-precision real (xsd:double) |  Unit of Measure, Minimum Value, Maximum Value, Decimal Places  |
| Date |  xsd:date |   |
| Multi-Choice |   | Default; _no Multiple_  |
| Checkbox |   | Default; _no Multiple_ |
| Pick From List |   | Single Select vs Multi-Select; Default; _no Multiple_  |

A special type of data entry field is the Attribute-Value field type, 
which lets the metadata author name the Attribute _and_ provide the Value 
when entering the metadata. 
This field type allows multiple (unlimited) entries by design.

#### Special field types for presentation

The following special field types do not support data storage for the metadata creator,
but allow the template author to customize presentation of the template
to the metadata creator.

| Special Field Type | Description | Purpose |
| --------- | :--------- | :------- |
| Section | Creates a section break | Provides a textual separator with optional explanatory text  |
| Page | Creates a page break | Breaks up form into multiple pages (screens) when entering metadata |
| Rich Text | Support entry of rich text in HTML  | Provide a descriptive lead-in to the _following_ field for metadata creators |
| Image | Specify location of an image to display | Provide a static visual lead-in to the following field for metadata creators |
| YouTube | Specify location of a YouTube video to display | Provide a video lead-in to the following field for metadata creators |  


###  Customization Descriptions

This subsection describes the field customizations,
which are presented in alphabetical order by name.

#### Decimal Places (Numeric field Option)

You can specify the number of decimal places used to constrain and display the value 
entered by the metadata author.  
The metadata author will not be able to enter more decimal places 
than the value specified by this option 
(or if more decimal places are entered, the value will be rounded
to fit into the specified number of decimal places).

This customization has no impact if the Numeric field type is an integer type.

#### Default Value (Text field Option)

The Default Value option specifies the value for the field if the metadata author does not
add a value to that field when filling out the metadata. 
The value can be either a string or a controlled term.
The controlled term must be expressed as an IRI from BioPortal.

#### Minimum/Maximum Value (Numeric field Option)

For numeric fields, you can specify a minimum legal value, a maximum legal value, or both.
Users entering metadata will be warned in real time 
if entered values do not meet the field's value limit specifications.

#### Minimum/Maximum String Length (Text field Option)

With this option you can set a minimum length for the string, 
a maximum length for the string, or both.
Users filling out the metadata will see a warning if the metadata is saved while 
the value in this field has a text length that does not satisfy the criteria.

#### Multiple

When Multiple is set to Yes, the Template Designer displays a control to define
the minimum and maximum number of entries allowed for the field. 

If Multiple is set to Yes, then the Metadata Editor 
provides an interface to fill out the field multiple times. 
The Metadata Editor forces the specified minimum number of fields to be present
(though the user is not forced to fill out the fields with values). 
The Metadata Editor prevents creating more than the maximum number of entries 
by making the field Copy icon unavailable. 

#### Number Type (Numeric field Option)

CEDAR provides a default numeric field (decimal), whose values can be entered as 
either an integer or floating point number. (Exponential notation is not supported.)
As a template creator you can also choose a more specialized number type for this field.

To select a specialized number type for the field, click on the drop-down menu 
labeled 'Any numbers'. Select from the list of number formats, including 
long-integer numbers, integer numbers, double-precision real numbers, and
single-precision real numbers. 
Your choice will be reflected in the JSON value type used 
to describe the number field in the template (JSON Schema), and 
to specify the entered value in the metadata (JSON-LD). 
The Data entry field table in the Reference Tables section lists 
the specific JSON value types used for each case. 

#### Required

If this option is set to Yes, the Metadata Editor indicates to the metadata author
that the field is required, and issues a warning when the metadata is saved 
while this field has not been filled out with metadata.

The metadata author can choose to ignore the warning and save the metadata 
even though the required field is not completed.

#### Suggestions 

Set the Suggestions tab to Yes to enable intelligent authoring suggestions 
for this field from CEDAR. 
You can read a detailed explanation of the suggestions system 
at [Understanding the Suggestion System](https://metadatacenter.github.io/cedar-manual/sections/c4/understanding_the_suggestion_system/).

#### Unit of Measure (Numeric field Option)

You can specify a unit of measure for the field as a string. 
The string will be displayed to viewers and editors of metadata created using this field,
both before and after a value is entered for the field. 

#### Value Relation

The Value Relation customization provides a unique capability to the CEDAR metadata model 
for making metadata more semantic. 

For every metadata-entry field, the Value Relation optionally defines
the relationship from the field's immediate parent entity 
(either the Element containing the field, or if the field is at the top level,
the Template containing the field)
to the field's value. For example, when the Value Relation is 'has study characteristic'
from the Ontology for Clinical Relations (IRI of http://purl.org/net/OCRe/OCRe.owl#OCRE406000), 
the resulting metadata will be readable as
`<ParentElement> has_study_characteristic <user-selected-value>`
where each of the 3 elements is replaced with its corresponding unique identifier (IRI).

To select a Value Relation, click on the RDF icon at the right side of the field.
This brings up a search field that allows you to choose an appropriate Value Relation.
(If the search brings up Classes instead of Properties, 
click on the Start Over button to clear the previous search.) 
Once you select a property, you are returned to the template. 

The selected property can be viewed by clicking on the drop-down arrow 
next to the RDF icon. 
Do so carefully, as clicking on the RDF icon again will clear any existing property 
and begin a new search.

#### Values
![](../../../../img/userguide/text-field-values-tab-20191229.png){:width="50%" class="right"}
The Values tab shows a view of the current value set(s) that the metadata author
can use to fill out a text field. If no selections are listed, the metadata author
is prompted to enter free text. 
This ability to choose controlled values for the field is fundamental
to CEDAR's semantic capabilities. 

![](../../../../img/userguide/controlled-term-selection-modal-20191229.png){:width="50%" class="right"}
Clicking on the Add button brings up a modal window 
from which you can select the term, branch, or ontology 
from which legal values may be chosen by the metadata author. 
After you've made the selection, you will be returned to the view of the field
which includes a line describing your selection.

You can repeat this process by (clicking the Add button) 
as often as you want to select additional 
terms, branches, or ontologies.
You can remove any of the selected terms, branches, or ontologies
by clicking on the X to the right of the row you want to delete.

Advice about finding and choosing controlled values is available in the [Choosing Controlled Terms](https://metadatacenter.github.io/cedar-manual/sections/c2/choosing_controlled_terms/)
section.
