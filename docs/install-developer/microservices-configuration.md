# Configuring the CEDAR microservices

Some CEDAR microservices must be configured to allow them to access external resources.

This configuration information is stored in environment variables that are assigned by the `set-env-external.sh` script, which is located at the base of your CEDAR installation directory.
You will have created this file [earlier in the CEDAR installation process](./scripts-and-aliases-install.html).

## Terminology microservice configuration

CEDAR is supplied with controlled terminologies via a BioPortal or OntoPortal service, which may be running locally or remotely.

All access to a BioPortal or OntoPortal server is routed through the CEDAR terminology microservice. 

This microservice is configured using two environment variables: 

| Environment Variable                 | Description  |
| -----------                          | ------------ |
| `CEDAR_BIOPORTAL_API_KEY`            | Specifies a API key for accessing BioPortal or OntoPortal REST services  |
| `CEDAR_BIOPORTAL_REST_BASE`          | Specifies the base URL of the REST APIs for a BioPortal or OntoPortal service |

Instructions for obtaining a BioPortal or OntoPortal API key can be found  [here](https://bioportal.bioontology.org/help#Getting_an_API_key).

The default `CEDAR_BIOPORTAL_REST_BASE` value is `https://data.bioontology.org/`, which is the public BioPortal service. 
If you wish to use this service, you can create an account there and immediately maintain the BioPortal API key associated with that account.

After obtaining an API key and determining the base REST endpoint URL, edit your `set-env-internal.sh` file to set these variables.


