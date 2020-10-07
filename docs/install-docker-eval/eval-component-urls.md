# Components, URLs

Below you will find the URLs for the different components that make up the CEDAR ecosystem.


## Keycloak

Keycloak serves as the authentication and autorization system for CEDAR.

| Data        | Value                                     |
| ----------- | -----------                               |
| URL:        | [https://auth.metadatacenter.orgx/](https://auth.metadatacenter.orgx/)         |
| Username:   | administrator                             |
| Password:   | changeme                                  |


## Neo4j

Neo4j is the graph database behind CEDAR.

| Data        | Value                                     |
| ----------- | -----------                               |
| URL:        | [http://localhost:7474/](http://localhost:7474/)         |
| Username:   | neo4j                                     |
| Password:   | changeme                                  |


## Redis Commander

`Redis Commander` is an optional component, it is started with the `monitoring` group of services.

Redis is the memory cache and message queue behind CEDAR.

| Data        | Value                                     |
| ----------- | -----------                               |
| URL:        | [http://localhost:8081/](http://localhost:8081/)         |


## Kibana

`Kibana` is an optional component, it is started with the `monitoring` group of services.

Kibana lets you monitor Elasticsearch, the search engine behind CEDAR.

| Data        | Value                                     |
| ----------- | -----------                               |
| URL:        | [http://localhost:5601/](http://localhost:5601/)         |
| DEVTools URL:   | [http://localhost:5601/app/kibana#/dev_tools/console?_g=()](http://localhost:5601/app/kibana#/dev_tools/console?_g=())           |


## phpMyAdmin

`phpMyAdmin` is an optional component, it is started with the `monitoring` group of services.

| Data        | Value                                     |
| ----------- | -----------                               |
| URL:        | [http://localhost:8082/](http://localhost:8082/)         |
| Server:     | 192.168.17.1                              |
| Username:   | root                                      |
| Password:   | changeme                                  |
