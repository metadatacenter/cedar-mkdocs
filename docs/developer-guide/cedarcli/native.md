# Native Development

Native mode runs CEDAR directly from the checked-out source and locally built artifacts. It gives
backend developers a short build-and-restart loop and lets frontend developers use the normal
development servers.

Complete the [Developer Install](../../install-developer/overview/) before using this mode. It
provides the host tools and services that a native deployment expects.

## Start CEDAR

Select native mode, build the source, and start the complete system:

```bash
cedarcli mode native
cedarcli build java
cedarcli build frontends
cedarcli native start all
```

Check that the applications and their supporting services are ready:

```bash
cedarcli native status
```

The grouped status table is the authoritative native view. For microservices and frontends it shows
the managed PID, application port and listener state, health, binary freshness, and cumulative log
error count. Infrastructure rows show their configured ports and availability in the same table.
A healthy service whose `Binary` value is `STALE` is still running an older JAR; restart it before
trusting a smoke test. A PID prefixed with `~` is a verified but unmanaged CEDAR process that restart
can adopt, while `!` marks a foreign listener that native control will not touch.

For scripts and CI checks, `cedarcli native health` provides a simple success or failure result for
the managed application tier. During an interactive startup, `cedarcli native watch` keeps the
lower-level process view current.

## Work on One Part

You rarely need to restart the complete system after every edit. Native start and stop commands
accept broad targets:

| Target | Scope |
| --- | --- |
| `infra` | Infrastructure services |
| `microservices` | All Java microservices |
| `backends` | Infrastructure and microservices |
| `frontends` | All frontend development servers |
| `keycloak` or `kk` | Keycloak only |
| `all` | The complete native system |

The singular forms operate on one frontend or microservice:

```bash
cedarcli native start frontend workspace
cedarcli native start microservice resource
```

After changing one backend repository, the normal loop is:

```bash
cd "$CEDAR_HOME/cedar-resource-server"
cedarcli build this
cedarcli native restart resource
cedarcli native logs resource
```

Frontend development servers usually rebuild source changes automatically. Restart one when its
dependencies or process configuration have changed:

```bash
cedarcli native restart workspace
```

## Stop CEDAR

Stop a group with the same target used to start it, or stop everything:

```bash
cedarcli native stop frontends
cedarcli native stop all
```

Leave native mode selected during ordinary stop and restart cycles. Clear it only when moving to a
different deployment mode.
