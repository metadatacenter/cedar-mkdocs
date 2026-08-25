# Configure Your Installation

The repositories contain safe example settings, not the configuration for your particular copy of
CEDAR. Keep installation-specific values at the top of `CEDAR_HOME`, outside the Git checkouts.
That keeps passwords and API keys out of version control and allows the repositories to be updated
without overwriting your choices.

## Create Local Configuration Files

Start from the supplied templates:

```bash
cd "$CEDAR_HOME"
cp cedar-development/bin/templates/set-env-external.sh ./set-env-external.sh
cp cedar-development/bin/templates/set-env-internal.sh ./set-env-internal.sh
```

The internal file holds credentials used among the local CEDAR services. The external file holds
credentials for services outside CEDAR, most notably BioPortal.
Edit the copies in `CEDAR_HOME`; do not edit the templates in `cedar-development`.

## Connect CEDAR to BioPortal

Template authors use CEDAR to find ontology terms while designing fields and entering metadata.
Those searches go through CEDAR's terminology service to BioPortal. The public BioPortal endpoint
is already the default, but it requires an API key.

Obtain a key by following the
[BioPortal account help](https://bioportal.bioontology.org/help#Getting_an_API_key), then replace
the placeholder `CEDAR_BIOPORTAL_API_KEY` in `$CEDAR_HOME/set-env-external.sh`. The other supplied
credentials are deliberately simple local defaults. They are suitable only for an isolated
local installation.

## Make cedarcli Available

The CEDAR command-line interface, `cedarcli`, builds, starts, stops, and checks the installation.
Make it available in the shell where you will operate CEDAR:

```bash
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
```

For a local installation, use BioPortal rather than expecting a local terminology catalog:

```bash
export CEDAR_TERMINOLOGY_STORE_CATALOG=""
mkdir -p "$CEDAR_HOME/cedar-term"
```

The empty terminology-catalog setting tells CEDAR to use the BioPortal endpoint configured in
`set-env-external.sh`. Aggregate startup checks that a backend container can retrieve Keycloak's
signing configuration before it reports the deployment ready.

## Choose Where Docker Images Come From

CEDAR image names begin with a registry and namespace prefix. The Docker configuration defaults to
the `metadatacenter` namespace on Docker Hub. If your installation uses a private registry such as
a Nexus Docker repository, set its runtime prefix before selecting the deployment mode. Set the
base prefix only when the two non-runtime Java base images live in a separate repository:

```bash
export CEDAR_IMAGE_PREFIX=<registry-host>:<port>/<namespace>
export CEDAR_BASE_IMAGE_PREFIX=<registry-host>:<port>/<internal-namespace>
```

This is Docker image syntax, not a web address: do not include `https://`, an image tag, or a
trailing slash. Log in with `docker login <registry-host>:<port>` if the registry is private. The
runtime prefix controls the images Compose pulls and starts. The base prefix controls
`cedar-java`, `cedar-microservice`, and the `FROM` references used to build the Java services. CLI
image cleanup covers both, so keep both unchanged throughout a build and deployment.

CEDAR's Nexus deployment uses HTTPS path-based routing:

```bash
export CEDAR_IMAGE_PREFIX=nexus.bmir.stanford.edu/docker-cedar
export CEDAR_BASE_IMAGE_PREFIX=nexus.bmir.stanford.edu/docker-cedar-internal
```

## Select Docker Mode

Choose the topology once before running Docker commands:

```bash
cedarcli mode docker
```

This command starts nothing. It loads and validates the Docker configuration, checks that every
Compose project can be rendered, and records the selection in `$CEDAR_HOME/.cedar/mode.json`.
Later `cedarcli docker ...` commands work from a bare shell because cedarcli loads the recorded
profile itself. A second mode selection is rejected. To switch after stopping the current
deployment, run `cedarcli mode --clear` and then select the replacement mode.

The CLI verifies the runtime during this transition. Docker and hybrid selection reject native
backend or infrastructure listeners that would compete for the same host ports. Hybrid permits the
seven native frontend servers but rejects a leftover Docker frontend project. Clearing native mode
requires its applications and infrastructure to be stopped; clearing hybrid requires both its
native frontends and Docker projects to be stopped; clearing Docker requires its Docker projects to
be stopped. Stop commands on an allowed surface remain usable if saved state and the runtime
disagree, so the mismatch can be repaired before the mode is cleared. Stop the optional admin
project separately with `cedarcli docker stop admin` when it is running.

Keep Docker running until `cedarcli docker stop all` completes. If Docker was deliberately shut down
first, the CLI cannot confirm teardown. `cedarcli mode --clear --force` discards the inactive Docker
deployment record so another mode can be selected. It does not stop containers and cannot bypass
running CEDAR Compose projects.

The other choices are `native`, for the complete host-based stack, and `hybrid`, for native
frontend development servers with the Docker backend. Docker commands are rejected in native
mode, native commands are rejected in Docker mode, and hybrid mode permits only native frontend
operations alongside Docker backend operations. Hybrid also permits stopping stale Docker
frontends, although starting Docker frontends remains prohibited.

## Check the Result

Ask the CLI to render the Docker configuration before creating anything:

```bash
cedarcli docker validate
```

Each Compose project should report `OK`. This check rejects an invalid image prefix and catches
missing variables or malformed Compose configuration early; it does not start Docker or modify
application data.
