# CEDAR git utils

During development it is needed, that the same git operation is executed on all the repos.
This can be done one by one on all the CEDAR repos.
We have a set of utility script that can help the developer with these tasks.  

The prefix `g` in the aliases below refers to `global` as in "all the CEDAR repos".

The following commands can be executed from anywhere, they will use the `CEDAR_HOME` to define the working directory for the underlying git commands.

## Git status

```sh
cedargstatus
```

## Git pull

```sh
cedargpull
```

## Checkout a given branch

```sh
cedargcheckout <branchname>
```

## List the active branches

```sh
cedargbranches
```
