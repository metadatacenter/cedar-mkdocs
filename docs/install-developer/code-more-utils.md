# More CEDAR utils

On the previous pages you could have seen some aliases that we are using to get around the CEDAR development environment.

A partial list of these aliases is listed below. For the full list, please inspect the `${CEDAR_DEVELOP_HOME}/bin/util/set-dev-aliases.sh` script file.

## Change to the parent project directory

```sh
goparent
# aliases to 'cd $CEDAR_HOME/cedar-parent'
```

## Change to the CEDAR project directory

```sh
goproject
# aliases to 'cd $CEDAR_HOME/cedar-project'
```

## Clean `Maven` cache

```sh
rmmvn
# aliases to 'rm -rf ~/.m2/repository/'
```

???+ warning "Important"

    Please use this command with caution.
    It will empty your local `maven` cache. This is desirable when something 'strange' happens during the build process.
    Strange things can happen if a wrong version of remote or local repo is cached.
    
    Only use this command when you want to start with a clean slate for `maven`.
    All the dependencies will be downloaded from remote repos afterwards (and cached locally), resulting in an increased first build time. 

