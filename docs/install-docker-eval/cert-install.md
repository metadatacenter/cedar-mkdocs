# Install the self-signed root certificates

The CEDAR Docker setup uses self-signed certificates for the `*.metadatacenter.orgx` domains.

In order for these to work with your browser, you will need to trust our CA by importing its certificate into your truststore.

The process depends on which browser you use. Please follow one - or both - of the methods desribed below:

## Add to `Firefox`
If you use Firefox, you will need to add the root CA certificate to the trusted list of the browser.

Open the previously generated `ca-cedar.crt` from the browser using `File -> Open`. The file will be located in:
<br>`${CEDAR_DOCKER_HOME}/cedar-docker-deploy/cedar-assets/ca/`.

A popup will be shown, displaying three checkboxes. Check all those, and click OK. This means you added the root CA as a trusted authority. 

## Add to `Keychain Access`
If you use Chrome or Safari, or other browsers that use the system's trust store for certificates, you will need to add the root CA certificate to `Keychain Access`.

The process is the following:

* Using `Finder` navigate to:<br>`${CEDAR_DOCKER_HOME}/cedar-docker-deploy/cedar-assets/ca/`.
* Double-click the `ca-cedar.crt` file.
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
