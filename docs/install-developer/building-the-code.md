# Getting and Building the Code

## Overview

The preferred way for the setup of CEDAR would be to first install the infrastructure services, and then proceed with CEDAR code.

However, there is a dependency, where a CEDAR `jar` needs to be installed under `Keycloak`.

In order to do the `Keycloak` installation and setup in one pass (instead of doing a partial setup, and later coming back to it again)
we chose to build the CEDAR code first, and then proceed with the infrastructure services.

We strongly recommend this approach, but the 'infra-first code-second' approach is also valid.

## Clone the project repos

CEDAR is composed of numerous  `git` repos. However, it is possible, it would be tedious to clone these repos one by one.
We have a utility script that does just that.  

### Clone the repos using `cedarcli`

```sh
cedarcli git clone all
```

This will clone all the repos that are needed for the CEDAR development. One warning will be thrown since we already cloned the `cedar-cli` repo manually.

### Checkout `develop` branch

```sh
cedarcli git checkout develop
```

This will check out the `develop` branch for all the CEDAR repos.

### Check the status of the repos

```sh
cedarcli check repos
```

Should render something similar:
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Repo/File/Dir                                    ┃ File Type ┃    Repo Type     ┃ Recognized as ┃ Status ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━┩
│ cedar-admin-tool                                 │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
│ cedar-artifact-library                           │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
│ cedar-artifact-server                            │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
│ cedar-artifact-viewer                            │  📁 dir   │     angular      │  CEDAR repo   │   ✅   │
│ cedar-artifacts                                  │  📁 dir   │      multi       │  CEDAR repo   │   ✅   │
│ cedar-artifacts/cedar-artifacts-dist             │  📁 dir   │   angular-dist   │  CEDAR repo   │   ✅   │
│ cedar-artifacts/cedar-artifacts-src              │  📁 dir   │     angular      │  CEDAR repo   │   ✅   │
│ cedar-bridge-server                              │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
...
│ cedar-util                                       │  📁 dir   │       misc       │  CEDAR repo   │   ✅   │
│ cedar-valuerecommender-server                    │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
│ cedar-worker-server                              │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
└──────────────────────────────────────────────────┴───────────┴──────────────────┴───────────────┴────────┘
                                         66 object/files recognized
```

## CEDAR Maven utils

During development you could take advantage if the following `maven`-related aliases:

You need to be in a directory with a `pom.xml` to take advantage of these aliases.

### Clean install skipTests 

```sh
mcit
#aliases to 'mvn clean install -DskipTests=true'
```

### Install skipTests 

```sh
mit
#aliases to 'mvn install -DskipTests=true'
```

### Clean install 

```sh
mci
#aliases to 'mvn clean install'
```

### Clean 

```sh
mcl
#aliases to 'mvn clean'
```

## Build CEDAR parent and libraries

The CEDAR parent repo sets the versions for the components used throughout the project. It is a pom-only project.
Before building CEDAR, you need to build this repo first.
Once built, you do not need to build it again, unless you change the `pom.xml`.

### Build the parent
Execute this from anywhere:
```sh
cedarcli build parent
```

The same can be achieved by a more down-to earth approach:
```sh
goparent
mcit
```

The above is a shorthand for the following, full version:
```sh
cd ${CEDAR_HOME}/cedar-parent
mvn clean install -DskipTests=true
```

Another way, useful in some cases:
```sh
goparent
cedarcli build this
```

### What are CEDAR Libraries

The CEDAR Libraries is a collection of common code used throughout the project.
This codebase is also helpful to write third-party projects that use CEDAR constants and common model classes.

### Build the libraries
Execute this from anywhere:
```sh
cedarcli build libraries
```
or 

```sh
golibraries
mcit
```

The above is a shorthand for the following, full version:

```sh
cd ${CEDAR_HOME}/cedar-libraries
mvn clean install -DskipTests=true
```

## Build CEDAR project

### Build the project
Execute this from anywhere:
```sh
cedarcli build project
```
or
```sh
goproject
mcit
```

The above is a shorthand for the following, full version:
 
```sh
cd ${CEDAR_HOME}/cedar-project
mvn clean install -DskipTests=true
```

???+ warning "Important"
    
    You can see that we are building the project by skipping the tests at this point.
   
    Running the tests is the preferred way of building, however at this point the underlying infrastructure is not ready, so the tests would definitely fail.

    Because of this, we will skip the tests this time.

## More CEDAR utils

Above, you could have seen some aliases that we are using to get around the CEDAR development environment.

A partial list of these aliases is listed below. For the full list, please inspect the `${CEDAR_DEVELOP_HOME}/bin/util/set-dev-aliases.sh` script file.

### Change to the parent project directory

```sh
goparent
# aliases to 'cd $CEDAR_HOME/cedar-parent'
```

### Change to the libraries directory

```sh
golibraries
# aliases to 'cd $CEDAR_HOME/cedar-libraries'
```

### Change to the CEDAR project directory

```sh
goproject
# aliases to 'cd $CEDAR_HOME/cedar-project'
```

### Clean `Maven` cache

```sh
cedarcli clean maven all
# performs to 'rm -rf ~/.m2/repository/'
```

???+ warning "Important"

    Please use this command with caution.
    It will empty your local `maven` cache. This is desirable when something 'strange' happens during the build process.
    Strange things can happen if a wrong version of remote or local repo is cached.
    
    Only use this command when you want to start with a clean slate for `maven`.
    All the dependencies will be downloaded from remote repos afterwards (and cached locally), resulting in an increased first build time.
