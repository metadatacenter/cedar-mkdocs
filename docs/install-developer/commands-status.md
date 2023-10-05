# status

`cedarcli status` stands for CEDAR Server Status. You can check the status of the various components.
It is actually a shortcut to `cedarcli server status`

## Running `status`
Execute this: 
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
│ artifact               │ ❌     │ 9001  │ Port not open │
│ bridge                 │ ❌     │ 9015  │ Port not open │
│ group                  │ ❌     │ 9009  │ Port not open │
│ impex                  │ ❌     │ 9008  │ Port not open │
│ messaging              │ ❌     │ 9012  │ Port not open │
│ monitor                │ ❌     │ 9014  │ Port not open │
│ open                   │ ❌     │ 9013  │ Port not open │
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
│ openview               │ ❌     │ 4220  │ Port not open │
│ component              │ ❌     │ 4240  │ Port not open │
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

## Checking `status`
As you can see, all the services should be stopped at this point.

## Preexisting services

If you have some services in the running state, that means that you already have some components of the CEDAR system installed.
This could be a background service, that you use in another project, e.g. `MongoDB`, `Neo4j` and so on.

???+ warning "Important - Preexisting services"
    
    It is perfectly fine to have CEDAR components preinstalled onto your system.
    
    However, this guide presents an installation on a 'clean' OS.
    
    If you already have some of these components installed, than it is your responsibility to make them work with CEDAR while maintaining their connection to your other projects. 
