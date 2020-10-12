# cedarenv

`cedarenv` stands for CEDAR Environment Variables. You can check the values of all the environment variables that begin with the prefix `CEDAR_` in your current environment.

## Running `cedarenv`
Execute this: 
```sh
cedarenv
```

You should see an output resembling this:

```
CEDAR_ADMIN_USER_API_KEY=0000111122223333444455556666777788889999
CEDAR_ADMIN_USER_PASSWORD=Password123
CEDAR_ANALYTICS_KEY=false
CEDAR_ARTIFACT_ADMIN_PORT=9101
CEDAR_ARTIFACT_HTTP_PORT=9001
CEDAR_ARTIFACT_STOP_PORT=9201
...
CEDAR_WORKER_ADMIN_PORT=9111
CEDAR_WORKER_HTTP_PORT=9011
CEDAR_WORKER_STOP_PORT=9211
```

## Debugging `cedarenv`
If your output looks different, than the one presented above, please go back, and start from beginning.
You will need your environment set up correctly before proceeding.
