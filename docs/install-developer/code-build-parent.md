# Build CEDAR parent

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
