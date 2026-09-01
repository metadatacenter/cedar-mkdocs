# Selecting a Deployment Mode

CEDAR can run entirely on the host, entirely in Docker, or as a mixture of the two. The mode tells
cedarcli which arrangement you intend to operate. This prevents native and Docker services from
competing for the same ports or being stopped by the wrong command.

| Mode | What Runs Natively | What Runs in Docker |
| --- | --- | --- |
| `native` | The complete CEDAR system | Nothing |
| `hybrid` | The seven frontend development servers | Infrastructure and microservices |
| `docker` | Nothing | The complete CEDAR system |

## Select a Mode

Choose one mode before using native or Docker commands:

```bash
cedarcli mode native --profile develop
```

```bash
cedarcli mode hybrid --profile develop
```

```bash
cedarcli mode docker
```

Native and hybrid modes require `--profile develop|server`; there is no inferred default.
`develop` is the workstation environment: it builds and serves frontends locally and permits the
TLS exception needed for local `.orgx` certificates. `server` is the staging/production
environment: it uses served frontend payloads, verifies certificates, and rejects placeholder
server secrets. Docker runs no native applications and therefore takes no profile.

Running `cedarcli mode native` or `cedarcli mode hybrid` without the profile fails and records
nothing. Selecting a complete mode starts nothing. It checks that the requested arrangement and
profile are configured, verifies that they do not conflict with services already running, records
both values in `$CEDAR_HOME/.cedar/mode.json`, and loads that environment automatically for later
commands.

See the current mode and its important settings with:

```bash
cedarcli mode
cedarcli env status
```

`cedarcli mode` with no mode argument only reports the current selection and recorded profile; it
does not reconfigure the machine.

## Change Modes

Stop the current deployment before selecting another mode. For example, to move from native to
Docker:

```bash
cedarcli native stop all
cedarcli mode --clear
cedarcli mode docker
```

Hybrid has both native and Docker components, so stop both:

```bash
cedarcli native stop frontends
cedarcli docker stop all
cedarcli mode --clear
```

The clear command refuses to forget a deployment that is still running. If Docker has already been
deliberately shut down, `cedarcli mode --clear --force` can discard the inactive Docker record. It
does not stop containers and should not be used as a substitute for a normal shutdown.

The next three chapters show how to work within each mode.
