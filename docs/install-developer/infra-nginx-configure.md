# Configure nginx

Configuring `nginx` for CEDAR would involve a huge amount of editing.

Because of this, we provide ready-made config files that you will need to put in the 
proper place, and link them under the main `nginx` configuration.

Please follow these steps, and try to familiarize with the config file meaning. 

???+ success "nginx"

    Once configured, `nginx` will work without any further intervention.
    However, it will be useful to understand what it actually does for CEDAR.

???+ note "nginx config"

    The way of configuring `nginx` for CEDAR could be regarded as not totally aligning with the *nginx-way* (custom directory holding the configs).
    
    However, we decided to go this way for the readability and maintainability.

## Create `geo` module config

This module is meant to be used for geolocation configuration.
We use it in CEDAR to set boolean variable that later will have an effect on the main configuration.  

```sh
cp ${CEDAR_DEVELOP_HOME}/os-mirror/development-macos/usr/local/etc/nginx/cedar/module-geo.inc.conf \
  /usr/local/etc/nginx/cedar/.
```

## Create `ssl` include config

Each subdomain served by `nginx` communicates through `https`.
To do so, they need the private and public keys for the given domain.
We are using a single certificate that takes advantage of the `SAN` feature of the certificates.

We would need to include the same two lines in the config of each subdomain.
To prevent this, we describe the `ssl` config in one include file, which we reference from each subdomain config. 

```sh
cp ${CEDAR_DEVELOP_HOME}/os-mirror/development-macos/usr/local/etc/nginx/cedar/include-ssl.conf \
  /usr/local/etc/nginx/cedar/.
```

## Create subdomain config files

These files will configure the available subdomains one by one: 

```sh
cp ${CEDAR_DEVELOP_HOME}/os-mirror/development-macos/usr/local/etc/nginx/cedar/frontend-*.conf \
  /usr/local/etc/nginx/cedar/
cp ${CEDAR_DEVELOP_HOME}/os-mirror/development-macos/usr/local/etc/nginx/cedar/server-*.conf \
  /usr/local/etc/nginx/cedar/
```

## Create global settings for CEDAR domains

This config contains global settings:

```sh
cp ${CEDAR_DEVELOP_HOME}/os-mirror/development-macos/usr/local/etc/nginx/cedar/config-cedar-global.inc.conf \
  /usr/local/etc/nginx/cedar/
```

## Replace main `nginx` config file

At this step, we are replacing the factory default `nginx.conf` with one that serves purely CEDAR purposes.

If you had `nginx` running before, possibly with a custom config, please merge your config, and the one mentioned here.
 
```sh
cp ${CEDAR_DEVELOP_HOME}/os-mirror/development-macos/usr/local/etc/nginx/nginx.conf \
  /usr/local/etc/nginx/.
```

???+ warning "Important"
    
    Please observe, that the `nginx` config files do not contain any variable interpolation.
    This is due to `nginx` intentionally not supporting this easily (you need to configure it once painfully, but it will run fast forever).
    
    If for some reason your `CEDAR_HOME` is not `/Users/cedar-dev/CEDAR/`, please replace this value in all the config files with the proper value from your system.
    
    The same applies to `CEDAR_HOST`. If you are not configuring for `metadatacenter.orgx`, please replace this value in your config files as well. 
