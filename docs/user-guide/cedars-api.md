# CEDAR's API

CEDAR is written in a way that all of its services are accessible via a RESTful API.
A focused subset of those services are "open services",
intended for any CEDAR user to use as they wish.
In our CEDAR guide we will describe the use of these open services.

To use the CEDAR API you will need the software tooling 
required to make queries directly to the API.
This tooling can be a simple operating system command like 'curl', 
the [API Swagger documentation](https://resource.metadatacenter.org/api) 
built-in testing commands, 
an API accession tool, or a complete software application. 
Most of our documentation uses examples with curl to demonstrate API access.

## About your API Key

You will also need a CEDAR API key to access the API. 
For most people this is the CEDAR API key for their own account.

For developers creating an application, 
we suggest using a separate account dedicated to your application.
This API key may have to be changed on occasion, 
and it should be decoupled from your personal account API key.

You can find your CEDAR API key by logging in to your CEDAR account,
then navigating to your profile page.
Your API key, and basic information about using it, should be visible on this page.

In this manual we use the expression `YOUR_API_KEY` to stand in for 
the UUID string of characters that is your API key. 
Whenever you see YOUR_API_KEY in a command, 
replace that text with your API key before trying to use the command.

## API—About Swagger Documentation

### Overview

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

### Using Swagger to submit CEDAR requests

To use CEDAR's API resource documentation to make CEDAR requests
as we describe in this Guide,
you must enter your API key to the documentation interface.
To obtain your API key, reference the [CEDAR's API](#about-your-api-key) documentation.

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

## API—Finding and Accessing Metadata Instances

There are several API methods that can find and return metadata instances. 
Note that in the API, metadata instances are called Template Instances
(template_instance in the method names). 
The API refers to an actual CEDAR template as a Template, 
though some might call it a 'template instance'. 
We apologize for this semantic hiccup.

We cover a few of the most useful API methods for finding and obtaining
CEDAR metadata instances in this page.
These same patterns and methods will also apply to searching and obtaining
metadata templates and elements.

### Overview

CEDAR offers a number of search methods that can return metadata instances.
Most of these return, for each discovered metadata instance, 
the description of the instance (in other words, that instance's metadata).
To obtain the actual metadata (values) contained in one of those instances,
you need to make a request for the specific instance using its `instance identifier`.

#### Search Methods

When performing searches via the API, just like searches in the UI,
you will only find artifacts to which you (identified by your API key) have access.
You must ensure the metadata artifacts you want searchable are visible
to the people or groups you need to find and access them—
either by explicitly giving those people or groups access to the artifacts,
or by giving Everyone group access to the artifacts,
or by putting the artifacts into a folder visible to those people, those groups, 
or the `Everyone` group.

CEDAR administrators can arrange for all the artifacts of a particular template
to be visible to a particular group, contact us at cedar-support@metadatacenter.org
to make that request.

This document describes one example in each section. 
To learn how to perform more detailed searches or searches for other entities,
simply review the appropriate [Swagger](https://resource.metadatacenter.org/api) forms 
and enter parameters you are interested in. 
Swagger provides Curl and Request URL equivalents for any given search configuration.

##### Finding metadata instances in CEDAR

To get a list of the identifiers and metadata of all the metadata instances you have access to, you can use the [Search GET method](https://resource.metadatacenter.org/api/#!/Template32Instances/get_search). 

To perform this search In the Swagger documentation, 
simply specify the resource_types as 'instance', 
and click the `Try it out!` button toward the bottom. 
With the default settings, you should see the first 100 Instances
that you have access to listed in the Response Body in JSON format. 

To execute the same search in a curl request 
from a Unix or Linux command line, 
your command will look like this, 
substituting your API key as described in the overview:
```
curl -X GET --header 'Accept: application/json' --header 'Authorization: apiKey ' 'https://resource.metadatacenter.org/search?version=all&publication_status=all&is_based_on=https%3A%2F%2Frepo.metadatacenter.org%2Ftemplates%2F5bf8d2bf-2f1c-4d77-a399-a2222157d894&sort=name&limit=100&sharing=null&mode=null'
```

##### Finding instances of a particular parent template

To find the set of metadata instances that have 
a particular metadata template as their parent,
you will use the [Search GET method](https://resource.metadatacenter.org/api/#!/Template32Instances/get_search).

The Search method has many parameters, but the key parameter for this command
are `is_based_on`, which specifies the parent template's `template identifier`, 
and `resource_types`, which *must be left blank*. 
(It is required in every other search request except this one.)

When you put this command and your template identifier into a curl request 
that you can run from your Unix or Linux command line, 
and you add a pretty-printing command so that your instances descriptions
are easily viewed, you obtain something like the following
```
curl -X GET --header 'Accept: application/json' --header 'Authorization: apiKey YOUR_API_KEY' 'https://resource.metadatacenter.org/search?version=all&publication_status=all&is_based_on=https%3A%2F%2Frepo.metadatacenter.org%2Ftemplates%2F5bf8d2bf-2f1c-4d77-a399-a2222157d894&sort=name&limit=100' | /usr/local/prettyprint
```

#### Retrieval Methods

To retrieve a metadata instance, you will use the [Template Instance GET method](https://resource.metadatacenter.org/api/#!/Template32Instances/get_template_instances_template_instance_id). 
This method has two parameters: the template_instance_id 
(the instance_identifier mentioned earlier), and 
the desired format.

##### Getting the template using its instance identifier

The template_instance_id should look very similar to the following:
  `https://repo.metadatacenter.org/template-instance/8bc64ab5-df6b-48c8-8c61-6c016245918e`
The final 32 characters are the unique part of the string.

When this is put into a curl request that you can run from your Unix command line, 
and a pretty-printing command is added,
you obtain something like the following:
```
curl -X GET --header 'Accept: application/json' --header 'Authorization: apiKey YOUR_API_KEY' 'https://resource.metadatacenter.org/template-instances/https%3A%2F%2Frepo.metadatacenter.org%2Ftemplate-instances%2Ffb8f0a9c-8ded-4d31-9d92-fb780ff6b4df?format=jsonld' | /usr/local/prettyprint` 
```

##### Requesting specific formats

Use the format parameter to request the format you want. CEDAR offers three formats:
* json-ld: JSON-Linked Data, the default internal storage format
* json: Plain JSON, similar content to json-ld but with most of the LD-specific identifiers removed (this specifically removes the semantic identifiers, which is a significant reduces the precision of the metadata)
* rdf: Resource Description Framework, with the same content as the JSON-LD but expressed as RDF n-quads. 

The RDF format should be importable by most triple stores and semantic repositories.

An example of the above call with an RDF-formatted instance returned:

```
curl -X GET --header 'Accept: application/json' --header 'Authorization: apiKey YOUR_API_KEY' 'https://resource.metadatacenter.org/template-instances/https%3A%2F%2Frepo.metadatacenter.org%2Ftemplate-instances%2Ffb8f0a9c-8ded-4d31-9d92-fb780ff6b4df?format=rdf' | /usr/local/prettyprint` 
```

## API: Using Google Sheets

You can also query CEDAR's API using a Google sheet library
developed by the CEDAR team.
As with the other parts of this chapter,
to see the library function, you will have to have your CEDAR API key
as described in the [CEDAR's API documentation](#about-your-api-key).

### Using the Google Sheet

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

### Advanced considerations

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
