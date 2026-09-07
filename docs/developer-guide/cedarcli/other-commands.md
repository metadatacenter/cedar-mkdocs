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
| `check` | Check repository presence and version consistency | `cedarcli check repos` |
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

Use `cedarcli check versions` before coordinated publication or release work. `cedarcli env list`
and `cedarcli env filter <TERM>` provide more detail when diagnosing configuration; sensitive
values remain redacted.

Certificate replacement deserves particular care. Renew domain certificates with
`cedarcli cert domains --force`. Replace the CA with `cedarcli cert ca --force` only when you intend
to update browser trust and regenerate the domain certificates.
