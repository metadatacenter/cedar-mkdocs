# BioPortal integration with Docker
If you already installed CEDAR using the Docker method, and you want to try out the BioPortal integration as well, follow these steps:

## Register to BioPortal, get your API key
Do this at: [https://bioportal.bioontology.org/](https://bioportal.bioontology.org/){: target="_blank" .external }

## Stop CEDAR microservices
```sh
cedarcli docker stop microservices
```

## Edit the CEDAR env variables, add your BioPortal API key
```sh
vi $CEDAR_HOME/cedar-development/bin/templates/set-env-external.sh
```
Edit the line starting with:
```
export CEDAR_BIOPORTAL_API_KEY="..."
```
Add your BioPortal API key between the quotes.

## Double-check that the env var is updated:
Close your shell, open a new one. Then execute:
```sh
cedarcli env filter BIO
```

## Restart the microservices
```sh
cedarcli docker start microservices
```
