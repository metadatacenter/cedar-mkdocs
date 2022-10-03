# Start nginx

You can start `nginx` with our dedicated alias.

???+ warning "User password required"

    Since `nginx` listens on a low port (lower than `1024`), it requires your password to start up.
    
    You need necessary privileges to start a listener on a low port.
    If the current user was created as `Administrator` on a Mac, that would be enough. 

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
