# Interactive API Documentation

The pages in this section describe the normal integration path rather than every route and option.
Use the [interactive API documentation](https://resource.metadatacenter.org/api){: target="_blank" .external }
to explore additional searches, updates, permissions, folders, and administrative operations. It
shows the accepted parameters, ETag requirements, and response shapes for the deployed CEDAR
version.

Select **Authorize**, enter `apiKey <YOUR_API_KEY>`, and then use **Try it out** and **Execute** on an
operation. Swagger sends a real request to CEDAR and displays the request, response body, status, and
headers. For a conditional write, first execute the corresponding `GET`, copy its response `ETag`,
and enter that complete value in the write operation's `If-Match` field.
