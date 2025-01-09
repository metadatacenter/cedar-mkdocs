# Starting the CEDAR microservices

## Running the microservices

To run all the CEDAR microservices:

```sh
cedarcli start microservices
```

The check the all the microservices are running, execute:

```sh
cedarcli status
```

You should see the following output:

```
                 CEDAR Server status list
┏━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━┳━━━━━━━━━━━━━━━┓
┃ Server                 ┃ Status ┃ Port  ┃ Error         ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━╇━━━━━━━━━━━━━━━┩
│ Microservice           │        │       │               │
│ artifact               │ ✅     │ 9001  │               │
│ bridge                 │ ✅     │ 9015  │               │
│ group                  │ ✅     │ 9009  │               │
│ impex                  │ ✅     │ 9008  │               │
│ messaging              │ ✅     │ 9012  │               │
│ monitor                │ ✅     │ 9014  │               │
│ open                   │ ✅     │ 9013  │               │
│ repo                   │ ✅     │ 9002  │               │
│ resource               │ ✅     │ 9007  │               │
│ schema                 │ ✅     │ 9003  │               │
│ submission             │ ✅     │ 9010  │               │
│ terminology            │ ✅     │ 9004  │               │
│ user                   │ ✅     │ 9005  │               │
│ valuerecommender       │ ✅     │ 9006  │               │
│ worker                 │ ✅     │ 9011  │               │
├────────────────────────┼────────┼───────┼───────────────┤
│ Infrastructure         │        │       │               │
│ MongoDB                │ ✅     │ 27017 │               │
│ OpenSearch-REST        │ ✅     │ 9200  │               │
│ OpenSearch-Transport   │ ✅     │ 9300  │               │
│ NGINX                  │ ✅     │ 80    │               │
│ Keycloak               │ ✅     │ 8080  │               │
│ Neo4j                  │ ✅     │ 7474  │               │
│ Redis-persistent       │ ✅     │ 6379  │               │
│ MySQL                  │ ✅     │ 3306  │               │
├────────────────────────┼────────┼───────┼───────────────┤
│ Frontend               │        │       │               │
│ main                   │ ❌     │ 4200  │ Port not open │
│ openview               │ ❌     │ 4220  │ Port not open │
│ content                │ ❌     │ 4240  │ Port not open │
│ monitoring             │ ❌     │ 4300  │ Port not open │
│ artifacts              │ ❌     │ 4320  │ Port not open │
│ bridging               │ ❌     │ 4340  │ Port not open │
├────────────────────────┼────────┼───────┼───────────────┤
│ Frontend-non-essential │        │       │               │
│ cee-dev                │ ❌     │ 4400  │ Port not open │
│ demo.cee               │ ❌     │ 4260  │ Port not open │
│ docs.cee               │ ❌     │ 4280  │ Port not open │
└────────────────────────┴────────┴───────┴───────────────┘
```

## Stopping the CEDAR microservices

```sh
stopall
```
