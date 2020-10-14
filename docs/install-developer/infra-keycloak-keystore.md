# Generate keystore

Instead of the auto-generated `Keycloak` keystore, we wilkl generate our own before the first run. 

## Generate keystore

```sh
cd ${CEDAR_KEYCLOAK_HOME}/standalone/configuration/
keytool -genkey -alias auth.metadatacenter.orgx \
  -keyalg RSA -keystore cedar.keycloak.keystore -validity 3650
```

We will use the default `password` password for the keystore.

A list of questions will be shown, please answer them according to the following values:

| Question                 | Answer |
| -----------                  | ----------- |
|Enter keystore password:|password *(literally: 'password')*|
|Re-enter new password:|password|
|What is your first and last name?|auth.metadatacenter.orgx|
|What is the name of your organizational unit?|BMIR|
|What is the name of your organization?|MED|
|What is the name of your City or Locality?|Stanford|
|What is the name of your State or Province?|California|
|What is the two-letter country code for this unit?|US|
|Is CN=auth.metadatacenter.orgx, OU=BMIR, O=MED,<br> L=Stanford, ST=California, C=US correct?|yes|

A file will be generated at the location `${CEDAR_KEYCLOAK_HOME}/standalone/configuration/cedar.keycloak.keystore`

## Change the config file

```sh
vi ${CEDAR_KEYCLOAK_HOME}/standalone/configuration/standalone.xml
``` 

Around `Line #46` locate the line with the following content (there will be one long line without line breaks):

```xml
<keystore path="application.keystore" relative-to="jboss.server.config.dir"
  keystore-password="password" alias="server" key-password="password"
  generate-self-signed-certificate-host="localhost"/>
```

Change:

- `path` into `cedar.keycloak.keystore`,
- `alias` into `auth.metadatacenter.orgx`

resulting in:

```xml
<keystore path="cedar.keycloak.keystore" relative-to="jboss.server.config.dir"
  keystore-password="password" alias="auth.metadatacenter.orgx" key-password="password"
  generate-self-signed-certificate-host="localhost"/>
```
