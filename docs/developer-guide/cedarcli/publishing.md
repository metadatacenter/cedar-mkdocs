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

Create a train with:

```bash
cedarcli publish train
```

cedarcli chooses the ID and starts the build in GitHub Actions. You can follow its progress from the
Actions page of the `cedar-development` repository. The build publishes a consistent Maven and
Docker set and verifies it before making the train available. Your checked-out development versions
are not changed.

Use a train when another machine or a later investigation must receive the same artifact set. The
Docker chapter shows how to select a train when starting or building containers.

## Resume a Failed Train

If publication failed for a temporary reason, resume the same recorded train:

```bash
cedarcli publish train --resume <TRAIN_ID>
```

Resume uses the source commits already attached to that ID. Use it when the source should remain
unchanged and only the interrupted publication needs to continue. If the fix requires a code
change, commit the fix and create a new train.

A build train is not a formal CEDAR release. Releases change versions, branches, and tags and are
handled through the release procedure summarized on [Other Command Groups](other-commands.md).
