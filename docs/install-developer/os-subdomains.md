# Subdomains

## Overview
The CEDAR system runs several microservices. These run on different TCP ports, and the `nginx` reverse proxy in front of them hides them.

However, we need to expose these microservices to the world. This is done using subdomains. Each microservice has its own subdomain under the main CEDAR domain.

For a local development machine the easiest way to have these subdomains resolved by the operating system is to add them to the hosts file.

Since there are numerous such subdomains, we created a script which will add the subdomains to your hosts file.

## Check the `CEDAR_HOST` variable

```sh
cedarenv | grep CEDAR_HOST
```

The output should be:
```
CEDAR_HOST=metadatacenter.orgx
```

If this is not what you see, please go back to the previous steps, and fix this. 

## Add the subdomains

Our utility script will check each subdomain by pinging it. 
If the host will not reply, we consider that the subdomain is non-resolvable, so we need to add it to the `/etc/hosts` file.

???+ warning "Important"

    Once the pinging part is done, our utility script will ask for your password in order to make a `sudo`.
    It will append the unknow hosts to the end of the file, with a proper comment.
    
    If you do not feel comfortable with this process, please analyze the script, and make the necessary changes by hand.   

Please run:
```sh
${CEDAR_DEVELOP_HOME}/bin/util/add-hosts.sh
```

The output of the script should be similar to the one below:

```
Testing the list of CEDAR hosts:
Host unknown : artifact.metadatacenter.orgx
Host unknown : auth.metadatacenter.orgx
Host unknown : cedar.metadatacenter.orgx
Host unknown : component.metadatacenter.orgx
Host unknown : group.metadatacenter.orgx
Host unknown : impex.metadatacenter.orgx
Host unknown : internals.metadatacenter.orgx
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

Some CEDAR hosts are unknown, we will prompt for your password 
    in order to make modifications to /etc/hosts !

Password:
Host unknown, adding to /etc/hosts: artifact.metadatacenter.orgx
Host unknown, adding to /etc/hosts: auth.metadatacenter.orgx
Host unknown, adding to /etc/hosts: cedar.metadatacenter.orgx
Host unknown, adding to /etc/hosts: component.metadatacenter.orgx
Host unknown, adding to /etc/hosts: group.metadatacenter.orgx
Host unknown, adding to /etc/hosts: impex.metadatacenter.orgx
Host unknown, adding to /etc/hosts: internals.metadatacenter.orgx
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
```

## Check the subdomains
You should run our script a second time.
Since all the hosts should be known at this point, the script should report that there is nothing to do.

```sh
${CEDAR_DEVELOP_HOME}/bin/util/add-hosts.sh
```

The output should be:
```
Testing the list of CEDAR hosts:
Host known   : artifact.metadatacenter.orgx
Host known   : auth.metadatacenter.orgx
Host known   : cedar.metadatacenter.orgx
Host known   : component.metadatacenter.orgx
Host known   : group.metadatacenter.orgx
Host known   : impex.metadatacenter.orgx
Host known   : internals.metadatacenter.orgx
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

All CEDAR hosts are known, nothing to do
```

???+ warning "Important"
    
    If this is not what you see, please go back, and try to fix the issue.
