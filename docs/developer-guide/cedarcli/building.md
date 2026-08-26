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
because cedarcli follows the required dependency order.

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
restart the affected service in the selected deployment mode.

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
changed. A successful preview only confirms the selected work; the real build and relevant tests
must still pass.
