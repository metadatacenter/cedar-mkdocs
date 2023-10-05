# MongoDB
CEDAR uses `MongoDB` as the storage for the CEDAR artifacts: fields, elements, templates and metadata instances.

## Install MongoBD

Please install `MongoDB Community`, version 5.0:

```sh
brew tap mongodb/brew
brew install mongodb-community@5.0
```

And pin this version:

```sh
brew pin mongodb-community@5.0
```

???+ warning "Important"
    
    Do not add MongoDB as a background service! We will have scripts in place which will start it when necessary.

    **Do not start MongoDB at this point!**

## Start MongoDB without access control
In order to have secure access to MongoDB, we will create a privileged user, a dedicated CEDAR user, and we will turn on access control.

First, we will create a power user. You will need to start MongoDB without access control from the command line.

Please replace the path below with the one applicable to your system:

```sh
$(brew --prefix)/Cellar/mongodb-community@5.0/5.0.<patch_version>/bin/mongod \
  --port 27017 \
  --dbpath $(brew --prefix)/var/mongodb
```

## Create privileged user
Once mongoDB is started, in a different terminal connect to it:

```sh
$(brew --prefix)/Cellar/mongodb-community@5.0/5.0.<patch_version>/bin/mongo
```

In this new terminal use the `admin` collection and create a privileged user:

```js
use admin

db.createUser(
  {
    user: "mongoRootUser",
    pwd: "changeme",
    roles: [ { role: "root", db: "admin" } ]
  }
)

exit
```

Close this terminal, and stop the running MongoDB by pressing ++ctrl++ + C.

## Start MongoDB with access control
```sh
startmongo
```

## Create CEDAR application user
Connect to MongoDB with the previously created user:
```sh
$(brew --prefix)/Cellar/mongodb-community@5.0/5.0.<patch_version>/bin/mongo \
  --port 27017 \
  --username "mongoRootUser" \
  --password "changeme" \
  --authenticationDatabase "admin"
```

Create the user:
```js
use cedar

db.createUser(
  {
   user: "cedarMongoUser",
   pwd: "changeme",
   roles: [ "readWrite"]
  })

exit
```

## Restart MongoDB
```sh
stopmongo
startmongo
```

## Check MongoDB status
```sh
cedarcli status
```

You should see the following line in the output:
```
| MongoDB                    | Running | openPort    |27017|                   |
```
