# Source shell scripts

Please edit your `bash profile` and add the following lines to it:

```sh
# CEDAR development related scripts, aliases, environment variables
export CEDAR_HOME=${HOME}/CEDAR
source ${CEDAR_HOME}/cedar-profile-native-develop.sh
```

???+ warning "Important"

    Check your setup at this point.
    Please close your shells, and start a new one.
    
    Execute the following:
    ```sh
    cedarenv
    ```

    You should see a list of 130+ environment variables

## CEDAR development shell environment

Please make sure, that during this installation, and later during development you always use a shell where the `CEDAR_HOME` is set, and the above mentioned script is sourced.

If you are using a terminal with multiple profile support (e.g. iTerm), make sure the active profile has the `CEDAR` environment set.
