# CEDAR REST APIs

This page helps developers get working quickly with CEDAR's REST APIs.

Detailed documentation for each REST route is available [here](https://resource.metadatacenter.org/api){: target="_blank" .external }.

### Getting a CEDAR API Key

First create an account on CEDAR at `cedar.metadatacenter.org`. Each registered user is assigned an API key. For a research group it may make sense to create a central project user and use that user's API key for all CEDAR access.

To find your API key, log in to CEDAR at `cedar.metadatacenter.org`, click the person icon at the top right of the desktop, and select **Profile**. The key shown there is needed for every CEDAR REST call.

### Format of CEDAR Resources

Templates, elements, fields, and instances all follow the CEDAR model. The [CEDAR Model YAML Specification](../yaml-spec/index.md) gives the full specification, and the [model overview](../yaml-spec/cedar-model.md) is a good place to start.

You can inspect any resource without going through the REST APIs: open it in the CEDAR Workbench and click the circle icons at the top right of the screen. The left-hand icon shows the template, the right-hand icon shows the instance.

### Creating Templates, Elements, and Fields

CEDAR's Template Designer is the most convenient way to create templates, elements, and fields. To create them programmatically, two libraries generate the underlying representation for you: the Java-based [CEDAR Artifact Library](https://github.com/metadatacenter/cedar-artifact-library) and the TypeScript-based [CEDAR Model TypeScript Library](https://github.com/metadatacenter/cedar-model-typescript-library). Both represent the model defined in the [CEDAR Model YAML Specification](../yaml-spec/index.md).

### Invoking the REST Endpoints

Try these endpoints interactively through the [Swagger](https://swagger.io/)-generated pages, or from the command line with a tool like `curl`. Each call passes your API key in the `Authorization` header.

**Search for resources.** Set `q=*` to match everything, or supply a search query. The `resource_types` parameter takes one or more comma-separated types: `template`, `element`, `instance`, or `folder`.

```bash
curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
     -X GET "https://resource.metadatacenter.org/search?q=<searchQuery>&resource_types=<resourceTypes>"
```

For example, to retrieve all templates and elements:

```bash
curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
     -X GET "https://resource.metadatacenter.org/search?q=*&resource_types=template,element"
```

**Find all instances of a template.** Use the `is_based_on` parameter to identify the template. Its value must be URL-encoded.

```bash
curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
     -X GET "https://resource.metadatacenter.org/search?q=*&is_based_on=https%3A%2F%2Frepo.metadatacenter.org%2Ftemplates%2Fc1199f96-dbd3-4476-8141-1f1fb13e1bca"
```

**Retrieve a resource by its identifier.** Replace `<resourceType>` with `templates`, `template-elements`, or `template-instances`, and `<resourceId>` with the URL-encoded resource identifier (its `@id` value).

```bash
curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
     -X GET -H "Accept: application/json" \
     "https://resource.metadatacenter.org/<resourceType>/<resourceId>"
```

For example, to retrieve a specific template:

```bash
curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
     -X GET -H "Accept: application/json" \
     "https://resource.metadatacenter.org/templates/https%3A%2F%2Frepo.metadatacenter.org%2Ftemplates%2Fc1199f96-dbd3-4476-8141-1f1fb13e1bca"
```

**Create a resource.** POST the resource to the route for its type. The optional `folder_id` parameter (URL-encoded) names the containing folder, found in the CEDAR Workbench URL; without it, the resource goes to your home folder.

```bash
curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" \
     -X POST --data-binary @resource.json \
     "https://resource.metadatacenter.org/<resourceType>?folder_id=<folderId>"
```

Here `resource.json` holds the template, element, or instance to create, and `<resourceType>` is `templates`, `template-elements`, or `template-instances`.

### Validating Templates, Elements, Fields, and Instances

Validate a resource before creating it. The `command/validate` route validates all four resource types; the `resource_type` parameter names the type as `template`, `element`, `field`, or `instance`.

```bash
curl -H "Content-Type: application/json" -H "Authorization: apiKey <yourApiKey>" -H "Accept: application/json" \
     -X POST --data-binary @MyTemplate.json \
     "https://resource.metadatacenter.org/command/validate?resource_type=template"
```

### Uploading Instances

Upload an instance with the create call shown above, using the `template-instances` resource type. A CEDAR server generates several provenance fields when it stores an instance: `@id`, `pav:createdOn`, `pav:createdBy`, `pav:lastUpdatedOn`, and `oslc:modifiedBy`. These must be present but set to `null` in the instance you upload. The `schema:isBasedOn` field must hold the identifier of the template the instance conforms to, and the `@type` field is optional.

### Support

If you have questions about these APIs, please subscribe to the [CEDAR Users Support mailing list](https://mailman.stanford.edu/mailman/listinfo/cedar-users). After subscribing, send messages to `cedar-users` at `lists.stanford.edu`.
