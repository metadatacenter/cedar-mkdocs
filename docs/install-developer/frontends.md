# Start the Native Frontends

The native frontend processes compile and serve checked-out source, which makes them suitable for
interactive development. nginx remains the public entry point: the browser uses CEDAR's HTTPS
hostnames, and nginx routes each request to the appropriate local frontend or backend service.

No frontend files are copied into nginx.

## Build the Frontends

With the infrastructure and initialized backend from the preceding pages running, execute the
full frontend reactor:

```bash
cedarcli build frontends
```

This builds current local component and application sources, runs the applicable unit, integration,
browser and visual checks, deploys the frontends, verifies the served component bytes, and runs
whole-stack smoke. Development builds have Maven-like SNAPSHOT semantics: uncommitted component
changes flow into every consumer without publication, manual dependency updates or extra approval.
Deployment installs missing or stale dependencies in the live frontend checkouts automatically
before applying the built components; there is no separate first-install npm step.

Run it after component or dependency changes and after pulling coordinated frontend updates.
Matching earlier passing checks are reused automatically; `--no-reuse` forces every check to run.
Use `cedarcli test frontends` when only the build and checks are wanted. That command does not
deploy or start the frontends.

## Start the Frontend Tier

The full reactor already starts the frontends. On a later visit, start an already-built and
configured installation with:

```bash
cedarcli native start all
cedarcli native status
```

The process controller records PIDs under `$CEDAR_HOME/log/run` and writes each application's output
under `$CEDAR_HOME/log`. It does not open terminal windows.

The browser-facing applications are:

| Application | URL |
| --- | --- |
| CEDAR | `https://cedar.metadatacenter.orgx` |
| Workspace | `https://workspace.metadatacenter.orgx` |
| Template Designer | `https://designer.metadatacenter.orgx` |
| OpenView | `https://openview.metadatacenter.orgx` |
| Content | `https://content.metadatacenter.orgx` |
| Monitoring | `https://monitoring.metadatacenter.orgx` |
| Bridging | `https://bridging.metadatacenter.orgx` |

## Log In and Verify the Installation

Open `https://cedar.metadatacenter.orgx` and log in. A reset development installation provides
`test1@test.com` with password `test1` and `test2@test.com` with password `test2`.

Open a folder, create or edit a template, and open a metadata instance. That path exercises shared
authentication, frontend routing, and the main backend APIs rather than merely proving that a page
can be downloaded.

Once the complete native stack is running, require every managed application to be healthy:

```bash
cedarcli native health
```

For a frontend problem, follow the relevant managed log. Every frontend is named `ui-<name>`, which
keeps it apart from the like-named microservice:

```bash
cedarcli native logs ui-main
cedarcli native logs ui-openview
cedarcli native logs ui-content
```

Stop all frontend processes without disturbing the backend with:

```bash
cedarcli native stop frontends
```
