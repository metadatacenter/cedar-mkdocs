# Startup and stop scripts

There are start and stop scripts available for each service that is present in the CEDAR ecosystem.

These will be introduced throughout this guide. As an example starting and stopping `MongoDB` after a brew installation would be done with:

???+ warning "Important - Not yet working at this moment"

    The examples below won't work at this phase of the installation process, they are just listed as an explanation. 


```sh
brew services start mongodb-community@5.0
brew services stop mongodb-community@5.0
```

In the CEDAR environment we have these aliases for simplicity:

```sh
startmongo
stopmongo
```


## List of startup scripts
A non-exhaustive list of the start aliases is as follows

* Infrastructure
```sh
startmongo
startneo
startmysql
startsearch
startredis
startnginx
startkk
```

* Microservices
```sh
startmessaging
startgroup
startrepo
startresource
startschema
startartifact
startterminology
startuser
startvaluerecommender
startsubmission
startworker
startopenview
startinternals
```
* Frontend
```sh
starteditor
```

## List of stop scripts
For each start script/alias there is a corresponding stop script (with some exceptions).
We will not enumerate all these.
The full list of aliases available can be listed using:

```sh
alias
```
