# Elasticsearch
CEDAR uses `elasticsearch` to make search for artifacts possible.

## Install Elasticsearch

Please install `elasticsearch version 6.8`:

```sh
brew install elasticsearch@6
```
    
???+ warning "Important"

    Do not add Elasticsearch as a background service! We will have scripts in place which will start it when necessary.

    **Do not start Elasticsearch at this point!**
 
## Configure Elasticsearch

```sh
vi /usr/local/etc/elasticsearch/elasticsearch.yml
```

Around `line #17`, change the cluster name configuration:

```
cluster.name: elasticsearch_cedar
```

## Start Elasticsearch

```sh
startelastic
```

## Check Elasticsearch status
```sh
cedarss
```

You should see the following lines in the output:
```
| Elasticsearch-REST         | Running | httpResponse| 9200| HTTP/1.1\s200\sOK |
| Elasticsearch-Transport    | Running | openPort    | 9300|                   |
```
