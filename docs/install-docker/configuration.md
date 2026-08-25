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

## Select the Docker Environment

A CEDAR profile translates the general application settings into addresses used by a particular
deployment. Source the Docker profile in the shell where you will build and run the
application:

```bash
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
source "$CEDAR_HOME/cedar-development/bin/templates/cedar-profile-docker.sh"
```

The profile supplies the fixed Docker network and container addresses. `cedarcli` selects
full-Docker or hybrid routing in the child processes it starts, so there are no routing
overrides to export in this shell. For a local installation, use BioPortal rather than
expecting a local terminology catalog:

```bash
export CEDAR_TERMINOLOGY_STORE_CATALOG=""
mkdir -p "$CEDAR_HOME/cedar-term"
```

The empty terminology-catalog setting tells CEDAR to use the BioPortal endpoint configured in
`set-env-external.sh`. Aggregate startup checks that a backend container can retrieve Keycloak's
signing configuration before it reports the deployment ready.

Keep this Docker environment in a dedicated terminal. Native and hybrid development use some of the
same variable names with different values, and combining profiles produces failures that are hard
to interpret.

## Choose Where Docker Images Come From

CEDAR image names begin with a registry and namespace prefix. The Docker profile defaults to the
`metadatacenter` namespace on Docker Hub. If your installation uses a private registry such as a
Nexus Docker repository, set its runtime prefix before sourcing the profile. Set the base prefix
only when the two non-runtime Java base images live in a separate repository:

```bash
export CEDAR_IMAGE_PREFIX=<registry-host>:<port>/<namespace>
export CEDAR_BASE_IMAGE_PREFIX=<registry-host>:<port>/<internal-namespace>
source "$CEDAR_HOME/cedar-development/bin/templates/cedar-profile-docker.sh"
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

## Check the Result

Ask the CLI to render the Docker configuration before creating anything:

```bash
cedarcli docker validate
```

Each Compose project should report `OK`. This check rejects an invalid image prefix and catches
missing variables or malformed Compose configuration early; it does not start Docker or modify
application data.
