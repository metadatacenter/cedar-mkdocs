# Install the scripts

???+ warning "Important"

    The steps in this section are crucial for the proper installation of CEDAR.
    
    Please execute these steps with great care.

## Clone the script repo

Please go to your previously created CEDAR Docker home folder, and clone the following repo:

[https://github.com/metadatacenter/cedar-development](https://github.com/metadatacenter/cedar-development)

```sh
cd ~/CEDAR_DOCKER
git clone https://github.com/metadatacenter/cedar-development
cd cedar-development
```

## Copy the helper scripts in place

There are three files that hold configuration.
You need to copy these files from the just cloned repo into CEDAR Docker home folder.

These files are the following: 

| Git file path<br>(in bin/templates/)  | Final path<br>(in ~/CEDAR/)      | Content      |
| -----------                           | -----------                      | -----------  |
| set-env-internal.sh                   | set-env-internal.sh              |  Local infrastructure service connection usernames and password.|
| set-env-external.sh                   | set-env-external.sh              |  Usernames, passwords and other connection data to remote systems that CEDAR integrates with.|
| cedar-profile-docker-eval.sh          | cedar-profile-docker-eval.sh     |  Bash profile extension for Docker install.|

Please copy these files from the recently cloned repo to their final location:

```sh
cd ~/CEDAR_DOCKER/
cp cedar-development/bin/templates/set-env-internal.sh .
cp cedar-development/bin/templates/set-env-external.sh .
cp cedar-development/bin/templates/cedar-profile-docker-eval.sh .
```
