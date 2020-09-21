# Keycloak
CEDAR uses `Keycloak` as the authentication provider for the frontend and microservices.
This allows CEDAR to offer Social Login (`Google`, `Github`), and to integrate with other Authentication Providers as well.

Installing Keycloak is relatively easy, but to set it up properly is relatively tedious.
So instead of describing all the steps, we will provide an easier way to achieve the same results.

## Download Keycloak

Please install `MongoDB-Community, version 3.4`:

```sh
brew install mongodb-community@3.4
```

???+ warning "Important"
    
    Do not add MongoDB as a background service! We will have scripts in place which will start it when necessary.

    **Do not start MongoDB at this point!**



Please install `MySql version 5.7`:

```sh
brew install mysql@5.7
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
/usr/local/Cellar/mysql@5.7/5.7.31/bin/mysql_secure_installation
```

Respond to the questions as follows:

| Question                 | Answer |
| -----------                  | ----------- |
|Would you like to setup VALIDATE PASSWORD plugin?  | N|
|New password:            | changeme|
|Re-enter new password:   | changeme|
|Remove anonymous users?  | Y|
|Disallow root login remotely?  | Y|
|Remove test database and access to it?  | Y|
|Reload privilege tables now?            | Y|

## Create CEDAR application users
Connect to the running MySql server

```sh
/usr/local/Cellar/mysql@5.7/5.7.31/bin/mysql -uroot -p
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
