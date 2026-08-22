# Build and Run CEDAR

CEDAR runs as a collection of cooperating containers rather than as one large container. The
containers are organized into stacks: infrastructure provides databases, authentication, search,
and public routing; microservices provide the CEDAR APIs and background processing; and frontends
provide the browser applications. A fourth stack contains optional administration tools.

An image is the packaged software used to create a container. Building prepares those images;
starting creates and runs the containers from them. For a complete CEDAR installation, build and
start the three required stacks in dependency order: infrastructure, microservices, then frontends.
Normal stop and restart operations reuse the images and preserve the data stored in Docker volumes.

## Runtime Inventory

| Stack | Containers | Purpose |
| --- | ---: | --- |
| Infrastructure | 7 | nginx, Keycloak, MySQL, MongoDB, Redis, Neo4j, and OpenSearch |
| Microservices | 15 | CEDAR REST and background services |
| Frontends | 7 | Main editor, Workspace, Designer, OpenView, Content, Monitoring, and Bridging |
| Admin tools | 4 | Optional Kibana, phpMyAdmin, Redis Commander, and CEDAR admin tool |

The first three stacks form the required 29-container deployment. Admin tools are optional. The
build inventory contains 35 images because the Java services also use two non-runtime base images.

Each frontend image has a private nginx that serves one immutable npm package. The infrastructure
nginx remains the single public TLS endpoint and routes browser requests to those seven containers.

## Build the Images

Starting a Compose stack does not build its images. Build all three required groups before the first
start:

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

The microservice build downloads the current `2.9.2-SNAPSHOT` application artifacts from Nexus. The
frontend build downloads exact immutable `2.9.2-dev.<timestamp>.g<commit>` npm versions from Nexus;
npm packages do not use a moving Maven-style snapshot version.

To rebuild Java from checked-out source instead, first clone and compile the complete Java estate on
JDK 17, then stage each local JAR into its image:

```bash
cedarcli build java
cedarcli docker build microservices --local
```

The local path is stronger verification but is not required for a normal evaluation installation.

## Start the Required Deployment

The argument after `start` or `stop` names a stack: a related group of containers managed together
by one Docker Compose project. The required stacks are `infrastructure`, `microservices`, and
`frontends`; `admin` is optional. Unlike a build target, a stack controls running containers rather
than constructing images.

Start the stacks in dependency order and in detached mode:

```bash
cedarcli docker start infrastructure -d
cedarcli docker start microservices -d
cedarcli docker start frontends -d
```

These commands default to `--pull never`, preventing Compose from replacing locally built snapshot
images or failing while looking for unpublished Docker Hub tags. A cold start can take several
minutes because infrastructure and microservice health dependencies are enforced by Compose.

There is not yet a single aggregate start-and-wait command. Check readiness separately:

```bash
cedarcli docker status
```

Expected result:

```text
29/29 required Docker services are ready.
```

If a service is missing or unhealthy, inspect its stack:

```bash
cd "$CEDAR_HOME/cedar-docker-deploy/cedar-microservices"
docker compose ps
docker compose logs --tail 200 <service>
```

Use the corresponding `cedar-infrastructure` or `cedar-frontend` directory for failures in those
stacks.

## Optional Administration Tools

Build and start the admin stack only when needed:

```bash
cedarcli docker build admin
cedarcli docker start admin -d
cedarcli docker status --include-admin
```

## Stop and Restart

Stop in reverse dependency order:

```bash
cedarcli docker stop frontends
cedarcli docker stop microservices
cedarcli docker stop infrastructure
```

Ordinary stop operations retain Docker named volumes and therefore retain application data.

## Destructive Reset Commands

The following commands remove local Docker state and are not part of an ordinary restart. Inspect
the target first and back up any required data.

### Containers

```bash
docker ps -a
cedarcli docker remove containers
```

### Volumes

```bash
docker volume ls
cedarcli docker remove volumes
```

Removing volumes deletes CEDAR databases, state, certificates, and logs. It cannot be undone by
restarting the containers.

### Images

```bash
docker images
cedarcli docker remove images
```

### Network

```bash
docker network ls
cedarcli docker remove network
```

The network cannot be removed while a container is attached to it.

### Everything

```bash
cedarcli docker remove all
```

This force-removes matching containers and images, deletes all named CEDAR volumes, and removes
`cedarnet`. Use it only for an intentional full reset.
