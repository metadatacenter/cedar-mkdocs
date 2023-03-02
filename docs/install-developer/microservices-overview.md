# Starting the CEDAR microservices

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
| Artifact                   | Running | healthCheck | 9101| HTTP/1.1\s200\sOK |
| Group                      | Running | healthCheck | 9109| HTTP/1.1\s200\sOK |
| Impex                      | Running | healthCheck | 9108| HTTP/1.1\s200\sOK |
| Internals                  | Running | healthCheck | 9114| HTTP/1.1\s200\sOK |
| Messaging                  | Running | healthCheck | 9112| HTTP/1.1\s200\sOK |
| OpenView                   | Running | healthCheck | 9113| HTTP/1.1\s200\sOK |
| Repo                       | Running | healthCheck | 9102| HTTP/1.1\s200\sOK |
| Resource                   | Running | healthCheck | 9107| HTTP/1.1\s200\sOK |
| Schema                     | Running | healthCheck | 9103| HTTP/1.1\s200\sOK |
| Submission                 | Running | healthCheck | 9110| HTTP/1.1\s200\sOK |
| Terminology                | Running | healthCheck | 9104| HTTP/1.1\s200\sOK |
| User                       | Running | healthCheck | 9105| HTTP/1.1\s200\sOK |
| ValueRecommender           | Running | healthCheck | 9106| HTTP/1.1\s200\sOK |
| Worker                     | Running | healthCheck | 9111| HTTP/1.1\s200\sOK |
| --- Infrastructure --------|         |             |     |                   |
| MongoDB                    | Running | openPort    |27017|                   |
| OpenSearch-REST            | Running | httpResponse| 9200| HTTP/1.1\s200\sOK |
| OpenSearch-Transport       | Running | openPort    | 9300|                   |
| NGINX                      | Running | httpResponse|   80| Server:\snginx    |
| Keycloak                   | Running | httpResponse| 8080| HTTP/1.1\s200\sOK |
| Neo4j                      | Running | httpResponse| 7474| HTTP/1.1\s200\sOK |
| Redis-persistent           | Running | redisPing   | 6379|                   |
| MySQL                      | Running | openPort    | 3306|                   |
| --- Monitoring ------------|         |             |     |                   |
| OpenSearch-Dashboards      | Stopped | httpResponse| 5601| HTTP/1.1\s302\sFou|
| Redis-Commander            | Stopped | httpResponse| 8081| HTTP/1.1\s200\sOK |
| PhpMyAdmin                 | Stopped | httpResponse| 8082| HTTP/1.1\s200\sOK |
| --- Front End -------------|         |             |     |                   |
| Base-Frontend              | Running | httpResponse| 4200| HTTP/1.1\s200\sOK |
| OpenView-Frontend          | Running | httpResponse| 4220| HTTP/1.1          |
| --- Environment ---------- |         |             |     |                   |
| CEDAR_NET_GATEWAY          |         | 127.0.0.1                             |
| CEDAR_NET_SUBNET           |         | 127.0.0.0                             |
|==============================================================================|
```

## Stopping the CEDAR microservices

```sh
stopall
```
