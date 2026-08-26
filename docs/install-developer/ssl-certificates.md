# Create Local HTTPS Certificates

The browser reaches native CEDAR through HTTPS, using the same family of local hostnames as the
complete application. A development machine therefore needs its own certificate authority and a
certificate for each CEDAR hostname.

`cedarcli` creates these files from the domain and certificate identity in
`set-env-internal.sh`. It preserves an existing certificate authority unless replacement is
explicitly requested.

## Generate the Certificate Authority

Prepare the certificate workspace, create the local authority, and issue all domain certificates:

```bash
cedarcli cert setup
cedarcli cert ca
cedarcli cert domains
```

The files are written below `$CEDAR_HOME/CEDAR_CA`. Keep the CA key private and do not commit this
directory.

To renew selected leaf certificates later without replacing the authority:

```bash
cedarcli cert domains cedar workspace designer --force
```

Replacing the CA with `cedarcli cert ca --force` invalidates every certificate it previously
issued. Regenerate all domain certificates and repeat the trust steps if you deliberately do that.

## Trust the Authority in macOS

Chrome, Safari, and other applications using the macOS trust store need to trust the local CA:

```bash
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain \
  "$CEDAR_HOME/CEDAR_CA/ca.crt"
```

Firefox may use its own certificate store, depending on its configuration. If it still rejects the
local sites, import `$CEDAR_HOME/CEDAR_CA/ca.crt` as a trusted authority in Firefox settings.

## Trust the Authority in JDK 17

CEDAR services also make HTTPS calls to Keycloak. Add the same CA to the JDK selected for native
CEDAR:

```bash
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
sudo "$JAVA_HOME/bin/keytool" -importcert -trustcacerts -noprompt \
  -storepass changeit \
  -alias cedar-local-ca \
  -file "$CEDAR_HOME/CEDAR_CA/ca.crt" \
  -cacerts
```

Confirm the entry when diagnosing trust problems:

```bash
"$JAVA_HOME/bin/keytool" -list -cacerts -storepass changeit -alias cedar-local-ca
```

The next page installs nginx and copies the generated domain certificates into the location used by
its native configuration.
