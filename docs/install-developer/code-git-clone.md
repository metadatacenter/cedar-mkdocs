# Clone the project repos

CEDAR is composed of numerous  `git` repos. However, it is possible, it would be tedious to clone these repos one by one.
We have a utility script that does just that.  

## Clone the repos using util script

```sh
gocedar
${CEDAR_DEVELOP_HOME}/bin/util/git/git-clone-all.sh
```

This will clone all the repos that are needed for the CEDAR development.

## Checkout `develop` branch

```sh
cedargcheckout develop
```

This will check out the `develop` branch for all the CEDAR repos.
