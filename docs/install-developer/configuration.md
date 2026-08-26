# Configure the Native Installation

The native profile gives every CEDAR component the same local domain, ports, credentials, and
working directories. `cedarcli` loads this profile automatically for native commands, so the full
environment does not need to be exported in every shell.

## Create the Local Configuration

Copy the editable templates into `CEDAR_HOME`:

```bash
cd "$CEDAR_HOME"
cp cedar-development/bin/templates/set-env-internal.sh .
cp cedar-development/bin/templates/set-env-external.sh .
cp cedar-development/bin/templates/cedar-profile-native-develop.sh .
```

The files have separate purposes:

| File | Purpose |
| --- | --- |
| `set-env-internal.sh` | Local domain, service credentials, certificate identity, and native data connections |
| `set-env-external.sh` | Credentials for BioPortal and other services outside the local installation |
| `cedar-profile-native-develop.sh` | The native topology and its CEDAR development defaults |

The supplied local credentials are intended only for a development machine. If you change them,
use the same values when creating the MongoDB, MySQL, Neo4j, and Keycloak accounts later in this
guide.

The default local domain is `metadatacenter.orgx`. Keeping it avoids having to rewrite the supplied
Keycloak and nginx configuration. The `x` is deliberate: it prevents a local installation from
colliding with the public CEDAR domain.

## Select Native Mode

Tell `cedarcli` which deployment topology this checkout will operate:

```bash
cedarcli mode native
```

This validates the native profile and records the choice under `$CEDAR_HOME/.cedar`. It does not
start anything. Native commands are allowed after this point, while Docker commands are rejected so
that the two deployments cannot accidentally claim the same ports.

Check the recorded mode and effective configuration:

```bash
cedarcli mode
cedarcli env status
cedarcli env filter CEDAR_HOST
```

To change deployment topology later, stop the active services and clear the current selection:

```bash
cedarcli native stop all
cedarcli mode --clear
```

## Register the Local Names

Browser requests enter through names such as `cedar.metadatacenter.orgx` and
`workspace.metadatacenter.orgx`. Add the complete set to `/etc/hosts`:

```bash
cedarcli dev add-hosts
```

The command shows which names are missing and requests administrator permission only when it needs
to append them. Running it again should report that every CEDAR name is already known.

## Create the Working Directories

CEDAR writes logs, generated certificates, exports, caches, and process state below `CEDAR_HOME`.
Create those directories with:

```bash
cedarcli dev create-directories
```

At this point the CLI and local profile are ready. The remaining work installs the host services
that the profile describes.
