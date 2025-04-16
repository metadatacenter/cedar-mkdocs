# OpenSearch
CEDAR uses `OpenSearch` to make search for artifacts possible.

## Install OpenSearch

Please install `OpenSearch`, version 2.18:

```sh
brew install opensearch
```

And pin this version:

```sh
brew pin opensearch
```
    
???+ warning "Important"

    Do not add OpenSearch as a background service! We will have scripts in place which will start it when necessary.

    **Do not start OpenSearch at this point!**
 
## Configure OpenSearch

```sh
vi $(brew --prefix)/etc/opensearch/opensearch.yml
```

Around `line #17`, change the cluster name configuration:

```
cluster.name: opensearch_cedar
```

## Start OpenSearch

```sh
startsearch
```

## Check OpenSearch status
```sh
cedarcli status
```

You should see the following lines in the output:
```
│ OpenSearch-REST        │ ✅     │ 9200  │               │
│ OpenSearch-Transport   │ ✅     │ 9300  │               │
```

## Create 
