# One-time setup

The following steps need to be executed once for a CEDAR Docker installation: 

## Create network

```sh
source ${CEDAR_DOCKER_DEPLOY}/bin/docker-create-network.sh
```

## Create volumes

```sh
source ${CEDAR_DOCKER_DEPLOY}/bin/docker-create-volumes.sh
```

## Copy certificates

```sh
source ${CEDAR_DOCKER_DEPLOY}/bin/docker-copy-certificates.sh
```
