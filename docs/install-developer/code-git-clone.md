# Clone the project repos

CEDAR is composed of numerous  `git` repos. However, it is possible, it would be tedious to clone these repos one by one.
We have a utility script that does just that.  

## Clone the repos using `cedarcli`

```sh
cedarcli git clone all
```

This will clone all the repos that are needed for the CEDAR development. One warning will be thrown since we already cloned the `cedar-cli` repo manually.

## Checkout `develop` branch

```sh
cedarcli git checkout develop
```

This will check out the `develop` branch for all the CEDAR repos.

## Check the status of the repos

```sh
cedarcli check repos
```

Should render something similar:
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Repo/File/Dir                                    ┃ File Type ┃    Repo Type     ┃ Recognized as ┃ Status ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━┩
│ cedar-admin-tool                                 │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
│ cedar-artifact-library                           │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
│ cedar-artifact-server                            │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
│ cedar-artifact-viewer                            │  📁 dir   │     angular      │  CEDAR repo   │   ✅   │
│ cedar-artifacts                                  │  📁 dir   │      multi       │  CEDAR repo   │   ✅   │
│ cedar-artifacts/cedar-artifacts-dist             │  📁 dir   │   angular-dist   │  CEDAR repo   │   ✅   │
│ cedar-artifacts/cedar-artifacts-src              │  📁 dir   │     angular      │  CEDAR repo   │   ✅   │
│ cedar-bridge-server                              │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
...
│ cedar-util                                       │  📁 dir   │       misc       │  CEDAR repo   │   ✅   │
│ cedar-valuerecommender-server                    │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
│ cedar-worker-server                              │  📁 dir   │       java       │  CEDAR repo   │   ✅   │
└──────────────────────────────────────────────────┴───────────┴──────────────────┴───────────────┴────────┘
                                         66 object/files recognized
```
