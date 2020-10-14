# Install Keycloak event listener

The CEDAR system needs to be notified every time when a login request is performed against the Keycloak authentication module.

In order to accomplish this, we have an event listener in place.
This is part of the CEDAR codebase, it resides in the `cedar-keycloak-event-listener` repo.

You will need to install this event listener under `Keycloak`

Ideally this event listener should be updated all the times when a CEDAR build is performed.
However, if there are no changes in the CEDAR codebase which will have an effect on the event listener, it is ok not to update the event listener.

## Configure Keycloak

You will need to do this only once:

```sh
vi ${CEDAR_KEYCLOAK_HOME}/standalone/configuration/standalone.xml
``` 

Around `Line #597` you will see the last `<spi>` element closing, just before the `<subsystem>` element closes as well.

After the last `<spi>` add this block:
```xml
<spi name="eventsListener">
    <provider name="CEDAR-event-listener" enabled="true">
        <properties>
            <property name="userEventList" value="[&quot;LOGIN&quot;]"/>
            <property name="userEventCallbackURL" value="http://${env.CEDAR_NET_GATEWAY}:${env.CEDAR_RESOURCE_HTTP_PORT}/command/auth-user-callback"/>
            <property name="adminResourceList" value="[&quot;USER&quot;]"/>
            <property name="adminResourceCallbackURL" value="http://${env.CEDAR_NET_GATEWAY}:${env.CEDAR_RESOURCE_HTTP_PORT}/command/auth-admin-callback"/>
            <property name="linkedDataUserBase" value="https://metadatacenter.org/users/"/>
            <property name="apiKey" value="${env.CEDAR_ADMIN_USER_API_KEY}"/>
            <property name="clientId" value="cedar-angular-app"/>
        </properties>
    </provider>
</spi>
```

???+ success "User base domain"

    You might notice that our user base domain is set to `metadatacenter.org` instead of `metadatacenter.orgx`.
    
    This is actually correct, our team decided that we allow changing the base domain for all the artifacts, but we keep our users under the same base domain. 


## Deploy the event listener `jar` under `Keycloak'

The following command will copy the event listener into it's proper location:
```sh
copylistener
```

You can execute this command from any location.

You can find out what the command actually does by executing:
```sh
alias copylistener
```

???+ warning "Deploy event listener"

    Please deploy the event listener every time a change in its code is performed..
    
    Also please deploy it after a version change.

