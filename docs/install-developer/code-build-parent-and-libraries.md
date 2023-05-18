# Build CEDAR parent and libraries

The CEDAR parent repo sets the versions for the components used throughout the project. It is a pom-only project.
Before building CEDAR, you need to build this repo first.
Once built, you do not need to build it again, unless you change the `pom.xml`.

## Build the parent

```sh
goparent
mcit
```

The above is a shorthand for the following, full version:
 
```sh
cd ${CEDAR_HOME}/cedar-parent
mvn clean install -DskipTests=true
```

## What are CEDAR Libraries

The CEDAR Libraries is a collection of common code used throughout the project.
This codebase is also helpful to write third-party projects that use CEDAR constants and common model classes.

## Build the libraries

```sh
golibraries
mcit
```

The above is a shorthand for the following, full version:

```sh
cd ${CEDAR_HOME}/cedar-libraries
mvn clean install -DskipTests=true
```
