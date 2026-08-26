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

`cedarcli native status` marks a Java process as stale when its JAR was rebuilt after that process
started.

## Recover from a Corrupt Maven Cache

Normal builds reuse Maven's local dependency cache. If that cache is demonstrably inconsistent,
remove only the CEDAR artifacts and rebuild:

```bash
cedarcli maven clean cedar
cedarcli build java
```

`cedarcli maven clean all` removes the complete Maven cache and should be reserved for a deliberate
full reset, because every dependency must then be downloaded again.

Build trains and publication are development workflows rather than installation steps. They are
explained in the [cedarcli Manual](../developer-guide/cedarcli/).
