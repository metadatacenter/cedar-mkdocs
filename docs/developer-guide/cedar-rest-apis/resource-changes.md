# Resource Changes and API Conventions

These contracts describe the current development API. Check the target deployment's
[interactive reference](interactive-api.md) before migrating an integration; a documentation update
does not deploy a new server version.

## Names and Identifiers

Paths use lowercase words separated by hyphens, such as `/template-instances` and
`/artifact-validations`. Query parameters use underscores, such as `folder_id` and
`resource_types`. JSON operation options use camelCase, such as `newOwnerId`. Artifact and
resource properties retain their model names, including `@id`, `schema:name`, and `schema:description`.

Artifact, folder, group, and category routes accept either a bare UUID or the full stored IRI,
percent-encoded as one path segment. Both forms address the same resource and revision, including
group membership and category permissions. An ETag read through either address works with the
other; authorization, ownership, and conditional-write rules are identical.

The matching type-qualified selector also works as one encoded path segment, for example
`groups%2F<UUID>` on a group route or `categories%2F<UUID>` on a category route. A selector naming
the wrong resource type is rejected with 400. A full IRI is preserved exactly, including its host;
UUID shorthand resolves within the current deployment and must not be used to retarget a historical
IRI. Responses retain the stored full IRI. The dedicated `/categories/root` and `/categories/tree`
reads and protections for the root category and built-in groups are unchanged.

This path convention does not change identifiers inside JSON bodies. Preserve identifiers returned
by the API there. User and terminology routes have their own identifier types, described in their
interactive references.

## Partial Resource Changes

`PUT` replaces a resource's writable representation; `PATCH` changes selected properties.
On the resource API, use these routes:

| Operation | Request | JSON Body |
| --- | --- | --- |
| Change a name or description | `PATCH /{collection}/{id}` | `{"schema:name":"New name"}` and/or `schema:description` |
| Change open access | `PATCH /{collection}/{id}` | `{"isOpen":true}` or `{"isOpen":false}` |
| Transfer ownership | `PATCH /{collection}/{id}/permissions` | `{"newOwnerId":"<USER_IRI>"}` |
| Transfer category ownership | `PATCH /categories/{id}/permissions` | `{"newOwnerId":"<USER_IRI>"}` |
| Set an artifact DOI | `PATCH /{artifact-collection}/{id}/annotations` | `{"doi":"<DOI>"}` |
| Publish a schema artifact | `PATCH /{schema-collection}/{id}/publication` | `{"newVersion":"1.0.0"}` |

`collection` is `folders`, `templates`, `template-elements`, `template-fields`, or
`template-instances`. Artifact collections exclude folders; schema collections also exclude
instances. The path supplies the resource identifier, so these bodies do not include `@id`.
The open-state body is separate from the name/description body; mixing them is rejected.

For example, after reading a template and retaining its ETag:

```bash
curl -X PATCH "$CEDAR_API/templates/<URL_ENCODED_TEMPLATE_ID>" \
  -H "Authorization: apiKey $CEDAR_API_KEY" \
  -H "Content-Type: application/json" \
  -H 'If-Match: "7"' \
  --data '{"schema:description":"Updated description"}'
```

Rename, description, and open-state changes use the artifact or folder ETag. Ownership changes
use the **permissions** ETag from `GET .../permissions`. Replacing grants still uses
`PUT .../permissions`; ownership transfer uses PATCH. See [ETag Concurrency](etag-concurrency.md).
Publication is owner-only. A DOI annotation is immutable once set, and repeating the same DOI is
idempotent. Their endpoint descriptions specify their individual authorization and response rules.

## Validation, Conversion, and Drafts

| Operation | Current Request | Input |
| --- | --- | --- |
| Validate without storing | `POST /artifact-validations/{resource_type}` | Artifact JSON or YAML; type is `template`, `element`, `field`, or `instance` |
| Convert supplied JSON-LD | `POST /artifact-conversions?format=json` | JSON artifact; formats are `jsonld`, `json`, and `rdf-nquad` |
| Check a proposed template update | `POST /template-update-checks/{id}` | Proposed template |
| Publish and create a template draft | `POST /template-drafts/{id}` | `template`, with optional `newFolderName` and `draftId` |
| Preview the inclusion subgraph | `POST /inclusion-subgraphs/query` | Inclusion query body described in Swagger |
| Update the inclusion subgraph | `POST /command/update-inclusions-subgraph` | Update body described in Swagger |

Conversion of supplied JSON-LD has its own format choices; use an artifact GET with `format=yaml`
to retrieve stored content as YAML. The replaced `/command/validate`, `/command/convert`,
`/command/check-update-template/{id}`, `/command/publish-create-draft-template/{id}`,
`/command/inclusions-subgraph-preview`, and `/command/inclusions-subgraph-update` routes are
withdrawn in the current development API. The former rename, ownership, DOI, and publication
command routes are likewise replaced by the PATCH routes above.

## Terminology Parameters

The terminology API uses `source_acronym`, `version_id`, `property_iri`, and `term_iri` in query
strings where those concepts are accepted. JSON bodies use `sourceAcronym`, `versionId`,
`propertyIri`, and `termIri`. Do not apply query-string spelling to a JSON body or artifact model.

The first-generation BioPortal routes use `/bioportal/property-search`,
`/bioportal/search?source_acronym=...&term_iri=...`, and
`/bioportal/classes/version-current?term_iri=...`. The search parameter `sources` retains its
separate meaning; it is not an alias for `source_acronym`.

Released term-picker packages still send some camelCase query parameters, and released CEE/CED
packages send `iri` in term-verification bodies. The server temporarily accepts these spellings
until replacement packages and their hosts have migrated. New integrations should use the
canonical names; sending both spellings is rejected with 400. Artifact value-constraint keys such
as an action's `termUri` belong to the model and remain unchanged.

Listings use the shared [limit/offset paging contract](paging.md), including its documented cursor
and released-client exceptions.
