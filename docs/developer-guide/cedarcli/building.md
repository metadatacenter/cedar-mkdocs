# Building CEDAR

A build turns checked-out source into artifacts on the current machine. Development frontend
builds have Java/Maven-like SNAPSHOT semantics: current local components automatically flow into
their consumers, including uncommitted edits. No publication, manual pin update, commit, clean
checkout or follow-up approval is required. Releases, immutable trains and explicit server
payloads retain their separate version rules.

## Build the Java Code

After updating the repositories, build the complete Java estate with:

```bash
cedarcli build java
```

This is the safest choice after changing a shared library or pulling coordinated backend changes,
because cedarcli follows the required dependency order. Java test suites run by default and require
no live backend; a successful build therefore means the code compiled and its unit and embedded
integration tests passed.

For a fast compile/install loop after those tests have already passed, skip them explicitly:

```bash
cedarcli build java --skip-tests
```

The Java-reaching commands accept the paired `--tests` / `--skip-tests` option. Tests are enabled
when neither is supplied. Frontend-only commands do not expose this Java-specific option.

Use a narrower target when the earlier layers are already current:

```bash
cedarcli build parent
cedarcli build libraries
cedarcli build project
cedarcli build clients
```

For a change contained in the current repository, use:

```bash
cedarcli build this
```

That is usually the quickest backend development loop: build the repository you changed, then
restart the affected service in the selected deployment mode. It also runs that repository's tests
unless `--skip-tests` is supplied.

### Test Coverage

Every build that runs Java tests measures their coverage with JaCoCo. Each module that runs tests
writes an HTML report to `target/site/jacoco/index.html`. A module with Failsafe suites writes a
second report to `target/site/jacoco-it/`. When the build finishes, cedarcli says how many reports
it wrote.

A report counts only the classes its own module compiles, and credits them only with that module's
tests. When a server's suites exercise a shared library, that execution counts toward neither the
server's report nor the library's. cedarcli therefore also merges the execution data of every test
the build ran, and credits each module's classes with whichever test ran them. It prints that figure
beside the own-tests figure, and writes both, per module and per repository, to a JSON file under
`$CEDAR_HOME/.cedar/coverage/`.

## Build the Frontends

Build the registered frontend projects with:

```bash
cedarcli build frontends
```

The full reactor builds current local library and component sources in isolated copies, checks
their consumers, runs the applicable integration and visual suites and consumer demos, restarts
the local frontends, verifies the served component bytes, and runs whole-stack smoke. A request
for this command authorizes those steps. It does not publish packages or commit or push Git changes.

Each build starts its component selection from current source. A producer can reuse a passing
result only when all relevant inputs still match; a missing or failed producer stops the build.
Registry pins and earlier local artifacts cannot silently substitute for that producer. Dependency
rewrites and resolved locks stay in the isolated build and its evidence; tracked pins need not move.
Existing edits are valid inputs. The build guard detects changes made during the build, so keep
the inputs stable while it runs; there is no requirement to commit or stash them first.

For the same build and verification without deployment or whole-stack smoke, use:

```bash
cedarcli test frontends
```

Both commands reuse matching passing results by default. Add `--no-reuse` to run every repository's
checks again. The full deployment and smoke contract belongs to `cedarcli build frontends`.

A narrower compile route targets Workspace and Template Designer:

```bash
cedarcli build split-frontends
```

This command, `cedarcli build this` from a frontend repository, and ordinary
`cedarcli build server-frontends` automatically include and verify their transitive local package
producers. They do not perform the full reactor's deployment and smoke. There is no switch that
silently restores pinned dependencies for a development build.

For a native staging or production deployment, explicitly select the separate pinned server-payload
workflow. Supply the configured Workspace and Designer URLs and generate the static trees that
nginx serves directly:

```bash
cedarcli build split-frontends --server-payload
```

The payload build uses locked packages, refuses dirty source, records source and content hashes in each generated
`app/config/build-info.json`, and exits after producing the static trees. It does not start a
development server or require Docker. On a host that also serves the legacy Template Editor,
`cedar-template-editor`, `cedarcli build server-frontends --server-payload` generates all three
trees.

## Build Everything

Use the broadest build when a change crosses Java and frontend boundaries or when you want a final
preflight of the complete checkout:

```bash
cedarcli build all
```

For the normal edit-build-run cycle, prefer the narrowest target that includes the changed
dependency. A complete build is more reassuring, but it should not replace understanding what the
change actually affects.

## Build Concurrency

A build uses the machine's cores without being asked. For the Java code, cedarcli gives Maven one
reactor thread per detected CPU, at least one and at most sixteen, and Maven schedules modules by
their dependency graph. The four Java layers still build in order, one Maven reactor at a time.
Test classes still run serially inside each test JVM, and the resource server spreads its suite
over two test JVMs of its own.

On hosts with at least 16 cores, frontend builds default to three repository jobs and twelve
workers per repository. Smaller hosts use two jobs and half the cores per repository, at least one
and at most eight. A shared host worker pool bounds total concurrency across repositories.

Both can be set explicitly. The options go before the build target:

```bash
cedarcli build --jobs 4 java
cedarcli build --jobs 3 --workers 12 frontends
cedarcli build --jobs 1 --workers 1 all
```

`--jobs N` sets the Maven thread count and the number of concurrent frontend repositories
together, and `--jobs 1 --workers 1` is the serial path for diagnosing a failure. On a 16-core
workstation the full Java build takes about 166 seconds at the default of sixteen threads, against
305 at two threads and 680 serially. Each build records its command timings and exit codes under
`$CEDAR_HOME/.cedar/build-reports/`.

## Preview a Broad Build

Before running a large build, inspect its planned scope without executing the underlying commands:

```bash
cedarcli build all --dry-run
```

The preview is particularly useful after the repository inventory or a project's build process has
changed. The generated plan says `Maven clean install` when tests will run and
`Maven clean install skip tests` when `--skip-tests` was selected. A successful preview only
confirms the selected work; the real build must still pass.

## Keep Failed-Build Evidence

An isolated frontend build works in a temporary copy that is deleted when it finishes. When one
fails, cedarcli first copies the npm debug logs, the test and coverage reports, and the build's
command log into `$CEDAR_HOME/.cedar/build-reports/failures/`, and the build prints the bundle's
path. A bundle holds at most 250 MiB. Nothing removes the bundles automatically, so review them
from time to time:

```bash
cedarcli build diagnostics
cedarcli build diagnostics --apply
```

The command selects every bundle older than `--days`, 14 by default. Counting from the newest, it
also selects those that would take the kept bundles past `--max-mib`, 1024 by default. Without
`--apply` it only lists its selection. It never removes a directory it does not recognize as a
completed bundle, such as one an interrupted capture left behind. The same age limit applies to the
coverage records Java builds write to `$CEDAR_HOME/.cedar/coverage/`, which need no size limit,
because each takes a few kilobytes.
