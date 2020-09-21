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
```
