---
author: Jennifer Vendetti
---
# Finding CDEs

Common Data Elements (CDEs) are imported into the {{ page.cedarw }} on a 
nightly basis.

This page describes the four main ways to browse and search for CDEs:

- [Browse CDEs via the CATEGORIES pane](#browse-by-category)
- [Browse CDEs via the Community Folder](#browse-by-community)
- [Search for CDEs from the Desktop](#search-from-desktop)
- [Search for CDEs from within templates and elements](#search-from-artifact)
- [Search for CDEs by permissible values](#search-by-pv)

***

## Browse CDEs via the CATEGORIES pane
<a name="browse-by-category"></a>

The "All Program Areas" tab in the {{ page.cdeb }} displays a list of caDSR 
contexts on the left-hand side of the window. These contexts have been 
imported into the {{ page.cedarw }} and presented as a tree structure in the 
CATEGORIES pane, located on the left-hand side of the window.

In the {{ page.cedarw }}, contexts and classifications are simply referred to 
as "categories". 

To browse CDEs by category, open the root node of the tree structure in the 
CATEGORIES pane entitled "NCI caDSR":

![CATEGORIES pane](../../img/userguide/cadsr/categories.png)<br />

Select a top-level category, e.g., "ABTC" to see all the CDEs in the category:

![CATEGORIES pane with ABTC selected](../../img/userguide/cadsr/category-abtc.png)<br />

Continue navigating deeper in the tree to further refine the list of CDEs 
displayed in the center pane:

![CATEGORIES pane with a leaf node in the tree selected](../../img/userguide/cadsr/category-leaf-node.png)<br />

To see more information about any of the CDEs listed in the center pane, 
select the CDE, click the "Details" button (lowercase 'i'), and look to the 
righ-hand side of the window where the {{ page.cedarw }} displays a details 
pane. The details pane has several tabs that show a wide variety of attributes 
including location, permissions, version, etc.:

![CDE details pane](../../img/userguide/cadsr/cde-details-pane.png)<br />


## Browse CDEs via the Community Folder
<a name="browse-by-community"></a>

The authors of the {{ page.cedarw }} maintain a "Community Folder" that 
contains CEDAR artifacts they feel may be of interest to the entire user 
community. 

To browse CDEs from the Community Folder, click the Community Folder link in 
the upper left portion of the window. In the center pane double-click the 
folder entitled "CDE":

![CDE Community Folder](../../img/userguide/cadsr/cde-folder.png)<br />

All of the CDEs imported into CEDAR are shown in the center. The buttons at 
the top right-hand side of the window are useful for tweaking how the CDEs 
are displayed, e.g.:

- Use the View button to toggle between grid and list views
- Select any CDE and use the Details button to show and hide the details pane
- Use the Sort button to sort CDEs by creation date, modification date, or title
<br /><br />

![CDEs grid view sorted by title](../../img/userguide/cadsr/sorted-cdes.png)<br />


## Search for CDEs from the Desktop
<a name="search-from-desktop"></a>

The {{ page.cedarw }} displays a search box at the top of what is referred to 
as the "Desktop". One way to make sure the Desktop view is displayed is to 
click on the Workspace link in the upper-left portion of the window. For a 
more in-depth explanation of the Desktop and other components displayed in 
the Workspace, refer to the section entitled 
"[Your CEDAR Workspace](../../sections/a4/your_cedar_workspace)" in the 
"[Desktop and Navigation](../../basic_topics/a4_desktop_and_navigation)" chapter.

When CDEs are imported into the {{ page.cedarw }}, they are named by 
concatenating the Long Name of the CDE with it's Public ID in parentheses. For 
example, the CDE with a Public ID of 62 is imported as "Patient Gender 
Category (62)". To follow are several examples of what to enter in the search 
box to efficiently locate CDEs:

Perform a string search by entering the Long Name of the CDE, surrounded by 
double quotes:

![String search for a CDE by Long Name](../../img/userguide/cadsr/search-by-long-name.png)<br />

Searching for a shorter Public ID like 62 will sometimes returns too many 
results. Instead, enter the Public ID in parentheses surrounded by double 
quotes:

![String search for a CDE by Public ID](../../img/userguide/cadsr/search-by-public-id.png)<br />

For longer Public IDs, simply entering the ID in the search box is sufficient:

![Search for a CDE by Public ID](../../img/userguide/cadsr/search-by-id-only.png)<br />

Perform a search by CDE Version number to see a list of CDEs with a 
particular version:

![Search for CDEs by version](../../img/userguide/cadsr/search-by-version.png)<br />

Perform a string search by entering the CDE Definition (known as "Description" 
in the {{ page.cedarw }}) surrounded by double quotes:

![Search for CDEs by definition (aka description)](../../img/userguide/cadsr/search-by-defintion.png)<br />

The {{ page.cedarw }} offers several more sophisticated methods of search 
including the use of wildcards, boolean expressions, and the ability to search 
by field names and values. More information is available in the 
"[Finding Resources](../../basic_topics/a2_finding_resources)" chapter.

## Search for CDEs from within templates and elements
<a name="search-from-artifact"></a>

This section assumes basic knowledge of creating and/or editing templates and 
elements in the {{ page.cedarw }}.

To search for a CDE from within a template:

1. Create a new template, or open an existing template.
2. In the resulting template designer interface, click the Search button 
   (magnifying glass icon) in the vertical finder toolbar:
   ![Vertical finder toolbar](../../img/userguide/cadsr/vertical-finder.png)
3. Use the search box in the resulting dialog to search for the desired CDE.

To search for a CDE from within an element:

1. Create a new element, or open an existing element.
2. In the resulting element designer interface, click the Search button 
   (magnifying glass icon) in the vertical finder toolbar.
3. Use the search box in the resulting dialog to search for the desired CDE.

## Search for CDEs by permissible values
<a name="search-by-pv"></a>
The CEDAR Workbench also supports a flexible syntax to search for CDEs by permissible value. This syntax is based on the patterns `[pv]VALUE` and `[pv]=VALUE`, which enable partial and full exact matches, respectively.

For example, the query `[pv]Female` will retrieve all the CDEs with the word `Female` in at least one of their permissible values. CDEs with values `Female` and `Female person` would be returned by this query. Adding an `=` sign to the query enforces exact-phrase matches. For example, the query `[pv]=Female` will return the CDEs with `Female` as one of their values, but it won't return CDEs with value `Female person`, since the query doesn't match the full value.

The syntax described in this section is enabled when searching CDEs from the Desktop and from templates and elements. Note that the syntax is case insensitive, such that `[pv]Female` will return the same results than `[pv]FEMALE` and `[pv]female`.

The following table summarizes the different types of permissible-value queries supported by the CEDAR Workbench, providing examples for each of them.

| Query Type | Example | Description |
| --- | --- | --- |
| Phrase | `[pv]female` | It will match "**Female**", "**Female** person". It won't match "Females" |
| Phrase | `[pv]"eye and orbit"` | It will match "**Eye And Orbit** Anatomic Site", "**Eye and Orbit**". It won't match "Orbit and Eye" |
| Exact phrase | `[pv]=female` | It will match "**Female**". It won't match "Female person" |
| Exact phrase | `[pv]="Eye and Orbit"` | It will match "**Eye and Orbit**". It won't match "Eye and Orbit Anatomic Site" |
| Wildcard | `[pv]fem*` | It will match "**Fem**ale", "**Fem**ale person" |
| Wildcard | `[pv]f*e` | It will match "**F**emal**e**", "**F**in**e**" |
| Wildcard | `[pv]fem?le` | It will match "**Fem**a**le**" |
| Boolean | `[pv]=female AND [pv]=male` | It will return CDEs that have both "**female**" and "**male**" in their list of permissible values |
| Boolean | `[pv]=female OR [pv]=woman` | It will return CDEs that have either "**female**" or "**woman**" in their list of permissible values |
