# Configuration

## Create `CEDAR_HOME`

Choose a path without spaces or shell metacharacters. This guide uses:

```bash
mkdir -p "$HOME/CEDAR_DOCKER"
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
```

Keep `CEDAR_HOME` exported before sourcing any CEDAR profile. Sourcing the Docker profile with an
empty value makes bind mounts and configuration paths resolve incorrectly.

## Installation Configuration Files

After cloning `cedar-development` on the previous page, copy the two configuration templates to
the root of `CEDAR_HOME`:

```bash
cd "$CEDAR_HOME"
cp cedar-development/bin/templates/set-env-external.sh ./set-env-external.sh
cp cedar-development/bin/templates/set-env-internal.sh ./set-env-internal.sh
```

Edit these installation copies, not the checked-in templates. At minimum, set a real
`CEDAR_BIOPORTAL_API_KEY` in `set-env-external.sh`. The defaults are evaluation credentials and
must never be reused for an exposed or production installation.

## Activate the Full-Docker Profile

Use a dedicated shell for Docker commands:

```bash
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
source "$CEDAR_HOME/cedar-development/bin/templates/cedar-profile-docker-eval.sh"

# Required when nginx itself runs in Docker.
export CEDAR_AUTH_HOST_TARGET="$CEDAR_NGINX_HOST"

# Use remote BioPortal/OntoPortal rather than a local terminology catalog.
export CEDAR_TERMINOLOGY_STORE_CATALOG=""
mkdir -p "$CEDAR_HOME/cedar-term"
```

The authentication override is essential. Without it, containers can be healthy while authenticated
API requests fail because a microservice cannot retrieve Keycloak signing keys through Docker nginx.

The checked-in profile can also support a Docker-backend/native-frontend hybrid; that mode uses
different frontend upstreams. Do not mix full-Docker and hybrid values in the same shell. See the
[Docker runbook](https://github.com/metadatacenter/cedar-development/blob/develop/ops/DOCKER-RUNBOOK.md)
for the hybrid procedure.

## Validate the Environment

After the repositories and Python dependencies are installed, run:

```bash
cedarcli docker validate
```

All four Compose projects—`cedar-infrastructure`, `cedar-microservices`, `cedar-frontend`, and
`cedar-admin`—must report `OK`. The admin project must parse cleanly even though starting its
containers is optional.
