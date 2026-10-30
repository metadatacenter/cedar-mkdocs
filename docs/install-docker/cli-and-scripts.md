# Get the Installation Tools

`cedarcli` is the command-line tool used to set up and operate a CEDAR installation. It is a small
Python program that knows how CEDAR's repositories, scripts, and Docker Compose projects fit
together. In this guide, it retrieves the core Docker repositories, selects a verified image train,
starts and stops the application, and reports whether the complete deployment is healthy. It can
also build images when a developer deliberately chooses the source-build path.

It does not replace Docker, and it is not a service that remains running with CEDAR. It provides a
consistent interface to Docker Compose and the deployment scripts that would otherwise have to be
run by hand from several different directories. Native CEDAR development uses the same CLI for its own
workflows, which is why Docker-specific operations appear under `cedarcli docker`.

## Install `cedarcli`

First choose a home for this CEDAR installation. The rest of the guide refers to it as
`CEDAR_HOME`:

```bash
export CEDAR_HOME="$HOME/CEDAR_DOCKER"
mkdir -p "$CEDAR_HOME"
cd "$CEDAR_HOME"
```

Use the released tooling tagged `release-2.9.31` throughout this guide. Keep the CLI and the three
deployment repositories on that same tag so their commands, profiles, image definitions, and
Compose configuration come from one release.

Clone that CLI release and give it its own Python environment, using Python 3.10 or later:

```bash
git clone --branch release-2.9.31 https://github.com/metadatacenter/cedar-cli
cd cedar-cli
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Git reports a detached HEAD when checking out a release tag. That is expected for these pinned
installation tools. For work on CEDAR's development sources, follow the
[Developer Install](../install-developer/overview/index.md) instead.

The following alias makes `cedarcli` available in the current shell. The wrapper activates its
Python environment automatically, so you do not need to activate the virtual environment before
every command.

```bash
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
```

Add the `CEDAR_HOME` export and alias to your normal shell profile if you want them to be available
in new terminals.

## Get the Docker Deployment Repositories

Now let the CLI retrieve the core Docker repositories. These define how CEDAR images are built,
how the containers are assembled into a working application, how requests are routed, and which
environment settings the deployment shares:

```bash
cd "$CEDAR_HOME"
cedarcli git clone docker
git -C "$CEDAR_HOME/cedar-development" checkout --detach release-2.9.31
git -C "$CEDAR_HOME/cedar-docker-build" checkout --detach release-2.9.31
git -C "$CEDAR_HOME/cedar-docker-deploy" checkout --detach release-2.9.31
```

The tooling release and the application image set are separate selections. This guide runs
verified development image trains, as described in [Build and Run CEDAR](build-and-run.md#select-the-image-set).
Pinning the tooling to `release-2.9.31` does not select release-versioned application images.

When upgrading the installation tools, select the same new release tag in all four repositories
and reinstall the CLI's Python requirements in its virtual environment. A tag stays fixed;
`git pull` does not update these detached checkouts.

This does not clone the entire CEDAR source tree. A normal installation starts the verified images
published to Nexus. You only need the application source repositories if you want to rebuild Java
and then construct local images yourself.

At this point the tools are installed, but the application is not configured yet. Continue to
[Configure Your Installation](configuration.md) before running Docker commands.

For a compact reference covering the normal native and Docker commands, see the
[cedarcli cheat sheet](cedarcli-cheat-sheet.md).
