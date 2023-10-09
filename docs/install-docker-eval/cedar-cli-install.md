# Install CEDAR CLI

???+ warning "Important"

    The steps in this section are crucial for the proper installation of CEDAR.
    
    Please execute these steps with great care.

## Clone the CEDAR CLI repo

Please go to your previously created CEDAR Docker home folder, and clone the following repo:

[https://github.com/metadatacenter/cedar-cli](https://github.com/metadatacenter/cedar-cli)

```sh
cd ~/CEDAR_DOCKER
git clone https://github.com/metadatacenter/cedar-cli
```

## Main vs develop branch

The above command cloned the repo, and set the active branch to `main`.

We suggest that you use the latest code from the `develop` branch at the moment.

[//]: # (If you want to have the latest `develop` branch, you will need to check out that branch.)

[//]: # (???+ warning "Important")

[//]: # ()
[//]: # ()
[//]: # (    Unless you specifically need something from the latest `develop` branch, you should use the `main` branch, so skip this step.)

    
```sh
cd cedar-cli
git checkout develop
```

## Configure the CLI

Execute these commands to create a Python virtual envrionment, activate it and install the requirements:

```sh
cd ~/CEDAR_DOCKER/cedar-cli
python -m venv ./.venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Add `CEDAR_HOME` env var and `cedarcli` alias

Edit your bash profile script:
```sh
vi ~/.zshrc
```

Add these lines at the end:
```sh
export CEDAR_HOME=~/CEDAR_DOCKER
alias cedarcli='source $CEDAR_HOME/cedar-cli/cli.sh'
```

## Reload your shell

Reload your shell by closing and opening it again, or by sourcing your profile
