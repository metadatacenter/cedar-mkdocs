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
building.

## See What Needs Attention

Start with:

```bash
cedarcli git status
```

The summary identifies uncommitted changes, branches that are ahead or behind, and Git errors. Use
the related commands when you need a narrower view:

```bash
cedarcli git branch
cedarcli git list branch
cedarcli git list tag
```

`git branch` answers which branch each checkout is currently using. The two `list` commands are
useful around releases, when you need to confirm that expected branches or tags exist across the
estate.

When several repositories need separate work, run `cedarcli git next`. Each invocation moves to
the next checkout reported by the status scan, making it easier to review and resolve them one at a
time.

## Commit at the Right Scope

Ordinary feature work should be committed inside the repository that owns it. This keeps each
history understandable and prevents unrelated changes from travelling together.

`cedarcli git add-commit-push "message"` is intentionally broad: it stages, commits, and pushes
changes across the configured repositories. Reserve it for a coordinated change that you have
already reviewed with `cedarcli git status`.
