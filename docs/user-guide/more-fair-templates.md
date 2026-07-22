# More FAIR Templates Using Semantics

The FAIR principles — Findability, Accessibility, Interoperability, and Reusability — capture
what good metadata should achieve. Semantics is a key technology in CEDAR because it supports
all four.

## Why Semantics Are Important

### The Problem

Search has two familiar failings: not finding everything you want, and finding things you do
not.

Finding things you do not want is a problem of *precision*, and it comes from words having many
meanings. A search for "python" may return snakes, ancient Greeks, a roller coaster, or the
programming language rather than the horror film, and adding a word ("python movie") often
narrows it little.

Not finding everything you want is a problem of *recall*. If the author who described a post
never wrote "movie", software that does not know "film" is a synonym will miss it. A search for
treatments of a disease may miss the drugs for it, even though a drug is a treatment.

This bites hardest when you need precise results: analyzing data, looking for similar datasets,
or finding something specific among many candidates. You want the system to understand what you
mean, and to be as precise as it can. Too often, though, the original questions were vague and
the answers ambiguous, so no reliable result can be drawn from them.

### The Solution

Semantic technologies reduce these problems by giving words precise meanings. To improve
precision, concepts are named with identifiers that are unique across the whole internet, so an
author can record an unambiguous term that means exactly a python snake. To improve recall,
software helps authors find and apply those precise names as they write, and understands the
relationships between them, so descriptions from different communities can be translated
between term sets with confidence that meaning is preserved.

Semantic standards such as OWL, RDF, and SKOS, and the tools that understand them, provide a
baseline for interoperable systems. CEDAR is one such tool. It lets form designers specify
questions thoroughly and answers precisely, so the people filling in metadata produce
well-defined descriptions, and it can recognize when questions or whole forms are about the
same topic and suggest relationships between them.

### Using Semantics in CEDAR

The sections that follow show how to build more rigorous metadata forms that are also *easier*
to understand and fill out. The process is rarely perfect, but it brings far more precision and
recall to whoever finds or reuses the data, and it can make your collection system easier to set
up.

## Defining Your Answers with Term Lists

You do not need to know semantics to use these tools. This section walks through the CEDAR
interfaces that work hand-in-hand with the
[BioPortal ontology repository](https://bioportal.bioontology.org), which holds over 800 public
terminologies you can draw on. If BioPortal lacks a terminology you want, you can add it.

Each part below assumes you have created a basic text field, opened its Values tab, and clicked
Add to bring up the term search dialog, as described in
[Adding Fields](building-basic-templates.md#adding-fields).

### Searching for Terms

When you click Add in a field's Values tab, CEDAR opens a search window pre-filled with the
field's name and runs the search at once. Here the name is "Study Type", and results have come
back in a scrollable list, most likely terms first.

![](../img/userguide/search-for-terms-list-results-20191229.png){:width="80%" class="centered"}

Change the search by typing in the search field; if it does not run on its own, click the
magnifying glass. The list updates as results arrive, with higher-value matches sometimes moving
to the top. Results usually return quickly, up to a maximum of 500.

To refine the search, click the settings gear at the right of the search field for the Advanced
Search Options. The first option, searching anywhere in BioPortal, is pre-selected. The other
"I want to…" options are covered further on.

![](../img/userguide/search-for-term-advanced-options-20191229.png){:width="80%" class="centered"}

The "Narrow your search to specific ontologies" field restricts the search. Start typing an
ontology's acronym or name and CEDAR offers matches; click one to add it. Add as many as you
need. Here the ontologies CTO and NCIT have been selected. Restricting this way lets you see
more terms from those ontologies, or exclude all others.

![](../img/userguide/search-for-term-restrict-ontologies-20191229.png){:width="80%" class="centered"}

### Reviewing Found Terms

With results in hand, you may want a closer look. Earlier terms in the list are exact matches
for your string and later ones match less closely; that ordering is the first way results are
ranked.

Clicking Show Details at the right of a term opens a display beneath the list for inspecting the
term. On the left is the ontology's list of terms, usually scrolled to the one you chose.
Sometimes a term appears in several places in the ontology, and you will need to look around to
find it.

![](../img/userguide/search-for-terms-show-details-20191229.png){:width="80%" class="centered"}

Click any term to see its details in the Term Details tab on the right; the Ontology Details
tab describes the whole ontology. Scroll the tree with the mouse, and open or close branches
with the + and - boxes. Below, the classes under the Study Type branch have been opened.

![](../img/userguide/search-for-terms-open-branch-20191229.png){:width="80%" class="centered"}

Here you might decide a class is not right, because it holds many study types specific to plant
science. Clicking the Study Type term in the CTO ontology instead shows, from its branch, a much
more generic set of study types.

![](../img/userguide/search-for-branch-20191229.png){:width="80%" class="centered"}

### Selecting Terms, Branches, or Ontologies

Scrolling down in the Term Finder reveals more controls, including the `TERM`, `BRANCH`, and
`ONTOLOGY` tabs, which decide what you add to the field's values. If the selected term has no
subclasses, the Branch tab is hidden and only Term and Ontology appear.

![](../img/userguide/select-branch-for-addition-20191229.png){:width="80%" class="centered"}

With the BRANCH tab selected, the description reads "Click to add all the descendants of the
selected term." Clicking ADD adds every class under "Study Type" as an allowed answer. With the
TERM tab, ADD adds only the Study Type term itself, a less common choice, since usually you want
a set of related terms. With the ONTOLOGY tab, ADD adds every term in the ontology; choose this
only when the whole ontology is devoted to one concept, as the Disease Ontology is to diseases.

To search for ontologies or value sets by name instead, return to the gear in the search box, as
described next.

### Searching for Ontologies and Value Sets

The other two "I want to…" buttons in the Advanced Search Options search explicitly for
ontologies or value sets, matching the top search field against their acronym or name. Below, a
search for a Study Type ontology finds nothing, since BioPortal has no such ontology.

![](../img/userguide/search-for-ontology-20191229.png){:width="80%" class="centered"}

A value set is like a very simple ontology: a set of terms with identifiers and labels. Value
sets tend to be smaller than ontologies and focused on one topic, and are often created
specifically to fill out forms. The search below finds several value sets dealing with Study
Type. The Source column names the ontology that holds each value set, since in BioPortal value
sets are grouped into organizational ontologies for easier management.

![](../img/userguide/search-for-value-set-20191229.png){:width="80%" class="centered"}

### Adding Your Own Terms

When you cannot find a term, or a sensible list of terms, CEDAR helps you add your own.

#### About Provisional Terms

A provisional term is one you propose for an existing resource, or add on its own as a stopgap.
In principle it lasts only until the proposal is acted on: accepted and added to the resource
(the provisional term is then deprecated in favor of the new one), or rejected or declared no
longer needed (the provisional term is deprecated). A provisional term should not be deleted, so
that existing and archived uses can still reference it.

CEDAR lets you *create* provisional terms and link them to related resources and classes. It
does not yet act on them — notifying the owners of related resources, or annotating deprecations
and their replacements — because that needs support in BioPortal for managing provisional terms.

#### Adding Your Own Single Terms

New terms you add are created as provisional classes in BioPortal and cannot be modified once
defined. To start, click the Add New Terms link at the top of the term selection dialog,
highlighted below.

![](../img/userguide/create-new-terms-20191229.png){:width="60%" class="centered"}

The next dialog collects the term's text.

![](../img/userguide/create-term-20191229.png){:width="70%" class="centered"}

![](../img/userguide/create-term-description-20191229.png){:width="70%" class="centered"}

Turning on the "Link to existing terms (optional)" switch leads through further dialogs for
relating your term to existing terms in existing ontologies. In future, this may help inform the
owners of those ontologies of your proposed addition.

![](../img/userguide/create-term-linked-to-existing-20191229.png){:width="70%" class="centered"}

#### Adding a New List of Terms

CEDAR cannot add a whole list of terms directly. To do that, create or modify an ontology in
BioPortal. This is straightforward as a SKOS vocabulary if you follow BioPortal's practices for
one. Collaborators from our center and the FAIR Data Collective have written
[a tutorial on building a simple SKOS vocabulary](https://excel2rdf.readthedocs.io/en/latest/)
that is easy to build, register in BioPortal, and maintain in GitHub.

### Customizing What You Have

Once you have added terms, you may want to remove some or move others ahead. Both use the
Arrange button on the field's Values tab, which opens this dialog.

![](../img/userguide/arrange-terms-20210807.png){:width="60%" class="centered"}

#### Rejecting Terms

To hide a term from users, hover over it and click the X that appears.

#### Putting Favorites First

To move a term, click its up-down arrow icon. A dialog lets you send it to the top of the list
or to any position; the other terms adjust automatically.

## Choosing Controlled Terms

This is a brief primer on choosing controlled terms. A thorough treatment would fill several
chapters, but the advice here will take you a long way.

Perfect terms, or perfect lists, can be elusive, much like perfect software. You can often find
many lists on a topic and none exactly right. CEDAR helps: you can add, remove, and reorder
terms, and combine lists. When you find a list that is almost right, use it and tweak it.

It helps to know the domain you need terms for, and to know vocabularies or people you can ask.
Finding good vocabularies, and choosing the best terms even when you have options, is genuinely
hard.

The most likely sources of good terms are authoritative ones, for two reasons. The authors
usually thought hard about the terms, and the terms are widely used, which gives you
interoperability. So term lists in popular ontologies, reputable websites, and well-cited
articles or reference books are often useful.

One caution: terms for mundane, unspecialized topics, such as "types of stores" or "types of
meeting places", are almost impossible to find ready-made. You may have to create such a list
yourself. If many others need it too, it could become popular.

### Your Criteria

There are many criteria for judging a term, list, or ontology, and the most important is whether
it fits your needs. Only you know those, so weigh the criteria for yourself. The general
criteria below may help you decide what you are looking for.

### General Criteria

Whether you are weighing terms, lists, or whole ontologies, each category below covers several
specific criteria. Some are objective; many are subjective or hard to measure.

* Popularity
* Reuse of the ontology as a whole and of individual terms
* Community relevance: usage, standardization, applicability
* Governance: is it well-managed, with clear, open policies?
* Adoption of best practices, including FAIRness and metadata scope
* Precision of the match to your needs, and, for a list, the frequency and specialization of its
  terms
* Cross-cutting concerns
  * Internationalization: how widely used, the level of the governing body, international reuse,
    and multiple languages in labels and definitions
  * Quality, by metrics and by independent qualitative assessment
* Analytics of the ontology's content and structure

Because few of these are readily visible in CEDAR, the next sections focus on concrete checks a
CEDAR user can make.

### What Makes a Term Better?

These are ways to judge whether a particular *term* is the one you want. Most often you are
after branches that contain whole lists of terms, so you can include everything at once. But
choosing a branch sometimes means examining a few terms, and sometimes you want a specific term
that is not in your core list.

#### Naming

Look at the term's name — its *label*, in semantic terms. It should be clear and match how your
users think of the concept. Names are usually short; if one is long, ask whether it needs to be.

Sometimes the label must match what users expect exactly: taxonomists would not look for
"human", and lay users would not look for "homo sapiens". Inconsistent naming patterns are
awkward too. When a field's name is long, CEDAR's search returns more and looser matches, both
because specialized terms match less often and because your words are less likely to appear in
the ontologies. Examine what comes back, and consider changing your search phrase to find better
options.

#### The Order of Results

CEDAR orders search results as follows:

* exact matches for your phrase;
* close matches, such as terms that begin with your phrase and continue; then
* poorer matches, including terms whose definition contains your phrase, or synonyms of it.

Among equally good matches, terms from the ontologies most widely used in BioPortal come first.
These are usually common, credible ontologies, and this works surprisingly well at surfacing
better terms. Still, check that a term makes sense for its ontology, so you do not take the "eye"
of a hurricane from a biomedical ontology.

#### Definition and Structure

CEDAR shows each term's definition in the results. A term without one is hard to interpret, both
for you now and for anyone who later looks it up by its identifier, so avoid terms that lack
definitions.

Context is the other way to understand a term. Click a term and choose Show Details to open a
tree browser, usually with the term highlighted. If it is not, scroll to find it; a term may
appear in several places if it has more than one parent. The hierarchy tells you a great deal.
Siblings under the same parent show related concepts, a plus sign reveals children that further
define the concept, and the parents above show which category it belongs to.

It may not matter here, but BioPortal hierarchies can express "subclass" relations (B is a type
of A), "part of" relations (B is part of A), or, for SKOS vocabularies, plain "narrower than"
relations (B is narrower than A in some unspecified way).

To learn more, visit the term in BioPortal.

#### More Context

For more detail on a term, look outside CEDAR. Often a page describing the term opens if you
enter its full identifier. Find that ID by clicking the term and reading the Term Details tab
below the results; copy the ID into your browser.

If that does not work, go to [BioPortal](https://bioportal.bioontology.org). Paste the ID into
the Class Search box on the front page, or into the
[class search page](https://bioportal.bioontology.org/search) with "Exact matches" selected
under Advanced Search, and open the first result. As a last resort, paste the ontology acronym
from the Source column into "Find an ontology", open that ontology, go to its Classes tab, and
use the "Jump to" box to find the term.

A well-defined term shows a Details tab with plenty of information. If only two or three items
appear, the term is thinly defined, and you might prefer one with more. BioPortal does not list
everything it knows, but it presents most of what the source ontology holds.

### Finding a Better Branch

For a fairly specific list of terms, you will rarely find a whole ontology devoted to it, but
you can often find a suitable branch of a larger ontology. Most lists of answers come from
ontology branches.

#### Finding Ontologies with Branches

You cannot always tell at a glance whether a term tops a branch. The quickest check is to click
it and see whether a BRANCH tab appears alongside TERM and ONTOLOGY; if not, the term is not the
top of a branch. Click through the list to see which terms are. Choosing Hide Details for a
selected term speeds this up.

If a term is not the top of a branch, choose Show Details to open the ontology's tree, often with
the term highlighted, and look one or two levels up and down for a good branch. Roaming the whole
ontology is rarely worth it; the strategies below tend to work better.

#### Likely Branch Names

Consider whether a synonym makes a better branch title. If "sex" finds few branches, try
"gender"; for "race", also try "ethnicity". Narrowing helps too: for "location" try "geographic
location", or a specific kind such as "country", which also avoids unrelated meanings like a
location on the body. An online synonym list can help.

In general, name a branch with the most specific category that still covers all your terms. Since
it is hard to guess how others categorized your concepts, a good alternative is to start lower
down, searching for things *in* the category rather than the category itself.

#### Starting Lower Down

Because category names can be specialized or arbitrary, an effective strategy is to search for
the entities you want in the user's drop-down. Rather than "gender", try "female". When you find
a matching term, use Show Details to open its ontology tree, navigate up to its parent category,
and examine the terms under that category. If they are the ones you want, select the parent term
to get a branch that contains them.

## Whole Ontologies

Some branch-finding strategies also find good ontologies. Instead of searching for "location" or
"city" as an ontology name, search for a distinctively named instance such as "Sacramento" to
see which ontologies contain it. You might find that BioPortal has only one good location
ontology (GAZ), and that it is flat, so you may prefer to
[create your own vocabulary](#defining-your-answers-with-term-lists).

### Serendipity and Reuse

As you use CEDAR and search for your concepts, you learn what is already in BioPortal and what
ontologies others use in their templates. Searching CEDAR for templates like yours can turn up
fields, or whole elements, to reuse. CEDAR itself is a responsive way to browse a wide range of
terms and ontologies.

### Browsing BioPortal

CEDAR is fast, but [BioPortal](https://bioportal.bioontology.org) is more thorough. Search from
its front page or [search page](https://bioportal.bioontology.org/search) to see the context of
many matching terms at once. The [BioPortal Annotator](https://bioportal.bioontology.org/annotator)
searches for many terms at once; its advanced features are worth exploring.

### Finding the Best Ontology: The Recommender

To find the best ontology, or combination of ontologies, for a set of related terms, the
[BioPortal Recommender](https://bioportal.bioontology.org/recommender) is very effective. Its use
is largely self-explanatory, and its advanced options can match your terms to the best
*combination* of ontologies. A full discussion is beyond this guide (see
[General Criteria](#general-criteria) above), but the Recommender is a good way to narrow your
options. You can then use CEDAR's advanced search to restrict your term search to those
ontologies.

### Browsing Elsewhere

Other sources of terms exist, in formal ontologies or in published vocabularies. Converting them
into BioPortal resources can be tricky, so email the
[BioPortal support list](mailto:support@bioontology.org) for advice on your case.

## Creating Lists for Users to Choose From

CEDAR offers several ways to present a list of terms for a user to choose from, but only one, the
controlled-term values described above, is truly semantic. The others store plain option labels.

Four field types can present a list of answers, as noted in the
[Field Type Reference](building-basic-templates.md#field-type-reference).

| Field type | Options |
| ---------- | ------- |
| Basic Text | Values; Suggestions; Hidden; Default |
| Multi-Choice | Default; _no Multiple_ |
| Checkbox | Default; _no Multiple_ |
| Pick From List | Single Select vs Multi-Select; Default; _no Multiple_ |
