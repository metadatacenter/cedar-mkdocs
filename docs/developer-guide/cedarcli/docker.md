# Docker Development

Docker mode runs the complete CEDAR system in containers. It is the simplest way to reproduce a
known application state because the whole deployment can use one verified build train.

Follow the [Docker installation guide](../../install-docker/overview/) for configuration,
certificates, and first-time setup. This page covers the normal cedarcli workflow after that setup.

## Start CEDAR

Select Docker mode and confirm the configuration:

```bash
cedarcli mode docker
cedarcli env status
cedarcli docker validate
```

Start the latest verified train and wait for the complete application to become ready:

```bash
cedarcli docker start all --pull missing --timeout 1800
cedarcli docker status
```

`--pull missing` downloads images that are not already on the machine. Use `--pull always` when you
want Docker to check the registry again, or `--pull never` when the selected images must come only
from the local cache.

Select an older verified train when reproducing a specific deployment:

```bash
cedarcli docker start all --train <TRAIN_ID> --pull missing --timeout 1800
```

## Operate on One Part

The start and stop commands also accept smaller targets:

```bash
cedarcli docker start infra --detach
cedarcli docker start microservices --detach
cedarcli docker start microservice resource --detach
cedarcli docker start frontends --detach
cedarcli docker start frontend workspace --detach
cedarcli docker start keycloak --detach
```

Use these after the deployment has been prepared, when diagnosing or restarting one part. The
optional `admin` target starts the administration tools and is managed separately from the main
deployment.

## Build Docker Images

Starting CEDAR uses existing images; it does not build them. Developers changing Docker definitions
can build a complete group or one image:

```bash
cedarcli docker build infra
cedarcli docker build microservices
cedarcli docker build frontends
```

By default, these builds use the current completed artifact train. To construct images from locally
built Java artifacts, use the local path consistently:

```bash
cedarcli build java
cedarcli docker build infra --local
cedarcli docker build microservices --local
cedarcli docker build frontends --local
cedarcli docker start all --local --pull never
```

Use the published train path for reproducible deployments and the local path while developing
changes that have not been published.

## Stop or Reset CEDAR

An ordinary stop preserves application data:

```bash
cedarcli docker stop all
```

The `cedarcli docker remove` commands are for resetting or uninstalling the deployment. In
particular, removing volumes deletes databases, certificates, logs, and other persistent state. The
[Docker run page](../../install-docker/build-and-run.md) explains the reset choices and their
consequences.
