# Components

## Overview

The 20+ services that make up the CEDAR ecosystem are grouped in three categories:

| Group          | cedarcli group name  |
| -----------    |----------------------|
| Infrastructure | nfrastructure        |
| Microservices  | microservices        |
| Frontend       | frontend             |

We have `docker-compose` files for each of these groups.
The services can be started one-by-one, but we suggest starting them in groups.

Starting a given group the first time will build the all the Docker images, and will start the corresponding `docker-compose` file.

This can take around 5-10 minutes with an everyday internet connection.

Starting a given group the second time will use the preexisting Docker images and containers, leading to a faster startup. 

### Build & run

You should start each group in their own shell window, to be able to monitor the output separately:

```sh
cedarcli docker start <GROUPNAME>
```

### Wait & debug

The system components have interdependencies.
This means that after all the docker images are built, all the docker containers are started, some of them will wait for others before starting their internal components.

For instance `Keycloak` will wait for `MySql` to start first. 

This also applies to microservices, which have a start order. 
    
???+ warning "Important"

    Please allow the script to run until the output stabilizes.
    
    You will see some red text in the output. Please note that some of this red text is normal. Even some warnings are expected.
    
    However, if the console does not stabilize after a while, please scroll back, and try to analyze the error messages.

### Stop a service group

You can press a single ++ctrl++ + C to stop a `docker-compose` group gracefully.

Or you can, from a different shell, stop the group with the stop command:

```sh
cedarcli docker stop <GROUPNAME>
```

## Infrastructure services

The infrastructure group provides the backend for CEDAR. 

### Start infra services

```sh
cedarcli docker start infrastructure
```

### Check infra services

```sh
cedarcli status
```

You should see all the services in the `Infrastructure` (2nd) block in `Running` status.

If this is not the case, stop the infrastructure services using one of these ways:

* with the `cedarcli docker stop infrastructure` command from another console
* with a single ++ctrl++ + C form the active console.

Then please try running them again. If this does not help, please analyze the output for indications of what went wrong.

### Stop infra services

```sh
cedarcli docker stop infrastructure
```

## Microservices

The microservices group provides the REST endpoints for CEDAR. 

### Start microservices

```sh
cedarcli docker start microservices
```

### Check microservices

```sh
cedarcli status
```

You should see all the services in the `Microservices` (1st) block in `Running` status.

If this is not the case, please stop the microservices using one of these ways:

* with the `cedarcli docker stop microservices` command from another console
* with a single ++ctrl++ + C form the active console.

Then please try running them again. If this does not help, please analyze the output for indications of what went wrong.

### Stop microservices

```sh
cedarcli docker stop microservices
```

## Frontends

The frontends group provides the four frontends for CEDAR (main CEDAR, OpenView, Monitoring and Bridging). 

### Start frontends

```sh
cedarcli docker start frontends
```

### Check frontend

```sh
cedarcli status
```

You should see all the services in the `Front End` (4th) block in `Running` status.

If this is not the case, please stop the frontend using one of these ways:

* with the `cedarcli docker stop frontends` command from another console
* with a single ++ctrl++ + C form the active console.

Then please try running them again. If this does not help, please analyze the output for indications of what went wrong.

### Stop frontend

```sh
cedarcli docker stop frontends
```

## Docker commands

While starting, stopping and evaluating CEDAR Docker, you could meet issues with the Docker images and containers.

Sometimes you could need to delete Docker resources (volumes, images, containers) in order to create/build them again.

To do so, we have a set of utility scripts that can help you:

### Docker Containers

List the containers using:
```sh
docker ps -a
```

Remove the CEDAR-related containers using:
```sh
cedarcli docker remove containers
```

### Docker Volumes

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

### Docker Images

List the images using:
```sh
docker images
```

Remove the CEDAR-related images using:
```sh
cedarcli docker remove images
```

### Docker Networks

List the networks using:
```sh
docker network list
```

Remove the CEDAR network using:
```sh
cedarcli docker remove network 
```

### Remove all CEDAR-related Docker artifacts

Remove all CEDAR from Docker using:
```sh
cedarcli docker remove all 
```
