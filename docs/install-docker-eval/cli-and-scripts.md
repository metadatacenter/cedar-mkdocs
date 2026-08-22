# CEDAR CLI and Repositories

## Install `cedarcli`

Clone the CLI into `CEDAR_HOME`, create its Python environment, and install its requirements:

```bash
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
cd "$CEDAR_HOME"
git clone https://github.com/metadatacenter/cedar-cli
cd cedar-cli
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Define the CLI alias after `CEDAR_HOME`:

```bash
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
```

## Clone the Docker Repositories

The Docker selector clones `cedar-development`, `cedar-docker-build`, and
`cedar-docker-deploy`:

```bash
cd "$CEDAR_HOME"
cedarcli git clone docker
```

The Docker repositories currently develop on `develop`. The documentation repository is not
required to run CEDAR.

Complete the installation-file copies and profile activation described on the
[Configuration](configuration.md) page before using the Docker commands below.

## Current Docker Commands

`cedarcli` has separate Docker-aware commands because the native status command probes host ports
that are intentionally private inside `cedarnet`.

```bash
cedarcli docker validate
cedarcli docker build <target>
cedarcli docker start <stack> -d
cedarcli docker status
cedarcli docker stop <stack>
```

Build targets are `infrastructure`, `microservices`, `frontends`, `admin`, `all`, or a single image
name. Start and stop stacks are:

| Stack | Containers | Required |
| --- | ---: | --- |
| `infrastructure` | 7 | Yes |
| `microservices` | 15 | Yes |
| `frontends` | 7 | Yes for all-Docker mode |
| `admin` | 4 | No |

Every start command accepts `--pull always`, `--pull missing`, or `--pull never`. The default is
`never`, which is correct for the current locally built snapshot images.

## Check the Environment

`cedarcli env list` prints the active `CEDAR_*` variables. There is no fixed expected count; the
profile evolves as services are added. Verify the important Docker values directly:

```bash
cedarcli env filter CEDAR_NET
cedarcli env filter CEDAR_NGINX_HOST
cedarcli env filter CEDAR_AUTH_HOST_TARGET
cedarcli docker validate
```

## Docker Status

Use this as the normal readiness gate:

```bash
cedarcli docker status
```

It reads the expected Compose services, inspects Docker runtime and health state, requires all 29
core containers by default, and exits nonzero if one is absent or unhealthy.

For the supported Docker-backend/native-frontend hybrid:

```bash
cedarcli docker status --no-frontends
```

To make the optional administration tools part of the gate:

```bash
cedarcli docker status --include-admin
```

Do not use `cedarcli status` to judge a Docker deployment. That command remains the native
process/host-port diagnostic and can report false failures for Docker-internal ports.
