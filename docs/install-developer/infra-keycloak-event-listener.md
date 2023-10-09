# Install Keycloak event listener

The CEDAR system needs to be notified every time when a login request is performed against the Keycloak authentication module.

In order to accomplish this, we have an event listener in place.
This even lister part of the CEDAR code base, and can be found in the `cedar-keycloak-event-listener` repo.

You will need to install this event listener under `Keycloak`

Ideally this event listener should be updated all the times when a CEDAR build is performed.
However, if there are no changes in the CEDAR codebase which will have an effect on the event listener, it is ok not to update the event listener.

## Deploy the event listener JAR

The following command will copy the event listener into it's proper location:
```sh
cedarcli dev copy-keycloak-listener
```

You can execute this command from any location. This command copies the event listener JAR `cedar-keycloak-event-listener.jar` from `$CEDAR_HOME/cedar-keycloak-event-listener/target/` to `${CEDAR_KEYCLOAK_HOME}/providers/`.


???+ warning "Deploy event listener"

    Please deploy the event listener every time a change in its code is performed.
    
    Also please deploy it after each CEDAR release update.

