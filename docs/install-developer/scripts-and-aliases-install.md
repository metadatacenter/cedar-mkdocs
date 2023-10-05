# Install the scripts

???+ warning "Important"

    The steps in this section are crucial for the proper installation of CEDAR.
    
    Please execute these steps with great care.

## Copy the helper scripts in place

There are three files that hold configuration that could/should be changed during development.
You need to copy these files from the just cloned repo into CEDAR home folder. There you can make modifications to these files.

These files are the following: 

| Filername                       | Content                                                                                     |
|---------------------------------|---------------------------------------------------------------------------------------------|
| set-env-internal.sh             | Local infrastructure service connection usernames and password.                             |
| set-env-external.sh             | Usernames, passwords and other connection data to remote systems that CEDAR integrates with.|
| cedar-profile-native-develop.sh | Bash profile extension for local development.                                               |

Please copy these files from the recently cloned repo to their final location:

```sh
cd ${CEDAR_HOME}
cp cedar-development/bin/templates/set-env-internal.sh .
cp cedar-development/bin/templates/set-env-external.sh .
cp cedar-development/bin/templates/cedar-profile-native-develop.sh .
```

## Check the location of the new files

```sh
cedarcli check repos
```

should result in:
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Repo/File/Dir                              ┃ File Type ┃    Repo Type     ┃      Recognized as       ┃ Status ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━┩
...
│ cedar-profile-native-develop.sh            │  📄 file  │                  │ Known CEDAR shell script │   ✅   │
│ cedar-project                              │  🗂️  dir   │   java-wrapper   │        CEDAR repo        │   ✅   │
│ cedar-repo-server                          │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ cedar-resource-server                      │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ cedar-rest-library                         │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ cedar-schema-server                        │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ cedar-shared-data                          │  🗂️  dir   │ content-delivery │        CEDAR repo        │   ✅   │
│ cedar-submission-server                    │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ cedar-swagger-ui                           │  🗂️  dir   │ content-delivery │        CEDAR repo        │   ✅   │
│ cedar-template-editor                      │  🗂️  dir   │    angularJS     │        CEDAR repo        │   ✅   │
│ cedar-terminology-server                   │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ cedar-user-server                          │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ cedar-util                                 │  🗂️  dir   │       misc       │        CEDAR repo        │   ✅   │
│ cedar-valuerecommender-server              │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ cedar-worker-server                        │  🗂️  dir   │       java       │        CEDAR repo        │   ✅   │
│ set-env-external.sh                        │  📄 file  │                  │ Known CEDAR shell script │   ✅   │
│ set-env-internal.sh                        │  📄 file  │                  │ Known CEDAR shell script │   ✅   │
└────────────────────────────────────────────┴───────────┴──────────────────┴──────────────────────────┴────────┘
                                           65 object/files recognized
```

## Change the environment variable values

???+ success "Optional"

    This step is optional. On a development machine it is totally acceptable to use the predefined user names, and `changeme` as password for all the systems.
    
    You would definitely change the password for a production system.

If you prefer, you can change the password values, or even the username values in `${CEDAR_HOME}/set-env-internal.sh`.
Please do not change the other two files at this moment.

???+ warning "Important - Remember usernames and passwords"

    If you decide to change the passwords and/or usernames, please remember that you will need to set the usernames and passwords later, when you install the infrastructure services for CEDAR.

???+ warning "Important - Preexisting connection data"

    If you have a system already installed onto your system (for instance you have `MongoDB`), and you wish to reuse an existing privileged user for CEDAR, please change the corresponding values in `${CEDAR_HOME}/set-env-internal.sh`.
    
    In this case you would change the following lines:
    ```sh
    export CEDAR_MONGO_ROOT_USER_NAME="mongoRootUser"
    export CEDAR_MONGO_ROOT_USER_PASSWORD="changeme"   
    ```
