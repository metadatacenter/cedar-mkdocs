# Directories

## Overview
The CEDAR system runs several microservices and infrastructure services. All these will create log files.
Some of them will create the log folder themselves, some of them chose not to do so (`Nginx` being one example).

We need to make sure all the components that want to log, can log. We will need to create the folders to hold the log files.

CEDAR stores some data on the local filesystem. These folders must also be created.

## Create the directories

Please run:
```sh
cedarcli dev create-directories
```

## Check the directories
```sh
ls -ls ${CEDAR_HOME}/log
```

The output should contain all the directories just created:
```
cadsr-tools
frontend-artifacts
frontend-bridging
frontend-cedar
frontend-cee-demo-angular
frontend-cee-demo-angular-dist
frontend-cee-docs-angular
frontend-cee-docs-angular-dist
frontend-component
frontend-monitoring
frontend-openview
frontend-shared
nginx
server-artifact
server-auth
server-bridge
server-group
server-impex
server-messaging
server-monitor
server-open
server-repo
server-resource
server-schema
server-submission
server-terminology
server-user
server-valuerecommender
server-worker
```
