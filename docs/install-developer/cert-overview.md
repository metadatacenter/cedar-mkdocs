# Overview
To closely replicate the behavior of `CEDAR` in production environment, we will set up `https` access for `nginx` later during the installation.
This means that the browser will communicate with the `nginx` using https.
`Nginx` acting as a reverse proxy, will communicate using plain `http` with the microservices and frontends behind it.

Since this is a development installation, it is not easy to get proper SSL certificates.
To overcome this, we will use self-signed certificates for development.

There is also back-channel communication between microservices and `Keycloak`.
In order to make this work, we will need to add our Self-signed certificates to the Java truststore. 
