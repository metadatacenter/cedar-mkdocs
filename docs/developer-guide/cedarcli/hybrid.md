# Hybrid Development

Hybrid mode is intended for frontend development. Infrastructure and Java microservices run in
Docker, while the seven frontend development servers run from their source checkouts on the host.
This keeps the backend stable without giving up fast frontend rebuilds.

Browser traffic still enters through the Docker nginx, so the same HTTPS addresses, authentication,
and navigation between applications continue to work.

## Prepare Hybrid Mode

Complete the configuration and certificate steps in the
[Docker installation guide](../../install-docker/overview/index.md), retrieve the full source tree
as described in the [Developer Install](../../install-developer/overview/index.md#get-the-cedar-source),
and install its [frontend tools](../../install-developer/prerequisites.md). Select `hybrid` rather than
`docker` when the guide reaches mode selection.

Select the mode:

```bash
cedarcli mode hybrid --profile develop
```

Hybrid also runs native applications, so its profile is required. `develop` is the normal hybrid
workstation choice; `server` is available for a server host. Running `cedarcli mode hybrid` without
`--profile develop|server` fails without recording a mode.

## Start the Deployment

For the first source build, start the Docker-owned infrastructure and microservices separately:

```bash
cedarcli docker start infra --detach --pull missing
cedarcli docker start microservices --detach --pull missing
cedarcli docker status
```

Wait until the infrastructure and microservice rows are healthy. Public frontend checks cannot
pass yet because no native frontend is running. With the backend ready, the full reactor can
build, deploy and smoke-test the current local frontend sources:

```bash
cedarcli build frontends
cedarcli docker start all --pull missing --timeout 1800
cedarcli docker status
```

In hybrid mode, `docker start all` starts everything assigned to Docker, not the frontend
containers. Its final readiness check includes the public frontend routes, so the native servers
must already be running. The final aggregate start verifies and records the complete deployment.
On later starts with an unchanged, already-built frontend tree, use `cedarcli native start frontends`
followed by `cedarcli docker start all --pull missing --timeout 1800`.

## Work on a Frontend

Angular CLI development servers rebuild application source changes automatically. Workspace's
native host builds when started, so restart it after source changes. For shared component or
dependency changes, use `cedarcli build frontends` to build and verify the complete local graph.
Restart or inspect a host through the native command group:

```bash
cedarcli native restart frontend workspace
cedarcli native logs ui-workspace
```

The mode keeps ownership clear. Native backend starts are rejected because the backend belongs to
Docker, and Docker frontend starts are rejected because the frontends belong to the host.

## Stop Hybrid Mode

Stop both parts of the deployment:

```bash
cedarcli native stop frontends
cedarcli docker stop all
```

The Docker data remains available for the next start. Clear the mode only when you are ready to
select another topology.
