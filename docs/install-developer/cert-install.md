# Install the self-signed root certificates

## Add to Java trust store
Find the location of the JDK that you just installed:

```sh
ls -ls /Library/Java/JavaVirtualMachines/
```

Choose the one which matches the version of the recently installed JDK.

Set the `JAVA_HOME` environment variable to point to this JDK, e.g.,
```sh
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-19.jdk/Contents/Home/
```

???+ warning "JAVA_HOME"
    
    We do not require, and we do not take advantage of the `JAVA_HOME` environment variable during this installation.
    We are setting it here to shorten the `keytool` command parameters.
    Feel free to use that environment variable, but please note that this guide was tested without the variable being set. 

Execute the commands below to navigate to the folder where the root CA certificate is stored.
Then import it into the `cacerts`: 
```sh
gocedar
cd CEDAR_CA

sudo keytool -import -cacerts -alias metadatacenter.orgx -file ./ca.crt
```

When prompted, enter these value:

| Question | Answer                   |
|----------| -----------              |
| Password | This is `sudo` password. Enter your password (your macOS password)|
| Trust    | yes |


???+ warning "Trust store password"

    In older JDK versions the `cacerts` trust store had a default password: `changeit`
    
    It the above command asks for a second password, enter `changeit`. 

???+ success "Useful commands"

    If you run into problems with the certificates, use these commands to list and filter the certificates:

    ```sh
    sudo keytool -list -cacerts | grep metadatacenter
    ```

    respectively to delete a certificate    
    ```
    sudo keytool -delete -cacerts -alias metadatacenter.orgx
    ```

If the certificate was added successfully, please close this session, to get rid of the `JAVA_HOME` environment variable.

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
