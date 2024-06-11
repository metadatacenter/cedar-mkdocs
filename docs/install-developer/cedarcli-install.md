# cedar-cli

## Install `cedar-cli`
Install `cedar-cli` by executing the following script:

```sh
export CEDAR_HOME=~/CEDAR

cd ~/CEDAR
git clone https://github.com/metadatacenter/cedar-cli

cd cedar-cli
git checkout develop

python -m venv ./.venv
source .venv/bin/activate
pip install -r requirements.txt

python -m pip install --upgrade pip
```

## Configure `CEDAR_HOME` and `cedarcli` alias

```sh
vi ~/.zshrc
```

Add these lines:

```sh
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"
```

## Check bash profile content

At this point, your `~/.zshrc` should contain these lines:

```sh
export PATH=$(brew --prefix)/opt/openssl@1.1/bin:$PATH

export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"

export CEDAR_HOME=~/CEDAR
alias cedarcli='source $CEDAR_HOME/cedar-cli/cli.sh'
```

If you are installing on a system where `Python 3` CLI is available as `python3` instead of `python`, use this alternative instead:

```sh
alias cedarcli='source $CEDAR_HOME/cedar-cli/cli3.sh'
```
