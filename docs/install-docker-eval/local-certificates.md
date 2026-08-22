# Set Up Local Certificates

CEDAR uses several local HTTPS addresses so the browser, authentication system, and APIs interact
as they do in a hosted installation. This page creates those local hostnames and their certificates,
then tells your browser and the Docker deployment how to use them.

The Docker setup command also creates the private network that lets CEDAR's internal services find
one another. Hostnames, certificates, and the network are installation-level resources: ordinary
starts and stops reuse them.

Run the following steps from the shell configured on the previous page.

## Add Local Hostnames

The hostname helper reads the central CEDAR subdomain inventory and adds missing names to
`/etc/hosts`, including Workspace and Designer:

```bash
cedarcli dev add-hosts
```

The command checks the complete CEDAR hostname inventory and prompts for `sudo` only when it needs
to add missing entries to `/etc/hosts`.

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

## Trust the Self-Signed CA

The certificate created above is private to this installation. Trusting its CA prevents certificate
warnings when you open CEDAR's local HTTPS addresses.

Import `$CEDAR_HOME/CEDAR_CA/ca.crt` as a trusted certificate authority. Firefox manages its own
authorities under **Settings → Privacy & Security → Certificates**. Chrome and Safari on macOS use
the system trust store: add the file in Keychain Access, open the imported `metadatacenter`
certificate, and set it to **Always Trust**.

Trust this CA only on the computer hosting your local CEDAR installation. Restart the browser after
the import so it reloads the trust store.
