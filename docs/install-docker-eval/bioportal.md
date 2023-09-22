# BioPortal integration

Some CEDAR microservices must be configured to allow them to access external resources.

This configuration information is stored in environment variables that are assigned by the `$CEDAR_HOME/cedar-development/bin/templates/set-env-external.sh` script.

## Terminology microservice configuration

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

```sh
vi $CEDAR_HOME/cedar-development/bin/templates/set-env-external.sh
```

These variables are read at microservice startup, described in a later step.
