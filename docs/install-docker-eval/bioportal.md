# BioPortal integration
The BioPortal integration is optional for the Docker installation. The CEDAR system will still work, but you will not have access to advanced features like the BioPortal integration, controlled term, value recommender.

If you would like to have the BioPortal integration in your installation, follow the steps below.


## Register to BioPortal, get your API key
Do this at: [https://bioportal.bioontology.org/](https://bioportal.bioontology.org/){: target="_blank" .external }

## Edit the CEDAR env variables, add your BioPortal API key
```sh
vi $CEDAR_HOME/cedar-development/bin/templates/set-env-external.sh
```
Edit the line starting with:
```
export CEDAR_BIOPORTAL_API_KEY="..."
```
Add your BioPortal API key between the quotes.

## Check that the env var is updated:
Close your shell, open a new one. Then execute:
```sh
cedarcli env filter BIO
```
