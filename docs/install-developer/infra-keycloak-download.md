# Download Keycloak

We will download and unpack the `Keycloak` distribution.

## Download Keycloak

Please install `Keycloak`, version 22.0.5:

Download the package from the distribution site:

```sh
gocedar
wget https://github.com/keycloak/keycloak/releases/download/22.0.5/keycloak-22.0.5.tar.gz
```

???+ success "Alternative download"

    Alternatively, you could download Keycloak using your browser, navigating to
    [https://www.keycloak.org/archive/downloads-22.0.5.html](https://www.keycloak.org/archive/downloads-22.0.5.html).
    
    Please save the archive into `CEDAR_HOME` if you choose this method/

## Unpack and rename Keycloak Directory

Once the package is downloaded, unpack it and rename it:

```sh
tar -xvf keycloak-22.0.5.tar.gz
mv keycloak-22.0.5 keycloak
rm keycloak-22.0.5.tar.gz
```
