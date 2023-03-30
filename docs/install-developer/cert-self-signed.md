# Copy self-signed certificates

We are using self-signed certificates for the local development.

Instead of generating these, we are reusing the pre-created self-signed certificates.

## Copy the certificates to working location

```sh
mkdir ${CEDAR_HOME}/CEDAR_CA
cp -R ${CEDAR_HOME}/cedar-development/os-mirror/development-macos/CEDAR_HOME/CEDAR_CA/ ${CEDAR_HOME}/CEDAR_CA
```

???+ warning "Important"
    
    Keep this folder, and its contents intact. You will need these certificates at several points of the installation.
