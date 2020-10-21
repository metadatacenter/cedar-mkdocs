# Set up CEDAR realm

Keycloak groups the settings and users of an organization under realms.

Setting up a realm is not trivial, so instead of guiding the user through the UI of Keycloak, we created a CEDAR realm that can be imported into Keycloak easily.

The CEDAR Keycloak realm can be found in the `${CEDAR_HOME}/cedar-util/keycloak/realm/` directory.

## Import CEDAR realm

You will need the `MySql` server running for this step. Check if it is already available using `cedarss`:

```sh
startmysql
cedarss
```

Importing a realm is done by starting `Keycloak` in the import mode
```sh
cd ${CEDAR_HOME}/cedar-util/keycloak/realm/
${CEDAR_KEYCLOAK_HOME}/bin/standalone.sh \
  -Dkeycloak.migration.action=import \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.file=keycloak-realm.CEDAR.development.20201020.json \
  -Dkeycloak.migration.strategy=IGNORE_EXISTING
```

Please monitor the log output for anomalies.

Once the logs stopped, and you see the following line:
```
HH:MM:SS,SSS INFO  [org.jboss.as] (Controller Boot Thread) WFLYSRV0051: Admin console listening on http://127.0.0.1:9990
``` 

please stop `Keycloak` using one ++ctrl++ + C.

## Start Keycloak in regular mode

You can start `Keycloak` from now on by executing:

```sh
startkk
```

## Check Keycloak status
```sh
cedarss
```

You should see the following line in the output:
```
| Keycloak                   | Running | httpResponse| 8080| HTTP/1.1\s200\sOK |
```


## Stop Keycloak

If you need to stop `Keycloak`, do that by:

```sh
killkk
```

The script starts with `kill` to emphasize that actually the process is killed.

## Export CEDAR realm

???+ success "Export CEDAR realm"

    If at any moment you need to back up your realm, and you do not wish or cannot perform a full database export, you can export the realm as a config file:

    This will contain your realm settings, your users, roles and credentials.

    This will not contain any logs or historical data.
    
    First, you will need to stop `Keycloak`, export the data, and then start it again. 

    ```sh
    killkk
    ```
    ```sh
    ${CEDAR_KEYCLOAK_HOME}/bin/standalone.sh \
      -Dkeycloak.migration.action=export \
      -Dkeycloak.migration.provider=singleFile \
      -Dkeycloak.migration.realmName=CEDAR \
      -Dkeycloak.migration.file=keycloak-realm.CEDAR.development.<YOUR-DATE-HERE>.json
    ```
    Stop `Keycloak` using one ++ctrl++ + C.
    ```sh
    startkk
    ```
 
