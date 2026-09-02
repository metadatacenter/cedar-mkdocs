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

Optionally rehearse source capture and dispatch without creating state or starting GitHub Actions:

```bash
cedarcli publish train --dry-run
```

The displayed dry-run ID is prospective and is not reserved; the real dispatch allocates again.
Dry-run and real dispatch use the same local preflight. It validates the Maven, model → CEE →
frontend, and 31-image Docker configuration as one contract; checks GitHub authentication and the
workflow plus CI for every exact remote `develop` SHA that defines one; requires the train slot to
be idle; rejects dirty, unpushed, or remote-diverged source; and rejects an ID collision. It also
reads the live Nexus service and writable status, the
Release-policy `cedar-maven-dev` repository root, npm identity, and Docker Registry v2 token flow.
It takes credentials from the environment or the `bmir-nexus-releases` server in
`~/.m2/settings.xml`. No extra parameter enables these checks, and the probe does not publish,
write train state, or change npm or Docker client configuration.

The exact-SHA probe gives only a short GitHub indexing absence and transient network or 502/503/504
failures bounded retries, naming the repository, SHA, attempt, and delay. Pending/red CI, 401/403,
malformed data, and a persistently absent run remain early failures; pending output includes the
workflow URL. Local preflight also inspects npmrc key names once without exposing values or tokens:
obsolete authentication semantics block, while harmless author-setting deprecations are one
advisory.

Then create the train with:

```bash
cedarcli publish train
```

cedarcli repeats the preflight, chooses the ID, and dispatches the build in GitHub Actions. It prints the workflow run and a
major-stage status command:

```bash
cedarcli publish train-status <TRAIN_ID> --watch
```

The compact watcher reports Maven, the three npm stages, the Docker plan, counts for the 31-image
matrix, and final verification. An unchanged long stage emits a one-minute heartbeat naming its
active job/step and elapsed time. Omit `--watch` for a one-shot view. Both forms show the exact failed
job and step when available, the workflow URL, how much publication is verified, and the safe next
command.

Before creating state or starting the long Maven build, the workflow validates the exact captured
files and cross-repository configuration, checks exact-source CI wherever a repository defines a
workflow, and requires the Docker image, Maven, and application suite-version
selectors to equal the captured source snapshot. It repeats the same read-only Nexus/npm/Docker
probe and proves Nexus is writable and can serve the `cedar-maven-dev` repository root. The train
repository uses a Release version policy, so artifact-level `maven-metadata.xml` is not expected and
is not used as a health probe. Probe failures name the target and distinguish rejected credentials,
missing access,
an absent endpoint/repository contract, rate limiting, and service failure.
The hosted controller loads the CI and lifecycle-script policy from the exact captured cedar-cli
commit, so it cannot silently disagree with the local rehearsal.

The same early gate binds the reviewed npm advisory counts to each lockfile's SHA-256. Any changed
dependency graph must be audited and have its baseline updated before Maven starts. Required npm 11
install scripts are approved by exact package version, and strict policy makes an unreviewed new
lifecycle script fail. The historical frontend counts remain visible as debt; the baseline prevents
them increasing silently, while CEE's production dependency audit remains a blocking zero gate.
Release planning and execution use the same validator and strict environment. When release
stamping changes a root lockfile, it refreshes that lock's baseline in the release and
next-development train configuration so the next train does not inherit a stale digest.

It then owns one exact source manifest and advances three independently verified pointers in order:

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

First run `cedarcli publish train-status <TRAIN_ID>`. Its decision follows the persisted boundary:

- no source record means no publication could start, so create a new train;
- recorded source with incomplete publication can resume if the source remains unchanged;
- Docker completion means the train is complete, so neither resume nor abandon applies.

There is no train-abandon operation. A failed immutable ID remains evidence and does not prevent a
new train.

If publication failed for a temporary reason, resume the same recorded train:

```bash
cedarcli publish train --resume <TRAIN_ID> --dry-run
cedarcli publish train --resume <TRAIN_ID>
```

The dry run confirms the immutable manifest, repeats the applicable preflight, and reports the
first incomplete major stage without dispatching it. The hosted preflight also runs again on real
resume. Resume uses the source commits already attached to that ID and accepts an existing
artifact only when its recorded identity and bytes agree. Use it when the source should remain
unchanged and only the interrupted publication needs to continue. If the fix requires a code
change, commit the fix and create a new train.

A scheduled publication-preflight canary runs the same read-only external checks every day and opens
an issue if they stop working. It is an early warning only. A real train still compares Maven/npm
bytes and hashes and pulls all 31 images back to verify their recorded registry digests and
provenance.

### CEE CI reports a missing development model tarball

CEE's source manifests and locks pin one exact development model package in both the repository root
and `visual/`. Nexus cleanup can remove an old tarball while those otherwise-valid locks still name
it; the CEE workflow then fails early with an npm 404. Do not republish the missing immutable version
or switch the dependency to a moving npm tag. Select a model package recorded and byte-verified by
an appropriate completed train in
`npm/model/completed/<TRAIN_ID>.json` on the `build-trains` branch, and first confirm that package
still installs.

Update the model alias in CEE's root and visual manifests and regenerate both lockfiles with Node
24.19.0. Run both installs with `NPM_CONFIG_STRICT_ALLOW_SCRIPTS=true`, review the dependency graphs,
and update the matching lockfile SHA-256 baselines in
`cedar-development/ops/frontend-train.json` (including advisory counts if they changed). The local
train dry-run and the pushed CEE workflow must then pass. Because this is a source correction, start
a new train rather than resuming an existing immutable ID. During that new train, the isolated CEE
checkout is wired again to the newly built train model package.

A build train is not a formal CEDAR release. Releases change versions, branches, and tags and are
handled through the release procedure summarized on [Other Command Groups](other-commands.md).
