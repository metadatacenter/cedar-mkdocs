# Configure Docker

Running CEDAR means running 20+ containers. You will need to configure your Docker to make it possible running all the containers needed under optimal conditions.

???+ warning "Important"

    We will change memory, CPUs and disk settings for Docker.
    The **Memory** setting is crucial, errors will occur if Docker does not have enough memory set up.
    
    The other settings will probably work with their default values as well, but please adjust those as well, if you can.
 

## Configure Memory
In the Docker Desktop application 
under `Preferences` -> `Resources` -> `Memory` assign at least **12 GB** to Docker.

## Configure CPUs
In the Docker Desktop application 
under `Preferences` -> `Resources` -> `CPUs` assign 8 cores to Docker.

## Configure Swap
In the Docker Desktop application 
under `Preferences` -> `Resources` -> `Swap` assign 1 GB to Docker.

## Configure Disk Image Size
In the Docker Desktop application 
under `Preferences` -> `Resources` -> `Disk Image Size` assign at least 25 GB to Docker.
