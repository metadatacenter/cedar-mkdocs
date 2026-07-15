# One-Time Setup

## One-time setup

This step needs to be executed once for a CEDAR Docker installation. This will create the network, the volumes, and copy certificates: 

### Create network, create volumes, copy certificates

```sh
cedarcli docker one-time-setup
```

## Subdomains

Our utility script will add the subdomains needed for CEDAR Docker into the local `/etc/hosts` file.

Please run:
```sh
cedarcli dev add-hosts
```

The script will ask you for your password to execute a `sudo`.
The output of the script should be similar to the one below:

```
Testing the list of CEDAR hosts:
Host unknown : artifact.metadatacenter.orgx
Host unknown : artifacts.metadatacenter.orgx
Host unknown : bridge.metadatacenter.orgx
Host unknown : bridging.metadatacenter.orgx
Host unknown : auth.metadatacenter.orgx
Host unknown : cedar.metadatacenter.orgx
Host unknown : content.metadatacenter.orgx
Host unknown : group.metadatacenter.orgx
Host unknown : impex.metadatacenter.orgx
Host unknown : monitor.metadatacenter.orgx
Host unknown : monitoring.metadatacenter.orgx
Host unknown : messaging.metadatacenter.orgx
Host unknown : open.metadatacenter.orgx
Host unknown : openview.metadatacenter.orgx
Host unknown : repo.metadatacenter.orgx
Host unknown : resource.metadatacenter.orgx
Host unknown : schema.metadatacenter.orgx
Host unknown : submission.metadatacenter.orgx
Host unknown : terminology.metadatacenter.orgx
Host unknown : user.metadatacenter.orgx
Host unknown : valuerecommender.metadatacenter.orgx
Host unknown : worker.metadatacenter.orgx
Host unknown : demo.cee.metadatacenter.orgx
Host unknown : demo-dist.cee.metadatacenter.orgx
Host unknown : docs.cee.metadatacenter.orgx
Host unknown : docs-dist.cee.metadatacenter.orgx
Some CEDAR hosts are unknown, we will prompt for your password in order to make modifications to /etc/hosts !
Password:
Host unknown, adding to /etc/hosts: artifact.metadatacenter.orgx
Host unknown, adding to /etc/hosts: artifacts.metadatacenter.orgx
Host unknown, adding to /etc/hosts: bridge.metadatacenter.orgx
Host unknown, adding to /etc/hosts: bridging.metadatacenter.orgx
Host unknown, adding to /etc/hosts: auth.metadatacenter.orgx
Host unknown, adding to /etc/hosts: cedar.metadatacenter.orgx
Host unknown, adding to /etc/hosts: content.metadatacenter.orgx
Host unknown, adding to /etc/hosts: group.metadatacenter.orgx
Host unknown, adding to /etc/hosts: impex.metadatacenter.orgx
Host unknown, adding to /etc/hosts: monitor.metadatacenter.orgx
Host unknown, adding to /etc/hosts: monitoring.metadatacenter.orgx
Host unknown, adding to /etc/hosts: messaging.metadatacenter.orgx
Host unknown, adding to /etc/hosts: open.metadatacenter.orgx
Host unknown, adding to /etc/hosts: openview.metadatacenter.orgx
Host unknown, adding to /etc/hosts: repo.metadatacenter.orgx
Host unknown, adding to /etc/hosts: resource.metadatacenter.orgx
Host unknown, adding to /etc/hosts: schema.metadatacenter.orgx
Host unknown, adding to /etc/hosts: submission.metadatacenter.orgx
Host unknown, adding to /etc/hosts: terminology.metadatacenter.orgx
Host unknown, adding to /etc/hosts: user.metadatacenter.orgx
Host unknown, adding to /etc/hosts: valuerecommender.metadatacenter.orgx
Host unknown, adding to /etc/hosts: worker.metadatacenter.orgx
Host unknown, adding to /etc/hosts: demo.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: demo-dist.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: docs.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: docs-dist.cee.metadatacenter.orgx
```

## BioPortal integration

Some CEDAR microservices must be configured to allow them to access external resources.

This configuration information is stored in environment variables that are assigned by the `$CEDAR_HOME/cedar-development/bin/templates/set-env-external.sh` script.

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

```sh
vi $CEDAR_HOME/cedar-development/bin/templates/set-env-external.sh
```

These variables are read at microservice startup, described in a later step.

## Install the self-signed root certificates

The CEDAR Docker setup uses self-signed certificates for the `*.metadatacenter.orgx` domains.

In order for these to work with your browser, you will need to trust our CA by importing its certificate into your truststore.

The process depends on which browser you use. Please follow one - or both - of the methods desribed below:

### Add to `Firefox`
If you use Firefox, you will need to add the root CA certificate to the trusted list of the browser.

The process is the following:

- Open the `Preferences`.
- In the `Find in Preferences` input type `certificates`.
- Click the `View Certificates...` button.
- Make sure the `Authorities` tab is open.
- Click `Import`.
- Browse for `ca.crt` file. It will be located in:<br>`${CEDAR_HOME}/cedar-docker-deploy/cedar-assets/ca/`.
- Click both checkbox:
    - `Trust this CA to identify websites.`
    - `Trust this CA to identify email users.`
- Click `OK`

### Add to `Keychain Access`
If you use Chrome or Safari, or other browsers that use the system's trust store for certificates, you will need to add the root CA certificate to `Keychain Access`.

The process is the following:

* Using `Finder` navigate to:<br>`${CEDAR_HOME}/cedar-docker-deploy/cedar-assets/ca/`.
* Double-click the `ca.crt` file.
* The application called `Keychain Access` will be launched.
* A dialog will pop up, prompting for a location for the certificate. The `login` will be preselected. Click the `Add` button.
* Locate the certificate you just added. It should be either in System or login Keychain. Search for `metadatacenter`.
* The certificate will have a white `x` in a red circle, meaning it is not trusted.
* Open it by double-clicking it.
* Expand the `Trust` branch on the top.
* Change the dropdown labeled `When using this certificate:` to `Always Trust`.
* Close the popup.
* You will be prompted for your password.
* You should see the icon of the certificate having a white cross inside a blue circle.
* You are done.
