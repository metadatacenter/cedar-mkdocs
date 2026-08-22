# Docker Install Overview

This guide installs a local CEDAR evaluation environment with Docker. The required runtime contains
29 containers:

- seven infrastructure services, including the public nginx and Keycloak;
- fifteen Java microservices; and
- seven frontend applications, including Workspace and Template Designer.

Four administration-tool containers are available separately and are not required for normal use.

The complete application can run locally in Docker, but this is still a development and evaluation
deployment rather than a registry-backed production release. CEDAR Docker images are not currently
published for this snapshot, so they must be built locally before the first start. Java application
artifacts and immutable frontend npm packages are downloaded from Nexus during the normal image
build.

The known-good environment is macOS on Apple Silicon with Docker Engine 29.6.2 and Docker Compose
5.3.1. Other Docker Desktop platforms may work, but have not been revalidated against the complete
29-container estate.

The detailed operator procedure, hybrid frontend option, acceptance tests, and current limitations
are maintained in the
[CEDAR Docker runbook](https://github.com/metadatacenter/cedar-development/blob/develop/ops/DOCKER-RUNBOOK.md).

Follow every page in this section in order. A fresh installation should finish by reporting:

```text
29/29 required Docker services are ready.
```
