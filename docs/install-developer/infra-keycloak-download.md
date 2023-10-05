# Download Keycloak

We will download and unpack the `Keycloak` distribution.

## Download Keycloak

Please install `Keycloak`, version 21.0.1:

Download the package from the distribution site:

```sh
gocedar
wget https://github.com/keycloak/keycloak/releases/download/21.0.1/keycloak-21.0.1.tar.gz
```

???+ success "Alternative download"

    Alternatively, you could download Keycloak using your browser, navigating to
    [https://www.keycloak.org/archive/downloads-21.0.1.html](https://www.keycloak.org/archive/downloads-21.0.1.html).
    
    Please save the archive into `CEDAR_HOME` if you choose this method/

## Unpack and rename Keycloak Directory

Once the package is downloaded, unpack it and rename it:

```sh
tar -xvf keycloak-21.0.1.tar.gz
mv keycloak-21.0.1 keycloak
rm keycloak-21.0.1.tar.gz
```
