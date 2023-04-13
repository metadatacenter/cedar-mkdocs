# Start nginx

You can start `nginx` with our dedicated alias.

???+ warning "User password required"

    Since `nginx` listens on a low port (lower than `1024`), it requires your password to start up.
    
    You need necessary privileges to start a listener on a low port.
    If the current user was created as `Administrator` on a Mac, that would be enough. 

## Starting `nginx` without user password

Entering the user's password in every new shell window could be a disturbance.
You can circumvent this if you add the scripts that `startnginx` and `stopnginx` uses to the `sudoers`.
Edit the `sudoers` file:

```sh
sudo visudo -f /etc/sudoers.d/cedar-dev
```

Add this line to the file:
```sh
cedar-dev ALL=(ALL) NOPASSWD: /Users/cedar-dev/CEDAR/cedar-development/bin/util/services-osx/startnginx.sh,/Users/cedar-dev/CEDAR/cedar-development/bin/util/services-osx/stopnginx.sh
```

???+ warning "Quicker version - username and `CEDAR_HOME`"

    The above assumes that your username is `cedar-dev` and CEDAR is installed under `/Users/cedar-dev/CEDAR/` (value of `${CEDAR_HOME}`)

    If that is not true, change the values in the above command and text

    Alternatively you can execute:

    ```sh
    echo `whoami` 'ALL=(ALL) NOPASSWD:' ${CEDAR_HOME}/cedar-development/bin/util/services-osx/startnginx.sh,${CEDAR_HOME}/cedar-development/bin/util/services-osx/stopnginx.sh 
    ```

    and add the content to the file opened after:
    ```sh
    sudo visudo -f /etc/sudoers.d/cedar-dev
    ```



## Allow `nginx` to read `CEDAR_HOME`

Nginx will serve static content aside of acting as a reverse proxy. In order to achieve this, it will need read privileges for the full path of the `CEDAR_HOME`.

Please execute the following command to allow it to read your home directory:

```
chmod o+x /Users/cedar-dev/
```

Please replace `cedar-dev` with your own username if you are using a different one!

## Start `nginx`
```sh
startnginx
```

## Check `nginx` status
```sh
cedarss
```

You should see the following line in the output:
```
| NGINX                      | Running | httpResponse|   80| Server:\snginx    |
```
