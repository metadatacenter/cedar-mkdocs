# Directories

## Overview
The CEDAR system runs several microservices and infrastructure services. All these will create log files.
Some of them will create the log folder themselves, some of them chose not to do so (`Nginx` being one example).

We need to make sure all the components that want to log, can log. We will need to create the folders to hold the log files.

CEDAR stores some data on the local filesystem. These folders must also be created.

## Create the directories

Please run:
```sh
${CEDAR_DEVELOP_HOME}/bin/util/localdev/create-directories.sh
```

## Check the directories
You should run our script a second time.
Since all the hosts should be known at this point, the script should report that there is nothing to do.

```sh
ls ${CEDAR_HOME}
ls ${CEDAR_HOME}/log
```

The output should contain all the directories just created.
