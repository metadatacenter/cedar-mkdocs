# Configure Docker

Running CEDAR means running 20+ containers. You will need to configure your Docker to make it possible running all the containers needed under optimal conditions.

???+ warning "Important"

    We will change memory, CPUs and disk settings for Docker.
    The **Memory** setting is crucial, errors will occur if Docker does not have enough memory set up.
    
    The other settings will probably work with their default values as well, but please adjust them as described below.
 

## Configure Memory
In the Docker Desktop application 
under `Preferences` -> `Resources` -> `Memory` assign at least **12 GB** to Docker.

## Configure CPUs
In the Docker Desktop application 
under `Preferences` -> `Resources` -> `CPUs` check the number of assigned cores. It is typically set by default to the half of the available cores. That setting will work for CEDAR.

## Configure Swap
In the Docker Desktop application 
under `Preferences` -> `Resources` -> `Swap` check the assigned storage. It is typically set by default to 1 GB. That setting will work for CEDAR.

## Configure Disk Image Size
In the Docker Desktop application 
under `Preferences` -> `Resources` -> `Disk Image Size` check the assigned space. CEDAR Docker will need at least **20 GB**. 
Please set it to accommodate your current data and the amount that CEDAR needs.
