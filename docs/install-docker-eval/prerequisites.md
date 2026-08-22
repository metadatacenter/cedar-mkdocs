# Prerequisites

## Host System

The complete Docker deployment was last verified on macOS with Apple Silicon. Use a current Docker
Desktop release with Docker Compose v2; Docker Engine 29.6.2 and Compose 5.3.1 are known-good.

Before starting, stop native CEDAR components and any other programs listening on CEDAR's ports.
The Docker backend and native backend cannot run at the same time. Native and containerized
frontends also cannot share their seven frontend ports.

## Docker Resources

Allocate at least:

- 12 GB of memory to Docker Desktop;
- half of the host's CPU cores; and
- 20 GB of free Docker disk space, plus room for application data and build layers.

The complete 35-image build and 29-container runtime can require more disk and memory than the old
20-container evaluation deployment. Increase these values if image builds are killed or
OpenSearch, Neo4j, or the Java services repeatedly become unhealthy.

## Required Software and Access

- Git
- Python 3 with `venv`
- Docker with the Compose v2 plugin
- OpenSSL, for generating current local certificates
- Network access to GitHub, Docker base-image registries, and the CEDAR Nexus repositories

JDK 17 and the Java source repositories are optional for the normal evaluation path, which builds
server images from the published Maven snapshots on Nexus. They are required only when rebuilding
all Java code locally and using `cedarcli docker build microservices --local`.

## Local Domain

The evaluation deployment uses `*.metadatacenter.orgx`; note the final `x`. The hostname helper
maps the required names to `127.0.0.1`, and Docker nginx publishes the application on ports 80 and
443.
