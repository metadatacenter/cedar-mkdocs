# Start the Native Frontends

The native frontend processes compile and serve checked-out source, which makes them suitable for
interactive development. nginx remains the public entry point: the browser uses CEDAR's HTTPS
hostnames, and nginx routes each request to the appropriate local frontend or backend service.

No frontend files are copied into nginx.

## Build the Frontends

Prepare the frontend dependencies and builds:

```bash
cedarcli build frontends
```

Run this after a fresh checkout, after dependency changes, or after pulling coordinated frontend
updates. Normal source edits are handled by the frontend development servers while they run.

## Start the Frontend Tier

Start every native frontend as a managed background process:

```bash
cedarcli native start frontends
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

For a frontend problem, follow the relevant managed log. The auxiliary Angular applications use a
`ui-` prefix:

```bash
cedarcli native logs workspace
cedarcli native logs designer
cedarcli native logs ui-openview
```

Stop all frontend processes without disturbing the backend with:

```bash
cedarcli native stop frontends
```
