# Elasticsearch
CEDAR uses `Elasticsearch` to make search for artifacts possible.

## Install Elasticsearch

Please install `Elasticsearch`, version 7:

```sh
brew tap elastic/tap
brew install elastic/tap/elasticsearch-full
```

And pin this version:

```sh
brew pin elasticsearch-full
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
startsearch
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

## Install Kibana

`Kibana` can be used to interact with `Elasticsearch`.

Please install `Elasticsearch`, version 6.8:

```sh
brew install elastic/tap/kibana-full
```

And pin this version:

```sh
brew pin kibana-full
```

## Start Kibana

```sh
startkibana
```

## Check Kibana status

```sh
cedarss
```

You should see the following lines in the output:
```
| --- Monitoring ------------|         |             |     |                   |
| Kibana                     | Running | httpResponse| 5601| kbn-name:\skibana |
```

