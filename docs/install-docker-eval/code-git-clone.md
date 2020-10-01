# Clone the Docker repos

CEDAR does not publish Docker images to DockerHub or to our Nexus server.
Instead of retrieving the docker images, you will need to build them locally.

This will be actually done transparently for you, if you follow this guide.

## Clone the repos using util script

Clone these two repos which hold the Dockerfiles and the docker-compose descriptors for all the system components:
 
```sh
cd ${CEDAR_DOCKER_HOME}
${CEDAR_DEVELOP_HOME}/bin/util/git/git-clone-all.sh
```

This will clone all the repos that are needed for the CEDAR Docker evaluation.

# Master vs develop branch

The above command cloned two repos, and set the active branch to `master`.

If you want to have the latest develop branch, you will need to check out that branch.

???+ warning "Important"

    Unless you specifically need something from the latest `develop` branch, you should use the `master` branch, so skip this step.
    
```sh
cd ${CEDAR_DOCKER_HOME}
cd cedar-docker-build
git checkout develop

cd ${CEDAR_DOCKER_HOME}
cd cedar-docker-develop
git checkout develop
```
