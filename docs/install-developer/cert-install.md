# Installing self-signed certificates

## Add to java trust store
Create a working folder for the certificate generation:

```sh
sudo keytool -import -alias metadatacenter.orgx \
-file ./ca.crt \
-keystore /Library/Java/JavaVirtualMachines/jdk-11.0.3.jdk/Contents/Home/lib/security/cacerts
```

When prompted, enter these value:

| Question                   | Answer                   |
| -----------                | -----------              |
| First password                   | This is `sudo` password. Enter your password |
| Second password                  | This is the trust store password. By default it is `changeit` |
| Trust | yes |

Useful commands

```sh
sudo keytool -list -keystore /Library/Java/JavaVirtualMachines/jdk-11.0.3.jdk/Contents/Home/lib/security/cacerts | grep metadatacenter

sudo keytool -delete -alias metadatacenter.orgx -keystore /Library/Java/JavaVirtualMachines/jdk-11.0.3.jdk/Contents/Home/lib/security/cacerts
```

## Add to Firefox

## Add to Keychain Access
