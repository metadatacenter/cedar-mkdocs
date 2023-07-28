# Microservices

The microservices group provides the REST endpoints for CEDAR. 

## Start microservices

```sh
cedarcli docker start microservices
```

## Check microservices

```sh
cedarcli status
```

You should see all the services in the `Microservices` (1st) block in `Running` status.

If this is not the case, please stop the microservices using one of these ways:

* with the `cedarcli docker stop microservices` command from another console
* with a single ++ctrl++ + C form the active console.

Then please try running them again. If this does not help, please analyze the output for indications of what went wrong.

## Stop microservices

```sh
cedarcli docker stop microservices
```
