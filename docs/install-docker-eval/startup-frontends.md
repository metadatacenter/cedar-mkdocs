# Frontends

The frontends group provides the four frontends for CEDAR (main CEDAR, OpenView, Monitoring and Bridging). 

## Start frontends

```sh
cedarcli docker start frontends
```

## Check frontend

```sh
cedarcli status
```

You should see all the services in the `Front End` (4th) block in `Running` status.

If this is not the case, please stop the frontend using one of these ways:

* with the `cedarcli docker stop frontends` command from another console
* with a single ++ctrl++ + C form the active console.

Then please try running them again. If this does not help, please analyze the output for indications of what went wrong.

## Stop frontend

```sh
cedarcli docker stop frontends
```
