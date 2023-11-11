---
author: John Graybeal
status: Ready
---
# Choosing Controlled Terms

## *General Introduction*

This page presents a (relatively) brief and simple primer about 
choosing controlled terms. 

A thorough tutorial deserves several chapters, if not a whole book.
But you can do a very good job with just the advice offered here.

Let's start with some general observations. 

Perfect terms, or perfect lists of terms, can be elusive, 
just like perfect software tools.
It is often true that you can find many lists on a topic,
but none are exactly right for your needs.

CEDAR helps with this—you can add terms to your list, 
remove terms from your list, or reorder the terms in the list,
and you can combine different lists of terms.
If you find a list of terms that is almost perfect, 
we highly recommend using that list and tweaking it with your changes.
In this section, we assume you will be doing just that.

It will help if you are familiar with the domain that you want terms for,
especially if you already know vocabularies or people you can ask about vocabularies.
It can be very hard to find good vocabularies,
or to choose the best terms for your needs even if you have options.

The most likely sources for good terms and lists are authoritative sources,
for two reasons: (1) The authors thought a lot (usually) about the terms in the list.
(2) The terms in those lists are likely used often, so you get good interoperability.
So, term lists in popular ontologies, web sites, and reference books or articles 
(especially heavily cited ones) are often very useful.

And a final observation is that term lists for mundane things—
topics that aren't specialized, like "types of stores"
or "types of places for meetings"—
these handy types of terms are almost impossible to find.
You may well be on your own to create a term list like this.
(On the bright side, if a lot of people need your list, it could be very popular.)

### Your criteria

There are so many criteria for deciding what term, list, or ontology is better,
and the most important one is "does it fit your needs?".
Since only you know what your needs are, 
we leave it to you to weigh these criteria for yourself.

The list of *General Criteria* that follows may be helpful
in establishing in your own mind what you are looking for in your search.

After that, we'll talk about how you can find better terms and term lists
when using CEDAR.

### General Criteria

Whether you are talking about terms, term lists, or whole ontologies of terms,
each of the following categories embodies multiple specific evaluation criteria. 
Many of the criteria are objective, but many others are subjective or hard to measure. 

* Popularity
* Reuse of ontologies / terms (ontology as a whole, and individual terms, in either case)
* Community (as in, domain) relevance (usage, standardization, concept applicability)
* Governance  (is it well-managed with clear and open policies?)
* Adoption of best practices (including FAIRness criteria and metadata scope)
* Precision of matching to your term needs
  * if multiple terms, match frequency and specialization
* Criteria that cut across the above
  * Level of internationalization 
    * how widely used
    * 'level' of governing body
    * international re-use
    * use of multiple languages in text labels and definitions
  * Quality 
    * by metrics
    * by independent qualitative assessment(s)
* Analytics (ontology content and structure)

Because few of these are readily available in CEDAR, 
let's focus more directly in the following section on concrete evaluations
that are easy for CEDAR users to do.

## *What Makes a Term Better?*

These are the strategies to see if a particular *term* is the one you want 
as a choice for your template.
Note that most commonly, you are looking for branches containing lists of terms,
so that you can include everything you need at once.
But sometimes, choosing those branches requires that you examine a few terms,
and other times, you want to include a few specific terms that aren't in your core list.

### Naming

Look at the name—which really means the 'label', in semantic talk—
for the terms you are comparing.
The term name should be clear and aligned with the way your users think of the concept.
Names are usually very short, and if the name is longer, consider whether it needs to be.

Sometimes it matters that the term name match exactly what users expect. 
Taxonomists would not expect to see the common name 'human', 
and lay persons wouldn't be looking for 'homo sapiens'. 
And it will be really awkward if the naming patterns aren't consistent. 

When the name of your field is long, the search executed by CEDAR returns more things,
and they often don't fit quite as well. 
(There are two reasons for this. Specialized terms are less likely to find matches,
and the words you use are less likely to match the words used in the ontologies.) 
For this reason you'll want to examine the concepts that are returned,
and maybe even change your search phrase to find more options.)

### The Order of Things

In CEDAR, the order of the concepts that are listed for a term search is as follows:
* perfect matches for your search phrase;
* close matches for your search phrase (e.g., words that start with your search phrase, but keep going); and
* poorer matches for your search phrase, concepts that include your search phrase in the definition of the concept, or concepts that are synonyms for your search phrase.

Of all the concepts that are equally good syntactic matches, 
the first ones listed are the ones in ontologies that are the most widely used in BioPortal. 
Usually these are very common and well-known ontologies that have more credibility.
This works surprisingly well to identify 'better terms', 
but make sure the term makes sense for the ontology
(you are looking for an 'eye' of a hurricane but find it in a biomedical ontology).

### Definition and Structure

Yes, but what does that term _mean_? 

You can see the definition of each term in CEDAR in the list of search term results.
If your term does not have a definition, it can be hard to know what it means.
Not only that, people looking up your term later (by its identifier, say)
also won't know what it means
And if (eventually) CEDAR shows the definition to people filling out forms,
_they_ won't know what it means either.
So we don't recommend the use of terms that don't have definitions.

The other way to understand what your term means is to look at its context.
When you click on a term, an option appears on the right side that says "Show Details".
Clicking on this option opens a tree browser, usually highlighting the term in question.
(If your term is not highlighted, you have to scroll through the tree to find it.
Note the term may be in multiple places, if it has multiple parents in the hierarchy.)

By examining the hierarchy, you can understand the nature of the term. 
Other terms at the same level and with the same parent tell you about sibling concepts.
If the term has a plus sign next to it, clicking on it will find children concepts, 
which themselves represent a kind of definition of the concept. 
And browsing up the tree to find the terms parentage tells you what category 
this concept fits into, which gives you another type of definition.

It may not matter for this use case, but you should know that
hierarchies in BioPortal can express 'subclass' relations (B is a type of A);
'part of' relations (B is a part of A);
or for SKOS vocabularies, simple 'hierarchy' relations (B is narrower than A, in some undefined way). 

To learn more about your term, you'll need to visit the term in BioPortal to see more details.
This is described in the next section.

### More Context

If you want to learn more about a term, you can usually get more details about it,
but not from within CEDAR. 

Often you can get a page describing the term by entering its full identifier. 
You can find this 'ID' by clicking on the term,
then look under the 'Term Details' tab below the list of responses. 
Copy the value of the ID and paste it into your browser—
often this will open a detailed page about the term.

If it does not, visit BioPortal at https://bioportal.bioontology.org. 
You can try pasting the ID into the Class Search box on the front page,
or go to the [class Search page](https://bioportal.bioontology.org/search)
and paste it in there, selecting 'Exact matches' under the Advanced Search section,
and clicking on the first result of the search.

(As a final resort, navigate to the ontology containing the term 
by pasting the ontology acronym from the source column into the "Find an ontology"
box on the front page, then select that ontology from the list that pops up,
then navigate to the Classes tab, then enter the name of the term in the Jump to box
and select the term of interest. Whew!)

You should see a Details tab that contains all sorts of information about your term.
If it is only 2 or 3 items listed there, your term is not very thoroughly defined—
possibly you'd like to look for one with more information.  
But if your term is well defined, you will see considerable information about it,
and can decide if any of the (inevitable) minor discrepancies would keep you from using it.

BioPortal doesn't list _everything_ it knows about the term, 
but most of the information in the source ontology is presented.

## Finding a Better Branch

What if you're looking for a rather specific list of terms, perhaps with just a few words?
You won't often find a whole ontology dedicated to just that list,
but you can often find specific branches from hierarchical ontologies that meet your need.
In fact most lists of terms used to answer questions are found in ontology branches.

### Finding Ontologies with Branches

When you first look at the term, you may not be able to tell if it is the top of a branch.
The fastest way to check this is to click on the term, and see if the tab "BRANCH"
appears below the found term list (in addition to "TERM" and "ONTOLOGY"). 
if the selection tabs don't show the BRANCH option,
then your term is not the top of a branch.
You can quickly click through the list to see which entries are the top of branches.
(If the item on the far right of a selected term says "Hide Details",
choose this option to make the click-through process faster.)

If your term is not the top of a branch, then as described above, after clicking on a term,
select the "Show Details" option to show a hierarchical view of the ontology,
often with your term highlighted. 
You may be able to find a good branch by navigating up and down the tree from your term,
but just for one or two levels. 
Hunting around the whole ontology may not be effective,
and the strategies below may be better.

### Likely Branch Names

Think about whether synonyms of your term may be better branch titles.
If you are searching for 'sex' but not finding many branches, try 'gender' instead;
for 'race' try looking also for 'ethnicity'.

Narrowing your search can be useful—for 'location' you might try 'geographic location'
or the specific kind of location, like 'country'. 
These refined names will also help eliminate overlapping meanings, 
like the location on a body.
An online synonym list may be valuable. 

In general when trying to name a branch,
you want to use the most specific category you can think of that includes all your terms.
But it's hard to know what others might have used to categorize your concepts.
A good alternative is to 'start lower down', searching for things *in* the category
instead of the category itself.

### Starting Lower Down

Since category names can be specialized and sometimes rather arbitrary,
an effective search strategy can be to search for the entities you want to appears
in the drop-down list that users see.
So rather than searching for 'gender', you can try searching for 'female'.

Once you find a term that matches, use the Show Details option to bring up the tree view 
of the ontology containing that term. 
Ideally your term will be highlighted in the tree; if not you need to find it if possible.
Once you find the term, you can navigate up the hierarchy to see its parent category.
Examine the terms under that category (and possibly under higher categories)
to see if they are the terms you want to display.
If they are, select _that_ (parent) term in the hierarchy
to give you a good branch containing the terms you want.

## *Whole Ontologies*

Some of the strategies for finding branches can also find good ontologies.
For example, if instead of looking for 'location' or 'city' as an ontology name
you search for a typical location with an uncommon name (say "Sacramento"),
you can see ontologies containing items with that name. 
In this case, you may quickly see that BioPortal has only one good location ontology
(GAZ) and that it is flat, so you might [create your own vocabulary](../2_defining_your_answers_with_term_lists) for these purposes.

### Serendipity and Reuse

If you keep your eyes open as you are using CEDAR and looking for your concepts,
you will start to learn what ontology content is already available in BioPortal,
and what ontologies others are using in their templates. 
Searching for templates like your own in CEDAR may help you find
some fields that you could re-use, or whole elements that are useful.
CEDAR is actually a responsive tool you can use to 
browse around a wide range of terms and ontologies.

### Browsing (BioPortal)

While CEDAR is fast, [BioPortal](https://bioportal.bioontology.org) itself is more thorough and has more features.
You can search for terms from the front page,
or from the [search page](https://bioportal.bioontology.org/search),
and you can quickly see the context for a large number of terms
that match your search pattern.

You can use the [BioPortal Annotator](https://bioportal.bioontology.org/annotator)
to search for a large number of terms at the same time. 
Be sure to check out the advanced features within the Annotator page
to enhance your searching capability.

### Finding the Best Ontology: BioPortal's Recommender

If you really want to find the best ontology for a number of related terms,
or even a single ontology,
the [BioPortal Recommender](https://bioportal.bioontology.org/recommender) 
is an extremely effective tool. 
It's use is fairly self-explanatory, but again be sure to check out advanced options,
particularly to match you terms with the best _combination_ of ontologies.

Discussing ontology recommendations is too complicated for this document 
(note the [General Criteria](#general-criteria) above), 
but the BioPortal Recommender is a good way to narrow your options.
You can then use the advanced features of the CEDAR search to narrow your term search
to just those good ontologies.
 
### Browsing (Everywhere)

There are other sources for ontology terms, whether they are in formal ontologies
or just in published vocabularies.
Converting these sources to ontology resources in BioPortal can be tricky,
so you might email the [BioPortal support list](mailto:support@bioontology.org) 
for advice for your specific case.



