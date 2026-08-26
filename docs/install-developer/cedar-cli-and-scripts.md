# Operate Native CEDAR

`cedarcli` is the normal control surface for a native installation. It prepares the correct profile
for each command and delegates to CEDAR's process controller, which runs applications in the
background and writes their logs below `$CEDAR_HOME/log`.

You should not need a separate terminal window for every microservice or frontend.

## Start and Stop CEDAR

Start the complete native installation after its one-time configuration is finished:

```bash
cedarcli native start all
```

The aggregate starts infrastructure first, followed by the application processes. The matching
stop command reverses that ownership safely:

```bash
cedarcli native stop all
```

During development, operate only the part you are changing:

```bash
cedarcli native start infra
cedarcli native start microservices
cedarcli native start frontends

cedarcli native stop frontends
cedarcli native stop microservices
cedarcli native stop infra
```

`backends` combines infrastructure and microservices. A single frontend or microservice can also be
selected explicitly:

```bash
cedarcli native start backends
cedarcli native start frontend workspace
cedarcli native start microservice resource
```

The CLI refuses to stop a process merely because it occupies a familiar port. It first verifies
that the process belongs to the expected CEDAR checkout.

## See What Is Running

Use status for the broad view:

```bash
cedarcli native status
```

It reports managed application processes and the native host ports used by infrastructure. Use
health when a script or test needs a simple success or failure result for the complete managed
application tier:

```bash
cedarcli native health
```

For a continuously refreshed process view, run:

```bash
cedarcli native watch
```

## Restart and Inspect Applications

After rebuilding a service, restart it by its process name:

```bash
cedarcli native restart resource
```

Follow its managed log with:

```bash
cedarcli native logs resource
```

The same commands work with frontend process names such as `workspace`, `designer`, and
`ui-openview`.

## Use the Profile Outside `cedarcli`

`cedarcli` loads the native profile for its own commands. A few standalone maintenance tools still
depend on shell aliases and environment variables from that profile. Load it only in a shell where
you intend to use those tools:

```bash
source "$CEDAR_HOME/cedar-profile-native-develop.sh"
```

This is not required for routine `cedarcli` commands.

The [cedarcli Manual](../developer-guide/cedarcli/) covers repository work, build trains, hybrid and
Docker modes, publication, and less frequently used command groups.
