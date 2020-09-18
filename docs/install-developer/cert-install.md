# Installing the self-signed certificates

## Add to java trust store
Find the location of the JDK that you just installed:

```sh
ls -ls /Library/Java/JavaVirtualMachines/
```

Choose the one which matches the version of the recently installed JDK. 

Execute the commands below to navigate to the folder where the root CA certificate is stored.
Then import it into the `cacerts`: 
```sh
gocedar
cd CEDAR_CA

sudo keytool -import \
-alias metadatacenter.orgx \
-file ./ca.crt \
-keystore /Library/Java/JavaVirtualMachines/jdk-11.0.8.jdk/Contents/Home/lib/security/cacerts
```

When prompted, enter these value:

| Question                   | Answer                   |
| -----------                | -----------              |
| First password             | This is `sudo` password. Enter your password |
| Second password            | This is the trust store password. By default it is `changeit` |
| Trust                      | yes |

???+ success "Useful commands"

    If you run into problems with the certificates, use these commands to list and filter the certificates, respectively to delete a certificate.

    ```sh
    sudo keytool -list \
    -keystore /Library/Java/JavaVirtualMachines/jdk-11.0.8.jdk/Contents/Home/lib/security/cacerts \
    | grep metadatacenter
    
    sudo keytool -delete \ 
    -alias metadatacenter.orgx \
    -keystore /Library/Java/JavaVirtualMachines/jdk-11.0.8.jdk/Contents/Home/lib/security/cacerts
    ```

## Add to `Firefox`
If you use Firefox, you will need to add the root CA certificate to the trusted list of the browser.

Open the previously generated `ca.crt` from the browser using `File -> Open`. The file will be located in `${CEDAR_HOME}/CEDAR_CA`.

A popup will be shown, displaying three checkboxes. Check all those, and click OK. This means you added the root CA as a trusted authority. 

## Add to `Keychain Access`
If you use Chrome or Safari, or other browsers that use the system's trust store for certificates, you will need to add the root CA certificate to `Keychain Access`.

The process is the following:

* Using `Finder` navigate to `${CEDAR_HOME}/CEDAR_CA`.
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
