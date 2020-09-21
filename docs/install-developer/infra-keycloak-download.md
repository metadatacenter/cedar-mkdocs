# Download Keycloak

We will download and unpack the `Keycloak` distribution.

## Download Keycloak

Please install `Keycloak, version 11.0.2`:

Download the package from the distribution site:

```sh
gocedar
wget https://downloads.jboss.org/keycloak/11.0.2/keycloak-11.0.2.tar.gz
```

???+ success "Alternative download"

    Alternatively, you could download Keycloak using your browser, navigating to
    [https://www.keycloak.org/downloads](https://www.keycloak.org/downloads).
    
    Please save the archive into `CEDAR_HOME` if you choose this method/

## Unpack and rename Keycloak

Once the package is downloaded, unpack it and rename it:

```sh
tar -xvf keycloak-11.0.2.tar.gz
mv keycloak-11.0.2 keycloak
```
