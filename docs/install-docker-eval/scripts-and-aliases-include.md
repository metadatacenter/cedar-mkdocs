# Source shell scripts

Please edit your `.bash_profile` (or `.zshrc`) and add the following line to it:

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

    You should see a list of ~169 environment variables

## CEDAR Docker shell environment

Please make sure, that during this installation, and later during starting/stopping the CEDAR Docker components you always use a shell where the `CEDAR_HOME` is set, and the above mentioned script is sourced.

If you are using a terminal with multiple profile support (e.g. iTerm), make sure the active profile has the `CEDAR` environment set.
