# Add MySql support

The factory setting for `Keycloak` is to use an embedded database.
We want to have a scalable, manageable database under `Keycloak`. 
We will use `MySql` for this purpose. We will need to add support for MySql by installing the `JDBC` driver. 

## Download MySql `JDBC driver`

Please install `Connector/J, version 5.1.49`:

Download the package from the distribution site:

```sh
gocedar
wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.49.tar.gz
```

???+ success "Alternative download"

    Alternatively, you could download the `JDBC` driver your browser, navigating to
    [https://dev.mysql.com/downloads/connector/j/5.1.html](https://dev.mysql.com/downloads/connector/j/5.1.html).
    
    Please save the archive into `CEDAR_HOME` if you choose this method/
    
    Please note, that the Download page offers the option to *Login* or *Sign Up* to download the driver.
    Although you can do that if you choose so, the driver is downloadable by clicking the *'No thanks, just start my download'* link lower on the page.

## Unpack the driver

```sh
gocedar
tar -xvf mysql-connector-java-5.1.49.tar.gz
rm mysql-connector-java-5.1.49.tar.gz
```

## Move the driver under `Keycloak`

```sh
gocedar
mkdir -p ${CEDAR_KEYCLOAK_HOME}/modules/system/layers/base/com/mysql/jdbc/main/
mv mysql-connector-java-5.1.49/mysql-connector-java-5.1.49.jar ${CEDAR_KEYCLOAK_HOME}/modules/system/layers/base/com/mysql/jdbc/main/
rm -rf mysql-connector-java-5.1.49
```

## Add a module descriptor

You will need to add a module descriptor in order for `JBoss` to use the `JDBC` driver 

```sh
vi ${CEDAR_KEYCLOAK_HOME}/modules/system/layers/base/com/mysql/jdbc/main/module.xml
```

Paste the following code into this new file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<module xmlns="urn:jboss:module:1.0" name="com.mysql.jdbc">
   <resources>
      <resource-root path="mysql-connector-java-5.1.49.jar"/>
   </resources>
   <dependencies>
      <module name="javax.api"/>
      <module name="javax.transaction.api"/>
   </dependencies>
</module>
```

## Edit Keycloak configuration

We will need to edit the configuration file to add a new datasource.

```sh
vi ${CEDAR_KEYCLOAK_HOME}/standalone/configuration/standalone.xml
``` 

### Add `driver`

Around `Line #132` you will see a `<datasources>` element, containing two `<datasource>`-es and a `<drivers>` element with one `<driver>`.

After the `driver` on `Line #156` add this block to enable the just added `MySql JDBC` driver:

```xml
<driver name="mysql" module="com.mysql.jdbc">
    <xa-datasource-class>com.mysql.jdbc.jdbc2.optional.MysqlXADataSource</xa-datasource-class>
</driver>
``` 

???+ success "Indent in config file"

    We are presenting the config blocks without leading whitespace for the readability of this section.
    
    When you add these blocks to the config file, please indent them according to the context, to improve config file readability. 


### Add `datasource`

Then after the datasources, before the drivers on `Line #152` add the new `MySql` datasource:

```xml
<datasource jndi-name="java:jboss/datasources/CedarKeycloakDS" pool-name="CedarKeycloakDS" enabled="true" use-java-context="true" use-ccm="true">
    <connection-url>jdbc:mysql://${env.CEDAR_KEYCLOAK_MYSQL_HOST}:${env.CEDAR_KEYCLOAK_MYSQL_PORT}/${env.CEDAR_KEYCLOAK_MYSQL_DB}?useSSL=false</connection-url>
    <driver>mysql</driver>
    <pool>
        <flush-strategy>IdleConnections</flush-strategy>
    </pool>
    <security>
        <user-name>${env.CEDAR_KEYCLOAK_MYSQL_USER}</user-name>
        <password>${env.CEDAR_KEYCLOAK_MYSQL_PASSWORD}</password>
    </security>
    <validation>
        <check-valid-connection-sql>SELECT 1</check-valid-connection-sql>
        <background-validation>true</background-validation>
        <background-validation-millis>60000</background-validation-millis>
    </validation>
</datasource>
```

### Change JPA datasource

Around `Line #555` locate the following line configuring the `JPA` connection: 

```xml
<property name="dataSource" value="java:jboss/datasources/KeycloakDS"/>
```

Please change this into:

```xml
<property name="dataSource" value="java:jboss/datasources/CedarKeycloakDS"/>
```
