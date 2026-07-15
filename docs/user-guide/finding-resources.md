# Finding Resources

## Simple Searching

*To learn about simple navigation in the Desktop, visit [Navigating Within CEDAR](desktop-and-navigation.md#navigating-within-cedar).*

### Searching use the search bar

Searching for a resource in CEDAR is simple if you know text in its title, description, or version. Just input the search string as free text (e.g., "Antibody") in the Search bar provided in the navigation header of the CEDAR Workbench. All the resources  that have the string "Antibody" in their labels, version, or description will be shown.

More advanced search patterns, using wildcards and boolean expressions (with AND, OR, NOT, and parentheses), and searching on fields and their values, are addressed in the following sections.

### Narrowing the list of returned resources

You may find there are too many resources available to you in the returned selection. 
The CEDAR Workbench organizes resources in three different categories, depending on the ownership and sharing: 1) resources created by you, the logged-in user, listed under the "Workspace" tab, 2) resources shared with the logged-in user, and 3) public resources that are shared with every user. 

Searching for a resource in a particular set is very simple. Just click on the given set (e.g., "Shared with everybody") and input the search string as free text in the search bar, as described above. All the resources in the selected set that have the string  listed in their labels, version, or description are shown. 

You can also constrain the resulting resources by their type, as described in [Constraining the Results by Type](#constraining-the-results-by-type).

The search results are illustrated in the Figure below. In later sections, we will demonstrate how to organize and constrain these search results, and perform advanced searches.

![](../img/userguide/search.png){:width="75%" class="centered"}

## Organizing the Results

You can view the search resources either as a grid of different resource tiles (as shown in the figure below) or as a list of different resources. You can switch between these views using the icon highlighted in the small blue rectangle in the upper right of the figure. 

You can also sort the different resources based on their titles, creation dates, and modification dates. To sort the resources, click on the sort icon highlighted in the small red rectangle at upper right, and select from the desired option that pops up. You can also click on the column header to sort by that column.

In the next section, we will discuss how to constrain the search results by filtering on the different resource types.


![](../img/userguide/sort.png){:width="75%" class="centered"}

## Constraining the Results by Type

When you search for resources (for example, all resources that mention "Antibody"), by default all types of matching resources are shown, including folders, templates, elements, fields, and metadata instances. If you have access to many resources, you may find it hard to navigate these lists of matching resources. 

You can constrain the search results by resource type using the type filter. To set a type filter, simply click on the  icons indicated in the left side-bar of the CEDAR Workbench, as highlighted in the figure below. These icons are listed as Template, Element, Field, and Metadata, from left to right. You can also display corresponding type represented by the icon by hovering over the icon. When the icon is displayed as a white icon, the resources for the corresponding type are NOT displayed in the search results (for example, Field resources are not shown in the search results in the figure below). To revert back (that is, to show the Field resources), simply click on the corresponding icon again to make its dominant color green.

There is no way to disable the folder resource, as it is used to navigate to lower levels of content.

These settings also apply to any other view of resources in the Workspace window, for example in the user's home directory. Note the settings persist from one session to the next, as long as the user stays logged in, so subsequent searches will have the same resource type constraints.

![](../img/userguide/filter.png){:width="75%" class="centered"}

## Advanced Searching - Search Fields

This section contains some examples of the query syntax that can be used to find CEDAR artifacts by field name and/or value.

In this section, the term 'field name' refers to the internal name (not displayed label) of fields that 
are defined for that metadata instance. 
It does not refer to the metadata attributes for the instance artifact, for example, the assigned Title of the metadata instance.
Those artifact metadata fields can not yet be searched individually by CEDAR.
(When a search pattern is entered into CEDAR without a prefixed field name, 
CEDAR will search through the title, description, and version number of the artifact for the entered search pattern.)

### Finding metadata instances by field name and/or field value

Suppose the following metadata instance:

![](../img/userguide/field_search_example_1.png){:height="100%" width="100%"}

Examples of queries that will retrieve the instance above:

- Search by field name and value:

  `title:statistics`
  
  `publisher:"City of New York"`

  `"publishing institution":"City of New York"` *(note that 'Publishing Institution' has been defined in the template as the preferred label of the field 'Publisher')*
  
- Search by field name (any value):

  `publisher:*`, or `publisher:`
  
- Search by field value (any name):

  `*:"New York"`, or `:"New York"`
  
- Boolean queries:

  `title:Statistics OR title:Math` *(the OR is optional—it is the assumed conjunction)*
  
  `title:(Statistics OR Math)`
  
  `title:Math OR (title:Statistics AND publisher:"New York")`
  
  `Dataset OR disease:CRC`  *searches for Dataset anywhere, OR a field 'disease' with value 'CRC'*
  
- Wildcard queries: 

  - One or more characters: `title:stat*`
  
  - Single character: `title:stat?stics`
  
- URLs: 

   - `url:https://catalog.data.gov/dataset/demographic-statistics-by-zip-code-acfc9`
   
- Ontology terms: 

    - Search by term label: `topic:statistics`
    
    - Search by term URI: `topic:http://edamontology.org/topic_2269`

    - Search by term label and URI: `topic:http://edamontology.org/topic_2269 AND topic:data`
    
### Finding templates, elements, and fields, by field name

Given the template for the previous instance:

![](../img/userguide/field_search_example_2.png){:height="100%" width="100%"}

Here are some examples of queries that can be used to find the template above:

  `title:*`, or simply `title:`

  `Publish*:`

  `"Contact Email":`  *use quotes for multi-word strings*

  `to?ic:`

## Advanced Searching - Patterns

This section describes the more complex search patterns available in CEDAR. 
You can find examples using these patterns with fields and values in the previous section.

Regular expressions (beyond the ones described below) are not yet available in CEDAR.

### Multi-word strings

To search for a literal string that contains spaces (e.g., a multi-word phrase), surround the phrase with double quotes, like this: "Injury Type".

### Boolean queries

Boolean expressions let you combine different search patterns. These expressions include AND, OR, and NOT, and they can be organized with parentheses following algebraic rules. 

#### OR

Use OR to broaden your search results by connecting multiple keywords or phrases. The OR operator is interpreted as “at least one of the search terms is required" for the resource to be returned in the search list.

A space between two words is interpreted as an OR condition.

#### AND

Use AND to narrow your search: all the search terms that have been combined with AND must be present for the resource to be returned.

#### NOT

To indicate that a resource should be excluded if a term is present, the term can be preceded by the NOT expression. "Injur NOT Template" will find "Articles about Injuries" but not "Injury Template".

#### Parenthetical Expressions

The logical priority of the searches is determined by parentheses. For example, 
`injury AND (health or operation)` will find resources with the term injury and *either* health or operation. The AND operator takes precedence, so without the 
parentheses, the same search pattern would find resources with both injury and health, or with just operation. 

In complex searches, using parentheses to make all your patterns explicit is the
best way to be sure you will get what you want in your returned results.

### Wildcard queries

You can use special characters to replace a single character, or any number of characters. However, you can only use each special character once in each word.

#### Replacing multiple characters

You can use an asterisk (*) in your search term to indicate that any number of characters can be substituted in place of the asterisk.

For example: 'injur*' will return resources with any of these words: injury, injuries, and injured.

CEDAR treats single-word search patterns as if they have an asterisk at the beginning and end, so 'injur' or 'jur' will also find the three examples above.

#### Replacing a single character

The question mark (?) replaces any single character when searching in the resources.
`injur?` will find anything containing the word injury, injured, or injuries.
