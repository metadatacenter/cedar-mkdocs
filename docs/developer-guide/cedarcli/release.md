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

**The machine can run a release.** Java 17 is active, `git`, `mvn`, `node`, and `npm` are on PATH,
the CEDAR profile is sourced, and there is disk for the train, the attempt tree, and the archives.
An unsourced profile is worth its own mention: the Maven suites read variables the profile defines,
and without them a build fails deep inside Dropwizard configuration rather than at its start.

**The source is ready.** Every repository is on `develop`, clean, and pushed, and the CI run for the
exact commit the train was built from is green. The question is asked of that commit rather than of
whatever `develop` points at now, which matters because a release advances `develop` everywhere at
once and the runs those pushes trigger can race the parent snapshot they resolve against.

When CI is genuinely broken for a reason that must not hold up a release, accept the specific run
rather than disabling the check:

```bash
cedarcli release start ... --accept-red-develop cedar-repo-server=33211136456
```

The acceptance names one repository and one run, and it is recorded in the release ledger. There is
no flag that skips the check for everything.

**The writes will be accepted.** Both Nexus credentials are set and authenticate, npm holds an
identity for CEDAR's Nexus registry, the release version is unused in every repository, and each
remote accepts a dry-run push of the `main` update and the release tag it will later make for real.
Nexus authorization cannot be inferred from the variables being present, because Nexus reads fall
back to anonymous and succeed either way.

The Nexus check reads a repository rather than a status endpoint, because the status endpoints stay
green while everything behind them fails. One shape of that is worth recognising: when Nexus serves
its status endpoints and returns 500 for every repository path, the instance is over its daily
request budget rather than broken. Plan says so. Retrying makes it worse, and the budget is a
rolling 24-hour window, so the answer is to stop and let it roll off.

**The content is stampable.** Every file a Maven build regenerates with the version inside is
declared, every `license.txt` carries a recognisable copyright line, and each remote's `main` holds
nothing that `develop` does not. That last one is reported rather than refused: a release writes
`main` from the released tree, so anything committed to `main` alone and never merged back is
replaced.

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
| `creating-local-refs` | Creates the release commits and tags locally, without touching any remote |
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

Follow a running release with:

```bash
cedarcli release status
```

The human view is a compact phase table with completed/total counts. It says `COMPLETE` only after
acceptance, highlights the single next or failed phase, and prints the safe commands to run next.
Older ledgers that stored snapshot and release publication records together are classified by task
identity, so their totals remain truthful.

## Acceptance

Publication is not the end of the route. The acceptance phase asks, from outside the ledger that
recorded the work, whether the release actually holds: every repository carries the release tag,
every remote ref stands where the ledger says, every published artifact still matches its recorded
bytes, and the frontends pin the proven CEE. The answers are recorded, and `accepted` is the
terminal phase.

The exact-ref check proves each release tag at its recorded commit as part of the same remote read.
Acceptance therefore does not repeat a tag-only request across all repositories.

A release that reports success has therefore been checked rather than assumed. Treat any other
final phase as an incomplete release, whatever else the output says.

## When a Phase Fails

A failure stops the release, records the reason in the ledger, and retains the failed attempt
under `~/.cedar/train-releases/attempts/<version>/`. Nothing is rolled back and nothing is deleted,
because a failed attempt is the evidence for diagnosing what happened.

Fix the cause, reconcile without changing anything, then continue from the recorded phase:

```bash
cedarcli release resume
```

Resume starts at the recorded phase, verifies the completed evidence that phase consumes, and
continues with bounded transient retry. Completed phases are not re-run, so a release interrupted
during publication does not rebuild anything.

Never edit a ledger or a release manifest by hand. Those files are the release's own record of what
it verified, and a hand-edited record makes every guard downstream of it meaningless.

One release is active at a time. Acceptance is the only path that marks it finished and frees the
slot for the next release; the slot is never freed by deleting or editing state.

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
