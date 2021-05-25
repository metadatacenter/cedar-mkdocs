# Starting the CEDAR microservices

## Before running

Before running the microservices, execute the following script to initialize the CEDAR databases:

```sh
cedarat system-reset
```

## Running the microservices

To run all the CEDAR microservices:

```sh
startall
```

The check the all the microservices are running, execute:

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
| Artifact                   | Started | healthCheck | 9101| HTTP/1.1\s200\sOK |
| Group                      | Started | healthCheck | 9109| HTTP/1.1\s200\sOK |
| Internals                  | Started | healthCheck | 9114| HTTP/1.1\s200\sOK |
| Messaging                  | Started | healthCheck | 9112| HTTP/1.1\s200\sOK |
| OpenView                   | Started | healthCheck | 9113| HTTP/1.1\s200\sOK |
| Repo                       | Started | healthCheck | 9102| HTTP/1.1\s200\sOK |
| Resource                   | Started | healthCheck | 9107| HTTP/1.1\s200\sOK |
| Schema                     | Started | healthCheck | 9103| HTTP/1.1\s200\sOK |
| Submission                 | Started | healthCheck | 9110| HTTP/1.1\s200\sOK |
| Terminology                | Started | healthCheck | 9104| HTTP/1.1\s200\sOK |
| User                       | Started | healthCheck | 9105| HTTP/1.1\s200\sOK |
| ValueRecommender           | Started | healthCheck | 9106| HTTP/1.1\s200\sOK |
| Worker                     | Started | healthCheck | 9111| HTTP/1.1\s200\sOK |
| --- Infrastructure --------|         |             |     |                   |
| MongoDB                    | Started | openPort    |27017|                   |
| Elasticsearch-REST         | Started | httpResponse| 9200| HTTP/1.1\s200\sOK |
| Elasticsearch-Transport    | Started | openPort    | 9300|                   |
| NGINX                      | Started | httpResponse|   80| Server:\snginx    |
| Keycloak                   | Started | httpResponse| 8080| HTTP/1.1\s200\sOK |
| Neo4j                      | Started | httpResponse| 7474| HTTP/1.1\s200\sOK |
| Redis-persistent           | Started | redisPing   | 6379|                   |
| MySQL                      | Started | openPort    | 3306|                   |
| --- Monitor ---------------|         |             |     |                   |
| Kibana                     | Stopped | httpResponse| 5601| kbn-name:\skibana |
| Redis-Commander            | Stopped | httpResponse| 8081| HTTP/1.1\s200\sOK |
| PhpMyAdmin                 | Stopped | httpResponse| 8082| HTTP/1.1\s200\sOK |
| --- Front End -------------|         |             |     |                   |
| Base-Frontend              | Started | httpResponse| 4200| HTTP/1.1\s200\sOK |
| OpenView-Frontend          | Started | httpResponse| 4220| HTTP/1.1          |
| --- Environment ---------- |         |             |     |                   |
| CEDAR_NET_GATEWAY          |         | 127.0.0.1                             |
| CEDAR_NET_SUBNET           |         | 127.0.0.0                             |
|==============================================================================|
```

## Stopping the CEDAR microservices

```sh
stopall
```
