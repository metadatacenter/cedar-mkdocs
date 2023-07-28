# cedarcli server status

`cedarcli server status` and its shortcut `cedarcli status` stands for CEDAR CLI Server Status. You can check the status of the various components.

## Running `cedarcli server status`
Execute this: 
```sh
cedarcli server status
# or
cedarcli status
```

You should see the following output:

```
                 CEDAR Server status list
┏━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━┳━━━━━━━━━━━━━━━┓
┃ Server                 ┃ Status ┃ Port  ┃ Error         ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━╇━━━━━━━━━━━━━━━┩
│ Microservice           │        │       │               │
│ artifact               │ ❌     │ 9001  │ Port not open │
│ bridge                 │ ❌     │ 9015  │ Port not open │
│ group                  │ ❌     │ 9009  │ Port not open │
│ impex                  │ ❌     │ 9008  │ Port not open │
│ messaging              │ ❌     │ 9012  │ Port not open │
│ monitor                │ ❌     │ 9014  │ Port not open │
│ OpenView               │ ❌     │ 9013  │ Port not open │
│ repo                   │ ❌     │ 9002  │ Port not open │
│ resource               │ ❌     │ 9007  │ Port not open │
│ schema                 │ ❌     │ 9003  │ Port not open │
│ submission             │ ❌     │ 9010  │ Port not open │
│ terminology            │ ❌     │ 9004  │ Port not open │
│ user                   │ ❌     │ 9005  │ Port not open │
│ valuerecommender       │ ❌     │ 9006  │ Port not open │
│ worker                 │ ❌     │ 9011  │ Port not open │
├────────────────────────┼────────┼───────┼───────────────┤
│ Infrastructure         │        │       │               │
│ MongoDB                │ ❌     │ 27017 │ Port not open │
│ OpenSearch-REST        │ ❌     │ 9200  │ Port not open │
│ OpenSearch-Transport   │ ❌     │ 9300  │ Port not open │
│ NGINX                  │ ❌     │ 80    │ Port not open │
│ Keycloak               │ ❌     │ 8080  │ Port not open │
│ Neo4j                  │ ❌     │ 7474  │ Port not open │
│ Redis-persistent       │ ❌     │ 6379  │ Port not open │
│ MySQL                  │ ❌     │ 3306  │ Port not open │
├────────────────────────┼────────┼───────┼───────────────┤
│ Frontend               │        │       │               │
│ main                   │ ❌     │ 4200  │ Port not open │
│ OpenView-Frontend      │ ❌     │ 4220  │ Port not open │
│ component              │ ❌     │ 4240  │ Port not open │
│ monitoring             │ ❌     │ 4300  │ Port not open │
│ artifacts              │ ❌     │ 4320  │ Port not open │
│ bridging               │ ❌     │ 4340  │ Port not open │
├────────────────────────┼────────┼───────┼───────────────┤
│ Dashboard              │        │       │               │
│ opensearch-dashboard   │ ❌     │ 5601  │ Port not open │
│ redis-commander        │ ❌     │ 8081  │ Port not open │
│ phpmyadmin             │ ❌     │ 8082  │ Port not open │
├────────────────────────┼────────┼───────┼───────────────┤
│ Frontend-non-essential │        │       │               │
│ cee-dev                │ ❌     │ 4400  │ Port not open │
│ demo.cee               │ ❌     │ 4260  │ Port not open │
│ docs.cee               │ ❌     │ 4280  │ Port not open │
└────────────────────────┴────────┴───────┴───────────────┘
```

## Checking `cedarcli server status`
As you can see, all the services should be stopped at this point.

## Preexisting services

If you have some services in the running state, that means that you already have some components of the CEDAR system installed.

This will cause issues since there will be a collision on the ports that CEDAR services will try to connect.

???+ warning "Important - Stop conflicting services"
    
    If at this point you see any servers running on any of the ports enumerated here, please stop those services.
    
    The Dockerized CEDAR exposes all the infrastructure services on their native ports in order for the evaluator to be able to connect and inspect them.
    
    Conflicting services will make the Dockerized CEDAR not run properly.
