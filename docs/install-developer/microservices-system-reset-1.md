# Initializing the backend data stores

## System reset

Before running the microservices for the first time, execute the following script to initialize the CEDAR databases:

```sh
cedarat system-reset
```

???+ warning "Use System Reset with care"

    This system-reset option deletes all user content in CEDAR. 
    It should only be used before the microservices are first started or when you want to bring a system back to a clean-slate condition.
    
Answer `yes` to all the questions to confirm that a system reset should be performed.

???+ error "System Reset failing last step"

    The last step of the system reset will fail. Tbhis is expected behavior at this point.

    We will execute a second round of system reset after all the microservices are started.
