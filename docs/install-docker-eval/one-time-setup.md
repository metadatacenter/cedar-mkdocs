# One-Time Setup

Run these steps from a shell with the full-Docker profile and overrides described on the
[Configuration](configuration.md) page.

## Add Local Hostnames

The hostname helper reads the central CEDAR subdomain inventory and adds missing names to
`/etc/hosts`, including Workspace and Designer:

```bash
cedarcli dev add-hosts
```

The command prompts for `sudo` only when changes are required. Confirm the principal frontend
names resolve locally:

```bash
for host in cedar workspace designer openview content monitoring bridging; do
  ping -c 1 "${host}.metadatacenter.orgx"
done
```

## Generate Current Certificates

Generate a local CA and certificates rather than relying on the bundled fallback certificates,
which may be expired:

```bash
cedarcli cert setup
cedarcli cert ca
cedarcli cert domains
```

These commands write the CA and domain certificates under `$CEDAR_HOME/CEDAR_CA`.

## Create the Docker Network and Certificate Volumes

Run this only while the CEDAR Docker stack is stopped. It recreates the external `cedarnet` network,
creates the `cedar_cert` and `cedar_ca` volumes, and copies the generated certificates into them:

```bash
cedarcli docker one-time-setup
```

Verify the resulting resources:

```bash
docker network inspect cedarnet >/dev/null
docker volume inspect cedar_cert cedar_ca >/dev/null
```

## BioPortal integration

Some CEDAR microservices must be configured to allow them to access external resources.

This configuration is stored in the installation copy at `$CEDAR_HOME/set-env-external.sh`.

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

After obtaining an API key and determining the base REST endpoint URL, edit
`$CEDAR_HOME/set-env-external.sh`:

```bash
vi "$CEDAR_HOME/set-env-external.sh"
```

These variables are read at microservice startup, described in a later step.

## Trust the Self-Signed CA

The CEDAR Docker setup uses self-signed certificates for the `*.metadatacenter.orgx` domains.

In order for these to work with your browser, you will need to trust our CA by importing its certificate into your truststore.

Import `$CEDAR_HOME/CEDAR_CA/ca.crt` into the trust store used by your browser. The process depends
on the browser.

### Add to `Firefox`
If you use Firefox, you will need to add the root CA certificate to the trusted list of the browser.

The process is the following:

- Open the `Preferences`.
- In the `Find in Preferences` input type `certificates`.
- Click the `View Certificates...` button.
- Make sure the `Authorities` tab is open.
- Click `Import`.
- Select `$CEDAR_HOME/CEDAR_CA/ca.crt`.
- Click both checkbox:
    - `Trust this CA to identify websites.`
    - `Trust this CA to identify email users.`
- Click `OK`

### Add to `Keychain Access`
If you use Chrome or Safari, or other browsers that use the system's trust store for certificates, you will need to add the root CA certificate to `Keychain Access`.

The process is the following:

* In Finder, navigate to `$CEDAR_HOME/CEDAR_CA`.
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
After trusting the CA, completely restart the browser before opening CEDAR.
