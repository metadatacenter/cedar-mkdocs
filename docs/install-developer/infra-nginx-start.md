# Start nginx

You can start `nginx` with our dedicated alias.

???+ warning "User password required"

    Since `nginx` listens on a low port (<`1024`), it requires your password to start up.
    
    You need necessary privileges to start a listener on a low port.
    If the current user was created as `Administrator` on a Mac, that would be enough. 


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
