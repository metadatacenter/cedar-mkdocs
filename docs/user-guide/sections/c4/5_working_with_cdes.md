---
layout: section
title: Working with CDEs
author: John Graybeal
status: Ready
chapter: c4
chapter_url: /cedar_templates/c4_advanced_template_topics/
chapter_title: Advanced Template Topics
---
CEDAR contains nearly 60,000 Common Data Elements imported from the National Cancer Institute's caDSR Data Element repository. 
These are represented as Fields in CEDAR, as each CDE
describes a single question and its possible answers.

Because all of these CDEs are managed by caDSR following the same metadata model, 
we can offer some tips for working with them efficiently in the CEDAR system.

## **Finding and Browsing CDEs** 

The same practices used for [finding other CEDAR resources](https://metadatacenter.github.io/cedar-manual/basic_topics/a2_finding_resources/) will work with CDEs as well.
However, there are a few additional strategies that may be particular helpful for 
those working with CDEs in CEDAR on a regular basis.

### Searching from the CEDAR Desktop

As described in the section [Finding Resources](https://metadatacenter.github.io/cedar-manual/basic_topics/a2_finding_resources/)
you can search for resources by name or description. 
In the case of CDEs, it is also possible to search by their CDE identifier.
This number is shown at the top middle of the CEDAR field in the Template Editor 
(or between parentheses in a Desktop resource list). 

For very short version numbers (like '5' or '58'), the indexing does not provide an
obvious way to find the whole number, instead finding all the numbers containing that string.
As a workaround, you can enter the number surrounded by spaces, and within quotes. 
This may find other occurrences of the number by itself, for example in the description 
of the CDE. You can then search within the results set in your browser by scrolling 
the results until they are all displayed, then enter into your browser 
your identifier surrounded by parentheses (e.g., `(5)`).

Another handy attribute for some searches is the version attribute.
Entering the exact version number will find all artifacts with that version, 
most of which will be CDEs. 
Entering version numbers with wildcards can find many CDEs at once; 
for example, `*0.0` will find all CDEs (and other artifacts) 
with version numbers ending in 0.0.

### Browsing All CDEs

If you search for the string "CDE" from the Desktop, 
one of the first entries you'll see is the shared CDE folder.
This is the location of all the imported CDEs from caDSR.

Double-click on the CDE folder to open it. You must wait a while (10-15 seconds) 
before the first screen of CDEs is displayed.

![](../../../img/userguide/cde-folder-20191212.png){:width="80%" class="centered"}

You will quickly discover that navigating through this list isn't practical, as only a small 
number can be presented at any one time. Instead, use the search bar to narrow down the list, 
as described above.

### Browsing by CDE Categories

![](../../../img/userguide/category-dropdown-20191212.png){:width="20%" class="right"}
In caDSR, CDEs and forms can be classified using Classifications, more specifically 
Classification Schemes and Classification Scheme Item. The caDSR classifications have been
imported into CEDAR as hierarchical categories under the NCI caDSR category, 
as shown in the image on the right. 

You can find CDEs in a particular category by using the CEDAR categories menu 
in the left-hand navigation panel. Selecting an item at any level of the category
hierarchy will show all the CDEs contained within that level, and all lower levels.

You can view the Category or Categories for any CDE you see in the Desktop by clicking on
the CDE, [bringing up the information metadata tab](https://metadatacenter.github.io/cedar-manual/cedar_templates/basic_topics/a3_viewing_resource_metadatda/), and selecting the Categories tab.
CEDAR lists all the Categories to which the selected CDE belongs.

### When Creating a Template

On bringing up the search pop-up display, searching results should be the same as 
when searching from the CEDAR Desktop. The returned results list is somewhat shorter,
so searching using the identifier is the best approach.

### Advanced: Search for Templates Using A CDE

If you are trying to find all the templates (or instances) that are using a particular CDE,
you could try using the field name of the CDE if it is relatively uncommon. 
By using the [Advanced Searching—Field Names](https://metadatacenter.github.io/cedar-manual/sections/a2/4_advanced_searching_search_fields/)
strategies, you can search by the name of the field for templates and/or instances
containing that field. (You must use the actual name of the field, not the displayed label.)

## **Obtaining and Maintaining CDEs**

By importing the XML-defined CDEs from the caDSR system into JSON Schema-defined fields in CEDAR, 
we make these specifications available to any CEDAR user. 
CEDAR imports only the released CDEs, not those in earlier stages of preparation.
To date the conversion process is manually initiated, 
but we plan to run conversions as frequently as nightly 
to keep the CEDAR CDEs up-to-date with respect to the source content.

When run, the conversion process updates any caDSR-updated CDEs in the CEDAR system, 
replaces all the CDE Value Sets in BioPortal, and 
ensures that the Categories in CEDAR are updated to the Classifications 
provided in the caDSR export. 

We do not manage the entire content of the CDE specification. CDEs in caDSR contain a comprehensive implementation of the ISO/IEC 11179 standard, but focus instead on core functionality that relates to the precise specification of questions and the values used to answer those questions.

## **References**

These references provide more information about performing CDE-related activities.

* [CEDAR for caDSR Users](https://metadatacenter.github.io/cedar-manual/cedar-for-cadsr)—a separate section of this manual targeting users of caDSR systems
* [CEDAR Announcement of CDE Support](https://metadatacenter.org/happenings/news/cedar-announces-cde-support/)—Blog post describing CEDAR's support for CDEs
* [Unleashing the value of Common Data Elements through the CEDAR Workbench](hhttps://www.ncbi.nlm.nih.gov/pmc/articles/PMC7153094/). Published in [Proceedings of AMIA 2019 Annual Symposium](https://knowledge.amia.org/69862-amia-1.4570936), 681-690.







