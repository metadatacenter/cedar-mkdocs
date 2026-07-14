# Configuration

## CEDAR Home Directory

You will need a directory where all the CEDAR-related code, configuration, log files and some executable will reside.
You should create a directory under your home directory:

```sh
mkdir ~/CEDAR 
```

???+ warning "Important"

    Of course, you can choose to have this CEDAR home directory in a different place.
    We have an environment variable (set up later during this guide as `CEDAR_HOME`) which holds this path.
    
    We suggest, however, that your CEDAR home directory path does not contain spaces or special characters.

    If you see this path referenced directly in this guide (as in `~/CEDAR`) and you did not use the same path, please replace it with the proper value on your system.

## Usernames and Passwords

Throughout this guide we use some default usernames and passwords.

The usernames reflect the system name they are associated with and their usage intent (e.g. `cedarMongoUser` is CEDAR app level user for MongoDB access).

The passwords for all the users are set to `changeme`.

You are welcome to change the usernames and/or passwords, but please make note of them.
You will need them to properly configure the environment variables that govern the CEDAR configuration.

## CEDAR Domain

This guide assumes that the installation will be available at `cedar.metadatacenter.orgx`.
Please note the `x` at the end of `orgx`.
This way the development environment will be close to the final production environment even in the domain names.

???+ warning "Important"
    
    We encourage you to follow this naming convention. The domain name appears in several places in this guide.
    
    Of course, if you prefer, you can set up your environment for a different domain.
    
    In that case, please make sure that you replace the domain name/names in every command and every file that references it.

## Subdomains

### Overview
The CEDAR system runs several microservices. These run on different TCP ports, and the `nginx` reverse proxy in front of them hides them.

However, we need to expose these microservices to the world. This is done using subdomains. Each microservice has its own subdomain under the main CEDAR domain.

For a local development machine the easiest way to have these subdomains resolved by the operating system is to add them to the hosts file.

Since there are numerous such subdomains, we created a script which will add the subdomains to your hosts file.

### Check the `CEDAR_HOST` variable

```sh
cedarcli env filter CEDAR_HOST
```

The output should be:
```
    CEDAR environment variables
┏━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┓
┃ Name       ┃ Value               ┃
┡━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━┩
│ CEDAR_HOST │ metadatacenter.orgx │
└────────────┴─────────────────────┘
            1 variables
```

If this is not what you see, please go back to the previous steps, and fix this. 

### Add the subdomains

Our utility script will check each subdomain by pinging it. 
If the host does not reply, we consider that the subdomain is non-resolvable, so we need to add it to the `/etc/hosts` file.

???+ warning "Important"

    Once the pinging part is done, our utility script will ask for your password in order to make a `sudo`.
    It will append the unknown hosts to the end of the file, with a proper comment.
    
    If you do not feel comfortable with this process, please analyze the script, and make the necessary changes by hand.   

Please run:
```sh
cedarcli dev add-hosts
```

The output of the script should be similar to the one below:

```
Testing the list of CEDAR hosts:
Host unknown : artifact.metadatacenter.orgx
Host unknown : artifacts.metadatacenter.orgx
Host unknown : bridge.metadatacenter.orgx
Host unknown : bridging.metadatacenter.orgx
Host unknown : auth.metadatacenter.orgx
Host unknown : cedar.metadatacenter.orgx
Host unknown : content.metadatacenter.orgx
Host unknown : group.metadatacenter.orgx
Host unknown : impex.metadatacenter.orgx
Host unknown : monitor.metadatacenter.orgx
Host unknown : monitoring.metadatacenter.orgx
Host unknown : messaging.metadatacenter.orgx
Host unknown : open.metadatacenter.orgx
Host unknown : openview.metadatacenter.orgx
Host unknown : repo.metadatacenter.orgx
Host unknown : resource.metadatacenter.orgx
Host unknown : schema.metadatacenter.orgx
Host unknown : submission.metadatacenter.orgx
Host unknown : terminology.metadatacenter.orgx
Host unknown : user.metadatacenter.orgx
Host unknown : valuerecommender.metadatacenter.orgx
Host unknown : worker.metadatacenter.orgx
Host unknown : demo.cee.metadatacenter.orgx
Host unknown : demo-dist.cee.metadatacenter.orgx
Host unknown : docs.cee.metadatacenter.orgx
Host unknown : docs-dist.cee.metadatacenter.orgx
Some CEDAR hosts are unknown, we will prompt for your password in order to make modifications to /etc/hosts !
Host unknown, adding to /etc/hosts: artifact.metadatacenter.orgx
Host unknown, adding to /etc/hosts: artifacts.metadatacenter.orgx
Host unknown, adding to /etc/hosts: bridge.metadatacenter.orgx
Host unknown, adding to /etc/hosts: bridging.metadatacenter.orgx
Host unknown, adding to /etc/hosts: auth.metadatacenter.orgx
Host unknown, adding to /etc/hosts: cedar.metadatacenter.orgx
Host unknown, adding to /etc/hosts: content.metadatacenter.orgx
Host unknown, adding to /etc/hosts: group.metadatacenter.orgx
Host unknown, adding to /etc/hosts: impex.metadatacenter.orgx
Host unknown, adding to /etc/hosts: monitor.metadatacenter.orgx
Host unknown, adding to /etc/hosts: monitoring.metadatacenter.orgx
Host unknown, adding to /etc/hosts: messaging.metadatacenter.orgx
Host unknown, adding to /etc/hosts: open.metadatacenter.orgx
Host unknown, adding to /etc/hosts: openview.metadatacenter.orgx
Host unknown, adding to /etc/hosts: repo.metadatacenter.orgx
Host unknown, adding to /etc/hosts: resource.metadatacenter.orgx
Host unknown, adding to /etc/hosts: schema.metadatacenter.orgx
Host unknown, adding to /etc/hosts: submission.metadatacenter.orgx
Host unknown, adding to /etc/hosts: terminology.metadatacenter.orgx
Host unknown, adding to /etc/hosts: user.metadatacenter.orgx
Host unknown, adding to /etc/hosts: valuerecommender.metadatacenter.orgx
Host unknown, adding to /etc/hosts: worker.metadatacenter.orgx
Host unknown, adding to /etc/hosts: demo.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: demo-dist.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: docs.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: docs-dist.cee.metadatacenter.orgx
```

### Check the subdomains
You should run our script a second time.
Since all the hosts should be known at this point, the script should report that there is nothing to do.

```sh
cedarcli dev add-hosts
```

The output should be:
```
Testing the list of CEDAR hosts:
Host known   : artifact.metadatacenter.orgx
Host known   : artifacts.metadatacenter.orgx
Host known   : bridge.metadatacenter.orgx
Host known   : bridging.metadatacenter.orgx
Host known   : auth.metadatacenter.orgx
Host known   : cedar.metadatacenter.orgx
Host known   : content.metadatacenter.orgx
Host known   : group.metadatacenter.orgx
Host known   : impex.metadatacenter.orgx
Host known   : monitor.metadatacenter.orgx
Host known   : monitoring.metadatacenter.orgx
Host known   : messaging.metadatacenter.orgx
Host known   : open.metadatacenter.orgx
Host known   : openview.metadatacenter.orgx
Host known   : repo.metadatacenter.orgx
Host known   : resource.metadatacenter.orgx
Host known   : schema.metadatacenter.orgx
Host known   : submission.metadatacenter.orgx
Host known   : terminology.metadatacenter.orgx
Host known   : user.metadatacenter.orgx
Host known   : valuerecommender.metadatacenter.orgx
Host known   : worker.metadatacenter.orgx
Host known   : demo.cee.metadatacenter.orgx
Host known   : demo-dist.cee.metadatacenter.orgx
Host known   : docs.cee.metadatacenter.orgx
Host known   : docs-dist.cee.metadatacenter.orgx
All CEDAR hosts are known, nothing to do
```

???+ warning "Important"
    
    If this is not what you see, please go back, and try to fix the issue.

## Directories

### Overview
The CEDAR system runs several microservices and infrastructure services. All these will create log files.
Some of them will create the log folder themselves, some of them chose not to do so (`Nginx` being one example).

We need to make sure all the components that want to log, can log. We will need to create the folders to hold the log files.

CEDAR stores some data on the local filesystem. These folders must also be created.

### Create the directories

Please run:
```sh
cedarcli dev create-directories
```

### Check the directories
```sh
ls -ls ${CEDAR_HOME}/log
```

The output should contain all the directories just created:
```
cadsr-tools
frontend-artifacts
frontend-bridging
frontend-cedar
frontend-cee-demo-angular
frontend-cee-demo-angular-dist
frontend-cee-docs-angular
frontend-cee-docs-angular-dist
frontend-content
frontend-monitoring
frontend-openview
frontend-shared
nginx
server-artifact
server-auth
server-bridge
server-group
server-impex
server-messaging
server-monitor
server-open
server-repo
server-resource
server-schema
server-submission
server-terminology
server-user
server-valuerecommender
server-worker
```
