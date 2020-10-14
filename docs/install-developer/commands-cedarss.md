# cedarss

`cedarss` stands for CEDAR Server Status. You can check the status of the various components.

## Running `cedarenv`
Execute this: 
```sh
cedarss
```

You should see the following output:

```
---------------------------------------------
Checking all CEDAR servers
---------------------------------------------

|==============================================================================|
| Server                     | Status  | CheckedFor  | Port| Value             |
|------------------------------------------------------------------------------|
| --- Microservices ---------|         |             |     |                   |
| Artifact                   | Stopped | healthCheck | 9101| HTTP/1.1\s200\sOK |
| Group                      | Stopped | healthCheck | 9109| HTTP/1.1\s200\sOK |
| Internals                  | Stopped | healthCheck | 9114| HTTP/1.1\s200\sOK |
| Messaging                  | Stopped | healthCheck | 9112| HTTP/1.1\s200\sOK |
| OpenView                   | Stopped | healthCheck | 9113| HTTP/1.1\s200\sOK |
| Repo                       | Stopped | healthCheck | 9102| HTTP/1.1\s200\sOK |
| Resource                   | Stopped | healthCheck | 9107| HTTP/1.1\s200\sOK |
| Schema                     | Stopped | healthCheck | 9103| HTTP/1.1\s200\sOK |
| Submission                 | Stopped | healthCheck | 9110| HTTP/1.1\s200\sOK |
| Terminology                | Stopped | healthCheck | 9104| HTTP/1.1\s200\sOK |
| User                       | Stopped | healthCheck | 9105| HTTP/1.1\s200\sOK |
| ValueRecommender           | Stopped | healthCheck | 9106| HTTP/1.1\s200\sOK |
| Worker                     | Stopped | healthCheck | 9111| HTTP/1.1\s200\sOK |
| --- Infrastructure --------|         |             |     |                   |
| MongoDB                    | Stopped | openPort    |27017|                   |
| Elasticsearch-REST         | Stopped | httpResponse| 9200| HTTP/1.1\s200\sOK |
| Elasticsearch-Transport    | Stopped | openPort    | 9300|                   |
| NGINX                      | Stopped | httpResponse|   80| Server:\snginx    |
| Keycloak                   | Stopped | httpResponse| 8080| HTTP/1.1\s200\sOK |
| Neo4j                      | Stopped | httpResponse| 7474| HTTP/1.1\s200\sOK |
| Redis-persistent           | Stopped | redisPing   | 6379|                   |
| MySQL                      | Stopped | openPort    | 3306|                   |
| --- Monitor ---------------|         |             |     |                   |
| Kibana                     | Stopped | httpResponse| 5601| kbn-name:\skibana |
| Redis-Commander            | Stopped | httpResponse| 8081| HTTP/1.1\s200\sOK |
| PhpMyAdmin                 | Stopped | httpResponse| 8082| HTTP/1.1\s200\sOK |
| --- Front End -------------|         |             |     |                   |
| Base-Frontend              | Stopped | httpResponse| 4200| HTTP/1.1\s200\sOK |
| OpenView-Frontend          | Stopped | httpResponse| 4220| HTTP/1.1          |
| --- Environment ---------- |         |             |     |                   |
| CEDAR_NET_GATEWAY          |         | 127.0.0.1                             |
| CEDAR_NET_SUBNET           |         | 127.0.0.0                             |
|==============================================================================|
```

## Checking `cedarss`
As you can see, all the services should be stopped at this point.

## Preexisting services

If you have some services in the running state, that means that you already have some components of the CEDAR system installed.
This could be a background service, that you use in another project, e.g. `MongoDB`, `Neo4j` and so on.

???+ warning "Important - Preexisting services"
    
    It is perfectly fine to have CEDAR components preinstalled onto your system.
    
    However, this guide presents an installation on a 'clean' OS.
    
    If you already have some of these components installed, than it is your responsibility to make them work with CEDAR while maintaining their connection to your other projects. 
