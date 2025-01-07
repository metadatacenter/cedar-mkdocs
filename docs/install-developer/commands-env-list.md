# env list

`cedarcli env list` stands for CEDAR Environment Variables List. You can check the values of all the environment variables that begin with the prefix `CEDAR_` in your current environment.

## Running `env list`
Execute this: 
```sh
cedarcli env list
```

You should see an output resembling this:

```
                                                            CEDAR environment variables
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Name                                          ┃ Value                                                                                           ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ CEDAR_ADMIN_USER_API_KEY                      │ 0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff                                │
...
│ CEDAR_WORKER_STOP_PORT                        │ 9211                                                                                            │
└───────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                   182 variables
```

## Debugging `env list`
If your output looks different, than the one presented above, please go back, and start from beginning.
You will need your environment set up correctly before proceeding.

## Other `env` commands
Executing 
```sh
cedarcli env
```
will present you with the other subcommands related to environment variables. Some examples:
```sh
cedarcli env
cedarcli env list
cedarcli env core
cedarcli env release
cedarcli env filter WORKER
```

