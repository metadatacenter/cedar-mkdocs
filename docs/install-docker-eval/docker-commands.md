# Docker commands

While starting, stopping and evaluating CEDAR Docker, you could meet issues with the Docker images and containers.

Sometimes you could need to delete Docker resources (volumes, images, containers) in order to create/build them again.

To do so, we have a set of utility scripts that can help you:

## Docker Containers

List the containers using:
```sh
docker ps -a
```

Remove the CEDAR-related containers using:
```sh
cedarcli docker remove containers
```

## Docker Volumes

List the volumes using:
```sh
docker volume list 
```

Remove the CEDAR-related volumes using:
```sh
cedarcli docker remove volumes 
```

Or remove them one-by-one:
```sh
docker volume rm <volume_name>
```

## Docker Images

List the images using:
```sh
docker images
```

Remove the CEDAR-related images using:
```sh
cedarcli docker remove images
```

## Docker Networks

List the networks using:
```sh
docker network list
```

Remove the CEDAR network using:
```sh
cedarcli docker remove network 
```

## Remove all CEDAR-related Docker artifacts

Remove all CEDAR from Docker using:
```sh
cedarcli docker remove all 
```
