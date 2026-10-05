# Other Command Groups

These commands support release, setup, inspection, and production work. They are not part of the
normal edit-build-run loop.

## `release`

`cedarcli release` performs a formal CEDAR release from a completed build train, changing versions,
branches, and tags across the repositories and publishing to Nexus.
[Releasing CEDAR](release.md) covers the whole route.

## Inspection and Setup Commands

| Group | Purpose | Starting Point |
| --- | --- | --- |
| `repo` | Explain which repositories cedarcli manages | `cedarcli repo config` |
| `check` | Check that repositories, versions, published artifacts, CI, served components and shared styling agree with the source | `cedarcli check repos` |
| `env` | Inspect the selected mode and effective settings without exposing credentials, and manage the artifact service key | `cedarcli env status` |
| `cert` | Create or renew the local certificate authority and domain certificates | `cedarcli cert setup` |
| `dev` | Prepare a development host, including directories, hostnames, and the Keycloak listener | `cedarcli dev --help` |
| `prod` | Configure built static frontends for a native production domain, and provision the artifact service key | `cedarcli prod --help` |
| `test` | Run the whole-stack smoke tiers and manage test-owned processes | `cedarcli test e2e` |

`cedarcli test e2e` runs the REST, browser and split-frontend smoke tiers under
`cedar-development/ops/e2e` against the native stack and records the run against the `develop`
heads it tested. Both
`cedarcli publish train` and `cedarcli release plan` require that record for exactly the source they
are about to ship, so run it after the last build and restart and before dispatching a train. It
refuses to start while any managed service is unhealthy or stale. `cedarcli test status` and
`cedarcli test cleanup` inventory and terminate embedded MongoDB processes left behind by backend
test runs.

The REST tier can run its independent suites concurrently. It uses two workers by default and
accepts `--rest-workers` from one to four:

```bash
cedarcli test e2e --rest-workers 4
```

Four workers is the fastest setting. On a 16-core workstation the REST tier takes about 51
seconds with four, against 119 serially. Suites that depend on global state, such as account
credentials or global counts, still run alone after the concurrent batch, and the full check
inventory must still pass. `--rest-workers 1` restores the serial order for diagnosis. The browser
and split-frontend tiers run serially and account for most of a whole run.

`cedarcli check versions` compares the version each repository declares on disk against the version
most of the estate carries, and reports one row per repository. A repository that does not match is
classified by how its checkout stands against its remote-tracking branch, because the cause decides
the remedy. A checkout that is behind its remote holds the remote's version, so it is counted
separately, reported with `cedarcli git pull` as the fix, and does not fail the command. A checkout
that is current and still disagrees is a divergence in the estate, and that is what the exit status
reports. A checkout carrying local commits is never excused by its remote. Where a repository's own
files disagree with each other, the report names a half-applied bump, which no pull repairs.

Two options adjust it. `--by-file` returns to one row per version-carrying file, which is the view
that shows which file inside a repository disagrees with its siblings. `--strict` also fails on a
checkout that is behind, for a caller judging one workspace rather than the estate: a host that
builds from its own checkout, such as a native production or staging host, gets the wrong binaries
from a stale clone, and CI runs on a fresh checkout where being behind is never expected. A build
train needs neither option, because its own preflight already requires every checked-out
repository's `develop` to equal the live remote `develop`.

The remaining checks each compare a declaration against what exists. `cedarcli check repos`
reports configured repositories that are absent, and Git clones the configuration does not name.
`cedarcli check snapshots` compares the Maven snapshot Nexus serves for each publishing repository
against the head commit on `develop`, which is the condition that leaves every consumer building
against an artifact nobody shipped. `cedarcli check components` asks the same question of the
browser applications, whose components reach each other as published npm packages: it measures each
pin against the component's own history, the bundles a host serves against the packages it locks,
and the elements a host creates against what those bundles define.

The snapshot check asks Nexus for the version `cedar-parent` declares on `develop`, and allows a
snapshot two hours to catch up with its source before counting it as behind. `--version`,
`--grace-hours`, and `--nexus` override the version, that allowance, and the repository URL.

`cedarcli check stores` compares the database with an assumption the code makes. It checks that
each of the four artifact collections in the native profile's MongoDB carries a unique `@id` index,
and prints each collection's document count. It never builds a missing index, because a unique
index cannot be built over a collection that already holds a repeated identifier. The
[backend runbook](https://github.com/metadatacenter/cedar-development/blob/develop/ops/BACKEND-RUNBOOK.md#one-document-per-identifier-which-the-store-enforces)
explains how to count the duplicates and provision the index.

`cedarcli check design-tokens` reports shared-style adoption across the embeddable components and
the applications that host them, and its `--strict` mode gates new drift against reviewed
baselines. See [Monitoring Design Token Adoption](design-tokens.md) for the repositories it scans,
its options, baseline maintenance and CI use.

Two checks read continuous integration rather than artifacts. `cedarcli check ci` reports the CI
state at every `develop` head a train would capture, and `cedarcli check ci-env` compares each Java
repository's CI environment block against the one its tests require, rewriting the copies that have
drifted under `--apply`. `cedarcli check main` is separate again: it names any repository whose
`main` has changed files that `develop` has not, which a release would otherwise replace.

Use `cedarcli check versions` before coordinated publication or release work. Run
`cedarcli check openapi` after changing any REST resource annotation and before dispatching a train,
because a response that describes no content generates a client operation with no type. `cedarcli env list`
and `cedarcli env filter <TERM>` provide more detail when diagnosing configuration; sensitive
values remain redacted.

Certificate replacement deserves particular care. Renew domain certificates with
`cedarcli cert domains --force`. Replace the CA with `cedarcli cert ca --force` only when you intend
to update browser trust and regenerate the domain certificates.

## Artifact Versioning

`cedarcli check artifact-versioning` audits the selected stack's graph for missing predecessors,
branches, non-increasing version numbers, invalid publication states, multiple drafts, disagreement
between predecessor properties and relationships, and incorrect latest-version flags. It prints a
JSON report and exits non-zero when it finds a divergence. It reads all schema artifacts, regardless
of their owners or folders, using the selected profile's database credentials without printing them.

After deploying the lifecycle implementation, `cedarcli check artifact-versioning --apply` repairs
only unambiguous latest flags and durably queues reindexing. It never guesses missing history or
repairs a branched series. Review those findings against stored documents and backups separately.
The inventory checks graph structure; the REST versioning smoke verifies document links, graph
flags and search results together on newly created templates, elements and fields.

## The Artifact Service Key

The artifact server accepts document reads and writes only from the resource and worker
microservices, which identify themselves with a shared service key sent alongside the user's own
credentials. `cedarcli env artifact-key` manages that key in
`$CEDAR_HOME/.cedar/secrets/artifact-service.sh`, a file only its owner can read, which the native
and Docker profiles both load:

```bash
cedarcli env artifact-key init
cedarcli env artifact-key rotate
cedarcli env artifact-key retire
```

`init` generates a random key once and leaves an existing one unchanged. `rotate` keeps the current
key as the previous one, which the artifact server continues to accept, and generates a new current
key. Restart the artifact server first, then resource and worker, and verify them before `retire`
drops the previous key. A final restart of the artifact server then stops it accepting the old one.
A second rotation is refused while a previous key is retained. None of the three commands prints the
key or restarts a service.

On a native production host, `cedarcli prod provision-artifact-key` performs `init` after checking
that the host runs native mode with the `server` profile and that no key already reaches it through
the environment, then prints the deployment steps. The
[backend runbook](https://github.com/metadatacenter/cedar-development/blob/develop/ops/BACKEND-RUNBOOK.md#deploying-and-rotating-the-artifact-service-key)
covers the order of the first deployment and sharing one key across several hosts.

## Development and Production Hosts

`cedarcli dev` prepares a development host:

- `create-directories` creates the log, export, temporary, and certificate-authority directories
  under `$CEDAR_HOME`.
- `add-hosts` appends a `127.0.0.1` entry to `/etc/hosts`, through `sudo`, for each CEDAR hostname
  under `CEDAR_HOST` that does not resolve.
- `copy-keycloak-listener` copies the built CEDAR event listener into the Keycloak installation's
  providers and rebuilds Keycloak, which loads the listener on its next start. Build
  `cedar-keycloak-event-listener` first. Production deployments use the same command.
- `generate-api-key [USER_ID]` prints a key derived from `CEDAR_SALT_API_KEY` and a user identifier
  by repeated SHA-256 hashing. The same inputs always give the same key, and the command writes
  nothing.

`cedarcli prod` prepares a native production host:

- `configure-frontends` writes `CEDAR_HOST` into the built bundles of OpenView, Bridging, and
  Monitoring, which have the CEDAR domain compiled in. It requires exactly one built bundle in each
  repository's distribution directory, and changes none until it has checked all three.
- `reset-frontends` restores those bundles to their committed content.
- `provision-artifact-key` is covered under [The Artifact Service Key](#the-artifact-service-key).
