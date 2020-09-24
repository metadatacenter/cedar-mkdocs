# Install the scripts

???+ warning "Important"

    The steps in this section are crucial for the proper installation of CEDAR.
    
    Please execute these steps with great care.

## Clone the script repo

Please go to your previously created CEDAR home folder, and clone the following repo:

[https://github.com/metadatacenter/cedar-development](https://github.com/metadatacenter/cedar-development)

Since we are in development mode, please check out the `develop` branch. 

```sh
cd ~/CEDAR
git clone https://github.com/metadatacenter/cedar-development
cd cedar-development
git checkout develop
```

## Copy the helper scripts in place

There are three files that hold configuration that could/should be changed during development.
You need to copy these files from the just cloned repo into CEDAR home folder. There you can make modifications to these files.

These files are the following: 

| Git file path<br>(in bin/templates/)  | Final path<br>(in ~/CEDAR/)      | Content      |
| -----------                           | -----------                      | -----------  |
| set-env-internal.sh                   | set-env-internal.sh              |  Local infrastructure service connection usernames and password.|
| set-env-external.sh                   | set-env-external.sh              |  Usernames, passwords and other connection data to remote systems that CEDAR integrates with.|
| cedar-profile-native-develop.sh       | cedar-profile-native-develop.sh  |  Bash profile extension for local development.|

Please copy these files from the recently cloned repo to their final location:

```sh
cd ~/CEDAR/
cp cedar-development/bin/templates/set-env-internal.sh .
cp cedar-development/bin/templates/set-env-external.sh .
cp cedar-development/bin/templates/cedar-profile-native-develop.sh .
```

## Change the environment variable values

???+ success "Optional"

    This step is optional. On a development machine it is totally acceptable to use the predefined user names, and `changeme` as password for all the systems.
    
    You would definitely change the password for a production system.

If you prefer, you can change the password values, or even the username values in `~/CEDAR/set-env-internal.sh`.
Please do not change the other two files at this moment.

???+ warning "Important - Remember usernames and passwords"

    If you decide to change the passwords and/or usernames, please remember that you will need to set the usernames and passwords later, when you install the infrastructure services for CEDAR.

???+ warning "Important - Preexisting connection data"

    If you have a system already installed onto your system (for instance you have `MongoDB`), and you wish to reuse an existing privileged user for CEDAR, please change the corresponding values in `~/CEDAR/set-env-internal.sh`.
    
    In this case you would change the following lines:
    ```sh
    export CEDAR_MONGO_ROOT_USER_NAME="mongoRootUser"
    export CEDAR_MONGO_ROOT_USER_PASSWORD="changeme"   
    ```
