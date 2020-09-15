# Elasticsearch
CEDAR uses `elasticsearch` to make search for artifacts possible.

## Install Elasticsearch

Please install `elasticsearch version 6.8`:

    brew install elasticsearch@6
    
**Important!**

Do not add Elasticsearch as a background service! We will have scripts in place which will start it when necessary.

Do not start Elasticsearch at this point!
 
## Configure Elasticsearch
    vi /usr/local/etc/elasticsearch/elasticsearch.yml

Around line #17, change the cluster name configuration:

    cluster.name: elasticsearch_cedar


## Start Elasticsearch
    brew services start elasticsearch@6