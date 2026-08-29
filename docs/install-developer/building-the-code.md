# Build CEDAR from Source

A native installation runs the Java artifacts and frontend dependencies produced from your local
checkouts. Build once before the first start, then rebuild only the area you change.

## Build the Complete Source Tree

From any directory, run:

```bash
cedarcli build all
```

The CLI builds the Java repositories in dependency order and then prepares the frontend
repositories. This is the simplest first build and the safest choice after pulling a coordinated
change across several repositories.

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

The frontend build installs each repository's declared npm dependencies and runs the build defined
for that project.

Workspace and Template Designer also have a narrow split-deployment route. Install only those two
locked dependency trees with `cedarcli build split-frontends`. A native staging or production host
uses `cedarcli build split-frontends --server-payload` to produce source-hashed static `app` trees
for nginx after the environment-specific Workspace and Designer URLs have been configured.

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
cedarcli build this --wd "$PWD"
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
explained in the [cedarcli Manual](../developer-guide/cedarcli/).
