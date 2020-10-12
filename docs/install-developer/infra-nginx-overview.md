# Overview

Nginx acts as a reverse proxy in front of all CEDAR microservices, frontends, and Keycloak.

As such, each request to CEDAR arrives to `nginx` on the standard `443` `https` port.
Based on the subdomain in the request, `nginx` will forward the request to one of the components.
`Nginx` talks on plain `http` with all the microservices and the frontends.
`Nginx` connects to `Keycloak` using `https`.

## List of services behind `nginx`
This table summarizes the services that are proxied by `nginx`.
The microservices are ordered in increasing `port` number order, which shows the evolution of CEDAR.

The frontend is delivered differently during development than on production.

???+ success "List of services"

    The table is provided for better understanding of the infrastructure, it is not required for the installation process. 


| Subdomain / <br> repo name | Service type        | Upstream / content on `dev`  | Upstream / content on `prod`  | Repo on `dev` / `prod` | 
| -----------      | -----------                | -----------              | -----------               | -----------                           |
| .                |Redirect                    | `nginx` redirect         |  `nginx` redirect         | N/A                                   |
| cedar            |Frontend                    | `gulp` on 4200           |  `nginx` directory access | cedar-template-editor                 |
| openview         |Frontend                    | `ng serve` on 4220       |  `nginx` directory access | cedar-openview / cedar-opernview-dist |
| component        |Content distribution        | `nginx` directory access |  `nginx` directory access | cedar-component-distribution          |
| auth             |Keycloak                    | 8443                     |  8443                     | N/A                                   |
| artifact         |Microservice                | java on 9001             |                           | cedar-artifact-server                 |
| repo             |Microservice                | java on 9002             |                           | cedar-repo-server                     |
| schema           |Microservice                | java on 9003             |                           | cedar-schema-server                   |
| terminology      |Microservice                | java on 9004             |                           | cedar-terminology-server              |
| user             |Microservice                | java on 9005             |                           | cedar-user-server                     |
| valuerecommender |Microservice                | java on 9006             |                           | cedar-valuerecommender-server         |
| resource         |Microservice                | java on 9007             |                           | cedar-resource-server                 |
| group            |Microservice                | java on 9009             |                           | cedar-group-server                    |
| submission       |Microservice                | java on 9010             |                           | cedar-submission-server               |
| worker           |Microservice                | java on 9011             |                           | cedar-worker-server                   |
| messaging        |Microservice                | java on 9012             |                           | cedar-messaging-server                |
| open             |Microservice                | java on 9013             |                           | cedar-openview-server                 |
| internals        |Microservice                | java on 9014             |                           | cedar-internals-server                |
