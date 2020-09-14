CEDAR uses MongoDB as the storage for the CEDAR artifacts: fields, elements, templates and metadata instances.

# Install MongoBD

Please install `MongoDB-Community, version 3.4`:

    brew install mongodb-community@3.4
    
**Important!**

Do not add MongoDB as a background service! We will have scripts in place which will start MongoDB when necessary.

Do not start MongoDB at this point!

# Start MongoDB without access control
In order to have secure access to MongoDB, we will create a privileged user, a dedicated CEDAR user, and we will turn on access control.

First, we will create a power user. You will need to start MongoDB without access control from the command line.

Please replace the path below with the one applicable to your system:
```
/usr/local/Cellar/mongodb-community@3.4/3.4.24/bin/mongod \
--port 27017 \
--dbpath /usr/local/var/mongodb
```

# Create privileged user
Once mongoDB is started, in a different terminal connect to it:

    /usr/local/Cellar/mongodb-community@3.4/3.4.24/bin/mongo

In this new terminal use the `admin` collection and create a privileged user:
```
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

Close this terminal, and stop the running MongoDB by pressing ^C.

# Start MongoDB with access control
    brew services start mongodb-community@3.4

# Create CEDAR application user
Connect to MongoDB with the previously created user:
```
/usr/local/Cellar/mongodb-community@3.4/3.4.24/bin/mongo \
--port 27017 \
--username "mongoRootUser" \
--password "changeme" \
--authenticationDatabase "admin"
```

Create the user:
```
use cedar

db.createUser(
  {
   user: "cedarMongoUser",
   pwd: "changeme",
   roles: [ "readWrite"]
  })

exit
```

# Restart MongoDB
    brew services restart mongodb-community@3.4