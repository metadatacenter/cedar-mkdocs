# MySql
CEDAR uses `MySql` as the backend for Keycloak as well as storage for messages and logs.

## Install MySql

Please install `MySql`, version 5.7:

```sh
brew install mysql@5.7
```

And pin this version:

```sh
brew pin mysql@5.7
```
    
???+ warning "Important"

    Do not add MySql as a background service! We will have scripts in place which will start it when necessary.

## Start MySql
```sh
startmysql
```

## Check MySql status
```sh
cedarss
```

You should see the following line in the output:
```
| MySQL                      | Running | openPort    | 3306|                   |
```

## Secure MySql server
```sh
$(brew --prefix)/Cellar/mysql@5.7/5.7.<minor_version>/bin/mysql_secure_installation
```

If you get a 'Column count' error, you will need to run the following command first:

```sh
sudo $(brew --prefix)/Cellar/mysql@5.7/5.7.<minor_version>/bin/mysql_upgrade
```

Respond to the questions as follows:

| Question                                          | Answer   |
|---------------------------------------------------|----------|
| Would you like to setup VALIDATE PASSWORD plugin? | N        |
| New password:                                     | changeme |
| Re-enter new password:                            | changeme |
| Remove anonymous users?                           | Y        |
| Disallow root login remotely?                     | Y        |
| Remove test database and access to it?            | Y        |
| Reload privilege tables now?                      | Y        |

## Create CEDAR application users
Connect to the running MySql server

```sh
$(brew --prefix)/Cellar/mysql@5.7/5.7.<minor_version>/bin/mysql -uroot -p
```

Execute the below three groups of statements in order to create MySql databases and corresponding users for the different components of CEDAR: 
```sql
CREATE DATABASE IF NOT EXISTS `cedar_keycloak`;
CREATE USER 'cedarMySQLKeycloakUser'@'localhost' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON cedar_keycloak.* TO 'cedarMySQLKeycloakUser'@'localhost';
```

```sql
CREATE DATABASE IF NOT EXISTS `cedar_messaging`;
CREATE USER 'cedarMySQLMessagingUser'@'localhost' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON cedar_messaging.* TO 'cedarMySQLMessagingUser'@'localhost';
```

```sql
CREATE DATABASE IF NOT EXISTS `cedar_log`;
CREATE USER 'cedarMySQLLogUser'@'localhost' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON cedar_log.* TO 'cedarMySQLLogUser'@'localhost';
```
Flush privileges and quit:

```sql
FLUSH PRIVILEGES;
quit
```
