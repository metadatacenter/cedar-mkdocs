# Install the self-signed root certificates

## Add to Java trust store

Execute the commands below to navigate to the folder where the root CA certificate is stored.
Then import it into the `cacerts`: 
```sh
gocedar
cd CEDAR_CA

keytool -import -cacerts -alias metadatacenter.orgx -file ./ca.crt
```

When prompted, enter these value:

| Question | Answer                         |
|----------|--------------------------------|
| Password | ```changeit``` |
| Trust    | yes                            |


???+ warning "Trust store password"

    The `cacerts` trust store had a default password: `changeit`
    
???+ success "Useful commands"

    If you run into problems with the certificates, use these commands to list and filter the certificates:

    ```sh
    keytool -list -cacerts | grep metadatacenter
    ```

    respectively to delete a certificate    
    ```
    keytool -delete -cacerts -alias metadatacenter.orgx
    ```

## Add to `Firefox`
If you use Firefox, you will need to add the root CA certificate to the trusted list of the browser.

The process is the following:

- Open the `Preferences`.
- In the `Find in Preferences` input type `certificates`.
- Click the `View Certificates...` button.
- Make sure the `Authorities` tab is open.
- Click `Import`.
- Browse for `ca.crt` file. It will be located in:<br>`${CEDAR_HOME}/CEDAR_CA/`.
- Click both checkbox:
    - `Trust this CA to identify websites.`
    - `Trust this CA to identify email users.`
- Click `OK`

## Add to `Keychain Access`
If you use Chrome or Safari, or other browsers that use the system's trust store for certificates, you will need to add the root CA certificate to `Keychain Access`.

The process is the following:

* Using `Finder` navigate to `${CEDAR_HOME}/CEDAR_CA/`.
* Double-click the `ca.crt` file.
* The application called `Keychain Access` will be launched.
* A dialog will pop up, prompting for a location for the certificate. The `iCloud` will be preselected. Change this to `login`.
* Click the `Add` button.
* Locate the certificate you just added. It should be either in System or login Keychain. Search for `metadatacenter`.
* The certificate will have a white `x` in a red circle, meaning it is not trusted.
* Open it by double-clicking it.
* Expand the `Trust` branch on the top.
* Change the dropdown labeled `When using this certificate:` to `Always Trust`.
* Close the popup.
* You will be prompted for your password.
* You should see the icon of the certificate having a white cross inside a blue circle.
* You are done.
