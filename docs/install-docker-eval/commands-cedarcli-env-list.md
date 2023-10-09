# cedarcli env list

`cedarcli env list` stands for CEDAR CLI Environment Variables List. You can check the values of all the environment variables that begin with the prefix `CEDAR_` in your current environment.

## Running `cedarcli env list`
Execute this: 
```sh
cedarcli env list
```

You should see an output resembling this:

```
                                    CEDAR environment variables
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Name                                          ┃ Value                                            ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ CEDAR_ADMIN_USER_API_KEY                      │ 0000111122223333444455556666777788889999aaaabbb… │
│ CEDAR_ADMIN_USER_PASSWORD                     │ Password123                                      │
│ CEDAR_ANALYTICS_KEY                           │ false                                            │
│ CEDAR_ARTIFACT_ADMIN_PORT                     │ 9101                                             │
│ CEDAR_ARTIFACT_HTTP_PORT                      │ 9001                                             │
│ CEDAR_ARTIFACT_SERVER_HOST                    │ 192.1680.17.111                                  │
│ CEDAR_ARTIFACT_STOP_PORT                      │ 9201                                             │
...
│ CEDAR_WORKER_HTTP_PORT                        │ 9011                                             │
│ CEDAR_WORKER_SERVER_HOST                      │ 192.1680.17.111                                  │
│ CEDAR_WORKER_STOP_PORT                        │ 9211                                             │
└───────────────────────────────────────────────┴──────────────────────────────────────────────────┘
                                           166 variables
```

## Debugging `cedarcli env list`
If your output looks different from the one presented above, please go back, and start from beginning.
You will need your environment set up correctly before proceeding.
