# Clone the Docker repos

CEDAR does not publish Docker images to DockerHub or to our Nexus server.
Instead of retrieving the docker images, you will need to build them locally.

This will be actually done transparently for you, if you follow this guide.

## Clone the repos using CLI script

Clone the needed repos and then pull the `develop` branch by executing:
 
```sh
cedarcli git clone docker
```

It is fine if the second command results in some warnings. We are not using all the source repos that the cli has knowledge of.
