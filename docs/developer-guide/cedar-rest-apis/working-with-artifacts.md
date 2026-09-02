# Working with Artifacts

## Understand What the API Stores

CEDAR has two closely related kinds of resources:

- **Templates, elements, and fields** describe the structure of metadata.
- **Instances** contain the values entered using a template.

Every stored resource receives a stable CEDAR identifier. An instance also records the identifier
of the template it follows in `schema:isBasedOn`. Understanding that relationship is more useful
than memorizing route names: a typical integration first finds a template, retrieves it, creates an
instance that refers to it, validates the instance, and then stores it.

The API uses CEDAR's native JSON representation by default. It also accepts and returns the
[CEDAR YAML representation](../../yaml-spec/index.md) when requests use `application/yaml` or
`application/x-yaml`. Send the desired representation in `Accept` and identify a request body with
`Content-Type`. The model is the same in either format; choose the representation that fits the
calling application.

## Find the Template You Need

Search returns resources the account is allowed to see. This example searches templates, with `*`
meaning all matching templates:

```bash
curl --get "$CEDAR_API/search" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  --data-urlencode "q=*" \
  --data-urlencode "resource_types=template"
```

Replace `*` with a title or other search text to narrow the result. Search can also include
elements, instances, and folders. Search is permission-scoped: the result contains only resources
that the account identified by the API key may read, including resources shared directly, through a
group, or through a folder. The result provides the stable identifiers needed for later requests.

## Retrieve an Artifact

Retrieve a template by placing its URL-encoded identifier after the `templates` route:

```bash
curl "$CEDAR_API/templates/<URL_ENCODED_TEMPLATE_ID>" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Accept: application/json"
```

Use `template-elements` for an element and `template-instances` for an instance. Request
`application/yaml` instead when the YAML form is easier for the calling workflow to read or edit.
An instance's `schema:isBasedOn` value is the identifier of its template; URL-encode that value and
retrieve it through the `templates` route when an integration needs the definition that governs an
instance. A template-instance `GET` can also use the `format` query parameter with `jsonld`, `json`,
or `rdf-nquad`; an explicit `format` takes precedence over the `Accept` header.

## Create and Validate Metadata

An instance must name its template in `schema:isBasedOn`. CEDAR also supplies its repository
identifier and provenance when the instance is stored. Include the following provenance properties
with `null` values in a new instance so the server can fill them in:

- `@id`
- `pav:createdOn`
- `pav:createdBy`
- `pav:lastUpdatedOn`
- `oslc:modifiedBy`

Validate the completed instance before storing it:

```bash
curl -X POST "$CEDAR_API/command/validate?resource_type=instance" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --data-binary @instance.json
```

Validation catches structural and value errors without creating a repository resource. Once it
passes, store the instance with:

```bash
curl -X POST "$CEDAR_API/template-instances?folder_id=<URL_ENCODED_FOLDER_ID>" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @instance.json
```

The folder identifier determines where the instance appears in Workspace. Omit `folder_id` to use
the account's home folder.

The same pattern creates templates and elements: validate the artifact with the appropriate
resource type, then send it to `templates` or `template-elements`. The
[CEDAR Artifact Library](../cedar-artifact-library.md) and
[CEDAR Model TypeScript Library](../cedar-model-typescript-library.md) can construct those artifacts
without requiring application code to assemble the model by hand.
