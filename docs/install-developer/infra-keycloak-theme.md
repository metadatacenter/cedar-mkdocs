# Install CEDAR Keycloak theme

Keycloak lets user customize the registeration and login experience by allowing the default theme to be overridden.

The CEDAR Keycloak theme can be found in the `${CEDAR_HOME}/cedar-development/os-mirror/development-macos/CEDAR_HOME/keycloak/themes/cedar-03/` directory.

## Copy the theme files

```sh
mkdir ${CEDAR_KEYCLOAK_HOME}/themes/cedar-03/
cp -r ${CEDAR_HOME}/cedar-development/os-mirror/development-macos/CEDAR_HOME/keycloak/themes/cedar-03/* \
  ${CEDAR_KEYCLOAK_HOME}/themes/cedar-03/
``` 
