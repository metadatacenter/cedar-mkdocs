# Verify the Docker Deployment

## Check That the Containers Are Ready

Before opening CEDAR in a browser, check that every application container has started and passed
its health check:

```bash
cedarcli docker status
```

For a full deployment, the expected result is 29 healthy containers followed by successful
authentication and frontend-route checks. `hybrid` and `backend` modes expect 22 containers;
hybrid additionally checks the seven routes served by native frontend processes.

## Open CEDAR in Your Browser

CEDAR provides several browser applications, each at its own local HTTPS address. Those addresses
all resolve to your computer, where the infrastructure nginx container is the single public entry
point for the Docker deployment.

For example, a request to `https://workspace.metadatacenter.orgx` reaches nginx on port 443. Nginx
handles the HTTPS connection, recognizes the `workspace` hostname, and forwards the request across
the private `cedarnet` Docker network to the Workspace frontend container. That container returns
the HTML, JavaScript, and other files that your browser displays. Authentication and API requests
from the application also return through the public nginx entry point to the appropriate backend
containers. The frontend containers themselves do not need public ports.

You can open any of the seven browser applications directly:

| Application | URL |
| --- | --- |
| Main editor | [https://cedar.metadatacenter.orgx/](https://cedar.metadatacenter.orgx/) |
| Workspace | [https://workspace.metadatacenter.orgx/](https://workspace.metadatacenter.orgx/) |
| Template Designer | [https://designer.metadatacenter.orgx/](https://designer.metadatacenter.orgx/) |
| OpenView | [https://openview.metadatacenter.orgx/](https://openview.metadatacenter.orgx/) |
| Content | [https://content.metadatacenter.orgx/](https://content.metadatacenter.orgx/) |
| Monitoring | [https://monitoring.metadatacenter.orgx/](https://monitoring.metadatacenter.orgx/) |
| Bridging | [https://bridging.metadatacenter.orgx/](https://bridging.metadatacenter.orgx/) |

## Log In to CEDAR

Start with [CEDAR Workspace](https://workspace.metadatacenter.orgx/). When you sign in, CEDAR sends
you to the local Keycloak service at `auth.metadatacenter.orgx`. After Keycloak accepts your
credentials, it returns you to Workspace.

The browser applications share that Keycloak session. For example, opening a template from
Workspace takes you to Template Designer without asking you to sign in again.

The local realm provides these accounts:

| Username | Password | Role |
| --- | --- | --- |
| `cedar-admin` | `Password123` | Power user with all available roles |
| `cadsr-admin` | `Password123` | Power user with category-administration roles |
| `my@user.com` | `my` | Regular user |
| `test1@test.com` | `test1` | Regular test user |
| `test2@test.com` | `test2` | Regular test user |

These credentials are for this local deployment only.

## Infrastructure URLs

| Component | URL | Local credentials |
| --- | --- | --- |
| Keycloak | [https://auth.metadatacenter.orgx/](https://auth.metadatacenter.orgx/) | `administrator` / `changeme` |
| Neo4j Browser | [http://localhost:7474/](http://localhost:7474/) | `neo4j` / `changeme` |

The admin-tool URLs are available only after starting the optional `admin` stack. Their ports come
from the active Docker profile: Redis Commander 8081, phpMyAdmin 8082, and Kibana 5601.
