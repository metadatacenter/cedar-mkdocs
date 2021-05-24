# Generate self-signed certificates

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

Make/add the following changes/lines:

(*The file uses tabs and spaces as indentation. The tab size is 8.
The values are aligned at block level, not throughout the whole file.
This is why our config here looks a bit unorganized.*)

```{.py3 hl_lines="3 6-8 11 13 16 19 22 25 28"}
HOME            = .
RANDFILE        = $ENV::HOME/.rnd
CEDAR_HOME      = $ENV::CEDAR_HOME

[ CA_default ]
dir         = $CEDAR_HOME/CEDAR_CA  # Where everything is kept
default_days= 824                   # how long to certify for
default_md  = sha256                # use public key default MD

[ req_distinguished_name ]
countryName_default     = US

stateOrProvinceName_default = CA

localityName            = Locality Name
localityName_default    = Stanford

0.organizationName      = Organization Name (eg, company)
0.organizationName_default  = BMIR

organizationalUnitName      = Organizational Unit Name (eg, section)
organizationalUnitName_default  = CEDAR

commonName_max			= 64
commonName_default      = metadatacenter.orgx

emailAddress_max		= 64
emailAddress_default    = metadatacenter@gmail.com
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

```{.py3 hl_lines="2 5 9 11-28"}
[req]
req_extensions = v3_req # The extensions to add to a certificate request

[ req_distinguished_name ]
commonName_default      = auth.metadatacenter.orgx

[ v3_req ]
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1   = artifact.metadatacenter.orgx
DNS.2   = auth.metadatacenter.orgx
DNS.3   = cedar.metadatacenter.orgx
DNS.4   = component.metadatacenter.orgx
DNS.5   = group.metadatacenter.orgx
DNS.6   = impex.metadatacenter.orgx
DNS.7   = internals.metadatacenter.orgx
DNS.8   = messaging.metadatacenter.orgx
DNS.9   = open.metadatacenter.orgx
DNS.10  = openview.metadatacenter.orgx
DNS.11  = repo.metadatacenter.orgx
DNS.12  = resource.metadatacenter.orgx
DNS.13  = schema.metadatacenter.orgx
DNS.14  = submission.metadatacenter.orgx
DNS.15  = terminology.metadatacenter.orgx
DNS.16  = user.metadatacenter.orgx
DNS.17  = valuerecommender.metadatacenter.orgx
DNS.18  = worker.metadatacenter.orgx

[ v3_ca ]
```

## Generate an RSA private key for the CA

```sh
openssl genrsa -des3 -out ca.key 4096
```

When asked, enter a `passphrase`. You could use `changeme`. Remember this, since you will need to use it later.

The following file will be generated:

* `ca.key`

## Generate a self signed certificate for the CA

```sh
openssl req -new -x509 -days 3650 \
  -key ca.key -out ca.crt -config ./openssl-ca.cnf
```

Provide the previously set password for `ca.key`, and then accept all the default values by pressing  ++return++. 

Provide these values when asked:

| Question                                        | Answer                   |
| -----------                                     | -----------              |
| Common Name (e.g. server FQDN or YOUR name) []: | metadatacenter.orgx      |
| Email Address []:                               | metadatacenter@gmail.com |

A new file, `ca.crt` will be generated. 

???+ warning "openssl"
    
    Make sure you are running version 1.1 of `openssl` that you previously installed via Homebrew and not the LibreSSL-based version pre-installed in macOS. 

## Generate an RSA private key for the server

```sh
openssl genrsa -out cedar.metadatacenter.orgx.key 2048
```

A new file, `cedar.metadatacenter.orgx.key` will be generated.

## Generate signing request

```sh
openssl req -new -sha256 \
  -key cedar.metadatacenter.orgx.key \
  -out cedar.metadatacenter.orgx.csr -config ./openssl-san.cnf
```

Use the default values when prompted. Just press ++return++. 

Lastly, you will be prompted for two values. Just leave them empty:

| Question                    | Answer                   |
| -----------                 | -----------              |
| A challenge password []:    | ++return++               |
| An optional company name []:| ++return++               |

A new file, `cedar.metadatacenter.orgx.csr` will be generated.

## Sign the request

```sh
echo 00 >serial
touch index.txt
touch index.txt.attr

openssl ca -cert ca.crt -keyfile ca.key \
  -in cedar.metadatacenter.orgx.csr -out cedar.metadatacenter.orgx.crt \
  -outdir ./ -config ./openssl-san.cnf -verbose -extensions v3_req
```

Provide the previously set password for `ca.key`.

Respond with `y` to the two questions:

| Question                    | Answer                   |
| -----------                 | -----------              |
| Sign the certificate? [y/n]                             | y             |
| 1 out of 1 certificate requests certified, commit? [y/n]| y              |

The following files will be generated:

* `00.pem`
* `cedar.metadatacenter.orgx.crt`
* `index.txt.attr.old`
* `index.txt.old`
* `serial.old`

???+ warning "Important"
    
    Keep this folder, and its contents intact. You will need these certificates at several points of the installation.
