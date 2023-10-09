# Overview

The 20+ services that make up the CEDAR ecosystem are grouped in three categories:

| Group          | cedarcli group name  |
| -----------    |----------------------|
| Infrastructure | nfrastructure        |
| Microservices  | microservices        |
| Frontend       | frontend             |

We have `docker-compose` files for each of these groups.
The services can be started one-by-one, but we suggest following this guide, and starting them in groups.

Starting a given group the first time will build the all the Docker images, and will start the corresponding `docker-compose` file.

This can take around 5-10 minutes with an everyday internet connection.

Starting a given group the second time will use the preexisting Docker images and containers, leading to a faster startup. 

## Build & run

You should start each group in their own shell window, to be able to monitor the output separately:

```sh
cedarcli docker start <GROUPNAME>
```

## Wait & debug

The system components have interdependencies.
This means that after all the docker images are built, all the docker containers are started, some of them will wait for others before starting their internal components.

For instance `Keycloak` will wait for `MySql` to start first. 

This also applies to microservices, which have a start order. 
    
???+ warning "Important"

    Please allow the script to run until the output stabilizes.
    
    You will see some red text in the output. Please note that some of this red text is normal. Even some warnings are expected.
    
    However, if the console does not stabilize after a while, please scroll back, and try to analyze the error messages.

## Stop a service group

You can press a single ++ctrl++ + C to stop a `docker-compose` group gracefully.

Or you can, from a different shell, stop the group with the stop command:

```sh
cedarcli docker stop <GROUPNAME>
```
