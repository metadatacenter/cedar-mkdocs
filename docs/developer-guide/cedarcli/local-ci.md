# Running CI Locally

Every gate that waits for CEDAR's continuous integration accepts two answers for a commit: a green
GitHub Actions run, or a passing local CI run of the same commit. Local CI runs a repository's own
GitHub workflows on your workstation, so a release need not wait for hosted runners, and an Actions
outage does not stop it. Actions keeps running beside it. It still publishes the snapshots and
development packages, and its runs remain a second opinion.

## Run a Repository's CI

Name the repositories to run. Each runs at its `origin/develop` head:

```bash
cedarcli ci run cedar-core-library
cedarcli ci run cedar-embeddable-editor cedar-embeddable-term-picker
cedarcli ci run --all --jobs 3
```

`--revision <repository>=<commit>` runs another commit. `--jobs` sets how many repositories run at
once, and a repository's own independent jobs run in parallel within it.

Local CI reads the workflows the commit carries and runs the jobs a push of that commit to `develop`
would start, each in a fresh workspace cloned from your local checkouts. A step runs with the
workflow's own condition, environment and working directory, and the environment keeps nothing from
your shell except the toolchain: Java 17 and Node 24.22.1, resolved as a release resolves them.
Maven resolves into a repository of its own, so a snapshot you installed from a working tree never
stands in for the one Nexus serves.

When a run finishes, it writes a record under `~/.cedar/local-ci/evidence` and posts a
`cedar/local-ci` status on the commit, where a pull request shows it and a gate on another machine
reads it. `--no-status` keeps the record local.

## What Local CI Covers

`cedar-development/ops/local-ci.json` names the jobs local CI answers for. For each, it records
only what must differ on a workstation, with a reason: the publication steps it skips, a Linux-only
package install, a port that would collide with the native stack. A repository the file does not
name is one GitHub still answers for.

```bash
cedarcli ci coverage
```

The command lists every repository the file names as covered, as left to GitHub with the reason the
file gives, or as drifted. A repository drifts when its workflows contain a step, action, expression
or secret the file does not account for. A workflow change that adds one therefore leaves that
repository to GitHub until the file is reviewed, and the command exits non-zero.

## See the Answers

```bash
cedarcli ci status
```

The command shows, for each repository's `develop` head, whether local CI passed, failed or has not
run there. `cedarcli check ci` shows the answer every train gate uses, which is a green GitHub run or
a passing local one.

A GitHub run that failed without any of its jobs failing never ran the code, as happens when GitHub
itself is failing. The gates no longer take such a run for a red commit: `cedarcli check ci` and
`cedarcli release plan` report it with the command that reruns it, and the release and
`cedarcli release npm` rerun it themselves and wait.
