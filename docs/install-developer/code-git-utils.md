# cedarcli git commands

During development, it is needed, that the same git operation is executed on all the repos.
This can be done one by one on all the CEDAR repos.
We have a set of commands that can help the developer with these tasks.  

The following commands can be executed from anywhere, they will use the `CEDAR_HOME` to define the working directory for the underlying git commands.

## Git status

```sh
cedarcli git status
```

## Git pull

```sh
cedarcli git pull
```

## Go to next repo with changes
This is especially usefull during the end-of-day check-in process. This commands changes the directory into the next repo which needs attention:
```sh
cedarcli git next
```

## Important env variable
CEDAR uses some private documentation repos as well, which are not crucial for the deployment of the application.
However, these are included in the list handled by `cedarcli`.

To disregard these repos in case you don't have access to them, set the `CEDAR_DEV_USE_PRIVATE_REPOS` env variable to anything but `true`:
```sh
vi ~/.zshrc
```

Add:
```
export CEDAR_DEV_USE_PRIVATE_REPOS=false
```


## Checkout a given branch
```sh
cedarcli git checkout <branchname>
```

## List the active branches
```sh
cedarcli git branch
```

## Fetch changes
```sh
cedarcli git fetch
```

## List remotes
```sh
cedarcli git remote
```

## List newest local and remote branches
```sh
cedarcli git list branch
```

## List newest local and remote tags
```sh
cedarcli git list tag
```

## Switch to branch
```sh
cedarcli git branch <branchname>
```

## Add-commit-push all repos
```sh
cedarcli git add-commit-push COMMENT
```
