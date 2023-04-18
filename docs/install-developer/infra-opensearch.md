# OpenSearch
CEDAR uses `OpenSearch` to make search for artifacts possible.

## Install OpenSearch

Please install `OpenSearch`, version 7:

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
cedarss
```

You should see the following lines in the output:
```
| OpenSearch-REST            | Running | httpResponse| 9200| HTTP/1.1\s200\sOK |
| OpenSearch-Transport       | Running | openPort    | 9300|                   |
```

[//]: # (## Install OpenSearch Dashboards)

[//]: # ()
[//]: # (`OpenSearch Dashboards` can be used to interact with `OpenSearch`.)

[//]: # ()
[//]: # (Please install the latest `OpenSearch Dashboards`:)

[//]: # ()
[//]: # (```sh)

[//]: # (brew install opensearch-dashboards)

[//]: # (```)

[//]: # ()
[//]: # (And pin this version:)

[//]: # ()
[//]: # (```sh)

[//]: # (brew pin opensearch-dashboards)

[//]: # (```)

[//]: # ()
[//]: # (## Start OpenSearch Dashboards)

[//]: # ()
[//]: # (```sh)

[//]: # (startsearchdash)

[//]: # (```)

[//]: # ()
[//]: # (## Check OpenSearch Dashboards status)

[//]: # ()
[//]: # (```sh)

[//]: # (cedarss)

[//]: # (```)

[//]: # ()
[//]: # (You should see the following lines in the output:)

[//]: # (```)

[//]: # (| --- Monitoring ------------|         |             |     |                   |)

[//]: # (| OpenSearch-Dashboards      | Running | httpResponse| 5601| HTTP/1.1\s302\sFou|)

[//]: # (```)

[//]: # ()
