# Get the Installation Tools

CEDAR spans several repositories and Docker Compose projects. You could manage each one directly,
but that would make the installation depend on remembering where every file lives and which part
must start first. The `cedarcli` helper provides one consistent entry point for setup, image builds,
startup, shutdown, and health checks.

## Install `cedarcli`

First choose a home for this CEDAR installation. The rest of the guide refers to it as
`CEDAR_HOME`:

```bash
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
mkdir -p "$CEDAR_HOME"
cd "$CEDAR_HOME"
```

Clone the CLI and give it its own Python environment:

```bash
git clone https://github.com/metadatacenter/cedar-cli
cd cedar-cli
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

The following alias makes `cedarcli` available in the current shell. The wrapper activates its
Python environment automatically, so you do not need to activate the virtual environment before
every command.

```bash
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
```

Add the `CEDAR_HOME` export and alias to your normal shell profile if you want them to be available
in new terminals.

## Get the Docker Support Repositories

Now let the CLI retrieve the repositories that describe how CEDAR images are constructed, how the
containers fit together, and which environment settings they share:

```bash
cd "$CEDAR_HOME"
cedarcli git clone docker
```

This does not clone the entire CEDAR source tree. A normal evaluation build consumes packaged Java
and frontend artifacts from Nexus, so the Docker support repositories are enough. You can add the
application source repositories later if you want to build the backend itself.

At this point the tools are installed, but the application is not configured yet. Continue to
[Configure Your Installation](configuration.md) before running Docker commands.
