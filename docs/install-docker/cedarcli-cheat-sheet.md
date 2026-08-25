# CEDAR CLI Cheat Sheet

`cedarcli` uses the environment selected in the current shell. Source the Docker profile before
running Docker commands:

```bash
export CEDAR_HOME=$HOME/CEDAR
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
source $CEDAR_HOME/cedar-development/bin/templates/cedar-profile-docker.sh
```

## Normal Docker Workflow

```bash
cedarcli docker validate
cedarcli docker one-time-setup
cedarcli docker start all --mode full --pull missing --timeout 1800
cedarcli docker status
cedarcli docker stop all
```

`one-time-setup` recreates the private Docker network, so run it only while the stack is stopped.
Ordinary stop and start operations preserve the named volumes that hold CEDAR data.

## Start or Stop One Target

Use a target when you need to operate on less than the complete deployment:

```bash
cedarcli docker start infra
cedarcli docker start keycloak
cedarcli docker start frontend workspace
cedarcli docker stop microservice resource
```

`kk` is the short spelling of `keycloak`. `frontend all` and `microservice all` are accepted, but
the clearer group spellings are `frontends` and `microservices`.

## Deployment Modes

| Mode | Runtime selected by the CLI |
| --- | --- |
| `full` | All 29 core containers, including the seven frontend applications |
| `hybrid` | The 22-container Docker backend, with Docker nginx routing to seven native frontend servers |

## Image Selection and Pulling

An ordinary start selects the latest completed and verified Docker train. The options change that
selection or control how it reaches this machine:

- `--pull missing` downloads only absent images. This is the normal first-start choice.
- `--pull always` checks the registry even when a local image is present.
- `--pull never` requires every selected image to exist locally.
- `--train <TRAIN>` selects a particular older, completed train.
- `--local` selects locally built development tags rather than a published train.

The timeout covers the complete start, including image downloads. A cold pull is several gigabytes,
so the example gives it 30 minutes. Later starts normally finish much sooner.

## Build Images from Checked-out Source

Most installations do not need to build images. Developers can build the complete local image set
from checked-out source:

```bash
cedarcli build java
cedarcli docker build infra --local
cedarcli docker build microservices --local
cedarcli docker build frontends --local
cedarcli docker start all --mode full --local --pull never
```

Docker build targets are `infra`, `microservices`, `frontends`, `admin`, `all`, or one
image name. `all` builds every image, including the four optional administration images.
`--no-deps` skips required CEDAR base images and should be used only when the exact bases are
already present.

## Immutable Development Trains

CEDAR maintainers publish one internally consistent Maven and Docker set with:

```bash
cedarcli publish train
cedarcli publish train --resume <TRAIN>
```

The first command allocates an identifier such as `<NEXT>-dev.YYYYMMDD.HHMM`; operators do not
choose it. Resume uses the source manifest already recorded for that train. Create a new train when
newer source commits must be included.

## Diagnose a Docker Service

```bash
cedarcli docker status --mode full
cd $CEDAR_HOME/cedar-docker-deploy/cedar-microservices
docker compose ps
docker compose logs --tail 200 server-resource
```

If the CLI says the Docker profile is not loaded, source
`cedar-development/bin/templates/cedar-profile-docker.sh` in that shell.

## Cleanup Commands

```bash
cedarcli docker remove containers
cedarcli docker remove images
cedarcli docker remove network
cedarcli docker remove volumes
cedarcli docker remove all
```

Containers, images, and the network are recreatable. `remove volumes` deletes databases,
certificates, logs, and other persistent state. `remove all` deletes the complete local Docker
installation, including those volumes.

Use `cedarcli <command> --help` at every level for the authoritative options.
