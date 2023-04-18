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
cd ${CEDAR_HOME}/cedar-development/os-mirror/development-macos/CEDAR_HOME/keycloak/
${CEDAR_KEYCLOAK_HOME}/bin/kc.sh \
  import \
  --file keycloak-realm.CEDAR.development.2023-03-23.json
```

Please monitor the log output for anomalies. Not that this importation process can take several minutes so please wait until it has finished.

Once the logs stopped, you should see the following line:
```
YYYY-mm-dd HH:MM:SS,SSS INFO  [io.quarkus] (main) Keycloak stopped in X.XXXs
``` 

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

    If at any moment you need to back up your realm, and you do not wish or cannot perform a full database export, you can export the realm as a JSON file.

    This file will contain your realm settings, your users, roles and credentials.

    It will not contain any logs or historical data.
    
    To export the file, you will need to stop `Keycloak`, export the data, and then start it again. 

    ```sh
    killkk
    ```
    ```sh
    ${CEDAR_KEYCLOAK_HOME}/bin/kc.sh export \
      --realm CEDAR \
      --users realm_file \
      --file ${CEDAR_HOME}/keycloak-realm.CEDAR.development.<YOUR-DATE-HERE>.json
    ```

    ```sh
    startkk
    ```
 
