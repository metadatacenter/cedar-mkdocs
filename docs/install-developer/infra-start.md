# Starting the infrastructure services

## Start the services

```sh
startinfra
```

## Check status

```sh
cedarcli status
```

You should see all the services in the `Infrastructure` (2nd) block in `Running` status.

If this is not the case, stop the infrastructure services using one of these ways:

* with the `stopinfra` command from another console
* with a single ++ctrl++ + C form the active console.

Then please try running them again. If this does not help, please analyze the output for indications of what went wrong.

## Stop infrastructure services

```sh
stopinfra
```
