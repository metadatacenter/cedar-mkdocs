# Hybrid Development

Hybrid mode is intended for frontend development. Infrastructure and Java microservices run in
Docker, while the seven frontend development servers run from their source checkouts on the host.
This keeps the backend stable without giving up fast frontend rebuilds.

Browser traffic still enters through the Docker nginx, so the same HTTPS addresses, authentication,
and navigation between applications continue to work.

## Prepare Hybrid Mode

Complete the configuration and certificate steps in the
[Docker installation guide](../../install-docker/overview/), and install the frontend tools covered
by the [Developer Install](../../install-developer/frontends.md). Select `hybrid` rather than
`docker` when the guide reaches mode selection.

Then build the frontend dependencies:

```bash
cedarcli mode hybrid --profile develop
cedarcli build frontends
```

Hybrid also runs native applications, so its profile is required. `develop` is the normal hybrid
workstation choice; `server` is available for a server host. Running `cedarcli mode hybrid` without
`--profile develop|server` fails without recording a mode.

## Start the Deployment

Start the native frontends first, followed by the Docker-owned backend:

```bash
cedarcli native start frontends
cedarcli docker start all --pull missing --timeout 1800
cedarcli docker status
```

In hybrid mode, `docker start all` starts everything assigned to Docker, not the frontend
containers. Its final readiness check includes the public frontend routes, so the native servers
must already be running.

## Work on a Frontend

The frontend servers normally rebuild when source changes. Restart or inspect one through the
native command group when needed:

```bash
cedarcli native restart ui-workspace
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
