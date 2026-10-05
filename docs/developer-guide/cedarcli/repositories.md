# Working Across Git Repositories

CEDAR source is divided among many Git repositories. A change in one repository can depend on a
change in another, so it is easy to build an accidental mixture of branches or overlook work that
has not been pushed. `cedarcli git` gives you one view of the complete checkout and applies
coordinated Git operations across it.

## Get the Source

Clone the repositories needed for CEDAR development, then confirm that the checkout is complete:

```bash
cedarcli git clone all
cedarcli check repos
```

The Docker-only checkout is available for machines that run published containers without changing
application source:

```bash
cedarcli git clone docker
```

A release can add a repository to the configuration that existing checkouts lack.
`cedarcli git clone-missing` clones each configured repository that has no directory under
`$CEDAR_HOME`, then checks out its `main`. `cedarcli check versions` names this command when it
finds a repository missing.

## Align the Repositories

Before a broad build, put the repositories on the intended branch and update them together. Normal
development uses `develop`:

```bash
cedarcli git status
cedarcli git checkout develop
cedarcli git pull
```

Use `main` when you need the released code instead:

```bash
cedarcli git checkout main
cedarcli git pull
```

These commands do not discard local work. If a repository cannot switch or pull cleanly, cedarcli
reports it and continues the estate-wide scan. Resolve those repositories individually before
building. The command returns a nonzero exit status if any selected repository fails, including
when Git prints no error text. Scripts should check that status before starting a dependent build.

Checkout treats the branch name as a literal Git argument. Quote branch names containing shell
metacharacters when entering them in your shell.

## See What Needs Attention

Start with:

```bash
cedarcli git status
```

The summary identifies uncommitted changes, branches that are ahead or behind, and Git errors. The
ahead and behind counts compare against the remote-tracking branches as last fetched.
`cedarcli git fetch` refreshes those branches in every repository without changing any checkout.
Use the related commands when you need a narrower view:

```bash
cedarcli git branch
cedarcli git remote
cedarcli git list branch
cedarcli git list tag
```

`git branch` answers which branch each checkout is currently using, and `git remote` lists the
remotes each one fetches from and pushes to. The two `list` commands are
useful around releases, when you need to confirm that expected branches or tags exist across the
estate.

When several repositories need separate work, run `cedarcli git next`. Each invocation moves to
the next checkout reported by the status scan, making it easier to review and resolve them one at a
time.

A failed status scan does not replace the navigation record used by `git next`. Resolve the scan
failure and run `cedarcli git status` successfully before using that record to navigate again.

## Commit at the Right Scope

Ordinary feature work should be committed inside the repository that owns it. This keeps each
history understandable and prevents unrelated changes from travelling together.

`cedarcli git add-commit-push` stages, commits, and pushes named paths in one named repository:

```bash
cedarcli git add-commit-push "Describe the change" --repo cedar-parent --path pom.xml
```

`--repo` takes the repository's exact name, and `--path` takes a file or directory relative to it,
repeated for each one to include. The command refuses before writing anything when the repository
has no changes, or when any change lies outside the named paths, so it cannot sweep unrelated work
into the commit. It then pushes to the branch's configured upstream. A failed push leaves the commit
in place locally.
