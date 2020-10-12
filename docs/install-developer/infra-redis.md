# Redis
CEDAR uses `Redis` as message queue for communication between components of the system.

## Install Redis

Please install `Redis, version 3.2`:

```sh
brew install redis@3.2
```
    
???+ warning "Important"

    Do not add Redis as a background service! We will have scripts in place which will start it when necessary.

## Start Redis
```sh
startredis
```

## Check Redis status
```sh
cedarss
```

You should see the following line in the output:
```
| Redis-persistent           | Running | redisPing   | 6379|                   |
```
