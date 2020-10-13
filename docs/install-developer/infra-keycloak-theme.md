# Install CEDAR Keycloak theme

Keycloak lets user customize the register/login experience by allowing to override the default theme.

The CEDAR Keycloak theme can be found in the `${CEDAR_HOME}/cedar-util/keycloak/themes/cedar-03` directory.

## Copy the theme files

```sh
mkdir ${CEDAR_KEYCLOAK_HOME}/themes/cedar-03/
cp -r ${CEDAR_HOME}/cedar-util/keycloak/themes/cedar-03/* \
  ${CEDAR_KEYCLOAK_HOME}/themes/cedar-03/
``` 
