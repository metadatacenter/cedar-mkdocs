# Install the scripts

???+ warning "Important"

    The steps in this section are crucial for the proper installation of CEDAR.
    
    Please execute these steps with great care.

## Clone the script repo

Please go to your previously created CEDAR Docker home folder, and clone the following repo:

[https://github.com/metadatacenter/cedar-development](https://github.com/metadatacenter/cedar-development)

```sh
cd ~/CEDAR_DOCKER
git clone https://github.com/metadatacenter/cedar-development
```

# Master vs develop branch

The above command cloned the repo, and set the active branch to `master`.

If you want to have the latest develop branch, you will need to check out that branch.

???+ warning "Important"

    Unless you specifically need something from the latest `develop` branch, you should use the `master` branch, so skip this step.
    
```sh
cd cedar-development
git checkout develop
```
