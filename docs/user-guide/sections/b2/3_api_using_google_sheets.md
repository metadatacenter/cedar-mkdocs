---
layout: section
title: API—Using Google Sheets
author: John Graybeal
status: Ready
chapter: b2
chapter_url: /advanced_topics/b2_cedars_api/
chapter_title: CEDAR's API
---

<h1>API: Using Google Sheets</h1>

You can also query CEDAR's API using a Google sheet library
developed by the CEDAR team.
As with the other parts of this chapter,
to see the library function, you will have to have your CEDAR API key
as described in the [CEDAR's API documentation](../../../advanced_topics/b2_cedars_api/).

<h2>Using the Google Sheet</h2>

To use the Google sheet library, or even to just inspect it,
visit the [Example CEDAR Data Lookup in Google Sheets](https://docs.google.com/spreadsheets/d/1z6Y8EcSZSkjb1-ztWa_nzYVjhTrfEzIthoBmoNYRfs4/) document. 
This is a publicly viewable Google spreadsheet that contains the libraries
that can be used to interrogate CEDAR.

The first tab has README documentation for this spreadsheet,
while the second tab has an Example spreadsheet you can inspect.
As you will see, this read-only spreadsheet shows `#ERROR` in two of its cells.
Examining the error message in either cell reveals
the request failed with status of UNAUTHORIZED.
To see the spreadsheet work, you have to make your own copy of it,
and modify the script associated with the Example tab to enter your API key.

Instructions for performing these steps are on the README tab of the Google sheet.
Once you follow them correctly,
you should see the cells change from `#ERROR`
to the creation date and title of the CEDAR instance,
because that instance is shared for any CEDAR user to see.

<h2>Advanced considerations</h2>

Arbitrarily advanced lookups can be performed in CEDAR metadata instances
using the XPath-compatible data_path expression in the second parameter.
These allow you to access the nested hierarchy in the metadata template,
as well as index into multiple entries for a given field or element.
(Unfortunately, describing the details of those expressions
is beyond the scope of this help text.)

There are two limits to the scope of this capability.
First, if you have a lot of requests being made in your spreadsheet,
for example because you have lots of rows of instances
with many field values being requested in the columns,
it will complete the fields rather slowly.
You may have to wait for the complete sheet to fill out.

Second, Google limits the number of requests
that can be made in a given period of time
from their sheets.
So large numbers of requests being repeatedly made may create a rate limit error,
and you will have to resume your work at some later time
or reduce the number of requests in a given sheet.


