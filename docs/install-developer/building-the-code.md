# Build CEDAR from Source

A native installation runs the Java artifacts and frontend dependencies produced from your local
checkouts. Build once before the first start, then rebuild only the area you change.

## Build Java for the First Installation

From any directory, run:

```bash
cedarcli build java
```

This builds the Java repositories in dependency order, including the event listener needed by
Keycloak's setup on the infrastructure page. Unit and embedded integration tests run without a
live CEDAR stack. Continue with certificates, infrastructure, and backend initialization before
running the full frontend reactor on the final installation page.

To also compile and check the frontend sources before a backend is available, use
`cedarcli build all`. It runs Java and frontend verification, including the applicable consumer
demos, but does not activate a frontend runtime, restart applications, or run whole-stack smoke.

## Build Java or Frontends Separately

For backend-only work:

```bash
cedarcli build java
```

The Java build always follows the required parent, libraries, project, and clients order. You do
not need to remember or reproduce that sequence manually.

For frontend-only work:

```bash
cedarcli build frontends
```

The frontend reactor uses current local library and component source, including uncommitted edits,
with Java/Maven-like SNAPSHOT semantics. It builds and checks consumers, restarts local frontends,
verifies served bundles and runs whole-stack smoke. No registry publication, pin update, commit or
follow-up approval is required. Use `cedarcli test frontends` for builds and checks without deployment.
Missing or failed local producers stop the build instead of falling back to older packages.
The full reactor needs the configured, initialized backend and HTTPS router to be running.
Its deployment and smoke steps are part of completion, not a separate command to remember.

`cedarcli build split-frontends` targets Workspace and Template Designer and automatically includes
their local component producers. A native staging or production host explicitly uses the separate
pinned workflow, `cedarcli build split-frontends --server-payload`, to produce source-hashed
static `app` trees for nginx after the environment-specific Workspace and Designer URLs have been
configured.

All Java-reaching build selectors run their unit and embedded integration suites by default. Use
`--skip-tests` only for an explicit compile/install-only pass after the tests have already passed.

## Build a Smaller Target

The main Java layers can be built independently when the earlier layers have not changed:

```bash
cedarcli build parent
cedarcli build libraries
cedarcli build project
cedarcli build clients
```

Inside an individual repository, use:

```bash
cedarcli build this
```

After rebuilding a running microservice, restart it so the new JAR replaces the process that was
already serving requests:

```bash
cedarcli native restart resource
```

`cedarcli native status` marks a Java process as `STALE` when its JAR was rebuilt after that process
started. A green health value does not override that warning; restart the service and confirm its
binary is `current` before testing it.

## Recover from a Corrupt Maven Cache

Normal builds reuse Maven's local dependency cache. If that cache is demonstrably inconsistent,
remove only the CEDAR artifacts and rebuild:

```bash
cedarcli build maven clean cedar
cedarcli build java
```

`cedarcli build maven clean all` removes the complete Maven cache and should be reserved for a
deliberate full reset, because every dependency must then be downloaded again.

Build trains and publication are development workflows rather than installation steps. They are
explained in the [cedarcli Manual](../developer-guide/cedarcli/index.md).
