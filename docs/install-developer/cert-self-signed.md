# Generating self-signed certificates

## Create working location
Create a working folder for the certificate generation:

```sh
mkdir ${CEDAR_HOME}/CEDAR_CA
```

## Configure `openssl` for CA

Copy the default `openssl.conf` to this new location, in order to modify it:

```sh
cp /usr/local/etc/openssl/openssl.cnf ${CEDAR_HOME}/CEDAR_CA/openssl-ca.cnf
cd ${CEDAR_HOME}/CEDAR_CA
```

Modify this file:

```sh
vi openssl-ca.cnf
```

Make the following changes:

```
HOME                    = .
RANDFILE                = $ENV::HOME/.rnd
CEDAR_HOME              = $ENV::CEDAR_HOME

[ CA_default ]
dir             = $CEDAR_HOME/CEDAR_CA
default_days    = 284
default_md      = sha256

[ req_distinguished_name ]
countryName_default             = US
stateOrProvinceName_default     = California
localityName                    = Locality Name
localityName_default            = Stanford
0.organizationName_default      = BMIR
organizationalUnitName_default  = CEDAR
```

## Configure `openssl` for SAN

Copy the recently modified `openssl.conf` to a new file as well:

```sh
cp ${CEDAR_HOME}/CEDAR_CA/openssl-ca.cnf ${CEDAR_HOME}/CEDAR_CA/openssl-san.cnf
```

Modify this file:

```sh
vi openssl-san.cnf
```

Make the following changes:

```
[req]
req_extensions = v3_req

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1   = artifact.metadatacenter.orgx
DNS.2   = auth.metadatacenter.orgx
DNS.3   = cedar.metadatacenter.orgx
DNS.4   = component.metadatacenter.orgx
DNS.5   = group.metadatacenter.orgx
DNS.6   = internals.metadatacenter.orgx
DNS.7   = messaging.metadatacenter.orgx
DNS.8   = open.metadatacenter.orgx
DNS.9   = openview.metadatacenter.orgx
DNS.10  = repo.metadatacenter.orgx
DNS.11  = resource.metadatacenter.orgx
DNS.12  = schema.metadatacenter.orgx
DNS.13  = submission.metadatacenter.orgx
DNS.14  = terminology.metadatacenter.orgx
DNS.15  = user.metadatacenter.orgx
DNS.16  = valuerecommender.metadatacenter.orgx
DNS.17  = worker.metadatacenter.orgx
```

## Generate an RSA private key for the CA

```sh
openssl genrsa -des3 -out ca.key 4096
```

When asked, enter a `passphrase`. Remember this, since you will need to use it later.

## Generate a self signed certificate for the CA

```sh
openssl req -new -x509 -days 3650 \
-key ca.key -out ca.crt -config ./openssl-ca.cnf
```

When prompted, enter these value:

| Question                   | Answer                   |
| -----------                | -----------              |
| Hostname                   | metadatacenter.orgx      |
| Email                      | metadatacenter@gmail.com |


## Generate an RSA private key for the server

```sh
openssl genrsa -out cedar.metadatacenter.orgx.key 2048
```

## Generate signing request

```sh
openssl req -new -sha256 \
-key cedar.metadatacenter.orgx.key \
-out cedar.metadatacenter.orgx.csr -config ./openssl-san.cnf
```

Use the default values when prompted. Just press ++return++. 

## Sign the request

```sh
echo 1 >serial
touch index.txt
touch index.txt.attr

openssl ca -cert ca.crt -keyfile ca.key \
-in cedar.metadatacenter.orgx.csr -out cedar.metadatacenter.orgx.crt \
-outdir ./ -config ./openssl-san.cnf -verbose -extensions v3_req
```

???+ warning "Important"
    
    Keep this folder, and its contents intact. You will need these certificates at several points of the installation.
