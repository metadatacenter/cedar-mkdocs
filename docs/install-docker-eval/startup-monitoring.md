# Monitoring

The monitoring group provides the optional monitoring services for CEDAR.

This includes `Redis Commander` and `Kibana`. 

## Start monitoring

```sh
startmonitoring
```

## Check monitoring

```sh
cedarss
```

You should see all the services in the `Monitoring` (3rd) block in `Running` status.

If this is not the case, please stop the monitoring using one of these ways:

* with the `stopmonitoring` command from another console
* with a single ++ctrl++ + C form the active console.

Then please try running them again. If this does not help, please analyze the output for indications of what went wrong.

## Stop monitoring

```sh
stopmonitoring
```
