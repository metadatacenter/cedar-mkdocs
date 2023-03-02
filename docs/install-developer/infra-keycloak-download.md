# Download Keycloak

We will download and unpack the `Keycloak` distribution.

## Download Keycloak

Please install `Keycloak`, version 12.0.4:

Download the package from the distribution site:

```sh
gocedar
wget https://github.com/keycloak/keycloak/releases/download/12.0.4/keycloak-12.0.4.tar.gz
```

???+ success "Alternative download"

    Alternatively, you could download Keycloak using your browser, navigating to
    [https://www.keycloak.org/archive/downloads-12.0.4.html](https://www.keycloak.org/archive/downloads-12.0.4.html).
    
    Please save the archive into `CEDAR_HOME` if you choose this method/

## Unpack and rename Keycloak Directory

Once the package is downloaded, unpack it and rename it:

```sh
tar -xvf keycloak-12.0.4.tar.gz
mv keycloak-12.0.4 keycloak
rm keycloak-12.0.4.tar.gz
```
