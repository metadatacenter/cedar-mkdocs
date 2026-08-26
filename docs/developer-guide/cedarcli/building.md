# Building CEDAR

A build turns checked-out source into artifacts on the current machine. It does not publish those
artifacts, start CEDAR, or create Docker images. Keeping those actions separate lets you prove a
change locally before it affects another developer or deployment.

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

## Build the Frontends

Build the registered frontend projects with:

```bash
cedarcli build frontends
```

cedarcli uses the appropriate build for each frontend, even though the projects do not all share
the same JavaScript framework or packaging process. During normal frontend development, the running
development servers then rebuild source changes as you work.

## Build Everything

Use the broadest build when a change crosses Java and frontend boundaries or when you want a final
preflight of the complete checkout:

```bash
cedarcli build all
```

For the normal edit-build-run cycle, prefer the narrowest target that includes the changed
dependency. A complete build is more reassuring, but it should not replace understanding what the
change actually affects.

## Preview a Broad Build

Before running a large build, inspect its planned scope without executing the underlying commands:

```bash
cedarcli build all --dry-run
```

The preview is particularly useful after the repository inventory or a project's build process has
changed. The generated plan says `Maven clean install` when tests will run and
`Maven clean install skip tests` when `--skip-tests` was selected. A successful preview only
confirms the selected work; the real build must still pass.
