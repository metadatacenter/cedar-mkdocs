# Redis
CEDAR uses `Redis` to implement a message queue for communication between components of the system.

## Install Redis

Please install `Redis`, version 7.2:

```sh
brew install redis@7.2
```

And pin this version:

```sh
brew pin redis@7.2
```
    
???+ warning "Important"

    Do not add Redis as a background service! We will have scripts in place which will start it when necessary.

## Start Redis
```sh
startredis
```

## Check Redis status
```sh
cedarcli status
```

You should see the following line in the output:
```
│ Redis-persistent       │ ✅     │ 6379  │               │
```
