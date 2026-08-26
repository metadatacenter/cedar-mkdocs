# Maven and Java Dependencies

CEDAR's Java code has a dependency order. Shared build settings and libraries must be available
before the services and clients that use them. Maven keeps the locally built artifacts so that each
later stage can resolve the results of the earlier ones.

The practical order is:

1. parent settings;
2. shared libraries;
3. backend projects and services; and
4. clients.

You normally do not need to run those stages by hand. `cedarcli build java`, covered on the next
page, follows the complete order and stops if a required stage fails.

## Local Development Versions

Development branches use a Maven snapshot version such as `<NEXT>-SNAPSHOT`. That moving version is
convenient on one development machine because a new local build can replace the previous result.
When an exact shared version is required, CEDAR publishes an immutable build train instead. The
[publishing chapter](publishing.md) explains the difference.

Estate-wide cedarcli builds skip Java tests so that compilation does not depend on a running CEDAR
environment. Run the tests for the repositories you changed before considering the work complete.

## Repair Maven State

Most builds should reuse Maven's local cache. Clean it only when an old CEDAR artifact is clearly
interfering with the current source.

Remove the locally cached CEDAR artifacts and rebuild them with:

```bash
cedarcli maven clean cedar
cedarcli build java
```

If the entire Maven cache is damaged, the broader command is:

```bash
cedarcli maven clean all
```

This removes CEDAR and third-party dependencies, so the next build must download everything again.
It is a recovery command, not a routine first step.
