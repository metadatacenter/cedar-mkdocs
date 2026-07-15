# CEDAR CLI and Scripts

## Install CEDAR CLI

???+ warning "Important"

    These steps are crucial for the proper installation of CEDAR.
    
    Please execute these steps with great care.

### Clone the CEDAR CLI repo

Please go to your previously created CEDAR Docker home folder, and clone this repo:

[https://github.com/metadatacenter/cedar-cli](https://github.com/metadatacenter/cedar-cli)

```sh
cd ~/CEDAR_DOCKER
git clone https://github.com/metadatacenter/cedar-cli
cd cedar-cli
```

### Configure the CLI

Execute these commands to create a Python virtual envrionment, activate it and install the requirements:

```sh
cd ~/CEDAR_DOCKER/cedar-cli
python -m venv ./.venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Add `CEDAR_HOME` env var and `cedarcli` alias

Edit your bash profile script:
```sh
vi ~/.zshrc
```

Add these lines at the end:
```sh
export CEDAR_HOME=~/CEDAR_DOCKER
alias cedarcli='source $CEDAR_HOME/cedar-cli/cli.sh'
```

### Reload your shell

Reload your shell by closing and opening it again, or by sourcing your profile

## Clone the Docker repos

CEDAR does not publish Docker images to DockerHub or to our Nexus server.
Instead of retrieving the docker images, you will need to build them locally.

### Clone the repos using CLI script

Clone the needed repos and then pull the `develop` branch by executing:
 
```sh
cedarcli git clone docker
```

It is fine if the second command results in some warnings. We are not using all the source repos that the cli has knowledge of.

## Source shell scripts

Please edit your `.bash_profile` (or `.zshrc`) and add this line to it:

```sh
source ${CEDAR_HOME}/cedar-development/bin/templates/cedar-profile-docker-eval.sh
```

As a result, this is how the CEDAR section of your `bash profile` should look like:

```sh
export CEDAR_HOME=~/CEDAR_DOCKER
alias cedarcli='source $CEDAR_HOME/decar-cli/cli.sh'
source ${CEDAR_HOME}/cedar-development/bin/templates/cedar-profile-docker-eval.sh
```

???+ warning "Important"

    Check your setup at this point.
    Please close your shells, and start a new one.
    
    Execute the following:
    ```sh
    cedarcli env list
    ```

    You should see a list of ~166 environment variables

### CEDAR Docker shell environment

Please make sure, that during this installation, and later during starting/stopping the CEDAR Docker components you always use a shell where the `CEDAR_HOME` is set, and the above mentioned script is sourced.

If you are using a terminal with multiple profile support (e.g. iTerm), make sure the active profile has the `CEDAR` environment set.

## Overview

During the installation and maintenance of CEDAR Docker you can take advantage of the numerous commands of `cedarcli`.

## cedarcli env list

`cedarcli env list` stands for CEDAR CLI Environment Variables List. You can check the values of all the environment variables that begin with the prefix `CEDAR_` in your current environment.

### Running `cedarcli env list`
Execute this: 
```sh
cedarcli env list
```

You should see an output resembling this:

```
                                    CEDAR environment variables
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Name                                          ┃ Value                                            ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ CEDAR_ADMIN_USER_API_KEY                      │ 0000111122223333444455556666777788889999aaaabbb… │
│ CEDAR_ADMIN_USER_PASSWORD                     │ Password123                                      │
│ CEDAR_ANALYTICS_KEY                           │ false                                            │
│ CEDAR_ARTIFACT_ADMIN_PORT                     │ 9101                                             │
│ CEDAR_ARTIFACT_HTTP_PORT                      │ 9001                                             │
│ CEDAR_ARTIFACT_SERVER_HOST                    │ 192.1680.17.111                                  │
│ CEDAR_ARTIFACT_STOP_PORT                      │ 9201                                             │
...
│ CEDAR_WORKER_HTTP_PORT                        │ 9011                                             │
│ CEDAR_WORKER_SERVER_HOST                      │ 192.1680.17.111                                  │
│ CEDAR_WORKER_STOP_PORT                        │ 9211                                             │
└───────────────────────────────────────────────┴──────────────────────────────────────────────────┘
                                           166 variables
```

### Debugging `cedarcli env list`
If your output looks different from the one presented above, please go back, and start from beginning.
You will need your environment set up correctly before proceeding.

## cedarcli server status

`cedarcli server status` and its shortcut `cedarcli status` stands for CEDAR CLI Server Status. You can check the status of the various components.

### Running `cedarcli server status`
Execute this: 
```sh
cedarcli server status
# or
cedarcli status
```

You should see the following output:

```
                 CEDAR Server status list
┏━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━┳━━━━━━━━━━━━━━━┓
┃ Server                 ┃ Status ┃ Port  ┃ Error         ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━╇━━━━━━━━━━━━━━━┩
│ Microservice           │        │       │               │
│ artifact               │ ❌     │ 9001  │ Port not open │
│ bridge                 │ ❌     │ 9015  │ Port not open │
│ group                  │ ❌     │ 9009  │ Port not open │
│ impex                  │ ❌     │ 9008  │ Port not open │
│ messaging              │ ❌     │ 9012  │ Port not open │
│ monitor                │ ❌     │ 9014  │ Port not open │
│ open                   │ ❌     │ 9013  │ Port not open │
│ repo                   │ ❌     │ 9002  │ Port not open │
│ resource               │ ❌     │ 9007  │ Port not open │
│ schema                 │ ❌     │ 9003  │ Port not open │
│ submission             │ ❌     │ 9010  │ Port not open │
│ terminology            │ ❌     │ 9004  │ Port not open │
│ user                   │ ❌     │ 9005  │ Port not open │
│ valuerecommender       │ ❌     │ 9006  │ Port not open │
│ worker                 │ ❌     │ 9011  │ Port not open │
├────────────────────────┼────────┼───────┼───────────────┤
│ Infrastructure         │        │       │               │
│ MongoDB                │ ❌     │ 27017 │ Port not open │
│ OpenSearch-REST        │ ❌     │ 9200  │ Port not open │
│ OpenSearch-Transport   │ ❌     │ 9300  │ Port not open │
│ NGINX                  │ ❌     │ 80    │ Port not open │
│ Keycloak               │ ❌     │ 8080  │ Port not open │
│ Neo4j                  │ ❌     │ 7474  │ Port not open │
│ Redis-persistent       │ ❌     │ 6379  │ Port not open │
│ MySQL                  │ ❌     │ 3306  │ Port not open │
├────────────────────────┼────────┼───────┼───────────────┤
│ Frontend               │        │       │               │
│ main                   │ ❌     │ 4200  │ Port not open │
│ openview               │ ❌     │ 4220  │ Port not open │
│ component              │ ❌     │ 4240  │ Port not open │
│ monitoring             │ ❌     │ 4300  │ Port not open │
│ artifacts              │ ❌     │ 4320  │ Port not open │
│ bridging               │ ❌     │ 4340  │ Port not open │
├────────────────────────┼────────┼───────┼───────────────┤
│ Frontend-non-essential │        │       │               │
│ cee-dev                │ ❌     │ 4400  │ Port not open │
│ demo.cee               │ ❌     │ 4260  │ Port not open │
│ docs.cee               │ ❌     │ 4280  │ Port not open │
└────────────────────────┴────────┴───────┴───────────────┘
```

### Checking `cedarcli server status`
As you can see, all the services should be stopped at this point.

### Preexisting services

If you have some services in the running state, that means that you already have some components of the CEDAR system installed.

This will cause issues since there will be a collision on the ports that CEDAR services will try to connect.

???+ warning "Important - Stop conflicting services"
    
    If at this point you see any servers running on any of the ports enumerated here, please stop those services.
    
    The Dockerized CEDAR exposes all the infrastructure services on their native ports in order for the evaluator to be able to connect and inspect them.
    
    Conflicting services will make the Dockerized CEDAR not run properly.
