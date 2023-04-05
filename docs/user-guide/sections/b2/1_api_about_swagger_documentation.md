---
author: John Graybeal
status: Ready
---
# API—About Swagger Documentation

<h2>Overview</h2>

When you first enter the [Swagger API documentation for CEDAR](https://resource.metadatacenter.org/api), 
you will see a list of API interface categories.
Some of these categories overlap; 
in particular the Search interface is similar across multiple resources.

If you click on any category, like [Template Instances](https://resource.metadatacenter.org/api/#/Template32Instances),
you will see all the API methods available for that category.
These follow the typical REST pattern:

* DELETE: removes an entity of that type
* GET: retrieves an entity or information about one or more entities
* PUT: updates an existing entity
* POST: creates an entity of that type

There can be multiple interfaces of the same type,
for example multiple GET interfaces, 
but each of these must have a different name.
(Interfaces of different types, like a GET and a PUT, can have the same name and even the same signature.)

You can view all the CEDAR documentation in this Swagger page. 
When you have located the interface you want to use,
if its documentation isn't visible,
click on the interface'a header line to expand the documentation for that interface.
You will then see the documentation details, 
including a section called Parameters.
If you fill out the parameters in the form
and then click on the `Try it out!` button,
the Curl and Request URL patterns will be completed
for you to examine and try for yourself.

At this point the API request also will be sent to CEDAR.
If you haven't entered your API key, though,
the first meaningful line of the response
will say `"status": "UNAUTHORIZED"`,
and no useful information will be returned.

<h2>Using Swagger to submit CEDAR requests</h2> 

To use CEDAR's API resource documentation to make CEDAR requests
as we describe in this Guide,
you must enter your API key to the documentation interface.
To obtain your API key, reference the [CEDAR's API](../../advanced_topics/b2_cedars_api.md) documentation.

In the upper right section of any API's documentation, 
just under the summary description of the API method,
you will see a red circle with a white exclamation point.
This indicates the API key has not been verified.

Click on this red circle and you will be prompted to enter your API key.
Use the format described in the written notes (`apiKey <yourApiKey>`),
not the format that you see in the value box (`api_key`).
Then click on the `Authorize` button.
If your API key is authorized, the red circle will turn blue.

Now, clicking on the `Try it out!` button
will actually send the request to CEDAR,
and you will be able to see the response
in the field under the Response Body section header.

Your API key will continue to be active
for any of the other API interface methods in the documentation page,
until you close or leave the page.

Now you can use the examples in the next section to begin trying
your own CEDAR interface tests.


 





