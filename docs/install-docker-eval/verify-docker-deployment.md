# Verify the Docker Deployment

## Confirm Runtime Health

Before opening a browser, require the complete Docker estate:

```bash
cedarcli docker status
```

The expected result is `29/29 required Docker services are ready`.

## Frontend URLs

All browser traffic enters through the infrastructure nginx container. The seven frontend
applications are:

| Application | URL |
| --- | --- |
| Main editor | [https://cedar.metadatacenter.orgx/](https://cedar.metadatacenter.orgx/) |
| Workspace | [https://workspace.metadatacenter.orgx/](https://workspace.metadatacenter.orgx/) |
| Template Designer | [https://designer.metadatacenter.orgx/](https://designer.metadatacenter.orgx/) |
| OpenView | [https://openview.metadatacenter.orgx/](https://openview.metadatacenter.orgx/) |
| Content | [https://content.metadatacenter.orgx/](https://content.metadatacenter.orgx/) |
| Monitoring | [https://monitoring.metadatacenter.orgx/](https://monitoring.metadatacenter.orgx/) |
| Bridging | [https://bridging.metadatacenter.orgx/](https://bridging.metadatacenter.orgx/) |

Verify the public routes without logging in:

```bash
for host in cedar workspace designer openview content monitoring bridging; do
  curl -sk -o /dev/null -w "$host %{http_code}\n" \
    "https://${host}.metadatacenter.orgx/"
done
```

Every route should return HTTP 200. Then log into Workspace, open a folder, and open a template in
Designer. This checks the split-frontend navigation and shared Keycloak session as well as static
page delivery.

## Evaluation Users

The checked-in evaluation realm contains these non-production accounts:

| Username | Password | Role |
| --- | --- | --- |
| `cedar-admin` | `Password123` | Power user with all available roles |
| `cadsr-admin` | `Password123` | Power user with category-administration roles |
| `my@user.com` | `my` | Regular user |
| `test1@test.com` | `test1` | Regular test user |
| `test2@test.com` | `test2` | Regular test user |

These credentials are for a local evaluation deployment only.

## Infrastructure URLs

| Component | URL | Evaluation credentials |
| --- | --- | --- |
| Keycloak | [https://auth.metadatacenter.orgx/](https://auth.metadatacenter.orgx/) | `administrator` / `changeme` |
| Neo4j Browser | [http://localhost:7474/](http://localhost:7474/) | `neo4j` / `changeme` |

The admin-tool URLs are available only after starting the optional `admin` stack. Their ports come
from the active Docker profile: Redis Commander 8081, phpMyAdmin 8082, and Kibana 5601.
