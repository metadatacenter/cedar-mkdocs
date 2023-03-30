# Configure Keycloak

In order for Keycloak to use MySQL database, use right certificates and host name, please copy the pre-packaged config file over the existing one:
```sh
mv ${CEDAR_KEYCLOAK_HOME}/conf/keycloak.conf ${CEDAR_KEYCLOAK_HOME}/conf/keycloak.conf.original
cp ${CEDAR_HOME}/cedar-development/os-mirror/development-macos/CEDAR_HOME/keycloak/conf/keycloak.conf ${CEDAR_KEYCLOAK_HOME}/conf/. 
```
