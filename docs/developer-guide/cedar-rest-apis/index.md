# CEDAR REST APIs

CEDAR exposes repository operations through REST APIs. The resource API covers search, validation,
content negotiation, and permission-aware CRUD for templates, elements, fields, instances, folders,
and categories. It also exposes artifact versioning and sharing operations.

The examples in this section target the resource server. Request and response bodies follow the
[CEDAR model](../../yaml-spec/index.md) and can be constructed directly or with the Java and
TypeScript artifact libraries.

Use the pages in this section in the order that fits your integration:

- [Authentication](authentication.md) explains API keys and the headers used by every request.
- [Working with Artifacts](working-with-artifacts.md) covers the resource model, content
  negotiation, search, retrieval, validation, and creation.
- [ETag Concurrency](etag-concurrency.md) explains how to update and delete mutable resources
  without overwriting somebody else's changes.
- [Interactive API Documentation](interactive-api.md) links to the deployed Swagger interface for
  the complete route and parameter reference.
