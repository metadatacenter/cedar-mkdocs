# Install the Native Infrastructure

Native CEDAR keeps its databases, search engine, authentication server, and public web router on
the Mac. This is the least automated part of the installation: `cedarcli` starts, stops, and checks
these services, but their initial databases and configuration still have to be created once.

The credentials below match the development defaults in `set-env-internal.sh`. Substitute your own
values consistently if you changed that file.

## Check the Locked Service Versions

The infrastructure versions are held separately from the frontend toolchain. Do not use a blanket
`brew install mysql redis opensearch` or `brew upgrade` to prepare a native CEDAR host: those
unversioned formulas now select different server releases. The retained native services are
MongoDB 5.0.31, Redis 7.2.7 and OpenSearch 2.19.1; Neo4j 5.26.0 and Keycloak 22.0.5 are installed
from explicit distributions below.

The official [MongoDB Homebrew tap](https://github.com/mongodb/homebrew-brew) no longer supplies
the 5.0 formula. A fresh native installation needs retained formulas/binaries and their matching
configuration. This guide does not yet provide a reproducible installer for that set. The
[Docker installation](../install-docker/overview/index.md) provides the packaged infrastructure;
[hybrid mode](../developer-guide/cedarcli/hybrid.md) supports native frontend development over it.

MySQL also needs an explicit decision on a new native host: Docker uses 8.4.11, while the audited
native workstation already runs 9.6.0. These are not interchangeable installations, and changing
an existing database's version is a separate migration. The native service controller currently
uses the `mysql` formula name.

The remaining steps assume the retained native Homebrew services and their service definitions
are available. Inspect the installed versions and existing protections first:

```bash
brew list --versions mongodb-community@5.0 mysql redis opensearch
brew list --pinned
brew install nginx
```

Once the intended server versions are installed, protect the available formulas with `brew pin`.
Pinning preserves an installed version; it does not install or downgrade to the required version.
CEDAR starts and stops the services through `cedarcli native start infra` and
`cedarcli native stop infra`.

## Configure MongoDB

MongoDB stores CEDAR artifacts and metadata instances. Start it temporarily for account creation:

```bash
brew services start mongodb-community@5.0
mongosh
```

Create the administrative account in the `admin` database and the CEDAR account in the `cedar`
database:

```javascript
use admin
db.createUser({
  user: "mongoRootUser",
  pwd: "changeme",
  roles: [{role: "root", db: "admin"}]
})

use cedar
db.createUser({
  user: "cedarMongoUser",
  pwd: "changeme",
  roles: [{role: "readWrite", db: "cedar"}]
})

exit
```

Enable authorization in `$(brew --prefix)/etc/mongod.conf`:

```yaml
security:
  authorization: enabled
```

Restart MongoDB and confirm that the CEDAR account can authenticate:

```bash
brew services restart mongodb-community@5.0
mongosh --username cedarMongoUser --password changeme --authenticationDatabase cedar cedar
```

Exit `mongosh` after the connection succeeds.

## Configure MySQL

MySQL stores Keycloak state, application messages, and CEDAR logs. Start it and connect as the
initial root user:

```bash
brew services start mysql
mysql -uroot
```

Create the three databases and their application accounts:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'changeme';

CREATE DATABASE IF NOT EXISTS cedar_keycloak;
CREATE USER IF NOT EXISTS 'cedarMySQLKeycloakUser'@'localhost' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON cedar_keycloak.* TO 'cedarMySQLKeycloakUser'@'localhost';

CREATE DATABASE IF NOT EXISTS cedar_messaging;
CREATE USER IF NOT EXISTS 'cedarMySQLMessagingUser'@'localhost' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON cedar_messaging.* TO 'cedarMySQLMessagingUser'@'localhost';

CREATE DATABASE IF NOT EXISTS cedar_log;
CREATE USER IF NOT EXISTS 'cedarMySQLLogUser'@'localhost' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON cedar_log.* TO 'cedarMySQLLogUser'@'localhost';

FLUSH PRIVILEGES;
quit
```

If MySQL already has a root password, connect with `mysql -uroot -p` and omit the `ALTER USER`
statement unless you deliberately want to replace it.

## Configure OpenSearch and Redis

OpenSearch provides artifact search. Set its cluster name in
`$(brew --prefix)/etc/opensearch/opensearch.yml`:

```yaml
cluster.name: opensearch_cedar
```

Redis needs no additional development configuration. Its persistent local instance is used for
CEDAR's queue and cache coordination.

OpenSearch 2.19 must also use JDK 17. Its Homebrew service inherits the launchd environment, so
set this before starting it:

```bash
launchctl setenv OPENSEARCH_JAVA_HOME "$(/usr/libexec/java_home -v 17)"
```

This setting lasts for the login session; arrange for it to run at login on a persistent native
installation. A newer Homebrew JDK selected implicitly can prevent OpenSearch from starting.

## Install Neo4j

Neo4j stores users, groups, categories, and permissions. The native scripts expect an unpacked
Neo4j distribution at `$CEDAR_HOME/neo4j` rather than a Homebrew service. Install the supported
community distribution:

```bash
cd "$CEDAR_HOME"
curl -LO https://dist.neo4j.org/neo4j-community-5.26.0-unix.tar.gz
tar -xzf neo4j-community-5.26.0-unix.tar.gz
mv neo4j-community-5.26.0 neo4j
```

Enable the bundled APOC procedures and set the development password before the first start:

```bash
mv "$CEDAR_HOME"/neo4j/labs/apoc-*-core.jar "$CEDAR_HOME/neo4j/plugins/"
printf '\ndbms.security.procedures.unrestricted=algo.*,apoc.*\n' \
  >> "$CEDAR_HOME/neo4j/conf/neo4j.conf"
"$CEDAR_HOME/neo4j/bin/neo4j-admin" dbms set-initial-password changeme
```

## Install Keycloak

Keycloak provides login and shared browser sessions. The native configuration is currently based
on Keycloak 22.0.5:

```bash
cd "$CEDAR_HOME"
curl -LO https://github.com/keycloak/keycloak/releases/download/22.0.5/keycloak-22.0.5.tar.gz
tar -xzf keycloak-22.0.5.tar.gz
mv keycloak-22.0.5 keycloak
```

Copy the supplied CEDAR configuration, realm, and login theme:

```bash
cp "$CEDAR_HOME/cedar-development/os-mirror/development-macos/CEDAR_HOME/keycloak/conf/keycloak.conf" \
  "$CEDAR_HOME/keycloak/conf/keycloak.conf"
cp "$CEDAR_HOME/cedar-development/os-mirror/development-macos/CEDAR_HOME/keycloak/keycloak-realm.CEDAR.development.2023-07-05.json" \
  "$CEDAR_HOME/keycloak/"
mkdir -p "$CEDAR_HOME/keycloak/themes/cedar-03"
cp -R "$CEDAR_HOME/cedar-development/os-mirror/development-macos/CEDAR_HOME/keycloak/themes/cedar-03/." \
  "$CEDAR_HOME/keycloak/themes/cedar-03/"
```

Edit `$CEDAR_HOME/keycloak/conf/keycloak.conf` so Keycloak uses the certificates generated on the
previous page:

```ini
https-certificate-file=${CEDAR_HOME}/CEDAR_CA/certs/auth.metadatacenter.orgx/auth.metadatacenter.orgx.crt
https-certificate-key-file=${CEDAR_HOME}/CEDAR_CA/certs/auth.metadatacenter.orgx/auth.metadatacenter.orgx.key
```

Load the profile for the one-time direct Keycloak commands, install the CEDAR event listener built
by `cedarcli build java`, and import the supplied realm:

```bash
export CEDAR_PROFILE=develop
source "$CEDAR_HOME/cedar-development/bin/templates/cedar-profile-native.sh"
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
cedarcli dev copy-keycloak-listener
"$CEDAR_HOME/keycloak/bin/kc.sh" import \
  --file "$CEDAR_HOME/keycloak/keycloak-realm.CEDAR.development.2023-07-05.json"
```

Create the initial Keycloak administrator on the first direct start:

```bash
KEYCLOAK_ADMIN="$CEDAR_KEYCLOAK_ADMIN_USER" \
KEYCLOAK_ADMIN_PASSWORD="$CEDAR_KEYCLOAK_ADMIN_PASSWORD" \
  "$CEDAR_HOME/keycloak/bin/kc.sh" start
```

Wait for Keycloak to finish starting, then stop it with ++ctrl++ + C. Future starts are managed by
`cedarcli`.

## Configure nginx

nginx is the public entry point for every native frontend and API. Copy the supplied routing
configuration into the Homebrew nginx directory:

```bash
cp -R "$CEDAR_HOME/cedar-development/os-mirror/development-macos/opt/homebrew/etc/nginx/." \
  "$(brew --prefix)/etc/nginx/"
```

The supplied configuration contains the example path `/Users/cedar-dev/CEDAR`. Replace it with the
actual `CEDAR_HOME` in every nginx configuration file:

```bash
find "$(brew --prefix)/etc/nginx" -type f -name '*.conf' \
  -exec sed -i '' "s|/Users/cedar-dev/CEDAR|$CEDAR_HOME|g" {} +
```

Install the certificates generated by `cedarcli` over the bundled development copies:

```bash
cp -R "$CEDAR_HOME/CEDAR_CA/certs/." \
  "$(brew --prefix)/etc/nginx/cedar/ssl/"
```

Validate the complete routing configuration before starting nginx:

```bash
sudo "$(brew --prefix)/bin/nginx" -t
```

nginx binds ports 80 and 443, so macOS will request administrator permission when `cedarcli` starts
or stops the native infrastructure.

## Start the Infrastructure

The one-time configuration is complete. Stop any services started directly during setup, then let
CEDAR take over their normal lifecycle:

```bash
brew services stop mongodb-community@5.0
brew services stop mysql
cedarcli native start infra
cedarcli native status
```

The infrastructure section of the status report should show nginx, MongoDB, MySQL, Redis,
OpenSearch, Neo4j, and Keycloak listening on their expected local ports. If one is absent, inspect
that service's startup output before continuing.
