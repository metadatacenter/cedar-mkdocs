# CEDAR REST APIs

This page provides a guide to help developers to quickly get working with CEDAR's REST APIs. 

Detailed documentation for each REST route is available [here](https://resource.metadatacenter.org/api){: target="_blank" .external }.

### Getting a CEDAR API Key

First create an account on CEDAR at `cedar.metadatacenter.org`. Each registered user will be assigned an API key. For a research group it may make sense to create a central project user and use the user's API key for all CEDAR access.

To find this API key, log in to CEDAR at `cedar.metadatacenter.org` and click on the person icon on the top right of the desktop and select the ```Profile``` option.

Note this API key presented in the profile display. This key is needed for all CEDAR REST calls.

### Format of CEDAR Repository Resources

CEDAR templates, elements, and fields are represented using [JSON Schema](http://json-schema.org/).
Instances are represented using [JSON-LD](http://json-ld.org/).

The [CEDAR Template Model](https://metadatacenter.org/tools-training/outreach/cedar-template-model) defines the representation of these entities. You can directly access any of these key documents: [a paper describing this model](https://metadatacenter.org/open-repository-model-acquiring-knowledge-about-scientific-experiments); or, [a full description of the model](https://metadatacenter.org/tools-training/outreach/cedar-template-model); or [a description of the format of metadata instances in the CEDAR repository](https://github.com/metadatacenter/cedar-docs/wiki/CEDAR-Template,-Element,-and-Field-Instances).

Note that you can also look at the JSON representing CEDAR resources by opening the resource in the CEDAR tool and clicking on the circle icons on the top right of the screen. (The left-hand icon shows template JSON, the right-hand icon shows instance JSON.) These will allow you to eyeball the representation of resources without going through the REST APIs.

### Invoking the REST Endpoints

You can try these endpoints interactively via the [Swagger](https://swagger.io/)-generated pages, or you can use command line tools like ```curl```.

Here are some example ```curl``` commands you can try to retrieve templates and instances:

- Find all resources that match a search query. For `q=*` all resources will be retrieved.

  ```
      curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
      -X GET "https://resource.metadatacenter.org/search?q=<searchQuery>&resource_types=folder,element,template,instance"
  ```

This query will return all templates, elements, fields, instances or folders that match the query.

- To find all resources of a particular type use the `resource_types` parameter followed by one or more comma-separated types. Possible values are `template`, `element`, `instance` and `folder`.

  ```
  curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
      -X GET "https://resource.metadatacenter.org/search?q=<searchQuery>&resource_types=<resourceTypes>"
  ```

- Retrieve all templates and elements:

  ```
  curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
      -X GET "https://resource.metadatacenter.org/search?q=*&resource_types=template,element"
  ```

- To find all instances of a particular template use the `is_based_on` parameter to identify the template:

  ```
  curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
      -X GET "https://resource.metadatacenter.org/search?is_based_on=<templateId>"
  ```

  Find all instances of the template with the ID `https://repo.metadatacenter.org/templates/c1199f96-dbd3-4476-8141-1f1fb13e1bca`:

  ```
  curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
      -X GET "https://resource.metadatacenter.org/search?q=*&is_based_on=https%3A%2F%2Frepo.metadatacenter.org%2Ftemplates%2Fc1199f96-dbd3-4476-8141-1f1fb13e1bca"
  ```

- Retrieve the content of a particular resource:

  ```
  curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
      -X GET --header "Accept: application/json" "https://resource.metadatacenter.org/<resourceType>/<resourceId>"
  ```

  with:

    - \<resourceType> = {templates|template-elements|template-instances}
    - \<resourceId> is the resource identifier (@id field). Note that **the resource identifier must be URL encoded** (e.g., ```https%3A%2F%2Frepo.metadatacenter.org%2Ftemplate-instances%2F30e39969-1995-47c9-bb74-a086dddced8e```).

- Retrieve the content of the template with the ID `https://repo.metadatacenter.org/templates/c1199f96-dbd3-4476-8141-1f1fb13e1bca`:

```
	curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
        -X GET --header 'Accept: application/json' 
        'https://resource.metadatacenter.org/templates/https%3A%2F%2Frepo.metadatacenter.org%2Ftemplates%2Fc1199f96-dbd3-4476-8141-1f1fb13e1bca'
```

- Create a new resource:

  ```
  curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
      -X POST --data-binary @resource.json https://resource.metadatacenter.org/<resourceType>?folder_id=<folderId>
  ```

  with:
    - \<resource.json> = JSON file with the resource (i.e., template, element, or instance) that will be created.
    - \<resourceType> = {templates|template-elements|template-instances}.
    - \<folderId> An (optional) identifier of the folder that will contain the resource. It can be found on the CEDAR Workbench, as part of the URL. The identifier must be URL encoded (e.g., ```https:%2F%2Frepo.metadatacenter.org%2Ffolders%2F23640714-f371-40f1-b2e6-ed2819ccc5e6```). If the folder identifier is not supplied then the user's home folder is used.

### Support

If you have questions about these APIs, please subscribe to the [CEDAR Users Support
mailing list](https://mailman.stanford.edu/mailman/listinfo/cedar-users).
After subscribing, send messages to `cedar-users` at `lists.stanford.edu`.
