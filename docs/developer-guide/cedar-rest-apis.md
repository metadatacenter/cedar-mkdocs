# CEDAR REST APIs

CEDAR exposes repository operations through REST APIs. The resource API covers search, validation,
content negotiation, and permission-aware CRUD for templates, elements, fields, instances, folders,
and categories. It also exposes artifact versioning and sharing operations. Mutable resources use
ETag-based optimistic concurrency, described below.

The examples on this page target the resource server. Request and response bodies follow the
[CEDAR model](../yaml-spec/index.md) and can be constructed directly or with the Java and TypeScript
artifact libraries.

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
[CEDAR YAML representation](../yaml-spec/index.md) when requests use `application/yaml` or
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
[CEDAR Artifact Library](cedar-artifact-library.md) and
[CEDAR Model TypeScript Library](cedar-model-typescript-library.md) can construct those artifacts
without requiring application code to assemble the model by hand.

## Update Safely with ETags

CEDAR protects mutable REST resources with standard HTTP
[ETags](https://www.rfc-editor.org/rfc/rfc9110.html#name-etag) and
[`If-Match`](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match). This is optimistic
concurrency control: a client may prepare an edit without holding a lock, but the server accepts the
write only if the resource has not changed since that client read it.

Every successful create, single-resource read, and update of a revisioned resource returns a strong
`ETag` response header. For example, a newly created artifact normally starts with:

```text
ETag: "1"
```

The tag is the version of the representation returned by that request. CEDAR currently bases it on
a server-owned revision that advances atomically after each successful change. The quotes are part
of the header value. Even when a tag looks like a number, treat the complete value as opaque: save
what the server returned rather than parsing it, incrementing it, or constructing a replacement.

### Read, Edit, and Write the Same Revision

First retrieve the current artifact and retain both its body and its `ETag`:

```bash
curl -i "$CEDAR_API/templates/<URL_ENCODED_TEMPLATE_ID>" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Accept: application/json"
```

If that response contains `ETag: "7"`, send that exact value when replacing or deleting the
artifact. A conditional update looks like this:

```bash
curl -i -X PUT "$CEDAR_API/templates/<URL_ENCODED_TEMPLATE_ID>" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Content-Type: application/json" \
  -H 'If-Match: "7"' \
  --data-binary @updated-template.json
```

A successful response returns the replacement body and its new tag, for example `ETag: "8"`.
Keep that returned value for the next change. The complete sequence is therefore:

```text
POST creates the artifact                -> ETag: "1"
GET reads the current artifact           -> ETag: "1"
PUT with If-Match: "1" succeeds         -> ETag: "2"
another PUT with the old If-Match: "1"  -> 412 Precondition Failed
```

The server performs the revision comparison and the write atomically. Two clients can both read
`"7"`, but only the first write can replace revision 7. The second receives `412 Precondition
Failed` rather than silently overwriting the first client's work.

Some `PUT` routes can either create a resource at a client-supplied identifier or replace the
resource already there. Omit `If-Match` only when creating at an identifier that does not yet exist;
if it exists, replacement requires its current ETag.

### Handle 428 and 412 Responses

An update or delete that requires a validator but omits `If-Match` returns
[`428 Precondition Required`](https://www.rfc-editor.org/rfc/rfc6585.html#section-3). Read the
resource and retry with the ETag from that response.

A stale, weak, or malformed validator returns `412 Precondition Failed`. When CEDAR can identify the
current revision, the error body's `parameters.currentETag` reports its tag. Do not simply attach
that newer tag to the body you had already prepared: retrieve the current representation, reconcile
the other client's change with yours, and then retry using the ETag that accompanied that body.

Representation-specific tags such as `"7-yaml"`, `"7-yaml-compact"`, `"7-json"`, or
`"7-resource-record"` distinguish byte-different renderings of the same stored revision. They are
valid `If-Match` values. Always use the value returned with the representation you actually read.
Weak validators such as `W/"7"` do not satisfy CEDAR's write precondition.

### Use the ETag for the Resource Being Changed

Artifact content, permission documents, folders, categories, groups, and group-membership documents
are independently revisioned. Read the same REST resource that the later operation will change:

| Change | Read first | Send its ETag with |
| --- | --- | --- |
| Template, element, field, or instance content | `GET` the artifact | `PUT` or `DELETE` that artifact |
| Artifact, folder, or category permissions | `GET .../permissions` | `PUT .../permissions` |
| Folder or category properties | `GET` the folder or category | its update or delete operation |
| Group properties | `GET /groups/{id}` on the group service | `PUT`, `PATCH`, or `DELETE /groups/{id}` |
| Group membership | `GET /groups/{id}/users` on the group service | `PUT /groups/{id}/users` |

An artifact's content ETag is not a substitute for its permissions ETag, and a group's ETag is not
a substitute for its membership ETag. For other mutation commands, use the read operation named by
the endpoint's `If-Match` description in the interactive API documentation.

### Use `If-Match: *` Deliberately

CEDAR accepts the HTTP wildcard:

```text
If-Match: *
```

The wildcard means “perform this operation if a current resource exists, whatever its revision.” It
is useful for an intentional delete-if-present or overwrite-latest operation, but it gives up
lost-update protection. If somebody changes the resource after your client reads it, `*` still
matches and your request can replace or delete their work. Interactive editors and ordinary
read-modify-write integrations should therefore use the exact ETag from `GET`.

## Explore the Complete API

This page describes the normal integration path rather than every route and option. Use the
[interactive API documentation](https://resource.metadatacenter.org/api){: target="_blank" .external }
to explore additional searches, updates, permissions, folders, and administrative operations. It
shows the accepted parameters, ETag requirements, and response shapes for the deployed CEDAR
version.

Select **Authorize**, enter `apiKey <YOUR_API_KEY>`, and then use **Try it out** and **Execute** on an
operation. Swagger sends a real request to CEDAR and displays the request, response body, status, and
headers. For a conditional write, first execute the corresponding `GET`, copy its response `ETag`,
and enter that complete value in the write operation's `If-Match` field.
