# Other Command Groups

These commands support release, setup, inspection, and production work. They are not part of the
normal edit-build-run loop.

## `release`

`cedarcli release` performs a formal CEDAR release, including version, branch, tag, merge, and
publication work across the repositories. This is different from a build train, which publishes a
fixed development state without changing branches or tags. Follow the
[CEDAR Release Runbook](https://github.com/metadatacenter/cedar-development/blob/main/ops/RELEASE-RUNBOOK.md)
for the complete release procedure.

## Inspection and Setup Commands

| Group | Purpose | Starting Point |
| --- | --- | --- |
| `repo` | Explain which repositories cedarcli manages | `cedarcli repo config` |
| `check` | Check repository presence and version consistency | `cedarcli check repos` |
| `env` | Inspect the selected mode and effective settings without exposing credentials | `cedarcli env status` |
| `cert` | Create or renew the local certificate authority and domain certificates | `cedarcli cert setup` |
| `dev` | Prepare a development host, including directories, hostnames, and the Keycloak listener | `cedarcli dev --help` |
| `prod` | Configure built static frontends for a native production domain | `cedarcli prod --help` |

Use `cedarcli check versions` before coordinated publication or release work. `cedarcli env list`
and `cedarcli env filter <TERM>` provide more detail when diagnosing configuration; sensitive
values remain redacted.

Certificate replacement deserves particular care. Renew domain certificates with
`cedarcli cert domains --force`. Replace the CA with `cedarcli cert ca --force` only when you intend
to update browser trust and regenerate the domain certificates.
