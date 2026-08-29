# Start the Native Backend

The Java microservices provide CEDAR's artifact, repository, user, terminology, submission, and
supporting APIs. They all use the infrastructure configured on the previous page and run from the
JARs produced by `cedarcli build java`.

## Connect CEDAR to BioPortal

CEDAR uses BioPortal to search ontologies and controlled terms. Create a BioPortal account, obtain
its API key, and set it in `$CEDAR_HOME/set-env-external.sh`:

```bash
export CEDAR_BIOPORTAL_REST_BASE="https://data.bioontology.org/"
export CEDAR_BIOPORTAL_API_KEY="your-api-key"
```

The terminology service reads these values when it starts. Restart that service after changing
them.

## Build and Start the Microservices

If the Java source has not been built yet, build it in dependency order:

```bash
cedarcli build java
```

Start the complete microservice tier and inspect the result:

```bash
cedarcli native start microservices
cedarcli native status
```

Every microservice should report a healthy application port and a `current` binary. A `STALE`
binary means the service is healthy but still running an older JAR and must be restarted. Frontends
will still appear stopped until the next page.

If a service does not become healthy, follow its log by process name. For example:

```bash
cedarcli native logs resource
```

## Initialize an Empty Installation

A new installation needs its initial users, folders, permissions, and search state. Run the system
reset only after the infrastructure and microservices are healthy:

```bash
source "$CEDAR_HOME/cedar-profile-native-develop.sh"
cedarat system-reset
```

Confirm the reset when prompted. This command deletes existing CEDAR content, so do not use it to
repair a development installation whose data you intend to keep.

For later backend work, individual services can be restarted without disturbing the rest of the
stack:

```bash
cedarcli native restart terminology
cedarcli native stop microservice terminology
cedarcli native start microservice terminology
```
