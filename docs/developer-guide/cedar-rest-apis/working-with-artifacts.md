# Working With Artifacts

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

Use `template-elements` for an element, `template-fields` for a field, and `template-instances`
for an instance. These typed routes also accept the identifier's bare UUID. Request
`application/yaml` instead when the YAML form is easier for the calling workflow to read or edit.
An instance's `schema:isBasedOn` value is the identifier of its template; URL-encode that value and
retrieve it through the `templates` route when an integration needs the definition that governs an
instance. Every artifact `GET`, including `/{id}/download`, also accepts `format=jsonld`, `json`,
`yaml`, or `rdf-nquad`. An explicit `format` takes precedence over `Accept`, even if that header
requests another representation. An unknown or repeated `format` returns 400.

`jsonld` preserves the stored document; `json` removes JSON-LD structure; `yaml` renders CEDAR YAML.
Use `compact=true` with YAML for its compact form. `rdf-nquad` returns N-Quads for instances.
Schema artifacts have no supported RDF mapping and return 406 for that format.

The response also carries an `ETag` header identifying the revision just read. Retain it alongside
the body when the retrieved artifact is about to be changed.

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
curl -X POST "$CEDAR_API/artifact-validations/instance" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --data-binary @instance.json
```

Validation catches structural and value errors without creating a repository resource. A completed
validation returns 200 even when the artifact is invalid: inspect the report's `validates`, `errors`,
and `warnings` properties. A JSON request may supply both the template and instance as
`{"schema": <template>, "instance": <instance>}`. YAML requests carry the artifact itself.
Once validation passes, store the instance with:

```bash
curl -X POST "$CEDAR_API/template-instances?folder_id=<URL_ENCODED_FOLDER_ID>" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @instance.json
```

The folder identifier determines where the instance appears in Workspace. Omit `folder_id` to use
the account's home folder.

The same pattern creates templates, elements, and fields: validate at
`/artifact-validations/template`, `/artifact-validations/element`, or `/artifact-validations/field`,
then send it to `templates`, `template-elements`, or `template-fields`. The
[CEDAR Artifact Library](../cedar-artifact-library.md) and
[CEDAR Model TypeScript Library](../cedar-model-typescript-library.md) can construct those artifacts
without requiring application code to assemble the model by hand.

## Update an Existing Artifact

Replacing a stored artifact uses `PUT` on the route that retrieved it, and the request must carry
the artifact's current revision in an `If-Match` header:

```bash
curl -X PUT "$CEDAR_API/templates/<URL_ENCODED_TEMPLATE_ID>" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Content-Type: application/json" \
  -H 'If-Match: "7"' \
  --data-binary @updated-template.json
```

The server replaces the artifact only if it still holds the revision that validator identifies, so
a concurrent change by another client produces `412 Precondition Failed` instead of a lost update.
Deleting an artifact requires the same header, and an artifact's permissions are revisioned
separately from its content. [ETag Concurrency](etag-concurrency.md) gives the full rules, including
the responses a missing or stale validator produces.

To change a name, description, or sharing state without replacing the complete artifact, use the
PATCH routes in [Resource Changes and API Conventions](resource-changes.md).
