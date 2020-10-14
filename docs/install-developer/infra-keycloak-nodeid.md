# Change node identifier

## Change `nodeid`

```sh
vi ${CEDAR_KEYCLOAK_HOME}/standalone/configuration/standalone.xml
``` 

Around `Line #489` locate the following line:

```xml
<core-environment node-identifier="${jboss.tx.node.id:1}">
``` 

Change it into:

```xml
<core-environment node-identifier="cedar-keycloak">
``` 

