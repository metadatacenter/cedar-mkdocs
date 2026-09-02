# ETag Concurrency

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

## Read, Edit, and Write the Same Revision

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

## Handle 428 and 412 Responses

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

## Use the ETag for the Resource Being Changed

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
the endpoint's `If-Match` description in the [interactive API documentation](interactive-api.md).

## Use `If-Match: *` Deliberately

CEDAR accepts the HTTP wildcard:

```text
If-Match: *
```

The wildcard means “perform this operation if a current resource exists, whatever its revision.” It
is useful for an intentional delete-if-present or overwrite-latest operation, but it gives up
lost-update protection. If somebody changes the resource after your client reads it, `*` still
matches and your request can replace or delete their work. Interactive editors and ordinary
read-modify-write integrations should therefore use the exact ETag from `GET`.
