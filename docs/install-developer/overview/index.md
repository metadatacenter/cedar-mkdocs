# Developer Install

A developer installation runs CEDAR from source on your Mac. Choose it when you want to change a
backend service or frontend application, rebuild it locally, and see the result in a complete CEDAR
system.

If you want to run CEDAR without changing its source, use the [Docker Install](../../install-docker/overview/index.md)
instead. Docker starts published application images and requires much less host configuration.

For a new Mac, read the [native infrastructure requirements](../infrastructure-services.md#check-the-locked-service-versions)
before choosing this path. The current Homebrew catalog cannot recreate all of CEDAR's locked
server versions. This guide's infrastructure steps require those retained versions; Docker uses
the already-packaged versions, and [hybrid development](../../developer-guide/cedarcli/hybrid.md)
keeps frontend development native over that Docker backend.

## How the Installation Works

CEDAR combines browser applications, APIs, authentication, routing, and data services. A native
installation runs these components as host processes while preserving the local names and secure
URLs used by the complete application.

`cedarcli` provides one entry point for this work. It retrieves the source repositories, builds the
code in dependency order, selects the deployment mode, starts and stops CEDAR, and reports what is
running. It is a command-line tool, not a service that remains active beside the application.

This guide first prepares the host, then configures the local CEDAR environment, and finally builds
and starts the application. Follow the pages in order for a first installation.

## Install `cedarcli`

Choose a home for the source tree. The rest of this guide refers to it as `CEDAR_HOME`:

```bash
export CEDAR_HOME="$HOME/CEDAR"
mkdir -p "$CEDAR_HOME"
cd "$CEDAR_HOME"
```

Install Git and **Python 3.10 or later** before running the following commands. On a Mac with
Homebrew, `brew install git python@3.12` provides both; if the system `python3` is older, use
`python3.12` in the environment-creation command.

This guide follows CEDAR's unreleased development sources. Use `develop` for the CLI so it stays
aligned with the application repositories selected below. `main` carries released code; the
[Docker installation guide](../../install-docker/cli-and-scripts.md) pins its tooling to a specific
release tag for reproducibility.

Clone the CLI, select `develop`, and give it its own Python environment:

```bash
git clone https://github.com/metadatacenter/cedar-cli
cd cedar-cli
git checkout develop
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

The following alias makes `cedarcli` available in the current shell. Its wrapper activates the
Python environment automatically, so you do not need to activate it before every command.

```bash
alias cedarcli='source "$CEDAR_HOME/cedar-cli/cli.sh"'
```

Add the `CEDAR_HOME` export and the alias to your normal shell profile so that they are available in
new terminals.

## Get the CEDAR Source

Use `cedarcli` to retrieve the missing repositories. This preserves the CLI checkout you just
created instead of attempting to clone it a second time:

```bash
cd "$CEDAR_HOME"
cedarcli git clone-missing
```

`clone-missing` selects `main` where available. For this fresh development tree, switch the
application repositories that have a `develop` branch to it; leave MkDocs on `main`. The CLI's
estate-wide checkout command has no per-repository branch exception, so use Git for this step:

```bash
for repo in "$CEDAR_HOME"/cedar-*; do
  [ -d "$repo/.git" ] || continue
  if [ "$repo" = "$CEDAR_HOME/cedar-mkdocs" ]; then
    git -C "$repo" checkout main || break
  elif git -C "$repo" show-ref --verify --quiet refs/remotes/origin/develop; then
    git -C "$repo" checkout develop || break
  fi
done
cedarcli check repos
```

The final command confirms that the expected repositories are present. It does not build or start
CEDAR.

## Continue the Installation

Continue with [Prepare the Development Mac](../prerequisites.md). The next page
installs the host toolchain, and the Configuration page creates the local profile and selects native
mode. Mode selection is a safety boundary; it does not start CEDAR.

The remaining pages generate certificates, configure the native infrastructure, and bring up the
backend and frontends. Once that one-time setup is complete, a normal rebuild and start looks like
this:

```bash
cedarcli build java
cedarcli native start backends
cedarcli native restart microservices
cedarcli build frontends
cedarcli native status
```

The restart replaces any microservices already serving older JARs. The frontend reactor deploys
the frontends and runs smoke against that backend. To start an unchanged installation later,
`cedarcli native start all` is sufficient.

The [cedarcli Manual](../../developer-guide/cedarcli/index.md) explains the build workflow, deployment
modes, selective starts and stops, and the supporting commands used during development.
