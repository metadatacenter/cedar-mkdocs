# Microservices

## Configuring the CEDAR microservices

Some CEDAR microservices must be configured to allow them to access external resources.

This configuration information is stored in environment variables that are assigned by the `set-env-external.sh` script, which is located at the base of your CEDAR installation directory.
You will have created this file earlier in the CEDAR installation process.

### Terminology microservice configuration

CEDAR is supplied with controlled terminologies via a BioPortal or OntoPortal service, which may be running locally or remotely.

All access to a BioPortal or OntoPortal service is routed through the CEDAR terminology microservice. 

This microservice is configured using two environment variables: 

| Environment Variable                 | Description  |
| -----------                          | ------------ |
| `CEDAR_BIOPORTAL_API_KEY`            | Specifies an API key for accessing BioPortal or OntoPortal REST services  |
| `CEDAR_BIOPORTAL_REST_BASE`          | Specifies the base URL of the REST APIs for a BioPortal or OntoPortal service |

Instructions for obtaining a BioPortal or OntoPortal API key can be found  [here](https://bioportal.bioontology.org/help#Getting_an_API_key).
If you want information on installing your own OntoPortal service (OntoPortal is the name we give the BioPortal software distribution
that is used for external deployments) you can see the [OntoPortal Administration Documentation](https://ontoportal.github.io/administration/).

The default `CEDAR_BIOPORTAL_REST_BASE` value is `https://data.bioontology.org/`, which is the public BioPortal service. 
If you wish to use this service, you can create an account there and immediately obtain the BioPortal API key associated with that account.

After obtaining an API key and determining the base REST endpoint URL, edit your `set-env-internal.sh` file to set these variables.

These variables are read at microservice startup, so you will need to stop and restart the terminology microservice if it is aready running (using the commands, `stopterminology` and `startterminology`, respectively) so that it picks up updated values.

## Initializing the backend data stores

### System reset

Before running the microservices for the first time, execute the following script to initialize the CEDAR databases:

```sh
cedarat system-reset
```

???+ warning "Use System Reset with care"

    This system-reset option deletes all user content in CEDAR. 
    It should only be used before the microservices are first started or when you want to bring a system back to a clean-slate condition.
    
Answer `yes` to all the questions to confirm that a system reset should be performed.

???+ error "System Reset failing last step"

    The last step of the system reset will fail. This is expected behavior at this point.

    We will execute a second round of system reset after all the microservices are started.

## Starting the CEDAR microservices

### Running the microservices

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

### Stopping the CEDAR microservices

Do not stop microservices at this point! But if you need to do that in the future, you can perform:
```sh
cedarcli stop microservices
```

## Performing a system reset

### System reset

After all the microservices are started, perform another system reset.

```sh
cedarat system-reset
```

Answer `yes` to all the questions to confirm that a system reset should be performed.

???+ ok "System Reset success"

    This time all the steps should succeed!
