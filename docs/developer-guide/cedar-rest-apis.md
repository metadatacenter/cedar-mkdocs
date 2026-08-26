# CEDAR REST APIs

The REST API lets another application work with the same templates and metadata that people use in
the CEDAR Workbench. Use it when a workflow needs to find a template, retrieve its definition,
validate metadata, or store a completed instance without asking a person to perform those steps in
the browser.

The API is usually not the best place to design a template from scratch. Template Designer and the
CEDAR artifact libraries provide safer ways to construct the underlying model. Once the artifact
exists, the REST API is the natural way to move it into or out of a CEDAR repository.

## Authenticate as a CEDAR User

API requests act on behalf of a CEDAR account and follow that account's permissions. Log in to
CEDAR, open **Profile** from the person menu, and copy the API key shown there. For a long-running
project integration, use a dedicated project account rather than tying the workflow to one person's
account.

The key is sent in the `Authorization` header:

```text
Authorization: apiKey <YOUR_API_KEY>
```

The examples below use two shell variables so the key and server address do not have to be repeated:

```bash
export CEDAR_API_KEY="<YOUR_API_KEY>"
export CEDAR_API="https://resource.metadatacenter.org"
```

Treat the API key as a password. Do not place it in source code or commit it to a repository.

## Understand What the API Stores

CEDAR has two closely related kinds of resources:

- **Templates, elements, and fields** describe the structure of metadata.
- **Instances** contain the values entered using a template.

Every stored resource receives a stable CEDAR identifier. An instance also records the identifier
of the template it follows in `schema:isBasedOn`. Understanding that relationship is more useful
than memorizing route names: a typical integration first finds a template, retrieves it, creates an
instance that refers to it, validates the instance, and then stores it.

The API uses CEDAR's native JSON representation by default. It also accepts and returns the
[CEDAR YAML representation](../yaml-spec/index.md) when requests use `application/yaml`. The model
is the same in either format; choose the representation that fits the calling application.

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
elements, instances, and folders. The result provides the stable identifiers needed for later
requests.

## Retrieve an Artifact

Retrieve a template by placing its URL-encoded identifier after the `templates` route:

```bash
curl "$CEDAR_API/templates/<URL_ENCODED_TEMPLATE_ID>" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Accept: application/json"
```

Use `template-elements` for an element and `template-instances` for an instance. Request
`application/yaml` instead when the YAML form is easier for the calling workflow to read or edit.

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
[CEDAR Artifact Library](cedar-artifact-library.md) and
[CEDAR Model TypeScript Library](cedar-model-typescript-library.md) can construct those artifacts
without requiring application code to assemble the model by hand.

## Explore the Complete API

This page describes the normal integration path rather than every route and option. Use the
[interactive API documentation](https://resource.metadatacenter.org/api){: target="_blank" .external }
to explore additional searches, updates, permissions, folders, and administrative operations. It
shows the accepted parameters and response shapes for the deployed CEDAR version.
