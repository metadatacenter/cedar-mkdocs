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
cd cedar-cli
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
