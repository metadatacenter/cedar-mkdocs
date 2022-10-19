---
author: John Graybeal
status: Ready
---
# Why Semantics Are Important

## Introduction: The Problem

Everyone is familiar with the two challenges of search: not finding everything you want;
and finding things you don't want. 

Finding things you don't want (the problem of _precision_) 
almost always comes from the basic truth that words
(the usual coin of the realm for searching) have many meanings, 
some of which may be much more popular than yours.
So your search for "python" may not find the horror film, but instead snakes, 
people of ancient Greece, roller coaster, or (most likely) the programming language.
Even adding terms for disambiguation ("python movie") doesn't narrow the search much.

And then, you can't be sure all the relevant things will be found 
(the problem of _recall_) . 
Maybe the person creating the description of their post is a film snob, and 
never uses the word 'movie'. 
Without understanding that 'film' is a synonym for 'movie',
software will not find conceptual matches that aren't spelled the same way, or
that are similar in important ways. 
For example, a search may be looking for treatments for a disease 
but not finding drugs for the disease, 
even though drugs are clearly treatments.

This is especially challenging when you are trying to get precise results
as you analyze data, look for similar data sets, or find anything specific 
in a large set of candidates. 
You want the system you are using to understand what you mean—in other words,
to understand semantics. 
And you want the understanding, and results, to be as precise as possible.

And yet what happens instead is that the original questions were unclear,
the descriptive answers that the users tried to provide—
and that you are now working with—are confusing and ambiguous,
and now there is no way you can obtain any sort of meaningful result from your efforts.
If only people could be more careful when they created an described their results!

## Semantics: The Solution

To seriously reduce these problems, we use semantic technologies 
to give more precise meanings to the words people are using.
To increase precision, we can use exact identifiers
(identifiers that are unique across the whole internet) 
to refer to concepts,
so the user can enter an unambiguous string that precisely means a python snake.
To increase recall, we can help software easily collect and apply precise names—
identifiers again—when users are entering descriptions.
We can also give the software tools to understand the relationships 
between those precise identifiers. 
In this way descriptions collected from different communities can be 'translated'
from one set of precise terms to another, 
with some confidence that the original meaning will be preserved.

Semantic standards like OWL, RDF, and SKOS, 
and semantic tools that understand these standards,
provide a baseline for building systems that are semantically interoperable.
CEDAR is one such tool—
it lets form developers specify questions more thoroughly, and 
specify answers in semantically precise ways,
so end users filling in metadata create well-defined descriptions.
And it can use semantic and other insights to understand when
questions and even whole questionnaires might be about the same topic,
and to suggest relationships between them.

## Using Semantics in CEDAR

The following sections in this chapter describe how you can use CEDAR 
to create more rigorous metadata forms that are *easier* for users to understand 
and fill out.  This process is rarely perfect, 
but it can offer much, much more precision and recall for the person 
finding or re-using the data.  
And did we mention it can be easier for the user to use than existing forms?
And even easier for you to set up the data collection system.
