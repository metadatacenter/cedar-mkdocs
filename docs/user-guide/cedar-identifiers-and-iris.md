# CEDAR Identifiers and IRIs

CEDAR uses identifiers to keep track of resources and the relationships between
them: which template an instance follows, which user created an artifact, and
which controlled term an answer refers to. Those identifiers travel with the
metadata when it is exported or read by another application.

An identifier and a browser address have different jobs. An artifact's identifier
names the artifact; a Workbench URL opens an application view of it. The same
artifact can be opened in an editor, retrieved through an API, or presented in
OpenView without acquiring a different identity.

## URI, URL, and IRI

These terms describe related concepts:

- A **URI** (Uniform Resource Identifier) identifies a resource using a syntax
  based on ASCII characters.
- An **IRI** (Internationalized Resource Identifier) extends that syntax to allow
  a wider range of Unicode characters. Every URI is also an IRI.
- A **URL** (Uniform Resource Locator) identifies a resource through an access
  mechanism, such as an HTTPS web address. In this guide, *URL* usually means an
  address to open in a browser or call through an API.

IRIs complement URIs; they did not replace URLs. Not every IRI is a web address,
and a syntactically valid HTTPS identifier does not guarantee that a browser can
retrieve a page from it. The standards are [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986)
for URIs and [RFC 3987](https://www.rfc-editor.org/rfc/rfc3987) for IRIs.

<a id="how-cedar-defines-and-applies-iris-uris-urls"></a>

## Resource Identifiers

A CEDAR artifact records its own identifier in `@id` in JSON and `id` in YAML.
A typical identifier minted by the public CEDAR deployment is:

```text
https://repo.metadatacenter.org/templates/4595e3d3-b0c5-467b-a967-fec870801624
```

The repository base is `https://repo.metadatacenter.org/`, `templates` names the
resource collection, and the final part is a UUID. The examples on this page use
illustrative UUIDs; they are not links to resources you can necessarily open.

| Resource | Collection in a Repository Identifier |
|---|---|
| Template | `templates` |
| Reusable element definition | `template-elements` |
| Reusable field definition | `template-fields` |
| Metadata instance | `template-instances` |
| Folder | `folders` |

Templates, elements, fields, and instances are the four artifact kinds in the
[CEDAR model](../yaml-spec/cedar-model.md). Folders organize those artifacts and
control access; they are resources with identifiers of their own.

The repository-base, collection, and UUID pattern is CEDAR's naming convention,
not the definition of an IRI. Other deployments use other bases, and imported
artifacts or external references may have identifiers assigned elsewhere. Use
the identifier returned by CEDAR rather than reconstructing it from a name or
assuming a particular hostname. In particular, an older identifier containing
`repo.metadatacenter.net` must not be changed to `.org` merely because the
application is now reached through an `.org` address.

Changing an artifact's title or moving it to another folder does not change its
identifier. A new version of a template, element, or field has its own identifier
and links to the preceding version. An instance names the template it follows
in `schema:isBasedOn` in JSON, or `isBasedOn` in YAML. That reference does not
silently switch to a newer template version. See the
[versioning model](advanced-topics/versioning-model/index.md).

### Other Identifiers Inside an Artifact

Not every identifier in a document names a top-level CEDAR resource:

| Identifier | What It Names |
|---|---|
| A controlled-term value | The term supplied by an ontology or value set. Its label is display text, not its identity. |
| An external-authority value | A record named by an ORCID, ROR, DOI, or another supported external identifier. |
| A property IRI in `@context` | The meaning of a field or attribute in the linked-data representation. It is distinct from the field definition's own `@id`. |
| An element occurrence's `@id` | A particular group of answers within an instance. Server-assigned identifiers commonly use `template-element-instances/<uuid>`. |
| A provenance user IRI | The user who created or modified the artifact, commonly under `https://metadatacenter.org/users/<uuid>`. |

Element occurrences are parts of their containing metadata instance; their
identifiers are not the identifiers of reusable element definitions. Likewise,
a term or user identifier is not an artifact-editing URL. The
[YAML specification](../yaml-spec/index.md) describes how these references are
represented.

## Browser Address URLs in CEDAR

Workbench URLs combine an application address, an operation, and a resource
selector. A *selector* is the value an application or API uses to find the
resource. It may be the complete IRI or a supported short form.

Modern CEDAR clients can shorten identifiers belonging to their deployment's
repository base. Where the route already names the collection, the UUID is
sufficient. Elsewhere, the short form retains the collection:

| Use | Example |
|---|---|
| Stored artifact identity | `https://repo.metadatacenter.org/templates/4595e3d3-b0c5-467b-a967-fec870801624` |
| Selector containing its resource type | `templates/4595e3d3-b0c5-467b-a967-fec870801624` |
| Template-edit route using that UUID | `/templates/edit/4595e3d3-b0c5-467b-a967-fec870801624` |

Short forms are an addressing convenience. They do not replace full IRIs in
stored `@id`, `schema:isBasedOn`, or other document references. Full-IRI addresses
remain supported. Identifiers on a different or historical repository base must
retain that base rather than being shortened into a different local identity.
This shortening convention does not apply to user, group, category, or
controlled-vocabulary identifiers.

<a id="workspace-home-directory-iri"></a>

### Folder Addresses

A folder can be opened with a URL such as:

```text
https://cedar.metadatacenter.org/dashboard?folderId=https%3A%2F%2Frepo.metadatacenter.org%2Ffolders%2F4036e319-5bb7-493f-8fe5-31a004f65a94
```

Here, `https` is the scheme, `cedar.metadatacenter.org` is the application host,
`/dashboard` is the application path, and `folderId` is a query parameter. Its
value is the folder IRI encoded for use inside the URL. The exact parameter name
is **`folderId`**, with a lowercase `d`.

For an identifier on the deployment's own base, a modern client may instead use
`folderId=folders%2F4036e319-5bb7-493f-8fe5-31a004f65a94`. Opening `/dashboard`
without a folder selector uses the signed-in user's home folder.

<a id="template-creator-or-metadata-editor-iri"></a>

### Artifact Addresses

The route determines what CEDAR opens:

| Purpose | Application | Route |
|---|---|---|
| Open a template definition | Designer | `/templates/edit/<template-selector>` |
| Open an element definition | Designer | `/elements/edit/<element-selector>` |
| Open a field definition | Designer | `/fields/edit/<field-selector>` |
| Open an existing metadata instance | Workspace | `/instances/edit/<instance-selector>` |
| Start a new instance from a template | Workspace | `/instances/create/<template-selector>` |

A selector used as a route argument is URL-encoded once. It can be a canonical
local UUID or the full IRI. Older bookmarks may contain a full IRI directly after
`/edit/` or `/create/`; current route handling retains compatibility with those
addresses.

The examples here use `https://cedar.metadatacenter.org` as the Workbench address.
Deployments with separate Workspace and Designer applications use their
configured application addresses for the corresponding routes. Prefer the links
CEDAR generates rather than guessing an application's host from the repository
IRI.

A URL can also carry navigation context. `returnTo` identifies the Workspace
view to return to when leaving an editor; CEDAR validates it before using it.
`folderId` supplies folder context and, when creating metadata, the destination
folder. Neither parameter changes an existing artifact's identity or grants
permission to read or write it.

<a id="building-shareable-metadata-creation-iris"></a>

## Building Shareable Metadata Creation Links

A metadata creation link names a **template** and opens a new form based on it.
It does not name an existing instance. For example:

```text
https://cedar.metadatacenter.org/instances/create/https%3A%2F%2Frepo.metadatacenter.org%2Ftemplates%2Ff7d62955-ed10-4912-b4db-1b366ad4ff00
```

Replace the illustrative template IRI with the identifier of a template the
recipient may read. The recipient must sign in if needed and must have permission
to create metadata in the destination folder. Sharing a creation link does not
share the template or grant access to that folder; use CEDAR's
[sharing controls](sharing-resources.md) to arrange access.

With no `folderId`, a new instance uses the recipient's home folder as its
destination. To select a different destination, include `folderId` with that
folder's selector. If the recipient cannot create resources there, the URL does
not override the refusal. Saving and leaving the editor are separate actions;
`returnTo` controls the return location, not the storage destination.

When constructing a link in JavaScript, encode the route argument and let
`URLSearchParams` encode the query value:

```javascript
const workspaceBase = 'https://cedar.metadatacenter.org';
const templateIri =
  'https://repo.metadatacenter.org/templates/f7d62955-ed10-4912-b4db-1b366ad4ff00';
const folderIri =
  'https://repo.metadatacenter.org/folders/4036e319-5bb7-493f-8fe5-31a004f65a94';

const link = new URL(
  `${workspaceBase}/instances/create/${encodeURIComponent(templateIri)}`,
);
link.searchParams.set('folderId', folderIri); // Omit to use the recipient's home folder.
console.log(link.href);
```

Use the Workspace address configured for your deployment. Pass the original
folder IRI to `searchParams.set`; pre-encoding it would add an unwanted second
layer of encoding.

To share a public, read-only view instead of a metadata-entry form, use the
resource's [OpenView link](openview.md), where OpenView is enabled. For
programmatic retrieval, use the [CEDAR REST APIs](../developer-guide/cedar-rest-apis/index.md).
The repository IRI itself is not a substitute for either kind of access link.

## Encoding, Unicode, and Identifier Preservation

Encoding an identifier inside another URL must not change the identifier stored
in the artifact. For example, the query value `https%3A%2F%2Frepo…` represents an
IRI beginning `https://repo…`. Decode that URL parameter once to recover the
identifier; do not repeatedly decode the identifier's own content.

This distinction matters when an identifier already contains a percent escape.
If the stored IRI is `https://example.org/terms/a%2Fb`, encoding it as a parameter
includes `a%252Fb`. Decoding the parameter once restores `a%2Fb`. Decoding again
would change the identifier to one containing `a/b`.

CEDAR's shared Java and TypeScript policies preserve accepted identifiers across
JSON, YAML, and editor operations:

- Keep the supplied spelling, including case, Unicode characters, and percent
  escapes. Do not globally lowercase or Unicode-normalize an identifier.
- Do not replace a stored Unicode IRI with a browser's normalized or
  percent-encoded rendering. Transport encoding and stored identity are separate.
- Do not silently trim identifiers while reading or writing artifacts. Explicit
  manual-entry controls may remove surrounding ASCII space, tab, and line-break
  padding; that is not a general reader or writer rule.
- Do not infer identity from appearance or a label. Two strings can look alike
  while containing different Unicode characters. Search may use a normalized
  comparison key without changing either stored identifier.

Acceptance rules depend on where the IRI occurs. Top-level artifact identifiers
require absolute IRIs, while field-value IRIs follow their own character and
compatibility rules. Ordinary unescaped ASCII spaces and malformed percent escapes are
invalid. Some Unicode characters, including non-breaking spaces, can be accepted
in field-value IRIs while being rejected in artifact identifier positions. A
single blanket trimming or URL-normalization rule cannot preserve these
distinctions.

## Syntax, Meaning, and Access Are Separate Checks

A correctly formed IRI does not establish that its target exists, belongs to a
permitted vocabulary, or is accessible to the current user:

| Check | Question |
|---|---|
| Syntax and structure | Is the identifier correctly formed and permitted in this position? |
| Semantic verification | Does the exact term or authority identifier satisfy the field's applicable constraints, including vocabulary versions? |
| Access | May this user read or change the CEDAR resource? |
| Resolution | Can the relevant service retrieve or describe the resource now? |

Malformed identifiers are structural defects. A well-formed identifier that
fails a field's semantic constraint is a different finding: it blocks an invalid
template default but remains a quality warning for a structurally valid instance
answer. Semantic checks distinguish `passed`, `failed`, `notChecked`, and
`unavailable`; an outage is not proof of an invalid term, and a check that did not
run is not proof of validity.

See [CEDAR Artifact Validation Architecture](../developer-guide/cedar-artifact-validation-architecture.md)
for the shared rules and save policies, and
[Validation and the Data Quality Report](../cedar-embeddable-editor/validation.md)
for how editors expose those findings.
