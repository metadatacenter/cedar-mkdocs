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
credentials for services outside CEDAR, most notably BioPortal or another OntoPortal instance.
Edit the copies in `CEDAR_HOME`; do not edit the templates in `cedar-development`.

For a useful terminology service, replace the placeholder `CEDAR_BIOPORTAL_API_KEY` in
`set-env-external.sh` with your own key. The other supplied credentials are deliberately simple
evaluation defaults. They are suitable only for an isolated local installation.

## Select the Docker Environment

A CEDAR profile translates the general application settings into addresses used by a particular
deployment. Source the Docker evaluation profile in the shell where you will build and run the
application:

```bash
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
source "$CEDAR_HOME/cedar-development/bin/templates/cedar-profile-docker-eval.sh"
```

The profile is also used by a hybrid developer setup, so two choices need to be made explicitly for
this all-Docker installation. Route authentication through the nginx container, and use the remote
terminology service rather than expecting a local terminology catalog:

```bash
export CEDAR_AUTH_HOST_TARGET="$CEDAR_NGINX_HOST"
export CEDAR_TERMINOLOGY_STORE_CATALOG=""
mkdir -p "$CEDAR_HOME/cedar-term"
```

The authentication setting matters even when every container looks healthy: it is what allows a
backend service to retrieve Keycloak's signing keys when you make an authenticated request. The
empty terminology-catalog setting tells CEDAR to use the BioPortal or OntoPortal endpoint configured
in `set-env-external.sh`.

Keep this Docker environment in a dedicated terminal. Native and hybrid development use some of the
same variable names with different values, and combining profiles produces failures that are hard
to interpret.

## Check the Result

Ask the CLI to render the Docker configuration before creating anything:

```bash
cedarcli docker validate
```

Each Compose project should report `OK`. This check catches missing variables and malformed
configuration early; it does not start Docker or modify application data.
