# Source Docker aliases scripts

Please edit your `bash profile` and add the following lines to the end of it:

```sh
source ${CEDAR_DOCKER_HOME}/cedar-docker-deploy/bin/util/set-docker-aliases.sh
```

As a result, this is how the CEDAR section of your `bash profile` should look like:

```sh
# CEDAR Docker related scripts, aliases, environment variables
export CEDAR_DOCKER_HOME=${HOME}/CEDAR_DOCKER/
source ${CEDAR_DOCKER_HOME}/cedar-development/bin/templates/cedar-profile-docker-eval.sh
```

???+ warning "Important"

    Check your setup at this point.
    Please close your shells, and start a new one.
    
    Check if there are no errors when starting a new shell.
    
