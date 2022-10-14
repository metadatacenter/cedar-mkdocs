# Advanced Searching - Patterns

This section describes the more complex search patterns available in CEDAR. 
You can find examples using these patterns with fields and values in the previous section.

Regular expressions (beyond the ones described below) are not yet available in CEDAR.

<h1>Multi-word strings</h1>

To search for a literal string that contains spaces (e.g., a multi-word phrase), surround the phrase with double quotes, like this: "Injury Type".

<h1>Boolean queries</h1>

Boolean expressions let you combine different search patterns. These expressions include AND, OR, and NOT, and they can be organized with parentheses following algebraic rules. 

<h2>OR</h2>

Use OR to broaden your search results by connecting multiple keywords or phrases. The OR operator is interpreted as “at least one of the search terms is required" for the resource to be returned in the search list.

A space between two words is interpreted as an OR condition.

<h2>AND</h2>

Use AND to narrow your search: all the search terms that have been combined with AND must be present for the resource to be returned.

<h2>NOT</h2>

To indicate that a resource should be excluded if a term is present, the term can be preceded by the NOT expression. "Injur NOT Template" will find "Articles about Injuries" but not "Injury Template".

<h2>Parenthetical Expressions</h2>

The logical priority of the searches is determined by parentheses. For example, 
`injury AND (health or operation)` will find resources with the term injury and *either* health or operation. The AND operator takes precedence, so without the 
parentheses, the same search pattern would find resources with both injury and health, or with just operation. 

In complex searches, using parentheses to make all your patterns explicit is the
best way to be sure you will get what you want in your returned results.

<h1>Wildcard queries</h1>

You can use special characters to replace a single character, or any number of characters. However, you can only use each special character once in each word.

<h2>Replacing multiple characters</h2> 

You can use an asterisk (*) in your search term to indicate that any number of characters can be substituted in place of the asterisk.

For example: 'injur*' will return resources with any of these words: injury, injuries, and injured.

CEDAR treats single-word search patterns as if they have an asterisk at the beginning and end, so 'injur' or 'jur' will also find the three examples above.

<h2>Replacing a single character</h2>

The question mark (?) replaces any single character when searching in the resources.
`injur?` will find anything containing the word injury, injured, or injuries.

