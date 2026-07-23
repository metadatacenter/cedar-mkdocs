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

The [CEDAR model](../yaml-spec/cedar-model.md) defines the representation of these entities; the [CEDAR Model YAML Specification](../yaml-spec/index.md) gives its full specification.

Note that you can also look at the JSON representing CEDAR resources by opening the resource in the CEDAR tool and clicking on the circle icons on the top right of the screen. (The left-hand icon shows template JSON, the right-hand icon shows instance JSON.) These will allow you to eyeball the representation of resources without going through the REST APIs.

### Creating Templates, Elements, and Fields

CEDAR's Template Designer is the most convenient way to create templates, elements, and fields. To create them programmatically, two libraries generate the underlying serialization for you, so you need not construct JSON Schema by hand: the Java-based [CEDAR Artifact Library](https://github.com/metadatacenter/cedar-artifact-library) and the TypeScript-based [CEDAR Model TypeScript Library](https://github.com/metadatacenter/cedar-model-typescript-library). Both represent the model defined in the [CEDAR Model YAML Specification](../yaml-spec/index.md).

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

### Validating Templates, Elements, Fields, and Instances

Validate an artifact before creating it. The `https://resource.metadatacenter.org/command/validate` route validates all four artifact types; a `resource_type` parameter names the type as `template`, `element`, `field`, or `instance`.

For example, to validate a template held in `MyTemplate.json`:

```
curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" -H "Accept: application/json" \
    -X POST --data-binary @MyTemplate.json "https://resource.metadatacenter.org/command/validate?resource_type=template"
```

### Uploading Instances

Upload an instance with the resource-creation call shown above, using the `template-instances` resource type. A CEDAR server generates several provenance fields when it stores an instance: `@id`, `pav:createdOn`, `pav:createdBy`, `pav:lastUpdatedOn`, and `oslc:modifiedBy`. These fields must be present but set to `null` in the instance you upload. The `schema:isBasedOn` field must hold the identifier of the template the instance conforms to. The `@type` field is optional and can be omitted when the instance has no assigned type.

### Representing Instances as RDF

Because instances are JSON-LD with full `@context` mappings for their fields, they convert directly to RDF. Here, for example, is a Turtle representation of a study instance with a nested principal-investigator element:

    @prefix oslc: <http://open-services.net/ns/core#> .
    @prefix pav: <http://purl.org/pav/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix schema: <https://schema.org/> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix myschema: <https://myschema.org/property/> .

    <https://repo.metadatacenter.org/template_instances/55417>
      a <http://semantic-dicom.org/dcm#Study> ;
      schema:name "Immune biomarkers" ;
      schema:description "Metadata about an immune biomarkers study" ;
      schema:isBasedOn <https://repo.metadatacenter.org/template/4343> ;
      oslc:modifiedBy <https://repo.metadatacenter.org/users/6d21a887> ;
      pav:createdBy <https://repo.metadatacenter.org/users/6d21a887> ;
      pav:createdOn "2016-06-29T10:58:26-0700"^^xsd:dateTime ;
      pav:lastUpdatedOn "2016-06-29T10:58:26-0700"^^xsd:dateTime ;
      schema:identifier "SDY2" ;
      myschema:hasPI [
        a <https://schema.org/Person> ;
        schema:name "Dr. P.I" ;
        foaf:homepage <https://www.stanford.edu/people/DrPI.html> ;
        schema:address "Stanford, CA 94305, USA" ;
        schema:birthDate "1999-01-01"^^xsd:date
      ] .

Useful online tools for performing this conversion include the [JSON-LD Playground](http://json-ld.org/playground/) and the [EasyRDF Converter](http://www.easyrdf.org/converter).

### Support

If you have questions about these APIs, please subscribe to the [CEDAR Users Support
mailing list](https://mailman.stanford.edu/mailman/listinfo/cedar-users).
After subscribing, send messages to `cedar-users` at `lists.stanford.edu`.
