# Publishing Artifacts and Build Trains

A build creates artifacts for the current machine. Publishing makes artifacts available to other
developers and deployments. Before publishing, decide whether you need the current development
versions or one immutable set that can be reproduced and selected later.

## Publish the Current Development Versions

The ordinary publish commands use the versions declared in the checked-out source. Use them when a
shared development artifact needs to be updated without creating a complete build train.

Publish the current repository with:

```bash
cedarcli publish this
```

Publish the Java estate in dependency order with:

```bash
cedarcli publish java
```

The broader targets are available when the change spans more of CEDAR:

```bash
cedarcli publish frontends
cedarcli publish all
```

Publishing does not deploy or restart an environment. It also does not replace testing: verify the
changed projects locally before making their artifacts shared inputs.

Workspace and Template Designer remain outside the generic frontend and `all` publication
selectors while their split deployment is being stabilized. Publish exactly those two immutable,
commit-derived development packages with the explicit route:

```bash
cedarcli publish split-frontends --dry-run
cedarcli publish split-frontends
```

The preview and publication both require clean source. Publication packs from the committed tree,
does not change either checkout, and writes to the configured CEDAR Nexus registry. Public releases
of the TypeScript model library and CEE remain a separate npmjs procedure.

## Publish an Immutable Build Train

Development snapshots can change while keeping the same version name. That is useful during local
work, but it is unsafe for Docker and integration testing because two components can resolve
different generations of the same snapshot.

A build train gives a coordinated source state one unique ID. The ID combines the next development
version with the time the train was created. For example, when development is on `2.9.3-SNAPSHOT`,
a train ID might be:

```text
2.9.3-dev.20260825.2045
```

First rehearse source capture and dispatch without creating state or starting GitHub Actions:

```bash
cedarcli publish train --dry-run
```

Then create the train with:

```bash
cedarcli publish train
```

cedarcli chooses the ID and dispatches the build in GitHub Actions. It prints the workflow run and a
major-stage status command:

```bash
cedarcli publish train-status <TRAIN_ID>
```

The workflow owns one exact source manifest and advances three independently verified pointers in
order:

1. Maven is compiled in dependency order, published under the immutable train version, and checked
   for a complete Nexus inventory.
2. The captured TypeScript model is stamped and published as a train development package; the
   captured CEE is wired to that exact package, tested, published, and then pinned into all seven
   captured frontend packages. Every downloaded npm tarball, integrity value, source commit, and
   prepared lock or payload is verified.
3. The workflow builds the two Java bases and 29 runtime images from those recorded Maven and npm
   inputs, pulls all 31 images back from Nexus, and verifies their digests and provenance labels.

Only completion of all three stages advances the deployable Docker pointer. The disposable train
workspaces receive the train versions and dependency pins; the ordinary source checkouts and their
development versions are not changed. The train Maven build skips tests by design, so run
`cedarcli build java` with its default test gate or verify CI for the captured commits first.

Use a train when another machine or a later investigation must receive the same artifact set. The
Docker chapter shows how to select a train when starting or building containers.

## Resume a Failed Train

If publication failed for a temporary reason, resume the same recorded train:

```bash
cedarcli publish train --resume <TRAIN_ID> --dry-run
cedarcli publish train --resume <TRAIN_ID>
```

The dry run confirms the immutable manifest and reports the first incomplete major stage without
dispatching it. Resume uses the source commits already attached to that ID and accepts an existing
artifact only when its recorded identity and bytes agree. Use it when the source should remain
unchanged and only the interrupted publication needs to continue. If the fix requires a code
change, commit the fix and create a new train.

A build train is not a formal CEDAR release. Releases change versions, branches, and tags and are
handled through the release procedure summarized on [Other Command Groups](other-commands.md).
