# CEDAR Docker Home Directory

You will need a directory where all the CEDAR Docker related code, configuration and some executable will reside.
You should create a directory under your home directory:

```shell
mkdir ~/CEDAR_DOCKER
```

???+ warning "Important"

    Of course, you can choose to have this CEDAR Docker home directory in a different place.
    We have an environment variable (set up later during this guide as `CEDAR_DOCKER_HOME`) which holds this path.
    
    We suggest, however, that your CEDAR Docker home directory path does not contain spaces or special characters.

    If you see this path referenced directly in this guide (as in `~/CEDAR_DOCKER`) and you did not use the same path, please replace it with the proper value on your system.  
