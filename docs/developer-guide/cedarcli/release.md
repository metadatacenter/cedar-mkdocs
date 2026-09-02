# Releasing CEDAR

A release turns one immutable build train into a permanent, published version of CEDAR. It moves
every repository's `main` to the released content, tags it, advances `develop` to the next
development snapshot, and publishes the Maven release plus the stable frontend npm surfaces to
CEDAR's Nexus.

A release consumes a train rather than building one. The train has already built and verified a
coordinated source state, so the release never compiles from a moving target: it takes the exact
commits the train recorded, stamps versions onto them, and proves that what it publishes matches
what the train built. Creating a train is covered in
[Publishing Artifacts and Build Trains](publishing.md).

The route is these commands:

```bash
cedarcli release plan       # read-only rehearsal against a completed train
cedarcli release start      # run the release
cedarcli release status     # show where it is
cedarcli release resume     # verify the recorded boundary and continue
cedarcli release abandon    # retain and close a local-only superseded attempt
```

## The Four Inputs

Every release input is stated explicitly. None is derived, defaulted, or read from the environment,
because each one names something a release can only get wrong once:

```bash
cedarcli release plan \
  --version 2.9.3 \
  --next-version 2.9.4-SNAPSHOT \
  --from-train 2.9.3-dev.20260828.1956 \
  --cee-version 2.0.3
```

`--version` is the version being released, and `--next-version` is the snapshot `develop` moves to
afterwards. Stating both guards against releasing into the wrong series: a release that derived the
next version from the released one could not tell an intended jump from a typing mistake.

`--from-train` identifies the completed build train the release is cut from. The train's recorded
source commits become the release's source, and its published artifacts become the bytes the
release republishes under the release version.

## `--cee-version` and the Byte-Equivalence Proof

`--cee-version` looks like a version pin, and it is really a proof obligation.

The Embeddable Editor is built by the train as a development version, and it is consumed by CEDAR's
frontends from public npmjs as a stable version. Those are two different packages with two
different names, so a frontend released against the public package could contain something other
than what the train built and tested.

The release closes that gap before it does anything else. It downloads both tarballs, normalizes
each one to remove the differences a publication legitimately introduces, and compares the
remaining payload by SHA-256. Only when the two match does the release pin the public version into
the frontends. `cedarcli release plan` prints the proof:

```text
CEE equivalence:     2.0.3-dev.20260824.1847.g48283fbabcde -> 2.0.3
CEE payload SHA-256: 6f1c…
CEE executable:      identical after declared release-provenance changes
```

Naming a public version that is not equivalent stops the release at planning time. Nothing is built
and nothing is changed.

The normalization is deliberately narrow. It covers package channel metadata, the declared CEE and
model identities, the load trace, the one public-release changelog entry, and CEE's `allowScripts`
install policy when Angular embeds the root `package.json` into its bundle. For that last case the
planner reads the exact policy from the train-captured CEE source, requires the corresponding
minified literal exactly once, and removes only that literal. `allowScripts` controls which npm
dependencies may run install scripts; it is not CEE runtime behavior. An undeclared policy, a second
copy, or a changed byte beside it still fails the executable comparison.

## Rehearsing a Release

Once the train is complete, rehearse the entire release without changing anything:

```bash
cedarcli release plan \
  --version 2.9.4 \
  --next-version 2.9.5-SNAPSHOT \
  --from-train 2.9.4-dev.20260829.1200 \
  --cee-version 2.0.3
```

`plan` validates the train and runs every machine, source, permission, registry, CEE, and content
check that gates `start`. It finishes with `No changes made.`

Plan settles four groups of question.

**The machine can run a release.** Java 17 and Node 24.19.0 are active, `git`, `mvn`, and `npm` are
on PATH, Git author name and email are configured, the CEDAR profile is sourced, and there is disk
for the train, the attempt tree, and the archives.
An unsourced profile is worth its own mention: the Maven suites read variables the profile defines,
and without them a build fails deep inside Dropwizard configuration rather than at its start.

**The source is ready.** Every participating repository, including independent CEE consumers, is
clean and pushed. The exact train commit contains every declared wrapper, manifest, lock, build,
preserve, version, and Docker stamp input. CI for that exact commit must be green wherever the
commit defines a workflow; missing, unreadable, queued, or running required checks block. A source
with no workflow is advisory because there is no CI contract to query. The question is asked of the
train commit rather than of whatever `develop` points at now, which matters because a release
advances `develop` everywhere at once and the runs those pushes trigger can race the parent snapshot
they resolve against.

When CI is genuinely broken for a reason that must not hold up a release, accept the specific run
rather than disabling the check:

```bash
cedarcli release start ... --accept-red-develop cedar-repo-server=33211136456
```

The acceptance names one repository and one run, and it is recorded in the release ledger. There is
no flag that skips the check for everything.

**The writes will be accepted.** Both Nexus credentials are available and authenticate, npm holds an
identity for CEDAR's Nexus registry, the release version is unused in every repository and absent
from the target Maven and npm namespaces, and each remote accepts a dry-run push of every ref it
will later receive: `main`, `develop`, `release/pre-<version>`, the release tag, and, where
applicable, `release/post-<next-version>`.
Nexus authorization cannot be inferred from the variables being present, because Nexus reads fall
back to anonymous and succeed either way. The CLI prefers `BMIR_NEXUS_USERNAME` and
`BMIR_NEXUS_PASSWORD` when both are set; otherwise it reads the `bmir-nexus-releases` server entry
from `~/.m2/settings.xml`. Namespaced and unnamespaced Maven settings files are both supported, and
credential values are never printed. There is no `release auth` command: credential resolution and
authentication happen automatically during `release plan`, `release start`, and `release resume`.

The Nexus check reads a repository rather than a status endpoint, because the status endpoints stay
green while everything behind them fails. One shape of that is worth recognising: when Nexus serves
its status endpoints and returns 500 for every repository path, the instance is over its daily
request budget rather than broken. Plan says so. Retrying makes it worse, and the budget is a
rolling 24-hour window, so the answer is to stop and let it roll off.

**The completed train is releasable.** Its Maven and npm inventories are complete, and its Docker
plan and completion record contain the same 31 images with immutable `sha256` registry digests.

**The content is stampable.** Every file a Maven build regenerates with the version inside is
declared, every `license.txt` carries a recognisable copyright line, and each remote's `main` holds
nothing that `develop` does not. That last one is reported rather than refused: a release writes
`main` from the released tree, so anything committed to `main` alone and never merged back is
replaced.

The Docker source's `IMAGE_VERSION`, `CEDAR_MAVEN_VERSION`, and `CEDAR_APPLICATION_VERSION` must all
equal the train source version. Release stamping advances them together for both the release and
next-development trees, so a new image tag cannot silently retain old Maven or application inputs.

## Running a Release

```bash
cedarcli release start \
  --version 2.9.3 \
  --next-version 2.9.4-SNAPSHOT \
  --from-train 2.9.3-dev.20260828.1956 \
  --cee-version 2.0.3
```

`start` runs the identical release gate before it touches anything, so a release cannot begin from a
state `plan` would have refused.

Transient transport retries are built in. A release runs for hours across two registries and forty
remotes, so it retries direct connection failures, HTTP 502/503/504 from resumable Git, Maven, and
npm commands, and Git's server-side 5xx failures with bounded backoff. A
changed tree, protected-ref refusal, failed byte verification, authentication failure, or Nexus
HTTP 500 stops the release at once. Nexus 500 is deliberately not retried because it is also how
the daily request-budget failure presents itself.

Before snapshot publication, release publication, and final acceptance, a circuit breaker reads
Nexus writable status and one real repository object. It does this before changing the phase ledger
or beginning request-heavy verification. A direct connection failure remains retryable; an HTTP
refusal opens the circuit.

## Phases and the Ledger

A release records its own progress in a ledger under `~/.cedar/train-releases/`, and every phase
verifies its work before the next one begins:

| Phase | What it does |
| --- | --- |
| `preparing-frontends` | Clones the train's exact commits and builds the frontends against the proven CEE |
| `preparing-versions` | Stamps the release and next-development versions, and the copyright year |
| `validating-builds` | Builds the stamped trees and records proof of their output |
| `creating-local-refs` | Replaces tracked distributions with the validated builds, removes obsolete generated files, and creates the release commits and tags locally without touching any remote |
| `publishing-snapshots` | Deploys the next-development snapshots to Nexus, in dependency order |
| `integrating-remotes` | Writes `main`, the tag, and `develop` in each remote |
| `publishing-artifacts` | Uploads the Maven release and six stable frontend npm packages to Nexus and verifies their published bytes |
| `accepted` | Proves the finished release from outside its own ledger |

Three properties of that sequence are worth knowing. Nothing reaches a remote until every local ref
has been created and verified, so a release that fails during preparation has changed nothing
outside the machine it ran on. Each integration commit is written from the prepared tree rather
than merged towards it, so `main` comes to hold exactly the released content.

The third explains why the snapshots are deployed before the remotes rather than after. Integrating
the remotes advances `develop` to the next version everywhere at once, and the CI those pushes
trigger resolves the parent and the libraries at that version from Nexus. Publishing the snapshots
first means those builds find what they are looking for. Deployed afterwards, as they once were,
they arrived minutes too late and left a tail of red `develop` builds that said nothing about the
code.

For distribution repositories, the local-ref phase is the boundary at which generated output
becomes release content. The CLI retains the package metadata, replaces everything else in the
tracked distribution with the inventoried production build, and records additions, changes, and
deletions in the release commit. OpenView receives an extra proof: its distributed CEE JavaScript
must equal the public CEE selected by `--cee-version` after only the declared production endpoint
normalization.

Publication packs the integrated commit rather than overlaying another build afterward. OpenView's
CEE and Web Components runtime files live under `node_modules`, which npm normally omits; the release
packer explicitly retains those declared runtime assets and verifies their hashes again after
downloading the registry tarball. Final acceptance binds the OpenView distribution and npm package
to the proven CEE bytes. Deployment remains a separate operational boundary, so the environment
smoke check must still confirm what the web server is serving.

Follow a running release with:

```bash
cedarcli release status
```

The human view is a compact phase table with completed/total counts. It says `COMPLETE` only after
acceptance, highlights the single next or failed phase, and prints the safe commands to run next.
During Maven release publication, the running command reports every uploaded or already-present
file. Each result is also checkpointed in the ledger, so `release status` shows Maven file progress,
the current path, and the two disposition counts while the enclosing artifact task is still open.
An interrupted upload resumes by comparing the immutable remote bytes and continuing. Older ledgers
that stored snapshot and release publication records together are classified by task identity, so
their totals remain truthful.

## Acceptance

Publication is not the end of the route. The acceptance phase asks, from outside the ledger that
recorded the work, whether the release actually holds: every repository carries the release tag,
every remote ref stands where the ledger says, every published artifact still matches its recorded
bytes, and the frontends pin the proven CEE. The answers are recorded, and `accepted` is the
terminal phase.

The exact-ref check proves each release tag at its recorded commit as part of the same remote read.
Acceptance therefore does not repeat a tag-only request across all repositories.

Acceptance also marks the release concluded and frees the active slot. There is no separate
`finish` command. If the process stops between writing the accepted ledger and concluding its
pointer, `cedarcli release resume` repairs that bookkeeping step without rerunning any phase.

A release that reports success has therefore been checked rather than assumed. Only `COMPLETE`
means successfully released. `ABANDONED` means the retained attempt was closed without releasing
it; every other status remains incomplete.

## When a Phase Fails

A failure stops the release, records the reason in the ledger, and retains the failed attempt
under `~/.cedar/train-releases/attempts/<version>/`. Nothing is rolled back and nothing is deleted,
because a failed attempt is the evidence for diagnosing what happened.

Fix the cause, reconcile without changing anything, then continue from the recorded phase:

```bash
cedarcli release resume
```

Resume starts at the recorded phase, verifies the completed evidence that phase consumes, and
continues with bounded transient retry. It also reruns the checks that remain meaningful at that
phase: source and toolchain checks during local preparation, exact-ref and push checks before remote
integration, and credential, registry, and target-object checks before publication. Conditions
deliberately changed by a completed phase are not tested as though this were a brand-new release.
Completed phases are not re-run, so a release interrupted during publication does not rebuild
anything. This phase-aware gate is automatic; `resume` takes no additional option.

Never edit a ledger or a release manifest by hand. Those files are the release's own record of what
it verified, and a hand-edited record makes every guard downstream of it meaningless.

Sometimes the immutable train is the cause of the failure, so retrying the same evidence cannot
work. If the attempt has not gone beyond `local-refs-created`, retain it and free the slot with:

```bash
cedarcli release abandon \
  --version 2.9.4 \
  --reason "superseded by corrected train 2.9.4-dev.20260901.0555"
```

The version must exactly match the active release, and the non-empty reason becomes part of its
ledger. Status then reports `ABANDONED`; the manifest and numbered attempt workspace remain intact,
and a new attempt may use the same release version.

Abandonment is intentionally limited to local-only work. Once snapshot publication may have begun,
Maven could have changed Nexus even if the deploy failed before recording a completed task. The CLI
therefore refuses abandonment from `publishing-snapshots` onward, or whenever snapshot,
remote-integration, or artifact-publication evidence exists. Repair and `release resume` from that
boundary; never use deletion as a substitute.

One release is active at a time. Acceptance closes a successful release, while guarded abandonment
closes a local-only attempt that must be replaced by another train.

## What a Release Changes

In each of the release repositories:

- `main` holds the released content and carries the tag `release-<version>`.
- `develop` moves to the next development snapshot.
- The copyright year in `license.txt` moves to the release year on both branches. Only the year
  changes, and a licence without a recognisable copyright line is left alone.

In CEDAR's Nexus, the Maven release artifacts and six stable frontend surfaces are published under
the release version, and the next-development Maven snapshots under the new snapshot version.
Workspace and Template Designer receive the stable CEE wiring but retain their independent
publication route while migration is in progress. Nothing is published to public npmjs, which is a
separate procedure for the Embeddable Editor and the TypeScript model library. Docker images belong
to the train and are not promoted by a release.
