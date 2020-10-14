# Set up CEDAR Keycloak administrator

In order to administer Keycloak, you will need to set up an administrator user.
This is a global system-wide administrator, it is different than the `cedar-admin` user that you will use to administer CEDAR resources.

## Start Keycloak

```sh
startkk
```

## Access the Administration Console

In your browser navigate to: [https://auth.metadatacenter.orgx/](https://auth.metadatacenter.orgx/).

The page will tell you that you need local access to set up the administrative user, and will point you to the following link: [http://localhost:8080/auth](http://localhost:8080/auth). Proceede to this URL.

## Create administrator user

In the form enter the following values:

| Question                | Answer |
| -----------             | ----------- |
| Username:               | administrator|
|New password:            | changeme|
|Re-enter new password:   | changeme|

Submit the form.

After the user is created, click on the "Administration Console >" link, and log in with your user.

## Stop Keycloak

```sh
killkk
```
