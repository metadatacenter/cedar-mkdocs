# Build and Run CEDAR

CEDAR runs as a collection of cooperating containers rather than as one large container. The
containers are organized into stacks: infrastructure provides databases, authentication, search,
and public routing; microservices provide the CEDAR APIs and background processing; and frontends
provide the browser applications. A fourth stack contains optional administration tools.

An image is the packaged software used to create a container. Building prepares those images;
starting creates and runs the containers from them. For a complete CEDAR installation, build the
three core stacks: infrastructure, microservices, and frontends. The CLI starts them in dependency
order. Normal stop and restart operations reuse the images and preserve the data stored in Docker
volumes.

## Runtime Inventory

| Stack | Containers | Purpose |
| --- | ---: | --- |
| Infrastructure | 7 | nginx, Keycloak, MySQL, MongoDB, Redis, Neo4j, and OpenSearch |
| Microservices | 15 | CEDAR REST and background services |
| Frontends | 7 | Main editor, Workspace, Designer, OpenView, Content, Monitoring, and Bridging |
| Admin tools | 4 | Optional Kibana, phpMyAdmin, Redis Commander, and CEDAR admin tool |

The first three stacks form the complete 29-container deployment. Admin tools are optional.

The infrastructure nginx remains the single public TLS endpoint and routes browser requests to the
frontend containers.

## Build the Images

CEDAR publishes development Java artifacts as immutable build trains. A train gives every Java
artifact one unique version and records the exact source commits used to create it. The Docker CLI
automatically selects the most recently completed train; it never guesses from whichever Maven
snapshot happened to be uploaded last.

Build the images for CEDAR's three core stacks:

```bash
cedarcli docker build infrastructure
cedarcli docker build microservices
cedarcli docker build frontends
```

The argument after `build` is a build target. `infrastructure` builds the databases, identity
provider, public nginx, and other platform services. `microservices` builds the CEDAR Java services,
and `frontends` builds the browser applications. `admin` builds the optional diagnostic and
administration tools. Use `all` to build every group, or use an individual image name when you need
to rebuild only one container image.

The microservice build downloads the selected train's Java application artifacts from Nexus. The frontend
build downloads immutable, commit-specific npm packages from Nexus; npm packages do not use a
moving Maven-style snapshot version.

To reproduce an older completed train, select it explicitly for both build and start:

```bash
cedarcli docker build microservices --train <TRAIN>
cedarcli docker start all --mode full --train <TRAIN> --pull never
```

To rebuild Java from checked-out source instead, first clone and compile the complete Java estate on
JDK 17, then stage each local JAR into its image:

```bash
cedarcli build java
cedarcli docker build infrastructure --local
cedarcli docker build microservices --local
cedarcli docker build frontends --local
```

Start locally built images with the matching local selector:

```bash
cedarcli docker start all --mode backend --local --pull never
```

The local path is useful while changing Java source but is not required for a normal Docker
installation. It uses the development image tag rather than claiming to reproduce a published
train.

Every locally built image is tagged under the `CEDAR_IMAGE_PREFIX` selected during configuration.
If you change that value, the deployment selects a different image set; rebuild under the new
prefix or pull a complete published set from that registry.

## Start the Deployment

Select the complete Docker topology. The CLI checks configuration, networking, certificates, and
ports; starts each stack in dependency order; waits for health; and checks authentication and the
seven public frontend routes:

```bash
cedarcli docker start all --mode full --pull never
```

`--pull never` uses images already present on the machine and fails if one is absent. Use
`--pull missing` to download only absent images or `--pull always` to refresh all images from the
configured registry. A cold start can take several minutes; change the ten-minute limit with
`--timeout SECONDS`.

Two other modes support development and automated REST work:

| Mode | What the CLI starts and checks |
| --- | --- |
| `full` | All 29 core containers and all seven public frontend routes |
| `hybrid` | The 22-container backend plus seven native frontend routes through Docker nginx |
| `backend` | The 22-container backend, with no frontend-route requirement |

Check that all CEDAR containers are running and healthy:

```bash
cedarcli docker status
```

The command remembers the successful mode, so status applies the same expectations. The full-mode
result includes 29 healthy containers and passing authentication and frontend-route checks.

If a service is missing or unhealthy, note its `Stack` and `Service` in the status table. Each stack
has its own Docker Compose directory:

| Stack | Directory |
| --- | --- |
| `infrastructure` | `$CEDAR_HOME/cedar-docker-deploy/cedar-infrastructure` |
| `microservices` | `$CEDAR_HOME/cedar-docker-deploy/cedar-microservices` |
| `frontends` | `$CEDAR_HOME/cedar-docker-deploy/cedar-frontend` |

Change to that directory, then inspect the containers and the failing service's logs:

```bash
docker compose ps
docker compose logs --tail 200 <service>
```

## Optional Administration Tools

Build and start the admin stack only when needed:

```bash
cedarcli docker build admin
cedarcli docker start all --mode full --include-admin
```

## Stop and Restart

Stop all Docker stacks selected by the aggregate deployment. The CLI uses reverse dependency order:

```bash
cedarcli docker stop all
```

Ordinary stop operations retain Docker named volumes and therefore retain application data.

## Reset Your Docker Installation

You do not need to remove Docker resources when you stop or restart CEDAR. Use these commands only
when you want to rebuild from a clean state, recover from damaged local state, reclaim disk space,
or remove the installation.

Containers, images, and the Docker network can be recreated. Volumes are different: they hold your
databases, certificates, and other persistent state. Choose the narrowest reset that meets your
need, inspect its target first, and back up any data you want to keep.

### Remove and Recreate the Containers

Use this when you want fresh containers while keeping downloaded images and persistent data. The
next start recreates the containers.

```bash
docker ps -a
cedarcli docker remove containers
```

### Delete Persistent Data and Certificates

Remove the volumes only when you intend to discard the installation's stored state.

```bash
docker volume ls
cedarcli docker remove volumes
```

Removing volumes deletes CEDAR databases, state, certificates, and logs. It cannot be undone by
restarting the containers.

### Remove Locally Stored Images

Use this to reclaim image storage or force the images to be built or downloaded again. Persistent
data remains in its volumes.

```bash
docker images
cedarcli docker remove images
```

### Remove the CEDAR Docker Network

Remove the network when uninstalling CEDAR or recreating its Docker networking.

```bash
docker network ls
cedarcli docker remove network
```

The network cannot be removed while a container is attached to it.

### Reset the Entire Docker Installation

```bash
cedarcli docker remove all
```

This force-removes matching containers and images, deletes all named CEDAR volumes, and removes
`cedarnet`. Use it only for an intentional full reset.
