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
| `check` | Check repository presence, version consistency, and OpenAPI contract completeness | `cedarcli check repos` |
| `env` | Inspect the selected mode and effective settings without exposing credentials | `cedarcli env status` |
| `cert` | Create or renew the local certificate authority and domain certificates | `cedarcli cert setup` |
| `dev` | Prepare a development host, including directories, hostnames, and the Keycloak listener | `cedarcli dev --help` |
| `prod` | Configure built static frontends for a native production domain | `cedarcli prod --help` |
| `test` | Run the whole-stack smoke tiers and manage test-owned processes | `cedarcli test e2e` |

`cedarcli test e2e` runs the REST and browser smoke tiers under `cedar-development/ops/e2e` against
the native stack and records the run against the `develop` heads it tested. Both
`cedarcli publish train` and `cedarcli release plan` require that record for exactly the source they
are about to ship, so run it after the last build and restart and before dispatching a train. It
refuses to start while any managed service is unhealthy or stale. `cedarcli test status` and
`cedarcli test cleanup` inventory and terminate embedded MongoDB processes left behind by backend
test runs.

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

Use `cedarcli check versions` before coordinated publication or release work. Run
`cedarcli check openapi` after changing any REST resource annotation and before dispatching a train,
because a response that describes no content generates a client operation with no type. `cedarcli env list`
and `cedarcli env filter <TERM>` provide more detail when diagnosing configuration; sensitive
values remain redacted.

Certificate replacement deserves particular care. Renew domain certificates with
`cedarcli cert domains --force`. Replace the CA with `cedarcli cert ca --force` only when you intend
to update browser trust and regenerate the domain certificates.
