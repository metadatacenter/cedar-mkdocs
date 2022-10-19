---
author: John Graybeal
status: Ready
---
# Advanced Searching - Search Fields

This section contains some examples of the query syntax that can be used to find CEDAR artifacts by field name and/or value.

In this section, the term 'field name' refers to the internal name (not displayed label) of fields that 
are defined for that metadata instance. 
It does not refer to the metadata attributes for the instance artifact, for example, the assigned Title of the metadata instance.
Those artifact metadata fields can not yet be searched individually by CEDAR.
(When a search pattern is entered into CEDAR without a prefixed field name, 
CEDAR will search through the title, description, and version number of the artifact for the entered search pattern.)

<h1>Finding metadata instances by field name and/or field value</h1>

Suppose the following metadata instance:

![](../../../../img/userguide/field_search_example_1.png){:height="100%" width="100%"}

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
    
<h1>Finding templates, elements, and fields, by field name</h1>

Given the template for the previous instance:

![](../../../../img/userguide/field_search_example_2.png){:height="100%" width="100%"}

Here are some examples of queries that can be used to find the template above:

  `title:*`, or simply `title:`

  `Publish*:`

  `"Contact Email":`  *use quotes for multi-word strings*

  `to?ic:`
