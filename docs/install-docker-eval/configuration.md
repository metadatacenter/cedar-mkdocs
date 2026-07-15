# Configuration

## CEDAR Docker Home Directory

You will need a directory where all the CEDAR Docker related code, configuration and some executable will reside.
You should create a directory under your home directory:

```sh
mkdir ~/CEDAR_DOCKER
```

???+ warning "Important"

    Of course, you can choose to have this CEDAR Docker home directory in a different place.
    We have an environment variable (set up later as `CEDAR_HOME`) which holds this path.
    
    We suggest, however, that your CEDAR Docker home directory path does not contain spaces or special characters.

    If you see this path referenced directly (as in `~/CEDAR_DOCKER`) and you did not use the same path, please replace it with the proper value on your system.  

## Usernames and Passwords

We use some default usernames and passwords.

Please do not change these for the evaluation phase.
If you decide to use CEDAR, please change these variables before the first run.

## CEDAR Docker Domain

The domain used in the CEDAR Docker images is `cedar.metadatacenter.orgx`.
Please note the `x` at the end of `orgx`.

Since this installation serves evaluation purposes, please do not try to change this domain name, even if you find some of the places that will contain this string.
