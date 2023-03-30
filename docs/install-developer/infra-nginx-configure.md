# Configure nginx

Configuring `nginx` for CEDAR would involve a huge amount of editing.

Because of this, we provide ready-made config files that you will need to put in the 
proper place, and link them under the main `nginx` configuration.

???+ success "nginx"

    Once configured, `nginx` will work without any further intervention.
    However, it will be useful to understand what it actually does for CEDAR.

???+ note "nginx config"

    The way of configuring `nginx` for CEDAR could be regarded as not totally aligning with the *nginx-way* (custom directory holding the configs).
    
    However, we decided to go this way for the readability and maintainability.

## Copy config files and SSL certificates

```sh
cp -R ${CEDAR_DEVELOP_HOME}/os-mirror/development-macos/opt/homebrew/etc/nginx/ \
  $(brew --prefix)/etc/nginx/
```

## Replace user home folder if needed

???+ warning "Important"
    
    Please observe, that the `nginx` config files do not contain any variable interpolation.
    This is due to `nginx` intentionally not supporting this easily.
    
    If for some reason your `CEDAR_HOME` is not `/Users/cedar-dev/CEDAR/`, please replace this value in all the config files with the proper value from your system.

    ```sh
    cd $(brew --prefix)/etc/nginx/cedar/
    find . -type f -name '*.conf' -exec sed -i '' s/cedar-dev/YOUR_HOME_FOLDER_NAME_HERE/g {} +
    ```
