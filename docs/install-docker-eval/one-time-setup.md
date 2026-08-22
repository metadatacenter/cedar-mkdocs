# One-Time Setup

CEDAR uses several local web addresses so the browser, authentication system, and APIs interact as
they do in a hosted installation. Your computer does not know those names yet, and your browser
does not automatically trust a certificate created on your laptop. This one-time setup establishes
that local identity before any application containers start.

It also creates the private Docker network that lets CEDAR's internal services find one another.
These are installation-level resources: ordinary starts and stops reuse them.

Run the following steps from the shell configured on the previous page.

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

## Connect CEDAR to Terminology

Template authors use CEDAR to find ontology terms while designing fields and entering metadata.
Those searches go through CEDAR's terminology service to BioPortal or another OntoPortal instance.
The public BioPortal endpoint is already the default; you only need to supply an API key in
`$CEDAR_HOME/set-env-external.sh`.

You can obtain a key from the
[BioPortal account help](https://bioportal.bioontology.org/help#Getting_an_API_key). If you operate
another OntoPortal instance, set `CEDAR_BIOPORTAL_REST_BASE` in the same file to its API address.
The [OntoPortal administration documentation](https://ontoportal.github.io/administration/) covers
running that service yourself.

## Trust the Self-Signed CA

The certificate created above is private to this installation. Trusting its CA prevents certificate
warnings when you open CEDAR's local HTTPS addresses.

Import `$CEDAR_HOME/CEDAR_CA/ca.crt` as a trusted certificate authority. Firefox manages its own
authorities under **Settings → Privacy & Security → Certificates**. Chrome and Safari on macOS use
the system trust store: add the file in Keychain Access, open the imported `metadatacenter`
certificate, and set it to **Always Trust**.

Trust this CA only on the computer hosting your local CEDAR installation. Restart the browser after
the import so it reloads the trust store.
