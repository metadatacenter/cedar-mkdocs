# Interactive API Documentation

The pages in this section describe the normal integration path rather than every route and option.
Use the [interactive API documentation](https://resource.metadatacenter.org/api){: target="_blank" .external }
to explore additional searches, updates, permissions, folders, and administrative operations. It
shows the accepted parameters, ETag requirements, and response shapes for the deployed CEDAR
version.

The [terminology API reference](https://terminology.metadatacenter.org/api){: target="_blank" .external }
describes term searches, hierarchies, and version selectors. The
[group API reference](https://group.metadatacenter.org/api){: target="_blank" .external }
describes group properties and membership. These are separate services; send a request to the
service whose reference defines it.

The reference is generated from the server's route annotations and shared schemas. It is the
authority for the deployed version: current development examples in this guide can precede a
production rollout. Select the reference on your own deployment when targeting staging or a
local stack.

Select **Authorize**, enter `apiKey <YOUR_API_KEY>`, and then use **Try it out** and **Execute** on an
operation. Swagger sends a real request to CEDAR and displays the request, response body, status, and
headers. For a conditional write, first execute the corresponding `GET`, copy its response `ETag`,
and enter that complete value in the write operation's `If-Match` field.
